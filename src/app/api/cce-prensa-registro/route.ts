import { NextRequest, NextResponse } from 'next/server';
import {
  saveRegistration,
  getRegistrations,
  updateCheckIn,
  logVisit,
  getTelemetry,
  PrensaRegistration,
} from '@/lib/cce-db';

const DEFAULT_BOT_TOKEN = '8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY';
const DEFAULT_CHAT_ID = '1813977310';

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

    // Handle standalone visit logging
    if (action === 'visit') {
      await logVisit({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      return NextResponse.json({ success: true });
    }

    // Mandatory Field Validations
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un nombre completo válido (mínimo 3 caracteres).' },
        { status: 400 }
      );
    }

    if (!medio || typeof medio !== 'string' || medio.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa el nombre de tu medio de comunicación o agencia.' },
        { status: 400 }
      );
    }

    if (!asistentes) {
      return NextResponse.json(
        { success: false, error: 'Por favor selecciona el número de asistentes.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(whatsapp || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'El número de WhatsApp debe contener exactamente 10 dígitos.' },
        { status: 400 }
      );
    }

    // Geolocation from Vercel headers
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

    // Save directly to Google Cloud Firestore (and secondary fallback cache)
    await saveRegistration(newRecord);
    await logVisit({
      ip: clientIp,
      deviceCategory,
      timestamp: Date.now(),
    });

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

    // Log page visit
    if (action === 'visit') {
      await logVisit({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      return NextResponse.json({ success: true });
    }

    // Admin authentication
    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json({ success: false, error: 'Acceso no autorizado al CRM' }, { status: 401 });
    }

    // Fetch real registrations from Firestore database
    const registrations = await getRegistrations();

    // Calculate real telemetry metrics from live data
    const telemetry = await getTelemetry(registrations);

    return NextResponse.json({
      success: true,
      telemetry,
      registrations,
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

    const registrations = await getRegistrations();
    const target = registrations.find(r => r.id === id);

    if (!target) {
      return NextResponse.json({ success: false, error: 'Registro no encontrado' }, { status: 404 });
    }

    await updateCheckIn(id, checkIn);

    return NextResponse.json({
      success: true,
      id,
      checkIn,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-prensa-registro PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
