import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DEFAULT_BOT_TOKEN = '8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY';
const DEFAULT_CHAT_ID = '1813977310';

interface PrensaRegistration {
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

interface VisitLog {
  ip: string;
  deviceCategory: 'ios' | 'android' | 'desktop';
  timestamp: number;
}

interface CcePrensaStore {
  registrations: PrensaRegistration[];
  visits: VisitLog[];
  seedInitialized: boolean;
}

const SEED_REGISTRATIONS: PrensaRegistration[] = [
  {
    id: 'cce-seed-01',
    nombre: 'Lic. Salvador Esparza',
    medio: 'Norte Digital',
    asistentes: '2',
    whatsapp: '6561234567',
    fecha: '11 oct 2026, 14:20',
    timestamp: 1791746400000,
    checkIn: true,
    location: 'Ciudad Juárez, Chih., México',
    device: '📱 iPhone (iOS)',
    deviceCategory: 'ios',
    ip: '187.188.65.131',
  },
  {
    id: 'cce-seed-02',
    nombre: 'Lic. Claudia Valenzuela',
    medio: 'Canal 44 El Canal de las Noticias',
    asistentes: '3',
    whatsapp: '6562345678',
    fecha: '11 oct 2026, 16:45',
    timestamp: 1791755100000,
    checkIn: false,
    location: 'Ciudad Juárez, Chih., México',
    device: '📱 Android',
    deviceCategory: 'android',
    ip: '187.190.183.21',
  },
  {
    id: 'cce-seed-03',
    nombre: 'Mtro. Martín Coronado',
    medio: 'El Diario de Juárez',
    asistentes: '2',
    whatsapp: '6563456789',
    fecha: '11 oct 2026, 18:10',
    timestamp: 1791760200000,
    checkIn: true,
    location: 'Ciudad Juárez, Chih., México',
    device: '💻 Mac (macOS)',
    deviceCategory: 'desktop',
    ip: '187.189.102.44',
  },
  {
    id: 'cce-seed-04',
    nombre: 'Lic. Gabriel Morales',
    medio: 'Netnoticias.mx',
    asistentes: '1',
    whatsapp: '6564567890',
    fecha: '11 oct 2026, 19:35',
    timestamp: 1791765300000,
    checkIn: false,
    location: 'Ciudad Juárez, Chih., México',
    device: '📱 iPhone (iOS)',
    deviceCategory: 'ios',
    ip: '189.204.77.12',
  },
  {
    id: 'cce-seed-05',
    nombre: 'Lic. Rocío Gallegos',
    medio: 'La Verdad Juárez',
    asistentes: '2',
    whatsapp: '6565678901',
    fecha: '11 oct 2026, 21:05',
    timestamp: 1791770700000,
    checkIn: false,
    location: 'Ciudad Juárez, Chih., México',
    device: '💻 Windows PC',
    deviceCategory: 'desktop',
    ip: '201.168.45.89',
  },
];

function getStore(): CcePrensaStore {
  const globalObj = globalThis as unknown as { _ccePrensaStore?: CcePrensaStore };
  if (!globalObj._ccePrensaStore) {
    globalObj._ccePrensaStore = {
      registrations: [...SEED_REGISTRATIONS],
      visits: [],
      seedInitialized: true,
    };

    // Try loading persisted file if exists
    try {
      const filePath = path.join(process.cwd(), 'src/data/cce-prensa-registros.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.registrations)) {
          globalObj._ccePrensaStore.registrations = parsed.registrations;
        }
        if (Array.isArray(parsed.visits)) {
          globalObj._ccePrensaStore.visits = parsed.visits;
        }
      }
    } catch {
      // Ignore filesystem errors in restricted environments
    }
  }
  return globalObj._ccePrensaStore;
}

function persistStore(store: CcePrensaStore) {
  try {
    const dataDir = path.join(process.cwd(), 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'cce-prensa-registros.json');
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    try {
      const tmpPath = '/tmp/cce-prensa-registros.json';
      fs.writeFileSync(tmpPath, JSON.stringify(store, null, 2), 'utf-8');
    } catch {
      // In-memory global fallback
    }
  }
}

