import { NextRequest, NextResponse } from 'next/server';
import {
  saveAcreditacionPrensa,
  findExistingAcreditacionByJournalist,
  getAcreditacionPrensaList,
  updateAcreditacionPrensaCheckIn,
  logAcreditacionPrensaVisit,
  saveAcreditacionPrensaAttempt,
  getAcreditacionPrensaFailedAttempts,
  getAcreditacionPrensaTelemetry,
  normalizeMxPhone,
  AcreditacionPrensaRegistration,
} from '@/lib/cce-acreditacion-prensa-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// Cutoff aligned with Firestore rule isPrensaEventRegistrationOpen():
// 2026-11-19T21:00:00Z = 2:00 p.m. Ciudad Juárez (MST UTC-7), covering the full ceremony & keynote
const EVENT_DEADLINE_MS = 1795122000000;

const BOT_UA_REGEX =
  /bot|crawler|spider|whatsapp|facebookexternalhit|telegrambot|twitterbot|slackbot|discordbot|linkedinbot|preview|headlesschrome|lighthouse|vercel-screenshot/i;

function isBotOrLocalVisit(userAgent: string, clientIp: string, host: string): boolean {
  if (BOT_UA_REGEX.test(userAgent)) return true;
  if (clientIp === '127.0.0.1' || clientIp === '::1') return true;
  if (/localhost|127\.0\.0\.1/i.test(host)) return true;
  return false;
}

