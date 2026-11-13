import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import fs from 'fs';
import path from 'path';

export interface AcreditacionPrensaRegistration {
  id: string;
  folio: string; // e.g. #CCE-PRENSA-8472
  nombre: string;
  medio: string;
  whatsapp: string;
  asistentes: number; // 1 | 2
  acompananteNombre?: string;
  fecha: string;
  timestamp: number;
  checkIn: boolean;
  location: string;
  device: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  ip: string;
}

export interface AcreditacionPrensaVisitLog {
  ip: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  timestamp: number;
}

export interface AcreditacionPrensaAttempt {
  attemptId: string;
  eventType: 'registration_attempt';
  status: 'iniciado' | 'fallido' | 'completado';
  folio?: string;
  nombre: string;
  medio: string;
  whatsapp: string;
  asistentes: number;
  acompananteNombre?: string;
  errorReason?: string;
  fecha: string;
  timestamp: number;
  device: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  ip: string;
}

export interface AcreditacionPrensaTelemetryData {
  totalVisits: number;
  uniqueVisits: number;
  conversionRate: string;
  devices: {
    ios: number;
    android: number;
    desktop: number;
  };
  totalRegistros: number;
  totalMedios: number;
  totalAsistentes: number;
}

const REGISTRATIONS_COL = 'cce_acreditacion_prensa_registros';
const TELEMETRY_COL = 'cce_acreditacion_prensa_telemetry';

interface LocalCache {
  registrations: AcreditacionPrensaRegistration[];
  visits: AcreditacionPrensaVisitLog[];
}

export function normalizeMxPhone(raw: unknown): string {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('521')) {
    digits = digits.slice(3);
  } else if (digits.length === 12 && digits.startsWith('52')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

export function normalizePersonKey(nombre: string, whatsapp: string): string {
  const cleanName = String(nombre || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  const cleanPhone = normalizeMxPhone(whatsapp);
  return `${cleanName}|${cleanPhone}`;
}

function getLocalCache(): LocalCache {
  const globalObj = globalThis as unknown as { _cceAcreditacionPrensaCache?: LocalCache };
  if (!globalObj._cceAcreditacionPrensaCache) {
    globalObj._cceAcreditacionPrensaCache = {
      registrations: [],
      visits: [],
    };

    try {
      const filePath = path.join(process.cwd(), 'src/data/cce-acreditacion-prensa-registros.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.registrations)) {
          globalObj._cceAcreditacionPrensaCache.registrations = parsed.registrations;
        }
        if (Array.isArray(parsed.visits)) {
          globalObj._cceAcreditacionPrensaCache.visits = parsed.visits;
        }
      }
    } catch {
      // Ignore filesystem errors in serverless environments
    }
  }
  return globalObj._cceAcreditacionPrensaCache;
}

function persistLocalCache(cache: LocalCache) {
  try {
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'cce-acreditacion-prensa-registros.json');
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch {
    try {
      const tmpPath = '/tmp/cce-acreditacion-prensa-registros.json';
      fs.writeFileSync(tmpPath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch {
      // In-memory cache continues
    }
  }
}

export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        clean[key] = sanitizeForFirestore(value);
      }
    }
    return clean as any;
  }
  return data;
}

async function withFirestoreRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 350));
      }
    }
  }
  throw lastErr;
}

export async function findExistingAcreditacionByJournalist(
  nombre: string,
  whatsapp: string
): Promise<AcreditacionPrensaRegistration | null> {
  const targetKey = normalizePersonKey(nombre, whatsapp);
  try {
    const list = await getAcreditacionPrensaList();
    return (
      list.find((r) => normalizePersonKey(r.nombre, r.whatsapp) === targetKey) || null
    );
  } catch {
    return null;
  }
}

