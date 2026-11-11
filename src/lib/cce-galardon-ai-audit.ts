import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { extractText } from 'unpdf';
import fs from 'fs';
import path from 'path';
import { GalardonAiAudit } from './cce-galardon-db';

/**
 * Extrae imágenes JPEG embebidas dentro de un buffer PDF (por ejemplo, PDFs escaneados o impresos como imagen).
 */
export function extractEmbeddedJpegFromPdf(pdfBuffer: Buffer): Buffer | null {
  let jpgStart = -1;
  for (let i = 0; i < pdfBuffer.length - 3; i++) {
    if (pdfBuffer[i] === 0xff && pdfBuffer[i + 1] === 0xd8 && pdfBuffer[i + 2] === 0xff) {
      jpgStart = i;
      break;
    }
  }
  if (jpgStart === -1) return null;

  let jpgEnd = -1;
  for (let i = pdfBuffer.length - 2; i > jpgStart; i--) {
    if (pdfBuffer[i] === 0xff && pdfBuffer[i + 1] === 0xd9) {
      jpgEnd = i + 2;
      break;
    }
  }
  if (jpgEnd === -1 || jpgEnd - jpgStart < 2000) return null;
  return pdfBuffer.subarray(jpgStart, jpgEnd);
}

/**
 * Optimiza el comprobante en Base64 para que SIEMPRE quepa con holgura debajo del límite de 1 MiB de Cloud Firestore,
 * sin perder legibilidad visual en el CRM.
 */