function safeDecode(val: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

function parseDevice(userAgent: string): {
  deviceType: string;
  category: 'ios' | 'android' | 'desktop';
} {
  if (/iphone/i.test(userAgent)) return { deviceType: '📱 iPhone (iOS)', category: 'ios' };
  if (/ipad/i.test(userAgent)) return { deviceType: '📱 iPad (iPadOS)', category: 'ios' };
  if (/android/i.test(userAgent)) return { deviceType: '📱 Android', category: 'android' };
  if (/mobile/i.test(userAgent)) return { deviceType: '📱 Móvil', category: 'android' };
  if (/macintosh|mac os x/i.test(userAgent))
    return { deviceType: '💻 Mac (macOS)', category: 'desktop' };
  if (/windows/i.test(userAgent)) return { deviceType: '💻 Windows PC', category: 'desktop' };
  return { deviceType: '💻 Desktop', category: 'desktop' };
}

function formatJuarezTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Ciudad_Juarez',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export async function POST(req: NextRequest) {
  let activeAttemptId = '';
  let attemptSnapshot: {
    nombre: string;
    medio: string;
    whatsapp: string;
    asistentes: number;
    acompananteNombre?: string;
    fecha: string;
    timestamp: number;
    device: string;
    deviceCategory: 'ios' | 'android' | 'desktop';
    ip: string;
  } | null = null;

  try {
    const body = await req.json().catch(() => ({}));
    const {
      action,
      attemptId,
      nombre,
      medio,
      whatsapp,
      asistentes,
      acompananteNombre,
    } = body;

    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const host = req.headers.get('host') || '';
    const rawXForwarded = req.headers.get('x-forwarded-for') || '';
    const rawRealIp = req.headers.get('x-real-ip') || '';
    const allIps = (rawXForwarded + ',' + rawRealIp)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const clientIp = allIps[0] || '127.0.0.1';
    const { deviceType, category: deviceCategory } = parseDevice(userAgent);
    const nowMs = Date.now();
    const formattedTime = formatJuarezTimestamp(new Date(nowMs));

    // 1. Standalone visit telemetry ping (ignores bots & localhost)
    if (action === 'visit') {
      if (!isBotOrLocalVisit(userAgent, clientIp, host)) {
        await logAcreditacionPrensaVisit({
          ip: clientIp,
          deviceCategory,
          timestamp: nowMs,
        });
      }
      return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
    }

    // 2. Zero-Loss Pre-Flight Attempt Checkpoint (lightweight <1 KB ping before submit)
    if (action === 'attempt') {
      const cleanId =
        typeof attemptId === 'string' && attemptId.trim()
          ? attemptId.trim()
          : `attempt-${nowMs}-${Math.random().toString(36).substring(2, 6)}`;
      const cleanPhone = normalizeMxPhone(whatsapp);
      const parsedAsistentes = Number(asistentes) === 2 ? 2 : 1;

      console.info(
        JSON.stringify({
          tag: 'CCE_ACREDITACION_PRENSA_PREFLIGHT',
          attemptId: cleanId,
          nombre: String(nombre || '').trim(),
          medio: String(medio || '').trim(),
          whatsapp: cleanPhone,
          asistentes: parsedAsistentes,
          acompananteNombre:
            parsedAsistentes === 2 ? String(acompananteNombre || '').trim() : undefined,
          ip: clientIp,
          fecha: formattedTime,
        })
      );

      await saveAcreditacionPrensaAttempt({
        attemptId: cleanId,
        eventType: 'registration_attempt',
        status: 'iniciado',
        nombre: String(nombre || '').trim(),
        medio: String(medio || '').trim(),
        whatsapp: cleanPhone,
        asistentes: parsedAsistentes,
        acompananteNombre:
          parsedAsistentes === 2 && acompananteNombre
            ? String(acompananteNombre).trim()
            : undefined,
        fecha: formattedTime,
        timestamp: nowMs,
        device: deviceType,
        deviceCategory,
        ip: clientIp,
      });

      return NextResponse.json(
        { success: true, attemptId: cleanId },
        { headers: NO_STORE_HEADERS }
      );
    }

    // 3. Enforce Event Cutoff (Nov 19, 2026 2:00 p.m. Ciudad Juárez)
    if (nowMs > EVENT_DEADLINE_MS) {
      return NextResponse.json(
        {
          success: false,
          error:
            'El periodo de acreditación en línea ha concluido. Por favor acude directamente a la mesa de prensa en Centro de Eventos Cibeles.',
        },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    // 4. Strict Input Validations
    const cleanNombre = typeof nombre === 'string' ? nombre.trim().replace(/\s+/g, ' ') : '';
    const cleanMedio = typeof medio === 'string' ? medio.trim().replace(/\s+/g, ' ') : '';
    const cleanWhatsapp = normalizeMxPhone(whatsapp);
    const numAsistentes = Number(asistentes);
    const cleanAcompanante =
      typeof acompananteNombre === 'string'
        ? acompananteNombre.trim().replace(/\s+/g, ' ')
        : '';

    activeAttemptId =
      typeof attemptId === 'string' && attemptId.trim()
        ? attemptId.trim()
        : `attempt-${nowMs}-${Math.random().toString(36).substring(2, 6)}`;

    attemptSnapshot = {
      nombre: cleanNombre,
      medio: cleanMedio,
      whatsapp: cleanWhatsapp,
      asistentes: numAsistentes === 2 ? 2 : 1,
      acompananteNombre:
        numAsistentes === 2 && cleanAcompanante ? cleanAcompanante : undefined,
      fecha: formattedTime,
      timestamp: nowMs,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    if (cleanNombre.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Por favor ingresa el nombre completo del periodista o reportero titular (mínimo 3 caracteres).',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (cleanMedio.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Por favor ingresa el nombre del medio de comunicación o agencia.',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (cleanWhatsapp.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Por favor ingresa un número celular con WhatsApp válido a 10 dígitos.',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (numAsistentes !== 1 && numAsistentes !== 2) {
      return NextResponse.json(
        {
          success: false,
          error:
            'El límite máximo de acreditaciones es de 1 o 2 personas por medio de comunicación.',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (numAsistentes === 2 && cleanAcompanante.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Por favor ingrese el nombre completo de su camarógrafo o fotógrafo acompañante.',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 5. Geolocation from Vercel headers
    const city = safeDecode(req.headers.get('x-vercel-ip-city') || '');
    const region = safeDecode(req.headers.get('x-vercel-ip-country-region') || '');
    const country = safeDecode(req.headers.get('x-vercel-ip-country') || '');
    const location =
      [city, region, country].filter(Boolean).join(', ') || 'Ciudad Juárez, Chih., México';

    // 6. Idempotent Deduplication: if same journalist + same WhatsApp already registered,
    //    update their accreditation & keep their original Folio instead of creating duplicate badges.
    const existing = await findExistingAcreditacionByJournalist(cleanNombre, cleanWhatsapp);

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const folio = existing?.folio || `#CCE-PRENSA-${randomDigits}`;
    const recordId =
      existing?.id || `cce-acred-${nowMs}-${Math.random().toString(36).substring(2, 7)}`;

    const newRecord: AcreditacionPrensaRegistration = {
      id: recordId,
      folio,
      nombre: cleanNombre,
      medio: cleanMedio,
      whatsapp: cleanWhatsapp,
      asistentes: numAsistentes,
      ...(numAsistentes === 2 ? { acompananteNombre: cleanAcompanante } : {}),
      fecha: formattedTime,
      timestamp: existing?.timestamp || nowMs,
      checkIn: existing?.checkIn || false,
      location,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    // Save exclusively to Cloud Firestore + CRM (Zero Telegram messages, no duplicate visit ping)
    await saveAcreditacionPrensa(newRecord);

    await saveAcreditacionPrensaAttempt({
      attemptId: activeAttemptId,
      eventType: 'registration_attempt',
      status: 'completado',
      folio,
      ...attemptSnapshot,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        updated: Boolean(existing),
        id: newRecord.id,
        record: newRecord,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in /api/cce-acreditacion-prensa POST:', error);

    if (activeAttemptId && attemptSnapshot) {
      await saveAcreditacionPrensaAttempt({
        attemptId: activeAttemptId,
        eventType: 'registration_attempt',
        status: 'fallido',
        errorReason: error?.message || 'Error interno al guardar acreditación',
        ...attemptSnapshot,
      }).catch(() => {});
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error interno del servidor al procesar la acreditación.',
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminParam = req.nextUrl.searchParams.get('admin');
    const action = req.nextUrl.searchParams.get('action');

    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const host = req.headers.get('host') || '';
    const rawXForwarded = req.headers.get('x-forwarded-for') || '';
    const rawRealIp = req.headers.get('x-real-ip') || '';
    const allIps = (rawXForwarded + ',' + rawRealIp)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const clientIp = allIps[0] || '127.0.0.1';
    const { category: deviceCategory } = parseDevice(userAgent);

    if (action === 'visit') {
      if (!isBotOrLocalVisit(userAgent, clientIp, host)) {
        await logAcreditacionPrensaVisit({
          ip: clientIp,
          deviceCategory,
          timestamp: Date.now(),
        });
      }
      return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
    }

    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado al CRM' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const registrations = await getAcreditacionPrensaList();
    const [telemetry, failedAttempts] = await Promise.all([
      getAcreditacionPrensaTelemetry(registrations),
      getAcreditacionPrensaFailedAttempts(registrations),
    ]);

    return NextResponse.json(
      {
        success: true,
        telemetry,
        registrations,
        failedAttempts,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in /api/cce-acreditacion-prensa GET:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminParam = req.nextUrl.searchParams.get('admin');
    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { id, checkIn } = body;

    if (!id || typeof checkIn !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos (id, checkIn).' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    await updateAcreditacionPrensaCheckIn(id, checkIn);

    return NextResponse.json(
      {
        success: true,
        id,
        checkIn,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in /api/cce-acreditacion-prensa PATCH:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
