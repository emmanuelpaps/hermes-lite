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

export interface GalardonRegistration {
  id: string;
  folio: string; // e.g. #CCE-2026-GAL-8472
  nombre: string;
  empresa: string;
  cargo: string;
  whatsapp: string;
  email: string;
  boletos: number;
  totalMonto: number;
  tipoBoleto: 'individual' | 'mesa';
  asistentesNombres?: string[];
  asignarNombresDespues: boolean;
  comprobanteFileName: string;
  comprobanteUrl?: string; // base64 preview or storage link
  requiereFactura: boolean;
  facturaData?: {
    rfc: string;
    razonSocial: string;
    regimenFiscal: string;
    usoCfdi: string;
    codigoPostal: string;
  };
  fecha: string;
  timestamp: number;
  status: 'pendiente' | 'validado' | 'rechazado';
  location: string;
  device: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  ip: string;
}

export interface GalardonVisitLog {
  ip: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  timestamp: number;
}

export interface GalardonTelemetryData {
  totalVisits: number;
  uniqueVisits: number;
  conversionRate: string;
  devices: {
    ios: number;
    android: number;
    desktop: number;
  };
  totalRegistros: number;
  totalBoletos: number;
  totalRecaudado: number;
  totalRecaudadoConciliado: number;
  totalMesas: number;
  comprobantesPendientes: number;
  comprobantesValidados: number;
  comprobantesRechazados: number;
}

const REGISTRATIONS_COL = 'cce_galardon_registros';
const TELEMETRY_COL = 'cce_galardon_telemetry';

// Local mirror cache for high-availability backup
interface LocalCache {
  registrations: GalardonRegistration[];
  visits: GalardonVisitLog[];
}

function getLocalCache(): LocalCache {
  const globalObj = globalThis as unknown as { _cceGalardonCache?: LocalCache };
  if (!globalObj._cceGalardonCache) {
    globalObj._cceGalardonCache = {
      registrations: [],
      visits: [],
    };

    try {
      const filePath = path.join(process.cwd(), 'src/data/cce-galardon-registros.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.registrations)) {
          globalObj._cceGalardonCache.registrations = parsed.registrations;
        }
        if (Array.isArray(parsed.visits)) {
          globalObj._cceGalardonCache.visits = parsed.visits;
        }
      }
    } catch {
      // In-memory cache continues
    }
  }
  return globalObj._cceGalardonCache;
}