export async function optimizeComprobanteForStorage(
  dataUrl: string | undefined,
  fileName: string
): Promise<string | undefined> {
  if (!dataUrl || !dataUrl.startsWith('data:')) return undefined;
  // Si ya es ligero (< 550 KB en texto Base64), guardar intacto
  if (dataUrl.length <= 550_000) return dataUrl;

  const parts = dataUrl.split(',');
  if (!parts[1]) return undefined;

  const buffer = Buffer.from(parts[1], 'base64');
  const isPdf =
    buffer.subarray(0, 5).toString('binary') === '%PDF-' ||
    fileName.toLowerCase().endsWith('.pdf') ||
    dataUrl.startsWith('data:application/pdf');

  if (isPdf) {
    // Un PDF hasta ~720,000 caracteres Base64 (~540 KB binario) cabe seguro en Firestore (< 1 MiB)
    if (dataUrl.length <= 720_000) {
      return dataUrl;
    }
    // Si el PDF pesa más de 540 KB y contiene imagen embebida, extraer vista previa JPEG optimizada
    const embeddedJpg = extractEmbeddedJpegFromPdf(buffer);
    if (embeddedJpg) {
      try {
        const compressed = await sharp(embeddedJpg)
          .resize({ width: 1400, withoutEnlargement: true })
          .jpeg({ quality: 76 })
          .toBuffer();
        if (compressed.length <= 450_000) {
          return `data:image/jpeg;base64,${compressed.toString('base64')}`;
        }
      } catch {
        // Ignorar si no es JPEG decodificable
      }
    }
    // Omitir binario inline excesivo para garantizar que el registro jamás sea rechazado por Firestore (1 MiB)
    return undefined;
  }

  // Es imagen (PNG, JPG, WebP): comprimir con Sharp a JPEG nítido < 350 KB
  try {
    const compressed = await sharp(buffer)
      .rotate()
      .resize({ width: 1400, height: 1800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    const outDataUrl = `data:image/jpeg;base64,${compressed.toString('base64')}`;
    if (outDataUrl.length <= 720_000) {
      return outDataUrl;
    }
    const ultraCompressed = await sharp(buffer)
      .rotate()
      .resize({ width: 1000, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 65 })
      .toBuffer();
    const fallbackUrl = `data:image/jpeg;base64,${ultraCompressed.toString('base64')}`;
    return fallbackUrl.length <= 720_000 ? fallbackUrl : undefined;
  } catch (err) {
    console.warn('Image compression warning:', err);
    return dataUrl.length <= 720_000 ? dataUrl : undefined;
  }
}

/**
 * Ejecuta OCR optimizado con pre-procesamiento de alto contraste en Sharp + Tesseract.js
 * Blindado con errorHandler y timeout estricto de 7.5s para evitar cuelgues en entornos Serverless.
 */
async function runOcrOnImageBuffer(imageBuffer: Buffer): Promise<string> {
  let workerRef: Awaited<ReturnType<typeof createWorker>> | null = null;

  const ocrTask = async (): Promise<string> => {
    const meta = await sharp(imageBuffer).metadata();
    const targetWidth = Math.min(2200, Math.max(1200, (meta.width || 1200) * 1.5));

    const enhancedBuffer = await sharp(imageBuffer)
      .rotate()
      .resize({ width: Math.round(targetWidth), withoutEnlargement: false })
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();

    const candidateWorkerPath = path.join(
      process.cwd(),
      'node_modules/tesseract.js/src/worker-script/node/index.js'
    );
    const candidateParentIndex = path.join(
      process.cwd(),
      'node_modules/tesseract.js/src/worker-script/index.js'
    );

    // Verificar antes de lanzar worker_threads que el bundle Serverless tenga todos los archivos requeridos
    if (!fs.existsSync(candidateWorkerPath) || !fs.existsSync(candidateParentIndex)) {
      console.warn('[cce-galardon-ai-audit] Tesseract worker scripts ausentes en bundle serverless; omitiendo OCR de imagen.');
      return '';
    }

    return await new Promise<string>((resolve) => {
      let settled = false;
      const finish = (val: string) => {
        if (!settled) {
          settled = true;
          resolve(val);
        }
      };

      createWorker('spa', 1, {
        cachePath: '/tmp',
        workerPath: candidateWorkerPath,
        errorHandler: (err) => {
          console.warn('[cce-galardon-ai-audit] Worker error capturado:', err);
          finish('');
        },
      })
        .then(async (worker) => {
          workerRef = worker;
          try {
            const result = await worker.recognize(enhancedBuffer);
            finish(result?.data?.text || '');
          } catch (recErr) {
            console.warn('[cce-galardon-ai-audit] Recognize error:', recErr);
            finish('');
          } finally {
            try {
              await worker.terminate();
            } catch {
              // Ignore terminate errors
            }
            workerRef = null;
          }
        })
        .catch((initErr) => {
          console.warn('[cce-galardon-ai-audit] createWorker catch:', initErr);
          finish('');
        });
    });
  };

  const timeoutPromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      console.warn('[cce-galardon-ai-audit] OCR superó el límite de 7.5s; continuando sin bloquear.');
      if (workerRef) {
        workerRef.terminate().catch(() => {});
        workerRef = null;
      }
      resolve('');
    }, 7500);
  });

  try {
    return await Promise.race([ocrTask(), timeoutPromise]);
  } catch (err) {
    console.warn('Error en OCR de imagen:', err);
    return '';
  }
}

/**
 * Extrae el texto de un comprobante (sea PDF nativo, PDF con imagen o captura PNG/JPG/WebP)
 */
export async function extractReceiptText(dataUrl: string, fileName: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:')) return '';
  const parts = dataUrl.split(',');
  if (!parts[1]) return '';

  const buffer = Buffer.from(parts[1], 'base64');
  const isPdf =
    buffer.subarray(0, 5).toString('binary') === '%PDF-' ||
    fileName.toLowerCase().endsWith('.pdf') ||
    dataUrl.startsWith('data:application/pdf');

  if (isPdf) {
    let pdfText = '';
    try {
      const { text } = await extractText(new Uint8Array(buffer));
      pdfText = Array.isArray(text) ? text.join('\n') : String(text || '');
    } catch (e) {
      console.warn('unpdf extraction warning:', e);
    }

    // Si el PDF tiene capa de texto suficiente, usarla directamente
    if (pdfText.trim().length >= 45) {
      return pdfText.trim();
    }

    // Si es un PDF escaneado (solo imagen adentro), extraer JPEG y pasarle OCR
    const embeddedJpg = extractEmbeddedJpegFromPdf(buffer);
    if (embeddedJpg) {
      const ocrFromPdf = await runOcrOnImageBuffer(embeddedJpg);
      return (pdfText + '\n' + ocrFromPdf).trim();
    }

    return pdfText.trim();
  }

  // Es una imagen (PNG, JPG, JPEG, WebP)
  return await runOcrOnImageBuffer(buffer);
}

