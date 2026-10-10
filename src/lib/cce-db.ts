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

export interface PrensaRegistration {
  id: string;
  nombre: string;
  medio: string;
  asistentes: string | number;
  whatsapp: string;
  fecha: string;
  timestamp: number;
  checkIn: boolean;
  location: string;
  device: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  ip: string;
}

export interface VisitLog {
  ip: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  timestamp: number;
}

export interface TelemetryData {
  totalVisits: number;
  uniqueVisits: number;
  conversionRate: string;
  devices: {
    ios: number;
    android: number;
    desktop: number;
  };
  totalMedios: number;
  totalAsistentes: number;
}

const REGISTRATIONS_COL = 'cce_prensa_registros';
const TELEMETRY_COL = 'cce_prensa_telemetry';

// In-memory fallback cache
interface LocalCache {
  registrations: PrensaRegistration[];
  visits: VisitLog[];
}

function getLocalCache(): LocalCache {
  const globalObj = globalThis as unknown as { _ccePrensaCache?: LocalCache };
  if (!globalObj._ccePrensaCache) {
    globalObj._ccePrensaCache = {
      registrations: [],
      visits: [],
    };

    try {
      const filePath = path.join(process.cwd(), 'src/data/cce-prensa-registros.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.registrations)) {
          globalObj._ccePrensaCache.registrations = parsed.registrations;
        }
        if (Array.isArray(parsed.visits)) {
          globalObj._ccePrensaCache.visits = parsed.visits;
        }
      }
    } catch {
      // Ignore filesystem errors in restricted/serverless environments
    }
  }
  return globalObj._ccePrensaCache;
}

function persistLocalCache(cache: LocalCache) {
  try {
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'cce-prensa-registros.json');
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch {
    try {
      const tmpPath = '/tmp/cce-prensa-registros.json';
      fs.writeFileSync(tmpPath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch {
      // In-memory cache continues
    }
  }
}

/**
 * Creates a new accreditation record in Google Cloud Firestore
 */
export async function saveRegistration(record: PrensaRegistration): Promise<PrensaRegistration> {
  const cache = getLocalCache();

  try {
    const docRef = doc(db, REGISTRATIONS_COL, record.id);
    await setDoc(docRef, { ...record });
  } catch (err) {
    console.warn('[Firestore] Error saving registration to cloud, caching locally:', err);
  }

  // Always update local cache
  const existingIdx = cache.registrations.findIndex(r => r.id === record.id);
  if (existingIdx >= 0) {
    cache.registrations[existingIdx] = record;
  } else {
    cache.registrations.unshift(record);
  }
  persistLocalCache(cache);

  return record;
}

/**
 * Retrieves all registrations from Google Cloud Firestore (or fallback cache)
 */
export async function getRegistrations(): Promise<PrensaRegistration[]> {
  const cache = getLocalCache();

  try {
    const colRef = collection(db, REGISTRATIONS_COL);
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const firestoreRecords: PrensaRegistration[] = [];
      snapshot.forEach(docSnap => {
        firestoreRecords.push(docSnap.data() as PrensaRegistration);
      });

      // Update cache
      cache.registrations = firestoreRecords;
      persistLocalCache(cache);
      return firestoreRecords;
    }
  } catch (err) {
    console.warn('[Firestore] Error fetching registrations from cloud, using cache:', err);
  }

  return cache.registrations;
}

/**
 * Updates the on-site check-in state of a journalist in Firestore
 */
export async function updateCheckIn(id: string, checkIn: boolean): Promise<boolean> {
  const cache = getLocalCache();

  try {
    const docRef = doc(db, REGISTRATIONS_COL, id);
    await updateDoc(docRef, { checkIn });
  } catch (err) {
    console.warn('[Firestore] Error updating check-in on cloud:', err);
  }

  const target = cache.registrations.find(r => r.id === id);
  if (target) {
    target.checkIn = checkIn;
    persistLocalCache(cache);
  }

  return true;
}

/**
 * Records a visitor telemetry ping in Firestore
 */
export async function logVisit(visit: VisitLog): Promise<void> {
  const cache = getLocalCache();

  try {
    const visitId = `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, TELEMETRY_COL, visitId);
    await setDoc(docRef, { ...visit });
  } catch (err) {
    console.warn('[Firestore] Error logging telemetry visit to cloud:', err);
  }

  cache.visits.push(visit);
  persistLocalCache(cache);
}

/**
 * Calculates live telemetry metrics exclusively from genuine database records
 */
export async function getTelemetry(registrations: PrensaRegistration[]): Promise<TelemetryData> {
  const cache = getLocalCache();
  let visits = cache.visits;

  try {
    const colRef = collection(db, TELEMETRY_COL);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const cloudVisits: VisitLog[] = [];
      snapshot.forEach(docSnap => {
        cloudVisits.push(docSnap.data() as VisitLog);
      });
      visits = cloudVisits;
      cache.visits = cloudVisits;
    }
  } catch (err) {
    console.warn('[Firestore] Error fetching telemetry from cloud, using cache:', err);
  }

  const totalVisits = visits.length;
  const uniqueIps = new Set(visits.map(v => v.ip));
  const uniqueVisits = Math.max(uniqueIps.size, totalVisits > 0 ? 1 : 0);

  const totalRegistrations = registrations.length;
  const conversionRate = uniqueVisits > 0
    ? `${((totalRegistrations / uniqueVisits) * 100).toFixed(1)}%`
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
    const num = parseInt(String(reg.asistentes).replace(/\D/g, ''), 10);
    totalAsistentes += isNaN(num) || num <= 0 ? 1 : num;
  }

  return {
    totalVisits,
    uniqueVisits,
    conversionRate,
    devices,
    totalMedios: mediaSet.size,
    totalAsistentes,
  };
}