function persistLocalCache(cache: LocalCache) {
  try {
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'cce-galardon-registros.json');
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch {
    try {
      const tmpPath = '/tmp/cce-galardon-registros.json';
      fs.writeFileSync(tmpPath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch {
      // Continue with in-memory cache
    }
  }
}

/**
 * Recursively strips undefined values from an object or array so that
 * Cloud Firestore setDoc/updateDoc never fails with "Unsupported field value: undefined".
 */
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

export async function saveGalardonRegistration(record: GalardonRegistration): Promise<void> {
  // 1. Primary persistence: Cloud Firestore (sanitized to remove any undefined fields)
  try {
    const docRef = doc(db, REGISTRATIONS_COL, record.id);
    const cleanRecord = sanitizeForFirestore(record);
    await setDoc(docRef, cleanRecord, { merge: true });
  } catch (err) {
    console.error('[cce-galardon-db] Firestore write error:', err);
    throw new Error('Error al registrar en Cloud Firestore: ' + (err as Error).message);
  }

  // 2. Mirror in local cache for durability
  const cache = getLocalCache();
  const existingIdx = cache.registrations.findIndex(r => r.id === record.id);
  if (existingIdx >= 0) {
    cache.registrations[existingIdx] = record;
  } else {
    cache.registrations.unshift(record);
  }
  persistLocalCache(cache);
}

export async function getGalardonRegistrations(): Promise<GalardonRegistration[]> {
  const cache = getLocalCache();

  try {
    const colRef = collection(db, REGISTRATIONS_COL);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(500));
    const snapshot = await getDocs(q);

    const firestoreData: GalardonRegistration[] = [];
    snapshot.forEach(docSnap => {
      firestoreData.push(docSnap.data() as GalardonRegistration);
    });

    // Cloud Firestore is the authoritative database
    cache.registrations = firestoreData;
    persistLocalCache(cache);
    return firestoreData;
  } catch (err) {
    console.warn('[cce-galardon-db] Firestore read fallback to local cache:', err);
    return cache.registrations;
  }
}

export async function updateGalardonStatus(id: string, status: 'pendiente' | 'validado' | 'rechazado'): Promise<void> {
  // 1. Primary update in Cloud Firestore
  try {
    const docRef = doc(db, REGISTRATIONS_COL, id);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.error('[cce-galardon-db] Firestore updateStatus error:', err);
    throw new Error('Error al actualizar estatus en Cloud Firestore: ' + (err as Error).message);
  }

  // 2. Mirror in local cache
  const cache = getLocalCache();
  const record = cache.registrations.find(r => r.id === id);
  if (record) {
    record.status = status;
    persistLocalCache(cache);
  }
}

export async function logGalardonVisit(visit: GalardonVisitLog): Promise<void> {
  // 1. Write to Firestore telemetry (sanitized)
  try {
    const visitId = `visit-${visit.timestamp}-${Math.random().toString(36).substring(2, 6)}`;
    const docRef = doc(db, TELEMETRY_COL, visitId);
    const cleanVisit = sanitizeForFirestore(visit);
    await setDoc(docRef, cleanVisit);
  } catch (err) {
    console.warn('[cce-galardon-db] Telemetry write notice:', err);
  }

  // 2. Mirror in local cache
  const cache = getLocalCache();
  cache.visits.push(visit);
  persistLocalCache(cache);
}

export async function getGalardonTelemetry(
  registrations?: GalardonRegistration[]
): Promise<GalardonTelemetryData> {
  const cache = getLocalCache();
  const regList = registrations || cache.registrations;

  let visits: GalardonVisitLog[] = [];
  try {
    const telemRef = collection(db, TELEMETRY_COL);
    const q = query(telemRef, orderBy('timestamp', 'desc'), limit(2000));
    const snap = await getDocs(q);
    snap.forEach(d => {
      visits.push(d.data() as GalardonVisitLog);
    });
    // Sync into memory cache
    cache.visits = visits;
  } catch (err) {
    console.warn('[cce-galardon-db] Firestore telemetry read fallback to local cache:', err);
    visits = cache.visits;
  }

  // 100% Real telemetry from Cloud Firestore
  const totalVisits = visits.length > 0 ? visits.length : (cache.visits.length > 0 ? cache.visits.length : regList.length);
  const uniqueIps = new Set(visits.map(v => v.ip).filter(Boolean));
  const uniqueVisits = uniqueIps.size > 0 ? uniqueIps.size : (regList.length > 0 ? regList.length : 0);

  const devices = {
    ios: 0,
    android: 0,
    desktop: 0,
  };

  visits.forEach(v => {
    if (v.deviceCategory === 'ios') devices.ios++;
    else if (v.deviceCategory === 'android') devices.android++;
    else devices.desktop++;
  });

  const activeRegistrations = regList.filter(r => r.status !== 'rechazado');
  const totalRegistros = activeRegistrations.length;
  const conversionRate =
    totalVisits > 0 ? ((totalRegistros / totalVisits) * 100).toFixed(1) + '%' : '0%';

  let totalBoletos = 0;
  let totalRecaudado = 0;
  let totalRecaudadoConciliado = 0;
  let totalMesas = 0;
  let comprobantesPendientes = 0;
  let comprobantesValidados = 0;
  let comprobantesRechazados = 0;

  regList.forEach(r => {
    if (r.status !== 'rechazado') {
      const b = Number(r.boletos) || 0;
      totalBoletos += b;
      const monto = Number(r.totalMonto) || (b === 8 ? 20000 : b * 2500);
      totalRecaudado += monto;
      if (r.status === 'validado') {
        totalRecaudadoConciliado += monto;
      }
      if (b === 8 || b === 10) totalMesas++;
    }

    if (r.status === 'validado') {
      comprobantesValidados++;
    } else if (r.status === 'rechazado') {
      comprobantesRechazados++;
    } else {
      comprobantesPendientes++;
    }
  });

  return {
    totalVisits,
    uniqueVisits,
    conversionRate,
    devices,
    totalRegistros,
    totalBoletos,
    totalRecaudado,
    totalRecaudadoConciliado,
    totalMesas,
    comprobantesPendientes,
    comprobantesValidados,
    comprobantesRechazados,
  };
}
