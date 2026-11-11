import { NextRequest, NextResponse } from 'next/server';
import {
  saveGalardonRegistration,
  getGalardonRegistrations,
  getGalardonRegistrationById,
  updateGalardonStatus,
  updateGalardonAiAudit,
  logGalardonVisit,
  saveGalardonAttempt,
  getGalardonFailedAttempts,
  getGalardonTelemetry,
  GalardonRegistration,
} from '@/lib/cce-galardon-db';
import {
  auditComprobanteWithAiOcr,
  optimizeComprobanteForStorage,
} from '@/lib/cce-galardon-ai-audit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

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
  let activeAttemptBase: {
    attemptId: string;
    nombre: string;
    empresa: string;
    cargo: string;
    whatsapp: string;
    email: string;
    boletos: number;
    totalMonto: number;
    comprobanteFileName: string;
    comprobanteSizeBytes?: number;
    source?: string;
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
      source,
      nombre,
      empresa,
      cargo,
      whatsapp,
      email,
      boletos,
      asistentesNombres,
      asignarNombresDespues,
      comprobanteFileName,
      comprobanteSizeBytes,
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

    const nowAttempt = new Date();
    const formattedAttemptTime = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Ciudad_Juarez',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(nowAttempt);

    const parsedBoletos = Math.max(1, Math.min(24, parseInt(String(boletos || 1), 10) || 1));
    const resolvedAttemptId =
      typeof attemptId === 'string' && attemptId.trim().length > 4
        ? attemptId.trim()
        : `attempt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    activeAttemptBase = {
      attemptId: resolvedAttemptId,
      nombre: typeof nombre === 'string' ? nombre.trim() : '',
      empresa: typeof empresa === 'string' ? empresa.trim() : '',
      cargo: typeof cargo === 'string' ? cargo.trim() : '',
      whatsapp: String(whatsapp || '').replace(/\D/g, ''),
      email: typeof email === 'string' ? email.trim().toLowerCase() : '',
      boletos: parsedBoletos,
      totalMonto: parsedBoletos * 2500,
      comprobanteFileName: typeof comprobanteFileName === 'string' ? comprobanteFileName.trim() : '',
      ...(typeof comprobanteSizeBytes === 'number' ? { comprobanteSizeBytes } : {}),
      ...(typeof source === 'string' && source ? { source } : {}),
      fecha: formattedAttemptTime,
      timestamp: Date.now(),
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    // Pre-flight lightweight checkpoint (se dispara desde el cliente ANTES de subir el binario pesado)
    // Garantiza que aunque falle la red móvil o el archivo exceda 4.5 MB, tengamos los datos de contacto en Firestore.
    if (action === 'attempt') {
      console.info('[CCE-GALARDON-ATTEMPT-START]', JSON.stringify(activeAttemptBase));
      await saveGalardonAttempt({
        ...activeAttemptBase,
        eventType: 'registration_attempt',
        status: 'iniciado',
      });
      return NextResponse.json(
        { success: true, attemptId: activeAttemptBase.attemptId },
        { headers: NO_STORE_HEADERS }
      );
    }

    // Registrar también en bitácora del servidor antes de procesar validaciones o archivos
    console.info('[CCE-GALARDON-POST-RECEIVED]', JSON.stringify(activeAttemptBase));
    await saveGalardonAttempt({
      ...activeAttemptBase,
      eventType: 'registration_attempt',
      status: 'iniciado',
    });

    const rejectWithAudit = async (errorMsg: string, statusCode: number, extra: Record<string, any> = {}) => {
      console.warn(
        '[CCE-GALARDON-POST-REJECTED]',
        JSON.stringify({ ...activeAttemptBase, statusCode, errorMsg })
      );
      if (activeAttemptBase) {
        await saveGalardonAttempt({
          ...activeAttemptBase,
          eventType: 'registration_attempt',
          status: 'fallido',
          errorReason: errorMsg,
        });
      }
      return NextResponse.json(
        { success: false, error: errorMsg, ...extra },
        { status: statusCode, headers: NO_STORE_HEADERS }
      );
    };

    // Ventana especial de regularización / confirmación prioritaria:
    // Jueves 12 de Noviembre de 2026 a las 11:59:59 P.M. (Ciudad Juárez, MST UTC-7 -> 2026-11-13T06:59:59Z)
    const RECOVERY_DEADLINE_MS = 1794553199000;
    if (source === 'confirmacion_especial' && Date.now() > RECOVERY_DEADLINE_MS) {
      return rejectWithAudit(
        'El plazo extraordinario de confirmación concluyó el jueves 12 de noviembre a las 11:59 p.m. Para asistencia directa comunícate al WhatsApp del CCE (656 180 3055).',
        403,
        { deadlineExpired: true }
      );
    }

    // Ventana oficial de registro: desde ahora hasta 2 horas después de iniciado el evento
    // Evento: 19 de Noviembre de 2026 a las 9:00 A.M. (Ciudad Juárez, UTC-6)
    // Cierre estricto: 19 de Noviembre de 2026 a las 11:00 A.M. (17:00:00 UTC)
    const EVENT_DEADLINE_MS = 1795107600000;
    if (Date.now() > EVENT_DEADLINE_MS) {
      return rejectWithAudit(
        'El periodo de registro oficial ha concluido formalmente. Las acreditaciones cerraron 2 horas después de iniciado el evento (19 de Noviembre de 2026 a las 11:00 A.M.).',
        403,
        { deadlineExpired: true }
      );
    }

    // Validations
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return rejectWithAudit('Por favor ingresa un nombre completo válido (mínimo 3 caracteres).', 400);
    }

    if (!empresa || typeof empresa !== 'string' || empresa.trim().length < 2) {
      return rejectWithAudit('Por favor ingresa el nombre de tu empresa u organización.', 400);
    }

    if (!cargo || typeof cargo !== 'string' || cargo.trim().length < 2) {
      return rejectWithAudit('Por favor ingresa tu cargo o puesto directivo.', 400);
    }

    const cleanPhone = String(whatsapp || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return rejectWithAudit('Por favor ingresa un número de teléfono celular con WhatsApp a 10 dígitos.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return rejectWithAudit('Por favor ingresa un correo electrónico válido.', 400);
    }

    const numBoletos = Math.max(1, Math.min(24, parseInt(String(boletos || 1), 10)));
    const totalMonto = numBoletos * 2500;
    const tipoBoleto = numBoletos === 8 ? 'mesa' : 'individual';

    if (!comprobanteFileName) {
      return rejectWithAudit('Es obligatorio adjuntar el comprobante de transferencia bancaria SPEI.', 400);
    }

    // Blindaje de archivo: Validación estricta de Magic Bytes binarios
    if (comprobanteUrl && typeof comprobanteUrl === 'string' && comprobanteUrl.startsWith('data:')) {
      const parts = comprobanteUrl.split(',');
      if (parts[1]) {
        const fileBuffer = Buffer.from(parts[1], 'base64');
        if (fileBuffer.length < 3000) {
          return rejectWithAudit(
            'El archivo adjunto es demasiado pequeño o está incompleto. Por favor adjunta tu comprobante SPEI legible.',
            400
          );
        }
        const isPdf = fileBuffer.subarray(0, 5).toString('binary') === '%PDF-';
        const isPng = fileBuffer.subarray(0, 4).toString('hex') === '89504e47';
        const isJpg = fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8 && fileBuffer[2] === 0xFF;
        const isWebp = fileBuffer.subarray(0, 4).toString('binary') === 'RIFF' && fileBuffer.subarray(8, 12).toString('binary') === 'WEBP';

        if (!isPdf && !isPng && !isJpg && !isWebp) {
          return rejectWithAudit(
            'Formato de archivo no válido. Solo se permiten comprobantes en formato PDF, PNG o JPG auténticos.',
            400
          );
        }
      }
    }

    // Facturación validation if requested
    if (requiereFactura) {
      if (!facturaData?.rfc || facturaData.rfc.trim().length < 12) {
        return rejectWithAudit('Por favor ingresa un RFC válido (12 o 13 caracteres).', 400);
      }
      if (!facturaData?.razonSocial || facturaData.razonSocial.trim().length < 3) {
        return rejectWithAudit(
          'Por favor ingresa la Razón Social tal como aparece en tu Constancia de Situación Fiscal.',
          400
        );
      }
      if (!facturaData?.codigoPostal || facturaData.codigoPostal.trim().length !== 5) {
        return rejectWithAudit('Por favor ingresa el Código Postal fiscal a 5 dígitos.', 400);
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

    const rawComprobanteUrl = comprobanteUrl ? String(comprobanteUrl).trim() : '';
    const cleanFileName = String(comprobanteFileName).trim();

    // Optimizar comprobante antes de guardar para jamás exceder el límite de 1 MiB por documento en Cloud Firestore
    const storedComprobanteUrl = rawComprobanteUrl
      ? await optimizeComprobanteForStorage(rawComprobanteUrl, cleanFileName)
      : '';

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
      comprobanteFileName: cleanFileName,
      ...(storedComprobanteUrl ? { comprobanteUrl: storedComprobanteUrl } : {}),
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
      fecha: formattedTime,
      timestamp: Date.now(),
      status: 'pendiente',
      location,
      device: deviceType,
      deviceCategory,
      ip: clientIp,
    };

    // PASO 1 CRÍTICO (Save-First): Persistir el registro inmediatamente en Firestore ANTES de cualquier OCR/IA
    // Garantiza que ningún timeout o fallo en worker pueda perder jamás una acreditación.
    await saveGalardonRegistration(newRecord);

    // Marcar el checkpoint de intento como completado exitosamente con su folio
    if (activeAttemptBase) {
      saveGalardonAttempt({
        ...activeAttemptBase,
        eventType: 'registration_attempt',
        status: 'completado',
        folio: newRecord.folio,
      }).catch(() => {});
    }

    // Registrar telemetría sin bloquear la acreditación
    logGalardonVisit({
      ip: clientIp,
      deviceCategory,
      timestamp: Date.now(),
    }).catch(() => {});

    // PASO 2 NO BLOQUEANTE: Pre-Conciliación IA + OCR con timeout estricto de 8.5s
    try {
      const aiAudit = await Promise.race([
        auditComprobanteWithAiOcr(
          rawComprobanteUrl || storedComprobanteUrl || undefined,
          cleanFileName,
          totalMonto
        ),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 8500)),
      ]);
      if (aiAudit) {
        await updateGalardonAiAudit(newRecord.id, aiAudit);
        newRecord.aiAudit = aiAudit;
      }
    } catch (auditErr) {
      console.warn('AI/OCR audit non-blocking warning (record already saved):', auditErr);
    }

    return NextResponse.json(
      {
        success: true,
        folio: newRecord.folio,
        id: newRecord.id,
        record: newRecord,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error(
      '[CCE-GALARDON-POST-EXCEPTION]',
      JSON.stringify({ attempt: activeAttemptBase, error: error?.message || String(error) })
    );
    if (activeAttemptBase) {
      await saveGalardonAttempt({
        ...activeAttemptBase,
        eventType: 'registration_attempt',
        status: 'fallido',
        errorReason: error?.message || 'Excepción interna del servidor',
      }).catch(() => {});
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminParam = req.nextUrl.searchParams.get('admin');
    const action = req.nextUrl.searchParams.get('action');
    const singleId = req.nextUrl.searchParams.get('id');

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
      return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
    }

    if (!adminParam || adminParam.toLowerCase().trim() !== 'cce2026') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado a la consola CRM' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    // Consulta individual bajo demanda del comprobante completo de un registro
    if (singleId) {
      const registration = await getGalardonRegistrationById(singleId.trim());
      if (!registration) {
        return NextResponse.json(
          { success: false, error: 'Registro no encontrado' },
          { status: 404, headers: NO_STORE_HEADERS }
        );
      }
      return NextResponse.json(
        { success: true, registration },
        { headers: NO_STORE_HEADERS }
      );
    }

    const registrations = await getGalardonRegistrations();
    const [telemetry, failedAttempts] = await Promise.all([
      getGalardonTelemetry(registrations),
      getGalardonFailedAttempts(registrations),
    ]);

    // Blindaje contra el límite de 4.5 MB de respuesta en Vercel Serverless:
    // Si el listado acumulado supera 3.2 MB, los registros excedentes omiten el binario inline
    // y el Dashboard lo descarga bajo demanda al abrir el modal "Ver Archivo".
    const MAX_INLINE_LIST_BYTES = 3_200_000;
    let cumulativeBytes = 0;
    const safeRegistrations = registrations.map((reg) => {
      const regSize = Buffer.byteLength(JSON.stringify(reg), 'utf8');
      if (cumulativeBytes + regSize <= MAX_INLINE_LIST_BYTES) {
        cumulativeBytes += regSize;
        return reg;
      }
      const { comprobanteUrl: _omitted, ...lightReg } = reg;
      cumulativeBytes += Buffer.byteLength(JSON.stringify(lightReg), 'utf8');
      return lightReg as GalardonRegistration;
    });

    return NextResponse.json(
      {
        success: true,
        telemetry,
        registrations: safeRegistrations,
        failedAttempts,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error in /api/cce-galardon-registro GET:', error);
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