/**
 * Analiza forensemente el texto extraído del comprobante y emite el dictamen estructurado para el CRM.
 */
export function analyzeReceiptText(
  rawText: string,
  expectedAmount: number,
  fileName: string
): GalardonAiAudit {
  const cleanText = rawText.replace(/\r/g, '').trim();
  const upper = cleanText.toUpperCase();
  const hallazgos: string[] = [];

  // 1. Vocabulario bancario SPEI / Transferencia
  const bankingKeywords = [
    'TRANSFERENCIA',
    'OPERACION',
    'OPERACIÓN',
    'SPEI',
    'IMPORTE',
    'MONTO',
    'CLABE',
    'RASTREO',
    'REFERENCIA',
    'BENEFICIARIO',
    'ORDENANTE',
    'CUENTA DESTINO',
    'CUENTA ORIGEN',
    'BANCO RECEPTOR',
    'BANCO DESTINO',
    'RECIBO',
    'COMPROBANTE',
    'FOLIO',
    'COMISION',
    'COMISIÓN',
    'BANORTE',
    'BBVA',
    'HSBC',
    'SANTANDER',
    'BANAMEX',
    'CITIBANAMEX',
    'SCOTIABANK',
    'BANREGIO',
    'BAJIO',
    'INBURSA',
  ];

  const matchedKeywords = bankingKeywords.filter((kw) => upper.includes(kw));
  const esComprobanteBancario = matchedKeywords.length >= 3;

  // 2. Detectar Banco Emisor / Receptor
  const otherBanks: { key: string; label: string }[] = [
    { key: 'HSBC', label: 'HSBC' },
    { key: 'BBVA', label: 'BBVA México' },
    { key: 'SANTANDER', label: 'Santander' },
    { key: 'CITIBANAMEX', label: 'Citibanamex' },
    { key: 'BANAMEX', label: 'Banamex' },
    { key: 'SCOTIABANK', label: 'Scotiabank' },
    { key: 'BANREGIO', label: 'Banregio' },
    { key: 'BAJIO', label: 'Banco del Bajío' },
    { key: 'BAJÍO', label: 'Banco del Bajío' },
    { key: 'AFIRME', label: 'Afirme' },
    { key: 'INBURSA', label: 'Inbursa' },
    { key: 'AZTECA', label: 'Banco Azteca' },
    { key: 'MERCADO PAGO', label: 'Mercado Pago' },
    { key: 'NU ', label: 'Nu México' },
    { key: 'STP', label: 'STP' },
  ];

  let originBank = '';
  for (const b of otherBanks) {
    if (upper.includes(b.key)) {
      originBank = b.label;
      break;
    }
  }

  const hasBanorte =
    upper.includes('BANORTE') ||
    upper.includes('MERCANTIL DEL NORTE') ||
    upper.includes('BMN-930209') ||
    upper.includes('NBXI') ||
    upper.includes('ENLACE PERSONAL');

  let bancoDetectado = 'No identificado';
  if (originBank && hasBanorte) {
    bancoDetectado = `${originBank} → Banorte`;
  } else if (originBank) {
    bancoDetectado = originBank;
  } else if (hasBanorte) {
    bancoDetectado = 'Banorte';
  }

  // 3. Extraer Monto de la Transferencia
  // Buscar números con formato de moneda o decimales: ej. $5,000.00, 10,000.00 MXN, 2,500.00
  const amountRegex = /(?:[$]\s*)?(\d{1,3}(?:,\d{3})+(?:\.\d{2})?|\d{4,6}(?:\.\d{2}))/g;
  const candidateAmounts: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = amountRegex.exec(cleanText)) !== null) {
    const rawNum = match[1].replace(/,/g, '');
    const val = parseFloat(rawNum);
    // Filtrar años como 2026 o números de cuenta largos o comisiones menores a $100
    const hasDecimal = match[1].includes('.');
    const hasComma = match[1].includes(',');
    if (!isNaN(val) && val >= 500 && val <= 500000 && (hasDecimal || hasComma)) {
      candidateAmounts.push(val);
    }
  }

  let montoDetectado: number | null = null;
  if (candidateAmounts.length > 0) {
    // Si alguno coincide exactamente con el esperado, priorizarlo
    const exactMatch = candidateAmounts.find((a) => Math.abs(a - expectedAmount) < 1);
    montoDetectado = exactMatch !== undefined ? exactMatch : Math.max(...candidateAmounts);
  }

  const montoCoincide =
    montoDetectado !== null && Math.abs(montoDetectado - expectedAmount) < 1;

  if (montoDetectado !== null) {
    if (montoCoincide) {
      hallazgos.push(
        `Monto verificado: $${montoDetectado.toLocaleString('es-MX')} MXN coincide con el total del registro.`
      );
    } else {
      hallazgos.push(
        `Discrepancia de monto: el comprobante muestra $${montoDetectado.toLocaleString('es-MX')} MXN pero el registro requiere $${expectedAmount.toLocaleString('es-MX')} MXN.`
      );
    }
  } else {
    hallazgos.push('No se logró leer un importe numérico claro en el documento.');
  }

  // 4. Verificar Cuenta Destino / Beneficiario CCE Ciudad Juárez
  const hasCceAccount =
    upper.includes('1311258562') ||
    upper.includes('8562') ||
    upper.includes('072164013112585620') ||
    /\*{4,}620\b/.test(upper) ||
    upper.includes('620');
  const hasCceRfc = upper.includes('CCE040526T14');
  const hasCceName =
    upper.includes('CONSEJO COORDINADOR EMPRESARIAL') ||
    upper.includes('CCE CIUDAD JUAREZ') ||
    upper.includes('CCE JUAREZ');

  const cuentaDestinoValida = Boolean(hasCceAccount || hasCceRfc || hasCceName || hasBanorte);

  let beneficiarioDetectado = 'No visible en captura';
  if (hasCceName && hasCceRfc) {
    beneficiarioDetectado = 'CCE Ciudad Juárez (RFC: CCE040526T14 · Cta. 1311258562)';
    hallazgos.push('Beneficiario y RFC oficial del CCE Ciudad Juárez (CCE040526T14) confirmados.');
  } else if (hasCceName || upper.includes('1311258562')) {
    beneficiarioDetectado = 'CCE Ciudad Juárez (Cta. 1311258562)';
    hallazgos.push('Cuenta destino Banorte del CCE Ciudad Juárez (1311258562) confirmada.');
  } else if (hasCceAccount && hasBanorte) {
    beneficiarioDetectado = 'Banorte CLABE terminación *620 (CCE)';
    hallazgos.push('Cuenta destino Banorte CLABE terminación *620 confirmada.');
  } else if (hasBanorte && upper.includes('RECEPTOR')) {
    beneficiarioDetectado = 'Banco Receptor: Banorte (Cuenta CCE)';
    hallazgos.push('Banco receptor Banorte confirmado en resumen de operación.');
  }

  // 5. Extraer Clave de Rastreo y Referencia
  let claveRastreo = '';
  const rastreoMatch = cleanText.match(
    /Clave\s+de\s+[Rr]astreo[:\s]+([A-Z0-9-]{4,35})/i
  );
  if (rastreoMatch && rastreoMatch[1]) {
    claveRastreo = rastreoMatch[1].trim();
  }

  let referencia = '';
  const refMatch = cleanText.match(
    /(?:Referencia\s+num[eé]rica|N[uú]mero\s+de\s+Referencia|Folio)[:\s]+([A-Z0-9-]{4,25})/i
  );
  if (refMatch && refMatch[1]) {
    referencia = refMatch[1].trim();
  }

  if (claveRastreo) {
    hallazgos.push(`Clave de rastreo detectada: ${claveRastreo}`);
  } else if (referencia) {
    hallazgos.push(`Referencia bancaria detectada: ${referencia}`);
  }

  // 6. Extraer Fecha de Operación (incluyendo variaciones OCR como 0ct por Oct)
  let fechaOperacion = '';
  const dateMatch = cleanText.match(
    /(\d{1,2}\s*[\/\-]\s*(?:\d{1,2}|[0O]?[A-Za-z]{2,4}\.?)\s*[\/\-]\s*\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?|\d{1,2}\s+(?:[0o]ct|nov|sep|ago|dic)[a-z]*\s+\d{4}(?:,?\s+\d{1,2}:\d{2}(?::\d{2})?)?)/i
  );
  if (dateMatch && dateMatch[1]) {
    fechaOperacion = dateMatch[1].replace(/0ct/gi, 'Oct').replace(/\s+/g, ' ').trim();
  }

  // 7. Calcular Veredicto y Confianza
  let veredicto: 'legitimo' | 'revision' | 'sospechoso' = 'sospechoso';
  let confianza = 15;
  let resumenIa = '';

  if (esComprobanteBancario && montoCoincide && cuentaDestinoValida) {
    veredicto = 'legitimo';
    confianza = 98;
    resumenIa = `Comprobante ${bancoDetectado} verificado por $${montoDetectado?.toLocaleString('es-MX')} MXN (coincide con el registro).`;
  } else if (esComprobanteBancario && montoCoincide) {
    veredicto = 'legitimo';
    confianza = 90;
    resumenIa = `Captura bancaria ${bancoDetectado} por $${montoDetectado?.toLocaleString('es-MX')} MXN coincide con el monto esperado.`;
  } else if (esComprobanteBancario && montoDetectado !== null && !montoCoincide) {
    veredicto = 'revision';
    confianza = 65;
    resumenIa = `Comprobante bancario detectado (${bancoDetectado}), pero el monto leído ($${montoDetectado.toLocaleString('es-MX')}) difiere del esperado ($${expectedAmount.toLocaleString('es-MX')}).`;
  } else if (esComprobanteBancario) {
    veredicto = 'revision';
    confianza = 60;
    resumenIa = `Estructura de recibo bancario (${bancoDetectado}) detectada; requiere confirmar importe visualmente.`;
  } else if (cleanText.length < 10) {
    veredicto = 'revision';
    confianza = 50;
    resumenIa = `Comprobante recibido (${fileName}); requiere verificación visual del importe en consola CRM.`;
    hallazgos.push('El documento es escaneado o imagen sin capa de texto legible automática; verificar visualmente.');
  } else {
    veredicto = 'sospechoso';
    confianza = 12;
    resumenIa = `Alerta: El archivo (${fileName}) no presenta texto ni estructura de transferencia bancaria SPEI.`;
    hallazgos.push('No se encontraron palabras clave de transferencia bancaria, CLABE ni banco.');
  }

  const auditadoEn = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Ciudad_Juarez',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  return {
    veredicto,
    confianza,
    esComprobanteBancario,
    bancoDetectado,
    montoDetectado,
    montoEsperado: expectedAmount,
    montoCoincide,
    cuentaDestinoValida,
    beneficiarioDetectado,
    claveRastreo: claveRastreo || 'No especificada',
    referencia: referencia || 'No especificada',
    fechaOperacion: fechaOperacion || 'No detectada',
    resumenIa,
    hallazgos,
    textoExtraido: cleanText.slice(0, 1200),
    auditadoEn,
  };
}