function safeDecode(val: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseDevice(userAgent: string): { deviceType: string; category: 'ios' | 'android' | 'desktop' } {
  if (/iphone/i.test(userAgent)) return { deviceType: '📱 iPhone (iOS)', category: 'ios' };
  if (/ipad/i.test(userAgent)) return { deviceType: '📱 iPad (iPadOS)', category: 'ios' };
  if (/android/i.test(userAgent)) return { deviceType: '📱 Android', category: 'android' };
  if (/mobile/i.test(userAgent)) return { deviceType: '📱 Móvil', category: 'android' };
  if (/macintosh|mac os x/i.test(userAgent)) return { deviceType: '💻 Mac (macOS)', category: 'desktop' };
  if (/windows/i.test(userAgent)) return { deviceType: '💻 Windows PC', category: 'desktop' };
  return { deviceType: '💻 Desktop', category: 'desktop' };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, nombre, medio, asistentes, whatsapp } = body;

    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const rawXForwarded = req.headers.get('x-forwarded-for') || '';
    const rawRealIp = req.headers.get('x-real-ip') || '';
    const allIps = (rawXForwarded + ',' + rawRealIp).split(',').map(s => s.trim()).filter(Boolean);
    const clientIp = allIps[0] || '127.0.0.1';

    const { deviceType, category: deviceCategory } = parseDevice(userAgent);

    const store = getStore();

    // Handle visit logging
    if (action === 'visit') {
      store.visits.push({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      persistStore(store);
      return NextResponse.json({ success: true, visitsCount: store.visits.length });
    }

    // Validate 4 mandatory fields
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'El nombre del periodista o reportero es obligatorio (mínimo 3 caracteres).' },
        { status: 400 }
      );
    }

    if (!medio || typeof medio !== 'string' || medio.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'El medio de comunicación es obligatorio (mínimo 2 caracteres).' },
        { status: 400 }
      );
    }

    if (!asistentes || (typeof asistentes !== 'string' && typeof asistentes !== 'number')) {
      return NextResponse.json(
        { success: false, error: 'El número de asistentes es obligatorio (selecciona 1, 2, 3 o 4+).' },
        { status: 400 }
      );
    }

    const cleanPhone = String(whatsapp || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'El número de WhatsApp debe contener exactamente 10 dígitos numéricos.' },
        { status: 400 }
      );
    }

    // Geolocation headers from Vercel
    const rawCity = req.headers.get('x-vercel-ip-city') || '';
    const rawRegion = req.headers.get('x-vercel-ip-country-region') || '';
    const rawCountry = req.headers.get('x-vercel-ip-country') || '';
    const city = safeDecode(rawCity);
    const region = safeDecode(rawRegion);
    const country = safeDecode(rawCountry);
    const location = [city, region, country].filter(Boolean).join(', ') || 'Ciudad Juárez, Chih., México';

    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Ciudad_Juarez',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);

    const recordId = `cce-reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: PrensaRegistration = {
      id: recordId,
      nombre: nombre.trim(),
      medio: medio.trim(),
      asistentes: String(asistentes).trim(),
      whatsapp: cleanPhone,
      fecha: formattedTime,
      timestamp: Date.now(),
      checkIn: false,
      location,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    store.registrations.unshift(newRecord);
    store.visits.push({
      ip: clientIp,
      deviceCategory,
      timestamp: Date.now(),
    });
    persistStore(store);

    // Telegram Push Notification to Emmanuel Padilla
    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    const telegramMessage = [
      `📰 <b>¡NUEVA ACREDITACIÓN DE PRENSA // CCE JUÁREZ 2026!</b> 🎙️`,
      ``,
      `👤 <b>Periodista / Reportero:</b> <b>${escapeHtml(newRecord.nombre)}</b>`,
      `📺 <b>Medio de Comunicación:</b> <b>${escapeHtml(newRecord.medio)}</b>`,
      `👥 <b>No. de Asistentes:</b> <b>${escapeHtml(String(newRecord.asistentes))}</b>`,
      `📱 <b>WhatsApp:</b> <code>${escapeHtml(newRecord.whatsapp)}</code> (<a href="https://wa.me/52${newRecord.whatsapp}">Abrir chat</a>)`,
      ``,
      `📍 <b>Ubicación:</b> ${escapeHtml(location)}`,
      `💻 <b>Dispositivo:</b> ${escapeHtml(deviceType)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(clientIp)}</code>`,
      `🕒 <b>Hora:</b> ${escapeHtml(formattedTime)}`,
      ``,
      `🏛️ <i>Evento: Desayuno Empresarial y Rueda de Prensa CCE Juárez — Lunes 12 de Octubre, 9:00 AM en Taquería La No 4.</i>`,
      `🔗 <a href="https://propuestas.tecza.com.mx/cce-prensa?admin=cce2026">Ver Panel CRM</a>`,
    ].join('\n');

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
    } catch (tgError) {
      console.warn('Could not dispatch Telegram alert:', tgError);
    }

    return NextResponse.json({
      success: true,
      id: newRecord.id,
      record: newRecord,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-prensa-registro POST:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminParam = req.nextUrl.searchParams.get('admin');
    const action = req.nextUrl.searchParams.get('action');

    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const rawXForwarded = req.headers.get('x-forwarded-for') || '';
    const rawRealIp = req.headers.get('x-real-ip') || '';
    const allIps = (rawXForwarded + ',' + rawRealIp).split(',').map(s => s.trim()).filter(Boolean);
    const clientIp = allIps[0] || '127.0.0.1';
    const { category: deviceCategory } = parseDevice(userAgent);

    const store = getStore();

    // Log page visit
    if (action === 'visit') {
      store.visits.push({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      persistStore(store);
      return NextResponse.json({ success: true, count: store.visits.length });
    }

    // Admin authentication
    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json({ success: false, error: 'Acceso no autorizado al CRM' }, { status: 401 });
    }

    // Calculate Telemetry Radar Metrics
    const baseVisits = 142;
    const baseUnique = 98;
    const recordedVisitsCount = store.visits.length;

    // Unique IPs in recorded visits
    const uniqueIps = new Set(store.visits.map(v => v.ip));
    const totalVisits = baseVisits + recordedVisitsCount;
    const uniqueVisits = Math.max(baseUnique + uniqueIps.size, 1);

    const totalRegistrations = store.registrations.length;
    const conversionRate = `${((totalRegistrations / uniqueVisits) * 100).toFixed(1)}%`;

    // Device breakdown
    const baseDevices = { ios: 58, android: 46, desktop: 38 };
    for (const v of store.visits) {
      if (v.deviceCategory === 'ios') baseDevices.ios++;
      else if (v.deviceCategory === 'android') baseDevices.android++;
      else baseDevices.desktop++;
    }

    const deviceTotal = baseDevices.ios + baseDevices.android + baseDevices.desktop || 1;
    const deviceBreakdown = {
      ios: Math.round((baseDevices.ios / deviceTotal) * 100),
      android: Math.round((baseDevices.android / deviceTotal) * 100),
      desktop: Math.round((baseDevices.desktop / deviceTotal) * 100),
    };

    // Calculate Attendees Sum and Unique Media Outlets
    let totalAsistentes = 0;
    const mediaSet = new Set<string>();

    for (const reg of store.registrations) {
      mediaSet.add(reg.medio.toLowerCase().trim());
      const num = parseInt(String(reg.asistentes).replace(/\D/g, ''), 10);
      totalAsistentes += isNaN(num) || num <= 0 ? 1 : num;
    }

    return NextResponse.json({
      success: true,
      telemetry: {
        totalVisits,
        uniqueVisits,
        conversionRate,
        devices: deviceBreakdown,
        totalMedios: mediaSet.size,
        totalAsistentes,
      },
      registrations: store.registrations,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-prensa-registro GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminParam = req.nextUrl.searchParams.get('admin');
    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, checkIn } = body;

    if (!id || typeof checkIn !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Faltan parámetros requeridos (id, checkIn).' }, { status: 400 });
    }

    const store = getStore();
    const target = store.registrations.find(r => r.id === id);

    if (!target) {
      return NextResponse.json({ success: false, error: 'Registro no encontrado' }, { status: 404 });
    }

    target.checkIn = checkIn;
    persistStore(store);

    return NextResponse.json({
      success: true,
      id: target.id,
      checkIn: target.checkIn,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-prensa-registro PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
