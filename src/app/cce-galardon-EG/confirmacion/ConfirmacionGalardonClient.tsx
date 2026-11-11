'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Upload,
  Users,
} from 'lucide-react';

// Fecha límite estricta: Jueves 12 de Noviembre de 2026 a las 11:59:59 P.M. (Hora Ciudad Juárez, MST UTC-7)
const RECOVERY_DEADLINE_MS = 1794553199000;

interface TimeLeft {
  expired: boolean;
  totalHours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(nowMs: number): TimeLeft {
  const diff = RECOVERY_DEADLINE_MS - nowMs;
  if (diff <= 0) {
    return { expired: true, totalHours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const totalHours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { expired: false, totalHours, minutes, seconds };
}

export default function ConfirmacionGalardonClient() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    expired: false,
    totalHours: 39,
    minutes: 59,
    seconds: 59,
  });

  // Form states
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [asignarNombresDespues, setAsignarNombresDespues] = useState(true);
  const [asistentesNombres, setAsistentesNombres] = useState<string[]>(['']);

  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobanteFileName, setComprobanteFileName] = useState('');
  const [comprobantePreview, setComprobantePreview] = useState('');
  const [comprobanteReading, setComprobanteReading] = useState(false);
  const comprobanteReadPromiseRef = useRef<Promise<string> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CFDI 4.0 states
  const [requiereFactura, setRequiereFactura] = useState(false);
  const [rfc, setRfc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('601 General de Ley Personas Morales');
  const [usoCfdi, setUsoCfdi] = useState('G03 Gastos en general');
  const [codigoPostal, setCodigoPostal] = useState('');

  // Submit & confirmation states
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<{
    folio: string;
    nombre: string;
    empresa: string;
    cargo: string;
    boletos: number;
    totalMonto: number;
    comprobanteFileName: string;
  } | null>(null);
  const [folioCopied, setFolioCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(computeTimeLeft(Date.now()));
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAsistentesNombres((prev) => {
      const next = [...prev];
      while (next.length < ticketQuantity) {
        next.push('');
      }
      return next.slice(0, ticketQuantity);
    });
  }, [ticketQuantity]);

  const isExpired = mounted && timeLeft.expired;

  const copyFolio = () => {
    if (confirmedRecord?.folio && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(confirmedRecord.folio);
      setFolioCopied(true);
      setTimeout(() => setFolioCopied(false), 3000);
    }
  };

  const handleFileSelect = (file: File) => {
    setFormError(null);
    if (!file) return;

    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setFormError('Formato no soportado. Por favor adjunta un archivo en formato PNG, JPG, JPEG, WebP o PDF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('El archivo excede el tamaño máximo permitido de 10 MB.');
      return;
    }

    if (file.size < 3000) {
      setFormError('El archivo seleccionado es demasiado pequeño o está dañado (mínimo 3 KB). Por favor adjunta una captura legible de tu comprobante SPEI.');
      return;
    }

    setComprobanteFile(file);
    setComprobanteFileName(file.name);
    setComprobanteReading(true);

    const readPromise = new Promise<string>((resolve) => {
      const isImage =
        file.type.startsWith('image/') ||
        /\.(png|jpe?g|webp)$/i.test(fileName);
      const isPdf =
        file.type === 'application/pdf' || fileName.endsWith('.pdf');

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rawDataUrl = (e.target?.result as string) || '';
          if (file.size > 200 * 1024 || !file.type.includes('jpeg')) {
            const img = new window.Image();
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                const MAX_DIM = 1400;
                let width = img.width;
                let height = img.height;
                if (width > height && width > MAX_DIM) {
                  height = Math.round((height * MAX_DIM) / width);
                  width = MAX_DIM;
                } else if (height > MAX_DIM) {
                  width = Math.round((width * MAX_DIM) / height);
                  height = MAX_DIM;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fillRect(0, 0, width, height);
                  ctx.drawImage(img, 0, 0, width, height);
                  const compressed = canvas.toDataURL('image/jpeg', 0.8);
                  setComprobantePreview(compressed);
                  setComprobanteReading(false);
                  resolve(compressed);
                  return;
                }
              } catch {
                // fallback below
              }
              setComprobantePreview(rawDataUrl);
              setComprobanteReading(false);
              resolve(rawDataUrl);
            };
            img.onerror = () => {
              setComprobantePreview(rawDataUrl);
              setComprobanteReading(false);
              resolve(rawDataUrl);
            };
            img.src = rawDataUrl;
          } else {
            setComprobantePreview(rawDataUrl);
            setComprobanteReading(false);
            resolve(rawDataUrl);
          }
        };
        reader.onerror = () => {
          setComprobantePreview('');
          setComprobanteReading(false);
          resolve('');
        };
        reader.readAsDataURL(file);
      } else if (isPdf) {
        if (file.size <= 3.2 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const rawDataUrl = (e.target?.result as string) || '';
            setComprobantePreview(rawDataUrl);
            setComprobanteReading(false);
            resolve(rawDataUrl);
          };
          reader.onerror = () => {
            setComprobantePreview('');
            setComprobanteReading(false);
            resolve('');
          };
          reader.readAsDataURL(file);
        } else {
          setComprobantePreview('');
          setComprobanteReading(false);
          resolve('');
        }
      } else {
        setComprobantePreview('');
        setComprobanteReading(false);
        resolve('');
      }
    });

    comprobanteReadPromiseRef.current = readPromise;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (Date.now() > RECOVERY_DEADLINE_MS) {
      setTimeLeft(computeTimeLeft(Date.now()));
      setFormError(
        'El plazo extraordinario de confirmación concluyó el jueves 12 de noviembre a las 11:59 p.m. Para asistencia directa comunícate al WhatsApp del CCE (656 180 3055).'
      );
      return;
    }

    if (!nombre.trim() || nombre.trim().length < 3) {
      setFormError('Por favor ingresa el nombre completo del titular o representante (mínimo 3 caracteres).');
      return;
    }

    if (!empresa.trim() || empresa.trim().length < 2) {
      setFormError('Por favor ingresa la empresa u organización.');
      return;
    }

    if (!cargo.trim() || cargo.trim().length < 2) {
      setFormError('Por favor ingresa tu cargo o puesto directivo.');
      return;
    }

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Por favor ingresa un teléfono celular con WhatsApp a 10 dígitos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!comprobanteFileName) {
      setFormError('Es obligatorio adjuntar el comprobante de transferencia bancaria SPEI.');
      return;
    }

    if (requiereFactura) {
      if (!rfc.trim() || rfc.trim().length < 12) {
        setFormError('Por favor ingresa un RFC válido (12 o 13 caracteres).');
        return;
      }
      if (!razonSocial.trim() || razonSocial.trim().length < 3) {
        setFormError('Por favor ingresa la Razón Social tal como aparece en tu Constancia de Situación Fiscal.');
        return;
      }
      if (!codigoPostal.trim() || codigoPostal.trim().length !== 5) {
        setFormError('Por favor ingresa el Código Postal fiscal a 5 dígitos.');
        return;
      }
    }

    setFormSubmitting(true);
    const attemptId = `attempt-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch('/api/cce-galardon-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'attempt',
          attemptId,
          source: 'confirmacion_especial',
          nombre: nombre.trim(),
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          whatsapp: cleanPhone,
          email: email.trim().toLowerCase(),
          boletos: ticketQuantity,
          comprobanteFileName,
          comprobanteSizeBytes: comprobanteFile?.size || 0,
        }),
      }).catch(() => {});

      let finalComprobanteUrl = comprobantePreview || '';
      if ((comprobanteReading || !finalComprobanteUrl) && comprobanteReadPromiseRef.current) {
        finalComprobanteUrl = await comprobanteReadPromiseRef.current;
      }

      const res = await fetch('/api/cce-galardon-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          source: 'confirmacion_especial',
          nombre: nombre.trim(),
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          whatsapp: cleanPhone,
          email: email.trim().toLowerCase(),
          boletos: ticketQuantity,
          asistentesNombres: !asignarNombresDespues ? asistentesNombres.filter(Boolean) : [],
          asignarNombresDespues,
          comprobanteFileName,
          comprobanteUrl: finalComprobanteUrl,
          requiereFactura,
          ...(requiereFactura
            ? {
                facturaData: {
                  rfc: rfc.trim().toUpperCase(),
                  razonSocial: razonSocial.trim(),
                  regimenFiscal,
                  usoCfdi,
                  codigoPostal: codigoPostal.trim(),
                },
              }
            : {}),
        }),
      });

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        if (res.status === 413) {
          throw new Error('El comprobante adjunto es demasiado pesado. Por favor sube una captura JPG/PNG o un PDF más ligero.');
        }
        throw new Error(`No se recibió respuesta válida del servidor (código ${res.status}). Por favor intenta nuevamente.`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar la confirmación.');
      }

      const totalMonto = ticketQuantity * 2500;
      setConfirmedRecord({
        folio: data.folio || `#CCE-2026-GAL-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre: nombre.trim(),
        empresa: empresa.trim(),
        cargo: cargo.trim(),
        boletos: ticketQuantity,
        totalMonto,
        comprobanteFileName,
      });

      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setFormError(err.message || 'Ocurrió un error al enviar la confirmación. Por favor intenta nuevamente.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const downloadIcs = () => {
    const folioStr = confirmedRecord?.folio || '#CCE-2026-GAL';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CCE Ciudad Juarez//Empresario del Ano 2026//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Entrega de Galardones 2026 & Conferencia Loret · CCE Juárez',
      `DESCRIPTION:Entrega de Galardones Empresariales 2026 (Estrella Ascendente y De Altos Vuelos) y Conferencia Magistral con Carlos Loret de Mola: "México y Estados Unidos: Poder, política y economía en tiempos de cambio".\\n\\nFolio Oficial: ${folioStr}\\nHorario: Registro 8:30 a.m. | Inicio del Desayuno 9:00 a.m.\\nCódigo de Vestimenta: Formal.\\nSede: Centro de Eventos Cibeles.`,
      'LOCATION:Centro de Eventos Cibeles, Blvd. Tomás Fernández No. 8450, Cd. Juárez, Chih.',
      'DTSTART:20261119T153000Z',
      'DTEND:20261119T190000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'CCE_Galardones_2026_Loret_Juarez.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleCalendarUrl = () => {
    const folioStr = confirmedRecord?.folio || '#CCE-2026-GAL';
    const title = encodeURIComponent('Entrega de Galardones 2026 & Conferencia Loret · CCE Juárez');
    const details = encodeURIComponent(
      `Entrega de Galardones Empresariales 2026 (Estrella Ascendente y De Altos Vuelos) y Conferencia Magistral con Carlos Loret de Mola: "México y Estados Unidos: Poder, política y economía en tiempos de cambio".\n\nFolio Oficial de Acreditación: ${folioStr}\nTitular: ${confirmedRecord?.nombre || ''}\nEmpresa: ${confirmedRecord?.empresa || ''}\nBoletos: ${confirmedRecord?.boletos || 1}\n\nSede: Centro de Eventos Cibeles, Salón Magno.\nHorario: Registro 8:30 a.m. | Inicio del Desayuno 9:00 a.m.\nCódigo de Vestimenta: Formal.`
    );
    const location = encodeURIComponent(
      'Centro de Eventos Cibeles, Blvd. Tomás Fernández No. 8450, Cd. Juárez, Chih.'
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261119T153000Z/20261119T190000Z&details=${details}&location=${location}`;
  };

  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="cce-recovery-shell">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --cce-gold: #d4af37;
          --cce-gold-light: #f5de98;
          --cce-emerald-deep: #021812;
          --cce-emerald-mid: #042e23;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #021812;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .cce-recovery-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.16) 0%, transparent 52%),
            radial-gradient(circle at 85% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 45%),
            linear-gradient(180deg, #042e23 0%, #021812 55%, #01110d 100%);
          padding: 0 0 64px 0;
        }

        /* Top Institutional Bar */
        .cce-rec-topbar {
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          background: rgba(2, 20, 15, 0.86);
          backdrop-filter: blur(12px);
          padding: 14px 20px;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .cce-rec-topbar-inner {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cce-rec-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
        }

        .cce-rec-event-tag {
          font-size: 12px;
          font-weight: 700;
          color: var(--cce-gold-light);
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.35);
          padding: 6px 14px;
          border-radius: 999px;
          letter-spacing: 0.03em;
        }

        .cce-rec-container {
          max-width: 860px;
          margin: 28px auto 0 auto;
          padding: 0 18px;
        }

        /* Countdown Banner */
        .cce-timer-banner {
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.72) 0%, rgba(2, 22, 16, 0.96) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.6);
          border-radius: 22px;
          padding: 22px 26px;
          margin-bottom: 26px;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cce-timer-banner.cce-timer-expired {
          border-color: rgba(239, 68, 68, 0.65);
          background: linear-gradient(135deg, rgba(69, 10, 10, 0.65) 0%, rgba(20, 10, 10, 0.95) 100%);
        }

        .cce-timer-left {
          flex: 1 1 320px;
        }

        .cce-timer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--cce-gold);
          margin-bottom: 6px;
        }

        .cce-timer-heading {
          font-size: 16.5px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 4px 0;
          line-height: 1.35;
        }

        .cce-timer-sub {
          font-size: 13px;
          color: #cbd5e1;
          margin: 0;
          line-height: 1.45;
        }

        .cce-timer-boxes {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .cce-timer-unit {
          min-width: 68px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(2, 16, 12, 0.92);
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          text-align: center;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .cce-timer-num {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 24px;
          font-weight: 900;
          color: var(--cce-gold-light);
          line-height: 1.1;
        }

        .cce-timer-lbl {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-top: 3px;
        }

        .cce-timer-sep {
          font-size: 20px;
          font-weight: 900;
          color: var(--cce-gold);
        }

        /* Header */
        .cce-reg-header {
          text-align: center;
          margin-bottom: 26px;
        }

        .cce-reg-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(6, 78, 59, 0.45);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: var(--cce-gold);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .cce-reg-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(23px, 4vw, 33px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.02em;
          margin: 0 0 10px 0;
        }

        .cce-reg-subtitle {
          font-size: clamp(13.5px, 2vw, 15.5px);
          color: #cbd5e1;
          max-width: 660px;
          margin: 0 auto;
          line-height: 1.55;
        }

        /* Ticket Summary */
        .cce-reg-ticket-summary {
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.45) 0%, rgba(3, 26, 19, 0.8) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.42);
          border-radius: 18px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .cce-reg-ticket-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cce-reg-ticket-badge-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cce-gold);
          flex-shrink: 0;
        }

        .cce-reg-ticket-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }

        .cce-reg-ticket-val {
          font-size: 15.5px;
          font-weight: 800;
          color: #ffffff;
        }

        .cce-stepper-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(212, 175, 55, 0.16);
          border: 1px solid rgba(212, 175, 55, 0.45);
          color: var(--cce-gold-light);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cce-stepper-btn:hover:not(:disabled) {
          background: var(--cce-gold);
          color: #021812;
        }

        .cce-stepper-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .cce-reg-ticket-total {
          text-align: right;
        }

        .cce-reg-ticket-total-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .cce-reg-ticket-total-val {
          font-size: 21px;
          font-weight: 900;
          color: var(--cce-gold-light);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        /* Form Card */
        .cce-form-card {
          background: linear-gradient(145deg, rgba(3, 26, 19, 0.96) 0%, rgba(2, 18, 14, 0.99) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.45);
          border-radius: 24px;
          padding: clamp(22px, 4vw, 38px);
          box-shadow: 0 25px 65px rgba(0, 0, 0, 0.8);
        }

        .cce-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .cce-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .cce-form-group.cce-full-width {
          grid-column: 1 / -1;
        }

        .cce-label {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cce-req-star {
          color: var(--cce-gold);
        }

        .cce-input,
        .cce-select {
          width: 100%;
          min-height: 48px;
          padding: 12px 15px;
          border-radius: 12px;
          background: rgba(2, 20, 15, 0.88);
          border: 1.5px solid rgba(212, 175, 55, 0.3);
          color: #ffffff;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.2s ease;
          outline: none;
        }

        .cce-input:focus,
        .cce-select:focus {
          border-color: var(--cce-gold);
          background: rgba(4, 30, 22, 0.96);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.18);
        }

        .cce-input:disabled,
        .cce-select:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .cce-input::placeholder {
          color: #64748b;
        }

        .cce-select option {
          background-color: #031a13;
          color: #ffffff;
        }

        /* Attendees */
        .cce-attendees-section {
          grid-column: 1 / -1;
          background: rgba(2, 22, 16, 0.65);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          padding: 18px;
          margin-top: 4px;
        }

        .cce-attendees-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }

        .cce-attendees-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cce-attendees-options {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cce-opt-btn {
          padding: 7px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(2, 18, 14, 0.8);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cce-opt-btn.cce-opt-active {
          background: rgba(16, 185, 129, 0.25);
          border-color: #10b981;
          color: #ffffff;
        }

        .cce-attendees-inputs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .cce-attendee-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cce-attendee-index {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--cce-gold);
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cce-attendees-note {
          font-size: 12.5px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
        }

        /* Upload */
        .cce-upload-wrap {
          grid-column: 1 / -1;
          margin-top: 6px;
        }

        .cce-upload-zone {
          border: 2px dashed rgba(212, 175, 55, 0.45);
          border-radius: 18px;
          background: rgba(2, 22, 16, 0.55);
          padding: 26px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cce-upload-zone:hover,
        .cce-upload-zone.cce-drag-over {
          border-color: #10b981;
          background: rgba(6, 78, 59, 0.35);
        }

        .cce-upload-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cce-gold);
          margin: 0 auto 12px auto;
        }

        .cce-upload-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 5px;
        }

        .cce-upload-desc {
          font-size: 12.5px;
          color: #94a3b8;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.45;
        }

        .cce-upload-success-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: rgba(6, 78, 59, 0.5);
          border: 1.5px solid #10b981;
          border-radius: 14px;
          padding: 13px 16px;
          margin-top: 12px;
        }

        .cce-upload-file-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ecfdf5;
          font-size: 13.5px;
          font-weight: 700;
          word-break: break-word;
        }

        .cce-upload-remove-btn {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #fca5a5;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Factura */
        .cce-factura-toggle-box {
          grid-column: 1 / -1;
          background: rgba(2, 22, 16, 0.65);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 18px 20px;
          margin-top: 6px;
        }

        .cce-factura-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 12px;
        }

        .cce-factura-toggle-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cce-factura-title {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .cce-factura-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .cce-toggle-switch {
          width: 46px;
          height: 26px;
          border-radius: 9999px;
          background: rgba(148, 163, 184, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.3);
          position: relative;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .cce-toggle-switch.cce-active {
          background: #10b981;
          border-color: #10b981;
        }

        .cce-toggle-knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          position: absolute;
          top: 2px;
          left: 3px;
          transition: all 0.25s ease;
        }

        .cce-toggle-switch.cce-active .cce-toggle-knob {
          left: 21px;
        }

        .cce-factura-fields {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* Error & Submit */
        .cce-form-error-banner {
          background: rgba(185, 28, 28, 0.25);
          border: 1.5px solid #ef4444;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fee2e2;
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .cce-btn-submit {
          width: 100%;
          min-height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981 0%, #064e3b 50%, #b8860b 100%);
          background-size: 200% auto;
          border: 1.5px solid rgba(245, 222, 152, 0.6);
          color: #ffffff;
          font-size: 15.5px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 12px 35px rgba(6, 78, 59, 0.7);
          transition: all 0.3s ease;
        }

        .cce-btn-submit:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
        }

        .cce-btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .cce-form-disclaimer {
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
          margin: 14px 0 0 0;
          line-height: 1.5;
        }

        .cce-spinner {
          animation: cceSpin 1s linear infinite;
        }

        @keyframes cceSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Confirmation Screen */
        .cce-confirm-card {
          background: linear-gradient(145deg, rgba(3, 26, 19, 0.96) 0%, rgba(2, 18, 14, 0.99) 100%);
          border: 2px solid rgba(212, 175, 55, 0.6);
          border-radius: 26px;
          padding: clamp(26px, 5vw, 48px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9);
          text-align: center;
        }

        .cce-confirm-seal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.2);
          border: 1.5px solid #10b981;
          color: #34d399;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .cce-confirm-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(24px, 4.5vw, 36px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .cce-folio-box {
          background: rgba(2, 20, 15, 0.9);
          border: 1.5px solid var(--cce-gold);
          border-radius: 16px;
          padding: 18px 22px;
          max-width: 480px;
          margin: 0 auto 22px auto;
        }

        .cce-folio-label {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .cce-folio-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cce-folio-code {
          font-size: clamp(20px, 3.5vw, 25px);
          font-weight: 900;
          color: var(--cce-gold-light);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .cce-folio-copy-btn {
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: var(--cce-gold);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .cce-confirm-msg {
          font-size: 15px;
          color: #e2e8f0;
          max-width: 640px;
          margin: 0 auto 28px auto;
          line-height: 1.6;
        }

        .cce-confirm-summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          text-align: left;
          max-width: 680px;
          margin: 0 auto 30px auto;
          background: rgba(2, 22, 16, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 18px;
          padding: 20px;
        }

        .cce-confirm-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cce-confirm-field.cce-full {
          grid-column: 1 / -1;
        }

        .cce-confirm-field-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .cce-confirm-field-val {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          word-break: break-word;
        }

        .cce-confirm-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }

        .cce-btn-cal {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid rgba(212, 175, 55, 0.4);
          background: rgba(6, 78, 59, 0.45);
          color: #ffffff;
        }

        .cce-confirm-note {
          font-size: 13px;
          color: #cbd5e1;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 680px) {
          .cce-form-grid,
          .cce-attendees-inputs-grid,
          .cce-factura-fields,
          .cce-confirm-summary-grid {
            grid-template-columns: 1fr;
          }

          .cce-timer-banner {
            padding: 18px;
          }

          .cce-timer-boxes {
            width: 100%;
            justify-content: center;
          }

          .cce-reg-ticket-total {
            text-align: left;
          }
        }
      `}</style>

      {/* Institutional Header */}
      <header className="cce-rec-topbar">
        <div className="cce-rec-topbar-inner">
          <img
            src="/assets/cce-juarez/cce_logo_hero_white.svg"
            alt="Consejo Coordinador Empresarial de Ciudad Juárez"
            className="cce-rec-logo"
          />
          <div className="cce-rec-event-tag">
            Galardones 2026 · 19 Nov · Centro de Eventos Cibeles
          </div>
        </div>
      </header>

      <main className="cce-rec-container">
        {/* Live Countdown Timer Banner */}
        {!isSubmitted && (
          <div className={`cce-timer-banner ${isExpired ? 'cce-timer-expired' : ''}`}>
            <div className="cce-timer-left">
              <div className="cce-timer-badge">
                <Clock size={14} />
                <span>
                  {isExpired
                    ? 'Ventana Extraordinaria Cerrada'
                    : 'Enlace Exclusivo · Vigencia Limitada'}
                </span>
              </div>
              <h2 className="cce-timer-heading">
                {isExpired
                  ? 'El plazo especial de confirmación ha concluido'
                  : 'Cierre de confirmación: Jueves 12 de Noviembre · 11:59 p.m.'}
              </h2>
              <p className="cce-timer-sub">
                {isExpired
                  ? 'Si realizaste tu transferencia previamente y requieres asistencia directa, comunícate por WhatsApp al 656 180 3055.'
                  : 'Habilitado exclusivamente para confirmar tu transferencia SPEI ya realizada y emitir tu folio oficial de acreditación.'}
              </p>
            </div>

            <div className="cce-timer-boxes" aria-label="Tiempo restante para confirmar registro">
              <div className="cce-timer-unit">
                <div className="cce-timer-num">{mounted ? pad2(timeLeft.totalHours) : '--'}</div>
                <div className="cce-timer-lbl">Horas</div>
              </div>
              <span className="cce-timer-sep">:</span>
              <div className="cce-timer-unit">
                <div className="cce-timer-num">{mounted ? pad2(timeLeft.minutes) : '--'}</div>
                <div className="cce-timer-lbl">Min</div>
              </div>
              <span className="cce-timer-sep">:</span>
              <div className="cce-timer-unit">
                <div className="cce-timer-num">{mounted ? pad2(timeLeft.seconds) : '--'}</div>
                <div className="cce-timer-lbl">Seg</div>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          <div>
            <div className="cce-reg-header">
              <div className="cce-reg-pill">
                <ShieldCheck size={14} color="#D4AF37" />
                <span>Confirmación Prioritaria de Folio SPEI</span>
              </div>
              <h1 className="cce-reg-title">Registro de Comprobante y Acreditación</h1>
              <p className="cce-reg-subtitle">
                Indica el número de boletos cubiertos en tu transferencia SPEI, completa tus datos de
                titular y adjunta tu comprobante (captura JPG/PNG o PDF) para generar tu folio al instante.
              </p>
            </div>

            {/* Ticket Quantity Selector */}
            <div className="cce-reg-ticket-summary">
              <div className="cce-reg-ticket-info">
                <div className="cce-reg-ticket-badge-icon">
                  <Ticket size={22} />
                </div>
                <div>
                  <div className="cce-reg-ticket-label">Boletos Cubiertos en tu Transferencia</div>
                  <div className="cce-reg-ticket-val">
                    {ticketQuantity === 8
                      ? '⭐ Mesa Corporativa Completa (8 Pax)'
                      : `${ticketQuantity} ${
                          ticketQuantity === 1 ? 'Boleto Individual' : 'Boletos Individuales'
                        }`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isExpired || ticketQuantity <= 1}
                    onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Disminuir boletos"
                    className="cce-stepper-btn"
                  >
                    <Minus size={15} />
                  </button>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '16px',
                      minWidth: '26px',
                      textAlign: 'center',
                      color: '#FFF',
                    }}
                  >
                    {ticketQuantity}
                  </span>
                  <button
                    type="button"
                    disabled={isExpired || ticketQuantity >= 24}
                    onClick={() => setTicketQuantity((q) => Math.min(24, q + 1))}
                    aria-label="Aumentar boletos"
                    className="cce-stepper-btn"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="cce-reg-ticket-total">
                  <div className="cce-reg-ticket-total-label">Cuota de Recuperación</div>
                  <div className="cce-reg-ticket-total-val">
                    ${(ticketQuantity * 2500).toLocaleString('es-MX')} MXN
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="cce-form-card" noValidate>
              {formError && (
                <div className="cce-form-error-banner" role="alert">
                  <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="cce-form-grid">
                <div className="cce-form-group">
                  <label htmlFor="conf-nombre" className="cce-label">
                    <span>Nombre Completo del Titular o Representante</span>
                    <span className="cce-req-star">*</span>
                  </label>
                  <input
                    id="conf-nombre"
                    type="text"
                    required
                    disabled={isExpired}
                    placeholder="Ej. Ing. Roberto Valenzuela M."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="cce-input"
                  />
                </div>

                <div className="cce-form-group">
                  <label htmlFor="conf-empresa" className="cce-label">
                    <span>Empresa u Organización</span>
                    <span className="cce-req-star">*</span>
                  </label>
                  <input
                    id="conf-empresa"
                    type="text"
                    required
                    disabled={isExpired}
                    placeholder="Ej. Grupo Industrial Fronterizo"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="cce-input"
                  />
                </div>

                <div className="cce-form-group">
                  <label htmlFor="conf-cargo" className="cce-label">
                    <span>Cargo o Puesto Directivo</span>
                    <span className="cce-req-star">*</span>
                  </label>
                  <input
                    id="conf-cargo"
                    type="text"
                    required
                    disabled={isExpired}
                    placeholder="Ej. Director General / Socio"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="cce-input"
                  />
                </div>

                <div className="cce-form-group">
                  <label htmlFor="conf-whatsapp" className="cce-label">
                    <span>Teléfono Celular con WhatsApp (10 dígitos)</span>
                    <span className="cce-req-star">*</span>
                  </label>
                  <input
                    id="conf-whatsapp"
                    type="tel"
                    required
                    disabled={isExpired}
                    maxLength={10}
                    placeholder="Ej. 6561803055"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="cce-input"
                  />
                </div>

                <div className="cce-form-group cce-full-width">
                  <label htmlFor="conf-email" className="cce-label">
                    <span>Correo Electrónico para Envío de Acreditación</span>
                    <span className="cce-req-star">*</span>
                  </label>
                  <input
                    id="conf-email"
                    type="email"
                    required
                    disabled={isExpired}
                    placeholder="ejemplo@empresa.com.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="cce-input"
                  />
                </div>

                {/* Attendees */}
                <div className="cce-attendees-section">
                  <div className="cce-attendees-header">
                    <div className="cce-attendees-title">
                      <Users size={16} color="#D4AF37" />
                      <span>Asignación de Nombres para los Boletos ({ticketQuantity})</span>
                    </div>
                    <div className="cce-attendees-options">
                      <button
                        type="button"
                        disabled={isExpired}
                        onClick={() => setAsignarNombresDespues(false)}
                        className={`cce-opt-btn ${!asignarNombresDespues ? 'cce-opt-active' : ''}`}
                      >
                        Capturar nombres ahora
                      </button>
                      <button
                        type="button"
                        disabled={isExpired}
                        onClick={() => setAsignarNombresDespues(true)}
                        className={`cce-opt-btn ${asignarNombresDespues ? 'cce-opt-active' : ''}`}
                      >
                        Asignar nombres más adelante
                      </button>
                    </div>
                  </div>

                  {!asignarNombresDespues ? (
                    <div className="cce-attendees-inputs-grid">
                      {Array.from({ length: ticketQuantity }).map((_, idx) => (
                        <div key={idx} className="cce-attendee-row">
                          <span className="cce-attendee-index">#{idx + 1}</span>
                          <input
                            type="text"
                            disabled={isExpired}
                            placeholder={
                              idx === 0
                                ? nombre || 'Nombre del Asistente 1 (Titular)'
                                : `Nombre del Asistente #${idx + 1}`
                            }
                            value={asistentesNombres[idx] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAsistentesNombres((prev) => {
                                const updated = [...prev];
                                updated[idx] = val;
                                return updated;
                              });
                            }}
                            className="cce-input"
                            style={{ minHeight: '40px', fontSize: '13.5px' }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="cce-attendees-note">
                      📌 Los nombres de los {ticketQuantity} asistentes podrán ser proporcionados y
                      coordinados directamente con el CCE antes del evento vía WhatsApp.
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="cce-upload-wrap">
                  <label className="cce-label" style={{ marginBottom: '8px' }}>
                    <span>Adjuntar Comprobante de Transferencia SPEI</span>
                    <span className="cce-req-star">*</span>
                  </label>

                  <div
                    className={`cce-upload-zone ${isDragging ? 'cce-drag-over' : ''}`}
                    style={isExpired ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!isExpired) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (!isExpired && e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileSelect(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      if (!isExpired) fileInputRef.current?.click();
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      disabled={isExpired}
                      accept=".png,.jpg,.jpeg,.webp,.pdf,image/png,image/jpeg,image/webp,application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="cce-upload-icon-wrap">
                      <Upload size={24} />
                    </div>
                    <div className="cce-upload-title">
                      Toca o arrastra aquí tu captura de transferencia o PDF
                    </div>
                    <div className="cce-upload-desc">
                      Acepta capturas de pantalla bancarias (PNG, JPG, JPEG, WebP) o comprobantes PDF
                      (máx. 10 MB)
                    </div>
                  </div>

                  {comprobanteFileName && (
                    <div className="cce-upload-success-card">
                      <div className="cce-upload-file-info">
                        <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                        <span>✓ Archivo listo: {comprobanteFileName}</span>
                        {comprobanteFile && (
                          <span style={{ color: '#94A3B8', fontSize: '12px' }}>
                            ({(comprobanteFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setComprobanteFile(null);
                          setComprobanteFileName('');
                          setComprobantePreview('');
                        }}
                        className="cce-upload-remove-btn"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  )}
                </div>

                {/* Facturación CFDI 4.0 */}
                <div className="cce-factura-toggle-box">
                  <div
                    className="cce-factura-toggle-row"
                    onClick={() => {
                      if (!isExpired) setRequiereFactura((v) => !v);
                    }}
                  >
                    <div className="cce-factura-toggle-info">
                      <FileText size={20} color="#D4AF37" style={{ flexShrink: 0 }} />
                      <div>
                        <div className="cce-factura-title">
                          ¿Requiere Factura Fiscal Electrónica (CFDI)?
                        </div>
                        <div className="cce-factura-sub">
                          El CCE emitirá su comprobante fiscal con los datos proporcionados.
                        </div>
                      </div>
                    </div>

                    <div className={`cce-toggle-switch ${requiereFactura ? 'cce-active' : ''}`}>
                      <div className="cce-toggle-knob" />
                    </div>
                  </div>

                  {requiereFactura && (
                    <div className="cce-factura-fields">
                      <div className="cce-form-group">
                        <label htmlFor="conf-rfc" className="cce-label">
                          <span>RFC</span>
                          <span className="cce-req-star">*</span>
                        </label>
                        <input
                          id="conf-rfc"
                          type="text"
                          disabled={isExpired}
                          maxLength={13}
                          placeholder="Ej. CCE880101XYZ"
                          value={rfc}
                          onChange={(e) => setRfc(e.target.value.toUpperCase())}
                          className="cce-input"
                        />
                      </div>

                      <div className="cce-form-group">
                        <label htmlFor="conf-razon" className="cce-label">
                          <span>Razón Social</span>
                          <span className="cce-req-star">*</span>
                        </label>
                        <input
                          id="conf-razon"
                          type="text"
                          disabled={isExpired}
                          placeholder="Tal como aparece en Constancia Fiscal"
                          value={razonSocial}
                          onChange={(e) => setRazonSocial(e.target.value)}
                          className="cce-input"
                        />
                      </div>

                      <div className="cce-form-group">
                        <label htmlFor="conf-regimen" className="cce-label">
                          <span>Régimen Fiscal</span>
                          <span className="cce-req-star">*</span>
                        </label>
                        <select
                          id="conf-regimen"
                          disabled={isExpired}
                          value={regimenFiscal}
                          onChange={(e) => setRegimenFiscal(e.target.value)}
                          className="cce-select"
                        >
                          <option value="601 General de Ley Personas Morales">
                            601 General de Ley Personas Morales
                          </option>
                          <option value="612 Personas Físicas con Actividades Empresariales y Profesionales">
                            612 Personas Físicas con Actividades Empresariales y Profesionales
                          </option>
                          <option value="626 Régimen Simplificado de Confianza (RESICO)">
                            626 Régimen Simplificado de Confianza (RESICO)
                          </option>
                          <option value="605 Sueldos y Salarios e Ingresos Asimilados a Salarios">
                            605 Sueldos y Salarios e Ingresos Asimilados a Salarios
                          </option>
                          <option value="616 Sin obligaciones fiscales">
                            616 Sin obligaciones fiscales
                          </option>
                          <option value="621 Incorporación Fiscal">621 Incorporación Fiscal</option>
                        </select>
                      </div>

                      <div className="cce-form-group">
                        <label htmlFor="conf-usocfdi" className="cce-label">
                          <span>Uso de CFDI</span>
                          <span className="cce-req-star">*</span>
                        </label>
                        <select
                          id="conf-usocfdi"
                          disabled={isExpired}
                          value={usoCfdi}
                          onChange={(e) => setUsoCfdi(e.target.value)}
                          className="cce-select"
                        >
                          <option value="G03 Gastos en general">G03 Gastos en general</option>
                          <option value="CP01 Pagos">CP01 Pagos</option>
                          <option value="S01 Sin efectos fiscales">S01 Sin efectos fiscales</option>
                          <option value="G01 Adquisición de mercancías">
                            G01 Adquisición de mercancías
                          </option>
                          <option value="D04 Donativos">D04 Donativos</option>
                        </select>
                      </div>

                      <div className="cce-form-group cce-full-width">
                        <label htmlFor="conf-cp" className="cce-label">
                          <span>Código Postal Fiscal</span>
                          <span className="cce-req-star">*</span>
                        </label>
                        <input
                          id="conf-cp"
                          type="text"
                          disabled={isExpired}
                          maxLength={5}
                          placeholder="Ej. 32000"
                          value={codigoPostal}
                          onChange={(e) => setCodigoPostal(e.target.value.replace(/\D/g, ''))}
                          className="cce-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting || isExpired}
                className="cce-btn-submit"
                style={isExpired ? { filter: 'grayscale(1)' } : undefined}
              >
                {isExpired ? (
                  <>
                    <Clock size={18} />
                    <span>Plazo de Confirmación Concluido (12 Nov · 11:59 p.m.)</span>
                  </>
                ) : formSubmitting ? (
                  <>
                    <RefreshCw size={18} className="cce-spinner" />
                    <span>Guardando registro y generando folio oficial...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>Confirmar Registro y Generar Folio Oficial</span>
                  </>
                )}
              </button>

              <p className="cce-form-disclaimer">
                * Tu acreditación queda registrada de forma inmediata en el sistema oficial del CCE
                Ciudad Juárez. Esta liga especial expira el jueves 12 de noviembre a las 11:59 p.m.
              </p>
            </form>
          </div>
        ) : (
          <div className="cce-confirm-card">
            <div className="cce-confirm-seal">
              <CheckCircle2 size={16} />
              <span>✓ REGISTRO CONFIRMADO EN SISTEMA OFICIAL CCE</span>
            </div>

            <h2 className="cce-confirm-title">¡Tu Folio Oficial ha sido Generado!</h2>

            <div className="cce-folio-box">
              <div className="cce-folio-label">FOLIO INSTITUCIONAL DE CONTROL</div>
              <div className="cce-folio-row">
                <span className="cce-folio-code">{confirmedRecord?.folio}</span>
                <button type="button" onClick={copyFolio} className="cce-folio-copy-btn">
                  {folioCopied ? (
                    <>
                      <Check size={13} color="#10B981" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar Folio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="cce-confirm-msg">
              Hemos registrado exitosamente tus datos y comprobante SPEI para la{' '}
              <strong>Entrega de Galardones Empresariales 2026</strong> y Conferencia Magistral con
              Carlos Loret de Mola. Tu acreditación ya es visible en la consola administrativa del CCE.
            </p>

            <div className="cce-confirm-summary-grid">
              <div className="cce-confirm-field">
                <span className="cce-confirm-field-label">Titular Registrado</span>
                <span className="cce-confirm-field-val">{confirmedRecord?.nombre}</span>
              </div>

              <div className="cce-confirm-field">
                <span className="cce-confirm-field-label">Empresa / Cargo</span>
                <span className="cce-confirm-field-val">
                  {confirmedRecord?.empresa} ({confirmedRecord?.cargo})
                </span>
              </div>

              <div className="cce-confirm-field">
                <span className="cce-confirm-field-label">Boletos Registrados</span>
                <span className="cce-confirm-field-val">
                  {confirmedRecord?.boletos}{' '}
                  {confirmedRecord?.boletos === 1 ? 'Boleto' : 'Boletos'} ($
                  {confirmedRecord?.totalMonto.toLocaleString('es-MX')} MXN)
                </span>
              </div>

              <div className="cce-confirm-field">
                <span className="cce-confirm-field-label">Fecha y Horario</span>
                <span className="cce-confirm-field-val">
                  Jueves 19 Nov 2026 · Registro 8:30 a.m. | Inicio 9:00 a.m.
                </span>
              </div>

              <div className="cce-confirm-field cce-full">
                <span className="cce-confirm-field-label">Sede Oficial & Protocolo</span>
                <span className="cce-confirm-field-val">
                  Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450) · Vestimenta Formal
                </span>
              </div>

              <div className="cce-confirm-field cce-full">
                <span className="cce-confirm-field-label">Comprobante SPEI Recibido</span>
                <span className="cce-confirm-field-val" style={{ fontFamily: 'monospace' }}>
                  📎 {confirmedRecord?.comprobanteFileName}
                </span>
              </div>
            </div>

            <div className="cce-confirm-actions">
              <a
                href={googleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="cce-btn-cal"
              >
                <CalendarPlus size={16} color="#34D399" />
                <span>Añadir a Google Calendar</span>
              </a>

              <button type="button" onClick={downloadIcs} className="cce-btn-cal">
                <Download size={16} color="#D4AF37" />
                <span>Descargar Apple Calendar (.ics)</span>
              </button>

              <a
                href="https://maps.google.com/?q=Centro+de+Eventos+Cibeles+Av+Valle+de+Juarez+6839+Ciudad+Juarez"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-btn-cal"
              >
                <MapPin size={16} color="#F5DE98" />
                <span>Ubicación en Google Maps</span>
              </a>
            </div>

            <p className="cce-confirm-note">
              Para atención directa del CCE Ciudad Juárez puedes escribir por WhatsApp al{' '}
              <a
                href={`https://wa.me/526561803055?text=Hola,%20acabo%20de%20confirmar%20mi%20registro%20con%20Folio:%20${encodeURIComponent(
                  confirmedRecord?.folio || ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#34D399', fontWeight: 800, textDecoration: 'underline' }}
              >
                656 180 3055
              </a>{' '}
              indicando tu folio.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
