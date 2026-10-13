import { NextRequest, NextResponse } from 'next/server';
import {
  saveGalardonRegistration,
  getGalardonRegistrations,
  updateGalardonStatus,
  logGalardonVisit,
  getGalardonTelemetry,
  GalardonRegistration,
} from '@/lib/cce-galardon-db';

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
    const {
      action,
      nombre,
      empresa,
      cargo,
      whatsapp,
      email,
      boletos,
      asistentesNombres,
      asignarNombresDespues,
      comprobanteFileName,
      comprobanteUrl,
      requiereFactura,
      facturaData,
    } = body;

    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const rawXForwarded = req.headers.get('x-forwarded-for') || '';
    const rawRealIp = req.headers.get('x-real-ip') || '';
    const allIps = (rawXForwarded + ',' + rawRealIp).split(',').map(s => s.trim()).filter(Boolean);
    const clientIp = allIps[0] || '127.0.0.1';

    const { deviceType, category: deviceCategory } = parseDevice(userAgent);

    // Standalone visit logger
    if (action === 'visit') {
      await logGalardonVisit({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      return NextResponse.json({ success: true });
    }

    // Ventana oficial de registro: desde ahora hasta 2 horas después de iniciado el evento
    // Evento: 19 de Noviembre de 2026 a las 9:00 A.M. (Ciudad Juárez, UTC-6)
    // Cierre estricto: 19 de Noviembre de 2026 a las 11:00 A.M. (17:00:00 UTC)
    const EVENT_DEADLINE_MS = 1795107600000;
    if (Date.now() > EVENT_DEADLINE_MS) {
      return NextResponse.json(
        {
          success: false,
          error: 'El periodo de registro oficial ha concluido formalmente. Las acreditaciones cerraron 2 horas después de iniciado el evento (19 de Noviembre de 2026 a las 11:00 A.M.).',
          deadlineExpired: true,
        },
        { status: 403 }
      );
    }

    // Validations
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un nombre completo válido (mínimo 3 caracteres).' },
        { status: 400 }
      );
    }

    if (!empresa || typeof empresa !== 'string' || empresa.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa el nombre de tu empresa u organización.' },
        { status: 400 }
      );
    }

    if (!cargo || typeof cargo !== 'string' || cargo.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa tu cargo o puesto directivo.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(whatsapp || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un número de teléfono celular con WhatsApp a 10 dígitos.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const numBoletos = Math.max(1, Math.min(24, parseInt(String(boletos || 1), 10)));
    const totalMonto = numBoletos * 2500;
    const tipoBoleto = numBoletos === 8 ? 'mesa' : 'individual';

    if (!comprobanteFileName) {
      return NextResponse.json(
        { success: false, error: 'Es obligatorio adjuntar el comprobante de transferencia bancaria SPEI.' },
        { status: 400 }
      );
    }

    // Facturación validation if requested
    if (requiereFactura) {
      if (!facturaData?.rfc || facturaData.rfc.trim().length < 12) {
        return NextResponse.json(
          { success: false, error: 'Por favor ingresa un RFC válido (12 o 13 caracteres).' },
          { status: 400 }
        );
      }
      if (!facturaData?.razonSocial || facturaData.razonSocial.trim().length < 3) {
        return NextResponse.json(
          { success: false, error: 'Por favor ingresa la Razón Social tal como aparece en tu Constancia de Situación Fiscal.' },
          { status: 400 }
        );
      }
      if (!facturaData?.codigoPostal || facturaData.codigoPostal.trim().length !== 5) {
        return NextResponse.json(
          { success: false, error: 'Por favor ingresa el Código Postal fiscal a 5 dígitos.' },
          { status: 400 }
        );
      }
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

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const folio = `#CCE-2026-GAL-${randomSuffix}`;
    const recordId = `cce-gal-${Date.now()}-${randomSuffix}`;

    const newRecord: GalardonRegistration = {
      id: recordId,
      folio,
      nombre: nombre.trim(),
      empresa: empresa.trim(),
      cargo: cargo.trim(),
      whatsapp: cleanPhone,
      email: email.trim().toLowerCase(),
      boletos: numBoletos,
      totalMonto,
      tipoBoleto,
      asistentesNombres: Array.isArray(asistentesNombres) ? asistentesNombres.filter(Boolean) : [],
      asignarNombresDespues: Boolean(asignarNombresDespues),
      comprobanteFileName: String(comprobanteFileName).trim(),
      comprobanteUrl: comprobanteUrl || undefined,
      requiereFactura: Boolean(requiereFactura),
      facturaData: requiereFactura
        ? {
            rfc: facturaData.rfc.trim().toUpperCase(),
            razonSocial: facturaData.razonSocial.trim(),
            regimenFiscal: facturaData.regimenFiscal || '601 General de Ley Personas Morales',
            usoCfdi: facturaData.usoCfdi || 'G03 Gastos en general',
            codigoPostal: facturaData.codigoPostal.trim(),
          }
        : undefined,
      fecha: formattedTime,
      timestamp: Date.now(),
      status: 'pendiente',
      location,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    // Save registration & visit
    await saveGalardonRegistration(newRecord);
    await logGalardonVisit({
      ip: clientIp,
      deviceCategory,
      timestamp: Date.now(),
    });

    // Telegram Alert to Emmanuel Padilla
    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    const montoFormateado = `$${totalMonto.toLocaleString('es-MX')} MXN`;
    const tipoEtiqueta =
      numBoletos === 8
        ? '⭐ Mesa Corporativa Completa (8 Pax)'
        : `${numBoletos} ${numBoletos === 1 ? 'Boleto Individual' : 'Boletos Individuales'}`;

    const asistentesTexto =
      newRecord.asistentesNombres && newRecord.asistentesNombres.length > 0
        ? `\n👥 <b>Asistentes:</b> ${escapeHtml(newRecord.asistentesNombres.join(', '))}`
        : newRecord.asignarNombresDespues
        ? `\n👥 <b>Asistentes:</b> Por coordinar antes del evento con CCE`
        : '';

    const facturaTexto = newRecord.requiereFactura
      ? `\n🧾 <b>Factura Solicitada:</b> RFC: <code>${escapeHtml(newRecord.facturaData?.rfc || '')}</code> | ${escapeHtml(newRecord.facturaData?.razonSocial || '')} (CP ${newRecord.facturaData?.codigoPostal})`
      : `\n🧾 <b>Factura:</b> No solicitada`;

    const telegramMessage = [
      `🎟️ <b>¡NUEVO REGISTRO & COMPROBANTE // CCE GALARDÓN 2026!</b> 🏆`,
      ``,
      `🔖 <b>Folio Oficial:</b> <code>${folio}</code>`,
      `👤 <b>Titular:</b> <b>${escapeHtml(newRecord.nombre)}</b>`,
      `🏢 <b>Empresa:</b> <b>${escapeHtml(newRecord.empresa)}</b> (${escapeHtml(newRecord.cargo)})`,
      `📱 <b>WhatsApp:</b> <a href="https://wa.me/52${cleanPhone}">${cleanPhone}</a>`,
      `✉️ <b>Email:</b> <code>${escapeHtml(newRecord.email)}</code>`,
      ``,
      `🎟️ <b>Modalidad:</b> ${tipoEtiqueta}`,
      `💰 <b>Monto Registrado:</b> <b>${montoFormateado}</b>`,
      `📎 <b>Comprobante Adjunto:</b> <code>${escapeHtml(newRecord.comprobanteFileName)}</code>`,
      asistentesTexto,
      facturaTexto,
      ``,
      `📍 <b>Ubicación:</b> ${escapeHtml(location)}`,
      `💻 <b>Dispositivo:</b> ${escapeHtml(deviceType)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(clientIp)}</code>`,
      `🕒 <b>Hora:</b> ${escapeHtml(formattedTime)}`,
      ``,
      `🏛️ <i>Evento: Empresario del Año 2026 con Carlos Loret de Mola · Centro de Eventos Cibeles · 19 Nov 2026</i>`,
      `🔗 <a href="https://hermes-lite.vercel.app/cce-galardon-EG?admin=cce2026">Abrir Consola CRM CCE</a>`,
    ].filter(Boolean).join('\n');

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
      folio: newRecord.folio,
      id: newRecord.id,
      record: newRecord,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-galardon-registro POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
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

    if (action === 'visit') {
      await logGalardonVisit({
        ip: clientIp,
        deviceCategory,
        timestamp: Date.now(),
      });
      return NextResponse.json({ success: true });
    }

    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json({ success: false, error: 'Acceso no autorizado a la consola CRM' }, { status: 401 });
    }

    const registrations = await getGalardonRegistrations();
    const telemetry = await getGalardonTelemetry(registrations);

    return NextResponse.json({
      success: true,
      telemetry,
      registrations,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-galardon-registro GET:', error);
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
    const { id, status } = body;

    if (!id || (status !== 'pendiente' && status !== 'validado')) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos (id y status son requeridos).' },
        { status: 400 }
      );
    }

    await updateGalardonStatus(id, status);

    return NextResponse.json({
      success: true,
      id,
      status,
    });
  } catch (error: any) {
    console.error('Error in /api/cce-galardon-registro PATCH:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