export async function saveAcreditacionPrensa(
  record: AcreditacionPrensaRegistration
): Promise<AcreditacionPrensaRegistration> {
  // 1. Authoritative full-document write to Cloud Firestore
  //    (Avoids { merge: true } so switching from 2 passes back to 1 pass cleanly removes acompananteNombre)
  try {
    const docRef = doc(db, REGISTRATIONS_COL, record.id);
    const cleanRecord = sanitizeForFirestore({ ...record });
    await withFirestoreRetry(() => setDoc(docRef, cleanRecord));
  } catch (err) {
    console.error('[cce-acreditacion-prensa-db] Firestore write error:', err);
    throw new Error('Error al guardar acreditación en Cloud Firestore: ' + (err as Error).message);
  }

  // 2. Mirror in local fallback cache
  const cache = getLocalCache();
  const existingIdx = cache.registrations.findIndex((r) => r.id === record.id);
  if (existingIdx >= 0) {
    cache.registrations[existingIdx] = record;
  } else {
    cache.registrations.unshift(record);
  }
  persistLocalCache(cache);

  return record;
}

export async function getAcreditacionPrensaList(): Promise<AcreditacionPrensaRegistration[]> {
  const cache = getLocalCache();

  try {
    const colRef = collection(db, REGISTRATIONS_COL);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(500));
    const snapshot = await withFirestoreRetry(() => getDocs(q));

    const firestoreRecords: AcreditacionPrensaRegistration[] = [];
    snapshot.forEach((docSnap) => {
      firestoreRecords.push(docSnap.data() as AcreditacionPrensaRegistration);
    });

    cache.registrations = firestoreRecords;
    persistLocalCache(cache);
    return firestoreRecords;
  } catch (err) {
    console.warn('[cce-acreditacion-prensa-db] Firestore read fallback to local cache:', err);
    return cache.registrations;
  }
}

export async function updateAcreditacionPrensaCheckIn(
  id: string,
  checkIn: boolean
): Promise<boolean> {
  try {
    const docRef = doc(db, REGISTRATIONS_COL, id);
    await withFirestoreRetry(() => updateDoc(docRef, { checkIn }));
  } catch (err) {
    console.error('[cce-acreditacion-prensa-db] Error updating check-in:', err);
    throw new Error('Error al actualizar check-in en Cloud Firestore: ' + (err as Error).message);
  }

  const cache = getLocalCache();
  const target = cache.registrations.find((r) => r.id === id);
  if (target) {
    target.checkIn = checkIn;
    persistLocalCache(cache);
  }

  return true;
}

