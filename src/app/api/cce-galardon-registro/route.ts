import { NextRequest, NextResponse } from 'next/server';
import {
  saveGalardonRegistration,
  getGalardonRegistrations,
  updateGalardonStatus,
  updateGalardonAiAudit,
  logGalardonVisit,
  getGalardonTelemetry,
  GalardonRegistration,
} from '@/lib/cce-galardon-db';
import { auditComprobanteWithAiOcr } from '@/lib/cce-galardon-ai-audit';

function safeDecode(val: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
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

    // Blindaje de archivo: Validación estricta de Magic Bytes binarios
    if (comprobanteUrl && typeof comprobanteUrl === 'string' && comprobanteUrl.startsWith('data:')) {
      const parts = comprobanteUrl.split(',');
      if (parts[1]) {
        const fileBuffer = Buffer.from(parts[1], 'base64');
        if (fileBuffer.length < 3000) {
          return NextResponse.json(
            { success: false, error: 'El archivo adjunto es demasiado pequeño o está incompleto. Por favor adjunta tu comprobante SPEI legible.' },
            { status: 400 }
          );
        }
        const isPdf = fileBuffer.subarray(0, 5).toString('binary') === '%PDF-';
        const isPng = fileBuffer.subarray(0, 4).toString('hex') === '89504e47';
        const isJpg = fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8 && fileBuffer[2] === 0xFF;
        const isWebp = fileBuffer.subarray(0, 4).toString('binary') === 'RIFF' && fileBuffer.subarray(8, 12).toString('binary') === 'WEBP';

        if (!isPdf && !isPng && !isJpg && !isWebp) {
          return NextResponse.json(
            { success: false, error: 'Formato de archivo no válido. Solo se permiten comprobantes en formato PDF, PNG o JPG auténticos.' },
            { status: 400 }
          );
        }
      }
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

    // Enfoque 2: Pre-Conciliación IA + OCR en segundo plano (sin bloquear el registro)
    let aiAudit = undefined;
    try {
      aiAudit = await auditComprobanteWithAiOcr(
        comprobanteUrl ? String(comprobanteUrl).trim() : undefined,
        String(comprobanteFileName).trim(),
        totalMonto
      );
    } catch (auditErr) {
      console.warn('AI/OCR audit non-blocking warning:', auditErr);
    }

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
      ...(comprobanteUrl ? { comprobanteUrl: String(comprobanteUrl).trim() } : {}),
      requiereFactura: Boolean(requiereFactura),
      ...(requiereFactura && facturaData
        ? {
            facturaData: {
              rfc: facturaData.rfc.trim().toUpperCase(),
              razonSocial: facturaData.razonSocial.trim(),
              regimenFiscal: facturaData.regimenFiscal || '601 General de Ley Personas Morales',
              usoCfdi: facturaData.usoCfdi || 'G03 Gastos en general',
              codigoPostal: facturaData.codigoPostal.trim(),
            },
          }
        : {}),
      ...(aiAudit ? { aiAudit } : {}),
      fecha: formattedTime,
      timestamp: Date.now(),
      status: 'pendiente',
      location,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    // Save registration & visit exclusively in Firestore / CRM (Zero Telegram messages)
    await saveGalardonRegistration(newRecord);
    await logGalardonVisit({
      ip: clientIp,
      deviceCategory,
      timestamp: Date.now(),
    });

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
    const { id, status, action } = body;

    // Acción 1: Ejecutar o re-ejecutar Auditoría IA / OCR para un registro o todos los pendientes de auditar
    if (action === 'audit') {
      const registrations = await getGalardonRegistrations();
      if (id) {
        const target = registrations.find(r => r.id === id);
        if (!target) {
          return NextResponse.json({ success: false, error: 'Registro no encontrado.' }, { status: 404 });
        }
        const aiAudit = await auditComprobanteWithAiOcr(
          target.comprobanteUrl,
          target.comprobanteFileName,
          target.totalMonto
        );
        await updateGalardonAiAudit(target.id, aiAudit);
        return NextResponse.json({
          success: true,
          id: target.id,
          aiAudit,
        });
      }

      // Auditar todos los que aún no tengan aiAudit
      const updated: { id: string; aiAudit: any }[] = [];
      for (const reg of registrations) {
        if (!reg.aiAudit) {
          const aiAudit = await auditComprobanteWithAiOcr(
            reg.comprobanteUrl,
            reg.comprobanteFileName,
            reg.totalMonto
          );
          await updateGalardonAiAudit(reg.id, aiAudit);
          updated.push({ id: reg.id, aiAudit });
        }
      }
      return NextResponse.json({
        success: true,
        auditedCount: updated.length,
        updated,
      });
    }

    // Acción 2: Actualizar estatus SPEI
    if (!id || (status !== 'pendiente' && status !== 'validado' && status !== 'rechazado')) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos (id y status válido [pendiente, validado, rechazado] son requeridos).' },
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