/**
 * Función integral que recibe un comprobante en DataURL y devuelve el objeto GalardonAiAudit completo.
 */
export async function auditComprobanteWithAiOcr(
  comprobanteUrl: string | undefined,
  comprobanteFileName: string,
  expectedAmount: number
): Promise<GalardonAiAudit> {
  if (!comprobanteUrl || !comprobanteUrl.startsWith('data:')) {
    return {
      veredicto: 'revision',
      confianza: 30,
      esComprobanteBancario: false,
      bancoDetectado: 'Pendiente de lectura',
      montoDetectado: null,
      montoEsperado: expectedAmount,
      montoCoincide: false,
      cuentaDestinoValida: false,
      beneficiarioDetectado: 'No disponible',
      claveRastreo: 'No especificada',
      referencia: 'No especificada',
      fechaOperacion: 'No detectada',
      resumenIa: 'El archivo no incluye vista previa procesable para OCR automático.',
      hallazgos: ['Comprobante sin imagen/PDF en base64 para lectura OCR.'],
      textoExtraido: '',
      auditadoEn: new Date().toISOString(),
    };
  }

  const rawText = await extractReceiptText(comprobanteUrl, comprobanteFileName);
  return analyzeReceiptText(rawText, expectedAmount, comprobanteFileName);
}