export async function logAcreditacionPrensaVisit(
  visit: AcreditacionPrensaVisitLog
): Promise<void> {
  try {
    const visitId = `visit-${visit.timestamp}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, TELEMETRY_COL, visitId);
    const cleanVisit = sanitizeForFirestore(visit);
    await setDoc(docRef, cleanVisit);
  } catch (err) {
    console.warn('[cce-acreditacion-prensa-db] Telemetry write warning:', err);
  }

  const cache = getLocalCache();
  cache.visits.push(visit);
  persistLocalCache(cache);
}

export async function saveAcreditacionPrensaAttempt(
  attempt: AcreditacionPrensaAttempt
): Promise<void> {
  try {
    const cleanId = attempt.attemptId.startsWith('attempt-')
      ? attempt.attemptId
      : `attempt-${attempt.attemptId}`;
    const docRef = doc(db, TELEMETRY_COL, cleanId);
    const cleanAttempt = sanitizeForFirestore({
      ...attempt,
      attemptId: cleanId,
      eventType: 'registration_attempt' as const,
    });
    await withFirestoreRetry(() => setDoc(docRef, cleanAttempt, { merge: true }));
  } catch (err) {
    console.warn('[cce-acreditacion-prensa-db] Attempt checkpoint warning:', err);
  }
}

export async function getAcreditacionPrensaFailedAttempts(
  registrations: AcreditacionPrensaRegistration[] = []
): Promise<AcreditacionPrensaAttempt[]> {
  try {
    const telemRef = collection(db, TELEMETRY_COL);
    const q = query(telemRef, orderBy('timestamp', 'desc'), limit(1500));
    const snap = await withFirestoreRetry(() => getDocs(q));

    const registeredKeys = new Set(
      registrations.map((r) => normalizePersonKey(r.nombre, r.whatsapp))
    );
    const registeredPhones = new Set(
      registrations.map((r) => normalizeMxPhone(r.whatsapp)).filter(Boolean)
    );

    const byPerson = new Map<string, AcreditacionPrensaAttempt>();
    const now = Date.now();

    snap.forEach((d) => {
      const raw = d.data() as any;
      if (!d.id.startsWith('attempt-') && raw?.eventType !== 'registration_attempt') return;
      const att = raw as AcreditacionPrensaAttempt;
      if (att.status === 'completado') return;
      if (att.status === 'iniciado' && now - (att.timestamp || 0) < 45_000) return;

      const phone = normalizeMxPhone(att.whatsapp);
      const personKey = normalizePersonKey(att.nombre, att.whatsapp);

      if (registeredKeys.has(personKey) || (phone && registeredPhones.has(phone))) {
        return;
      }

      const dedupeKey = personKey || phone || att.ip || att.attemptId;
      const existing = byPerson.get(dedupeKey);
      if (!existing || (att.timestamp || 0) > (existing.timestamp || 0)) {
        byPerson.set(dedupeKey, att);
      }
    });

    return Array.from(byPerson.values()).sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.warn('[cce-acreditacion-prensa-db] Could not read failed attempts:', err);
    return [];
  }
}

export async function getAcreditacionPrensaTelemetry(
  registrations: AcreditacionPrensaRegistration[]
): Promise<AcreditacionPrensaTelemetryData> {
  const cache = getLocalCache();
  let visits: AcreditacionPrensaVisitLog[] = [];

  try {
    const colRef = collection(db, TELEMETRY_COL);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(2000));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as any;
      if (docSnap.id.startsWith('attempt-') || data?.eventType === 'registration_attempt') {
        return;
      }
      visits.push(data as AcreditacionPrensaVisitLog);
    });
    cache.visits = visits;
  } catch (err) {
    console.warn('[cce-acreditacion-prensa-db] Error fetching telemetry, using cache:', err);
    visits = cache.visits;
  }

  const totalRegistros = registrations.length;
  const totalVisits = Math.max(visits.length, totalRegistros);
  const uniqueIps = new Set(visits.map((v) => v.ip).filter(Boolean));
  const uniqueVisits = Math.max(uniqueIps.size, totalVisits > 0 ? 1 : 0);

  // Use totalVisits as denominator so multiple reporters sharing one newsroom NAT Wi-Fi IP never distort conversion
  const conversionRate =
    totalVisits > 0
      ? `${Math.min(100, (totalRegistros / totalVisits) * 100).toFixed(1)}%`
      : '0.0%';

  const deviceCounts = { ios: 0, android: 0, desktop: 0 };
  for (const v of visits) {
    if (v.deviceCategory === 'ios') deviceCounts.ios++;
    else if (v.deviceCategory === 'android') deviceCounts.android++;
    else deviceCounts.desktop++;
  }

  const deviceTotal = deviceCounts.ios + deviceCounts.android + deviceCounts.desktop;
  const devices = {
    ios: deviceTotal > 0 ? Math.round((deviceCounts.ios / deviceTotal) * 100) : 0,
    android: deviceTotal > 0 ? Math.round((deviceCounts.android / deviceTotal) * 100) : 0,
    desktop: deviceTotal > 0 ? Math.round((deviceCounts.desktop / deviceTotal) * 100) : 0,
  };

  const mediaSet = new Set<string>();
  let totalAsistentes = 0;

  for (const reg of registrations) {
    if (reg.medio) {
      mediaSet.add(reg.medio.toLowerCase().trim());
    }
    const num = Number(reg.asistentes) || 1;
    totalAsistentes += num >= 2 ? 2 : 1;
  }

  return {
    totalVisits,
    uniqueVisits,
    conversionRate,
    devices,
    totalRegistros,
    totalMedios: mediaSet.size,
    totalAsistentes,
  };
}
