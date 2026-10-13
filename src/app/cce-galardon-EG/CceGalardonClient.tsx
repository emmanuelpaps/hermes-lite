'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Ticket,
  Store,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Globe,
  TrendingUp,
  Scale,
  Mic,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Mail,
  Plus,
  Minus,
  Building2,
  Truck,
  Upload,
  FileText,
  AlertCircle,
  Download,
  Search,
  Filter,
  Users,
  DollarSign,
  CalendarPlus,
  X,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Award,
  Activity,
  Smartphone,
  Laptop,
  Radio,
  CheckCheck,
} from 'lucide-react';
import { GalardonRegistration, GalardonTelemetryData } from '@/lib/cce-galardon-db';

export default function CceGalardonClient() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [clabeCopied, setClabeCopied] = useState<boolean>(false);

  // Sprint 4: CRM Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [crmView, setCrmView] = useState<'landing' | 'crm'>('landing');
  const [crmLoading, setCrmLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<GalardonTelemetryData | null>(null);
  const [crmRegistrations, setCrmRegistrations] = useState<GalardonRegistration[]>([]);
  const [crmFilter, setCrmFilter] = useState<'todos' | 'pendiente' | 'validado'>('todos');
  const [crmSearch, setCrmSearch] = useState('');
  const [selectedComprobante, setSelectedComprobante] = useState<GalardonRegistration | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sprint 4: Form & Registration States
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [asignarNombresDespues, setAsignarNombresDespues] = useState(true);
  const [asistentesNombres, setAsistentesNombres] = useState<string[]>([]);
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobanteFileName, setComprobanteFileName] = useState('');
  const [comprobantePreview, setComprobantePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CFDI 4.0 Facturación States
  const [requiereFactura, setRequiereFactura] = useState(false);
  const [rfc, setRfc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('601 General de Ley Personas Morales');
  const [usoCfdi, setUsoCfdi] = useState('G03 Gastos en general');
  const [codigoPostal, setCodigoPostal] = useState('');

  // Form Submit & Confirmation States
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
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const copyClabe = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('072164013112585620');
      setClabeCopied(true);
      setTimeout(() => setClabeCopied(false), 3000);
    }
  };

  const copyFolio = () => {
    if (confirmedRecord?.folio && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(confirmedRecord.folio);
      setFolioCopied(true);
      setTimeout(() => setFolioCopied(false), 3000);
    }
  };

  // Sync attendee input count with ticketQuantity
  useEffect(() => {
    setAsistentesNombres((prev) => {
      const next = [...prev];
      while (next.length < ticketQuantity) {
        next.push('');
      }
      return next.slice(0, ticketQuantity);
    });
  }, [ticketQuantity]);

  // Strict Event Registration Window: from now until 2 hours after event start (19 Nov 2026 11:00 AM Juárez UTC-6)
  const EVENT_DEADLINE_MS = 1795107600000;
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  // Check Admin & Log Visit & Validate Deadline
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsRegistrationClosed(Date.now() > EVENT_DEADLINE_MS);
      const params = new URLSearchParams(window.location.search);
      const adminToken = params.get('admin');
      if (adminToken && adminToken.toLowerCase() === 'cce2026') {
        setIsAdmin(true);
        setCrmView('crm');
        fetchCrmData();
      } else {
        fetch('/api/cce-galardon-registro?action=visit', { method: 'GET' }).catch(() => {});
      }
    }
  }, []);

  // Real-time Firestore auto-refresh in CRM console (every 15s)
  useEffect(() => {
    if (isAdmin && crmView === 'crm') {
      const interval = setInterval(() => {
        fetchCrmData();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, crmView]);

  const fetchCrmData = async () => {
    setCrmLoading(true);
    try {
      const res = await fetch('/api/cce-galardon-registro?admin=cce2026');
      const data = await res.json();
      if (res.ok && data.success) {
        setTelemetry(data.telemetry);
        setCrmRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error fetching CRM data:', err);
    } finally {
      setCrmLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: 'pendiente' | 'validado') => {
    const nextStatus = currentStatus === 'validado' ? 'pendiente' : 'validado';
    setUpdatingId(id);

    // Optimistic UI update
    setCrmRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    setSelectedComprobante((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));

    try {
      const res = await fetch('/api/cce-galardon-registro?admin=cce2026', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback on error
        setCrmRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: currentStatus } : r))
        );
        setSelectedComprobante((prev) => (prev && prev.id === id ? { ...prev, status: currentStatus } : prev));
        alert('Error al actualizar estatus en Firestore: ' + (data?.error || 'Desconocido'));
      } else {
        fetchCrmData();
      }
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setCrmRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: currentStatus } : r))
      );
      setSelectedComprobante((prev) => (prev && prev.id === id ? { ...prev, status: currentStatus } : prev));
      alert('Error de conexión al actualizar estatus: ' + (err?.message || 'Error de red'));
    } finally {
      setUpdatingId(null);
    }
  };

  const getCrmWhatsAppUrl = (reg: GalardonRegistration) => {
    const cleanPhone = String(reg.whatsapp || '').replace(/\D/g, '');
    const text = `Buen día ${reg.nombre}. Confirmamos la recepción de tu registro y comprobante para la Entrega de Galardones y Conferencia Magistral de Carlos Loret de Mola (Folio ${reg.folio}, ${reg.boletos} boletos). Registro: 8:30 a.m. · Inicio del Desayuno: 9:00 a.m. en Centro de Eventos Cibeles (Vestimenta Formal): https://maps.google.com/?q=Centro+de+Eventos+Cibeles+Ciudad+Juarez. ¡Agradecemos tu participación!`;
    return `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const exportCrmCsv = () => {
    if (!crmRegistrations || crmRegistrations.length === 0) return;

    const headers = [
      'Folio',
      'Fecha Registro',
      'Titular',
      'Empresa',
      'Cargo',
      'WhatsApp',
      'Email',
      'Boletos',
      'Total Monto MXN',
      'Modalidad',
      'Estatus Comprobante',
      'Requiere Factura',
      'RFC',
      'Razón Social',
      'Régimen Fiscal',
      'Uso CFDI',
      'CP Fiscal',
      'Archivo Comprobante',
    ];

    const rows = crmRegistrations.map((r) => [
      `"${r.folio}"`,
      `"${r.fecha}"`,
      `"${r.nombre.replace(/"/g, '""')}"`,
      `"${r.empresa.replace(/"/g, '""')}"`,
      `"${r.cargo.replace(/"/g, '""')}"`,
      `"${r.whatsapp}"`,
      `"${r.email}"`,
      r.boletos,
      r.totalMonto,
      `"${r.tipoBoleto === 'mesa' ? 'Mesa Corporativa (8 Pax)' : 'Individual'}"`,
      `"${r.status}"`,
      `"${r.requiereFactura ? 'SÍ' : 'NO'}"`,
      `"${r.facturaData?.rfc || ''}"`,
      `"${(r.facturaData?.razonSocial || '').replace(/"/g, '""')}"`,
      `"${r.facturaData?.regimenFiscal || ''}"`,
      `"${r.facturaData?.usoCfdi || ''}"`,
      `"${r.facturaData?.codigoPostal || ''}"`,
      `"${r.comprobanteFileName}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      'download',
      `CCE_Galardon_2026_Acreditaciones_${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    setComprobanteFile(file);
    setComprobanteFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setComprobantePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setComprobantePreview('');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (Date.now() > EVENT_DEADLINE_MS) {
      setFormError('El periodo de registro oficial ha concluido formalmente. Las acreditaciones cerraron 2 horas después de iniciado el evento.');
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

    try {
      const res = await fetch('/api/cce-galardon-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          whatsapp: cleanPhone,
          email: email.trim().toLowerCase(),
          boletos: ticketQuantity,
          asistentesNombres: !asignarNombresDespues ? asistentesNombres.filter(Boolean) : [],
          asignarNombresDespues,
          comprobanteFileName,
          comprobanteUrl: comprobantePreview || undefined,
          requiereFactura,
          facturaData: requiereFactura
            ? {
                rfc: rfc.trim().toUpperCase(),
                razonSocial: razonSocial.trim(),
                regimenFiscal,
                usoCfdi,
                codigoPostal: codigoPostal.trim(),
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el registro.');
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

      const regElem = document.getElementById('registro');
      if (regElem) {
        regElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      setFormError(err.message || 'Ocurrió un error al enviar el registro. Por favor intenta nuevamente.');
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
      'DTSTART:20261119T143000Z',
      'DTEND:20261119T180000Z',
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
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261119T143000Z/20261119T180000Z&details=${details}&location=${location}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="cce-gala-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

            :root {
              --cce-emerald: #064E3B;
              --cce-emerald-dark: #042E23;
              --cce-emerald-deep: #021B14;
              --cce-emerald-vibrant: #0F766E;
              --cce-emerald-glow: rgba(16, 185, 129, 0.35);
              --cce-gold: #D4AF37;
              --cce-gold-light: #F3E5AB;
              --cce-gold-dark: #B8860B;
              --cce-obsidian: #03120E;
              --cce-white: #FFFFFF;
              --cce-text-light: #F1F5F9;
              --cce-text-muted: #94A3B8;
              --cce-card-border: rgba(212, 175, 55, 0.3);
            }

            *, *::before, *::after {
              box-sizing: border-box;
            }

            html, body {
              margin: 0;
              padding: 0;
              background-color: var(--cce-obsidian);
              color: var(--cce-text-light);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              width: 100%;
              max-width: 100vw;
              overflow-x: hidden;
              scroll-behavior: smooth;
            }

            .cce-gala-root {
              width: 100%;
              max-width: 100vw;
              min-height: 100vh;
              background:
                /* 75% Dominant Emerald Atmosphere */
                radial-gradient(1300px 900px at 50% -80px, rgba(16, 185, 129, 0.42) 0%, rgba(6, 78, 59, 0.72) 35%, rgba(4, 38, 28, 0.88) 60%, transparent 78%),
                radial-gradient(1100px 800px at 10% 45%, rgba(5, 150, 105, 0.38) 0%, rgba(6, 78, 59, 0.32) 42%, transparent 70%),
                radial-gradient(1000px 750px at 85% 80%, rgba(6, 78, 59, 0.52) 0%, rgba(4, 46, 35, 0.68) 45%, rgba(2, 24, 18, 0.95) 75%, transparent 85%),
                /* 25% Refined Golden Glow Accent */
                radial-gradient(800px 600px at 85% 26%, rgba(245, 222, 152, 0.16) 0%, rgba(212, 175, 55, 0.1) 32%, rgba(184, 134, 11, 0.04) 55%, transparent 70%),
                #02120C;
              position: relative;
              overflow-x: hidden;
            }

            /* Ambient Living Canvas (Aurora Mesh) with contain: paint */
            .cce-living-canvas {
              position: fixed;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
              z-index: 0;
              contain: paint;
              clip-path: inset(0);
            }

            .cce-aurora-orb-1 {
              position: absolute;
              top: -8vw;
              left: 0;
              right: 0;
              margin: 0 auto;
              width: 90vw;
              max-width: 650px;
              height: 45vw;
              max-height: 450px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(6, 78, 59, 0.18) 50%, transparent 75%);
              filter: blur(65px);
              animation: cceAuroraFloat 16s ease-in-out infinite alternate;
              will-change: transform, opacity;
            }

            .cce-aurora-orb-2 {
              position: absolute;
              top: 25vh;
              left: -10vw;
              width: 45vw;
              max-width: 450px;
              height: 45vw;
              max-height: 450px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(212, 175, 55, 0.14) 0%, transparent 65%);
              filter: blur(75px);
              animation: cceAuroraFloat 20s ease-in-out infinite alternate-reverse;
              will-change: transform;
            }

            .cce-aurora-orb-3 {
              position: absolute;
              top: 45vh;
              right: -10vw;
              width: 50vw;
              max-width: 500px;
              height: 50vw;
              max-height: 500px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(5, 150, 105, 0.22) 0%, transparent 70%);
              filter: blur(80px);
              animation: cceAuroraFloat 18s ease-in-out infinite alternate;
              will-change: transform;
            }

            @keyframes cceAuroraFloat {
              0% {
                transform: translateY(0) scale(1);
                opacity: 0.85;
              }
              50% {
                transform: translateY(-20px) scale(1.05);
                opacity: 1;
              }
              100% {
                transform: translateY(15px) scale(0.95);
                opacity: 0.8;
              }
            }

            /* Golden Shimmer Animation */
            @keyframes cceGoldShimmer {
              0% {
                background-position: -200% center;
              }
              100% {
                background-position: 200% center;
              }
            }

            .cce-gold-shimmer-text {
              background: linear-gradient(
                90deg,
                #F5DE98 0%,
                #FFF8DC 20%,
                #FFFFFF 35%,
                #F5DE98 50%,
                #D4AF37 70%,
                #F5DE98 85%,
                #FFF8DC 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: cceGoldShimmer 8s linear infinite;
            }

            /* Floating Navigation Pill */
            .cce-nav-header {
              position: fixed;
              top: 12px;
              left: 50%;
              transform: translateX(-50%);
              width: calc(100% - 24px);
              max-width: 1180px;
              z-index: 50;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-nav-inner {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 8px 14px;
              background: rgba(3, 18, 14, 0.88);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 9999px;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.12);
              gap: 8px;
            }

            @media (min-width: 640px) {
              .cce-nav-header {
                top: 16px;
                width: calc(100% - 32px);
              }
              .cce-nav-inner {
                padding: 10px 18px;
                gap: 16px;
              }
            }

            .cce-nav-brand {
              display: flex;
              align-items: center;
              gap: 8px;
              text-decoration: none;
              min-width: 0;
              flex-shrink: 1;
            }

            @media (min-width: 640px) {
              .cce-nav-brand {
                gap: 12px;
                flex-shrink: 0;
              }
            }

            .cce-nav-brand-title {
              display: flex;
              flex-direction: column;
              min-width: 0;
            }

            .cce-nav-brand-main {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #F8FAFC;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            @media (min-width: 640px) {
              .cce-nav-brand-main {
                font-size: 13px;
                letter-spacing: 0.08em;
              }
            }

            .cce-nav-brand-sub {
              display: none;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-family: monospace;
            }

            @media (min-width: 480px) {
              .cce-nav-brand-sub {
                display: block;
              }
            }

            .cce-nav-links {
              display: none;
              align-items: center;
              gap: 6px;
            }

            @media (min-width: 960px) {
              .cce-nav-links {
                display: flex;
              }
            }

            .cce-nav-link {
              padding: 6px 14px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #CBD5E1;
              text-decoration: none;
              transition: all 0.2s ease;
            }

            .cce-nav-link:hover {
              color: #FFFFFF;
              background: rgba(212, 175, 55, 0.12);
            }

            .cce-nav-actions {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-shrink: 0;
            }

            .cce-nav-status-pill {
              display: none;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              background: rgba(6, 78, 59, 0.45);
              border: 1px solid rgba(16, 185, 129, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-family: monospace;
              font-weight: 700;
              color: #A7F3D0;
            }

            @media (min-width: 1140px) {
              .cce-nav-status-pill {
                display: flex;
              }
            }

            .cce-pulse-dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: #10B981;
              box-shadow: 0 0 10px #10B981;
              animation: ccePulseGlow 2s infinite;
            }

            @keyframes ccePulseGlow {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.4;
                transform: scale(0.85);
              }
            }

            .cce-btn-cta {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 7px 14px;
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              border-radius: 9999px;
              border: 1px solid #F3E5AB;
              text-decoration: none;
              box-shadow: 0 4px 16px rgba(212, 175, 55, 0.35);
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              cursor: pointer;
              white-space: nowrap;
            }

            @media (min-width: 640px) {
              .cce-btn-cta {
                padding: 9px 18px;
                font-size: 12px;
                gap: 8px;
                letter-spacing: 0.08em;
              }
            }

            .cce-btn-cta:hover {
              transform: translateY(-1px) scale(1.02);
              box-shadow: 0 8px 24px rgba(212, 175, 55, 0.5);
              background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%);
            }

            /* Main Content Container */
            .cce-content-wrap {
              position: relative;
              z-index: 10;
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px 80px 20px;
            }

            @media (max-width: 640px) {
              .cce-content-wrap {
                padding: 24px 16px 60px 16px;
              }
            }

            /* Hero Section */
            .cce-hero {
              position: relative;
              text-align: center;
              max-width: 1040px;
              margin: 0 auto;
              padding: 20px 20px 60px 20px;
            }

            /* Full-Bleed Cintillos Layer ("Cintillos Cruzados en X" - 100vw Edge-to-Edge) */
            .cce-hero-cintillos-fullbleed {
              position: absolute;
              top: -40px;
              left: 50%;
              transform: translateX(-50%);
              width: 100vw;
              height: calc(100% + 500px);
              min-height: 1200px;
              pointer-events: none;
              overflow: hidden;
              z-index: 1;
            }

            /* ULTRA-LARGE 3D Chamfered Gold Band ("Cintillos que ocupan todo el logo del CCE") */
            .cce-band-main {
              width: 100%;
              height: 240px;
              background: linear-gradient(180deg, 
                #FFFDE8 0%, 
                #FAEAAB 7%, 
                #E9C762 16%, 
                #DCAE33 28%,
                #FFF6D1 42%, 
                #F0CA56 56%, 
                #FFF6D1 70%, 
                #DEB43F 84%, 
                #B38424 94%,
                #7A5510 100%
              );
              border-top: 3px solid #FFFDEB;
              border-bottom: 3px solid #382404;
              box-shadow: 0 38px 85px rgba(0, 0, 0, 0.98), 0 0 70px rgba(212, 175, 55, 0.45);
              position: relative;
              overflow: hidden;
            }

            .cce-band-sheen {
              position: absolute;
              inset: 0;
              background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%);
              width: 25%;
              transform: skewX(-30deg) translateX(-200%);
              animation: cceRibbonSweep 8s infinite ease-in-out;
            }

            @keyframes cceRibbonSweep {
              0% { transform: skewX(-30deg) translateX(-200%); }
              25%, 100% { transform: skewX(-30deg) translateX(450%); }
            }

            .cce-band-sub {
              width: 100%;
              height: 16px;
              background: linear-gradient(180deg, 
                #FFFDE6 0%, 
                #E5BE4A 45%, 
                #9E7422 55%, 
                #66460D 100%
              );
              border-top: 1.5px solid #FFFDEB;
              border-bottom: 1.5px solid #201302;
              box-shadow: 0 0 25px rgba(212, 175, 55, 0.65);
            }

            /* Dedicated Lower Sash Band Across Badges */
            .cce-band-main-sash {
              width: 100%;
              height: 75px;
              background: linear-gradient(180deg, 
                #FFF8D6 0%, 
                #ECD17E 18%, 
                #D4AF37 46%, 
                #825916 50%, 
                #A87926 64%, 
                #52360E 88%,
                #301B03 100%
              );
              border-top: 2px solid #FFFDEB;
              border-bottom: 2px solid #1F1202;
              box-shadow: 0 26px 55px rgba(0, 0, 0, 0.96), 0 0 38px rgba(212, 175, 55, 0.35);
              position: relative;
              overflow: hidden;
            }

            /* True X Crossing Behind CCE Logo (Spanning 140vw Full-Bleed) */
            .cce-x-arm-1 {
              position: absolute;
              top: 40px;
              left: 50%;
              width: 140vw;
              transform: translateX(-50%) rotate(-7.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 35px 60px rgba(0, 0, 0, 0.98));
              opacity: 0.95;
            }

            .cce-x-arm-2 {
              position: absolute;
              top: 40px;
              left: 50%;
              width: 140vw;
              transform: translateX(-50%) rotate(7.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 35px 60px rgba(0, 0, 0, 0.98));
              opacity: 0.95;
            }

            /* Lower Diagonal Sash Across Badges (Continues unbroken across the entire screen and down into transition) */
            .cce-sash-bottom-full {
              position: absolute;
              top: 780px;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(9.5deg);
              display: flex;
              flex-direction: column;
              gap: 16px;
              filter: drop-shadow(0 28px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.95;
            }

            /* Reusable Section Cintillos Layer (Edge-to-Edge with strict overflow protection) */
            .cce-section-cintillos-fullbleed {
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              max-width: 100vw;
              height: 100%;
              pointer-events: none;
              overflow: hidden;
              z-index: 1;
              contain: paint;
              clip-path: inset(0);
            }

            /* Section 01: Galardones Sash (Sweeping down-left across trophy cards) */
            .cce-sash-galardones {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(-8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 02: Carlos Loret Lambrín Sash (Sweeping down-right matching official poster) */
            .cce-sash-loret {
              position: absolute;
              top: 48%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(10deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 28px 50px rgba(0, 0, 0, 0.96));
              opacity: 0.95;
            }

            /* Section 03: Tickets / Pase 3D Sash (Sweeping down-left across ticket pass & SPEI) */
            .cce-sash-tickets {
              position: absolute;
              top: 52%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(-8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 04: Puntos de Venta Sash (Sweeping down-right across store cards) */
            .cce-sash-pos {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 05: Registro Oficial Sash (Sweeping down-left across registration form) */
            .cce-sash-reg {
              position: absolute;
              top: 46%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(-8deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 06: Footer Transition Sash (Sweeping behind footer cards) */
            .cce-sash-footer {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) translateY(-50%) rotate(5deg);
              display: flex;
              flex-direction: column;
              gap: 12px;
              filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Staggered Light Sweep Sheen Delays */
            .cce-sheen-delay-1 { animation-delay: 2.5s; }
            .cce-sheen-delay-2 { animation-delay: 5s; }
            .cce-sheen-delay-3 { animation-delay: 1.5s; }
            .cce-sheen-delay-4 { animation-delay: 4s; }
            .cce-sheen-delay-5 { animation-delay: 6.5s; }
            .cce-sheen-delay-6 { animation-delay: 3.5s; }

            /* Content Z-Index Elevation above Background Sashes */
            .cce-hero-logo-box,
            .cce-hero-pill,
            .cce-hero-title,
            .cce-hero-subtitle,
            .cce-hero-motto,
            .cce-hero-lead,
            .cce-badges-grid,
            .cce-section-header,
            .cce-galardones-grid,
            .cce-institutional-contact-bar,
            .cce-lambrin-frame,
            .cce-tickets-grid,
            .cce-pos-grid,
            .cce-contact-closing,
            .cce-reg-header,
            .cce-reg-ticket-summary,
            .cce-form-card,
            .cce-confirm-card,
            .cce-footer-container,
            .cce-footer-col {
              position: relative;
              z-index: 5;
            }

            .cce-galardones-section,
            .cce-loret-section,
            .cce-tickets-section,
            .cce-pos-section,
            .cce-reg-section,
            .cce-footer {
              position: relative;
              overflow: hidden;
              contain: paint;
            }

            @media (max-width: 768px) {
              .cce-hero {
                padding: 10px 10px 50px 10px;
              }

              .cce-hero-cintillos-fullbleed {
                top: -15px;
                height: calc(100% + 200px);
                min-height: 800px;
              }

              .cce-band-main {
                height: 190px;
              }

              .cce-band-sub {
                height: 12px;
              }

              .cce-band-main-sash {
                height: 42px;
              }

              .cce-x-arm-1 {
                top: 25px;
                width: 160vw;
                transform: translateX(-50%) rotate(-9deg);
                gap: 10px;
              }

              .cce-x-arm-2 {
                top: 25px;
                width: 160vw;
                transform: translateX(-50%) rotate(9deg);
                gap: 10px;
              }

              .cce-sash-bottom-full {
                top: auto;
                bottom: 60px;
                width: 160vw;
                transform: translateX(-50%) rotate(16deg);
                gap: 10px;
              }

              .cce-sash-galardones,
              .cce-sash-loret,
              .cce-sash-tickets,
              .cce-sash-pos,
              .cce-sash-reg,
              .cce-sash-footer {
                width: 160vw;
                gap: 10px;
              }

              .cce-sash-galardones {
                top: 54%;
                transform: translateX(-50%) rotate(-13deg);
              }

              .cce-sash-loret {
                top: 50%;
                transform: translateX(-50%) rotate(14deg);
              }

              .cce-sash-tickets {
                top: 52%;
                transform: translateX(-50%) rotate(-13deg);
              }

              .cce-sash-pos {
                top: 48%;
                transform: translateX(-50%) rotate(13deg);
              }

              .cce-sash-reg {
                top: 45%;
                transform: translateX(-50%) rotate(-12deg);
              }

              .cce-sash-footer {
                top: 20px;
                transform: translateX(-50%) rotate(9deg);
              }

              /* =========================================================
                 ESCALADO DE TIPOGRAFÍA MÓVIL (LEGIBILIDAD ÓPTIMA <= 768PX)
                 ========================================================= */

              /* Hero & Badges de Contexto */
              .cce-hero-pill {
                font-size: 12.5px !important;
                letter-spacing: 0.1em !important;
                padding: 7px 16px !important;
                line-height: 1.35 !important;
              }
              .cce-hero-title {
                font-size: clamp(36px, 9.5vw, 46px) !important;
                line-height: 1.12 !important;
                letter-spacing: 0.025em !important;
              }
              .cce-hero-motto {
                font-size: 15.5px !important;
                letter-spacing: 0.08em !important;
                line-height: 1.45 !important;
                margin-bottom: 20px !important;
              }
              .cce-hero-lead {
                font-size: 16.5px !important;
                line-height: 1.65 !important;
                margin-bottom: 30px !important;
              }
              .cce-hero-cta {
                font-size: 15px !important;
                padding: 16px 28px !important;
                width: 100% !important;
                max-width: 380px !important;
              }
              .cce-badge-card {
                padding: 22px 18px !important;
              }
              .cce-badge-label {
                font-size: 12.5px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-badge-val {
                font-size: 19.5px !important;
              }
              .cce-badge-sub {
                font-size: 14.5px !important;
                line-height: 1.4 !important;
              }

              /* Encabezados Comunes de Sección */
              .cce-section-pill {
                font-size: 12.5px !important;
                padding: 7px 18px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-section-title {
                font-size: clamp(26px, 6.8vw, 32px) !important;
                line-height: 1.25 !important;
              }
              .cce-section-subtitle {
                font-size: 15.5px !important;
                line-height: 1.6 !important;
              }

              /* Sección 01: Galardones 2026 */
              .cce-galardones-motto {
                font-size: 16.5px !important;
                line-height: 1.45 !important;
              }
              .cce-galardon-badge {
                font-size: 12px !important;
                padding: 6px 14px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-galardon-tagline {
                font-size: 13px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-galardon-name {
                font-size: 22px !important;
                line-height: 1.25 !important;
              }
              .cce-galardon-desc {
                font-size: 15.5px !important;
                line-height: 1.65 !important;
                max-width: 100% !important;
              }
              .cce-galardon-criteria {
                font-size: 14px !important;
                padding: 10px 16px !important;
                line-height: 1.45 !important;
              }
              .cce-institutional-contact-bar {
                font-size: 14.5px !important;
                line-height: 1.55 !important;
                padding: 16px 18px !important;
              }

              /* Sección 02: Carlos Loret de Mola & Conferencia Magistral */
              .cce-loret-pill {
                font-size: 12.5px !important;
                padding: 7px 16px !important;
                letter-spacing: 0.1em !important;
              }
              .cce-loret-name {
                font-size: clamp(28px, 7vw, 34px) !important;
                line-height: 1.18 !important;
              }
              .cce-loret-role {
                font-size: 13.5px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-keynote-tag {
                font-size: 12px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-keynote-title {
                font-size: 17px !important;
                line-height: 1.45 !important;
              }
              .cce-semblanza-lead {
                font-size: 16.5px !important;
                line-height: 1.55 !important;
                padding-left: 14px !important;
              }
              .cce-semblanza-p {
                font-size: 15.5px !important;
                line-height: 1.7 !important;
              }
              .cce-pillar-title {
                font-size: 16px !important;
              }
              .cce-pillar-desc {
                font-size: 14.5px !important;
                line-height: 1.55 !important;
              }
              .cce-audio-btn-preview {
                font-size: 15px !important;
                padding: 14px 20px !important;
              }
              .cce-loret-cta {
                font-size: 15px !important;
                padding: 15px 22px !important;
                letter-spacing: 0.05em !important;
              }

              /* Sección 03: Boletos & SPEI */
              .cce-ticket-folio {
                font-size: 13px !important;
                letter-spacing: 0.1em !important;
              }
              .cce-ticket-badge {
                font-size: 12px !important;
                padding: 5px 12px !important;
              }
              .cce-modality-tab {
                font-size: 13.5px !important;
                padding: 11px 10px !important;
              }
              .cce-tab-sub {
                font-size: 12px !important;
              }
              .cce-stepper-label {
                font-size: 15px !important;
              }
              .cce-stepper-value {
                font-size: 21px !important;
              }
              .cce-quick-btn {
                font-size: 13px !important;
                padding: 10px 8px !important;
              }
              .cce-ticket-price-tag {
                font-size: 12.5px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-ticket-price-val {
                font-size: 34px !important;
              }
              .cce-ticket-price-note {
                font-size: 14px !important;
              }
              .cce-scarcity-info {
                font-size: 13.5px !important;
              }
              .cce-benefit-item {
                font-size: 15px !important;
                line-height: 1.55 !important;
              }
              .cce-ticket-footnote {
                font-size: 13px !important;
                line-height: 1.45 !important;
              }
              .cce-ticket-submit-btn {
                font-size: 15px !important;
                padding: 16px 24px !important;
              }
              .cce-spei-steps-title {
                font-size: 20px !important;
              }
              .cce-spei-steps-sub {
                font-size: 14.5px !important;
              }
              .cce-step-body-title {
                font-size: 15.5px !important;
              }
              .cce-step-body-desc {
                font-size: 14px !important;
                line-height: 1.55 !important;
              }
              .cce-bank-title {
                font-size: 16.5px !important;
              }
              .cce-bank-field-label {
                font-size: 12px !important;
              }
              .cce-bank-field-val {
                font-size: 15.5px !important;
              }
              .cce-clabe-num {
                font-size: 18px !important;
              }
              .cce-btn-copy-clabe {
                font-size: 13.5px !important;
                padding: 11px 16px !important;
              }

              /* Sección 04: Puntos de Venta */
              .cce-pos-badge {
                font-size: 12px !important;
              }
              .cce-pos-name {
                font-size: 18.5px !important;
              }
              .cce-pos-address {
                font-size: 14.5px !important;
                line-height: 1.6 !important;
              }
              .cce-pos-btn {
                font-size: 14px !important;
                padding: 12px 18px !important;
              }
              .cce-contact-title {
                font-size: 22px !important;
              }
              .cce-contact-intro {
                font-size: 15.5px !important;
                line-height: 1.6 !important;
              }
              .cce-contact-pill {
                font-size: 14.5px !important;
                padding: 12px 22px !important;
              }
              .cce-contact-closing {
                font-size: 15px !important;
              }

              /* Sección 05: Formulario de Registro Oficial */
              .cce-reg-pill {
                font-size: 13px !important;
              }
              .cce-reg-title {
                font-size: clamp(25px, 6vw, 30px) !important;
                line-height: 1.25 !important;
              }
              .cce-reg-subtitle {
                font-size: 15.5px !important;
                line-height: 1.55 !important;
              }
              .cce-reg-ticket-label {
                font-size: 13px !important;
              }
              .cce-reg-ticket-val {
                font-size: 18px !important;
              }
              .cce-reg-ticket-total-label {
                font-size: 13px !important;
              }
              .cce-reg-ticket-total-val {
                font-size: 25px !important;
              }
              .cce-label {
                font-size: 15px !important;
              }
              .cce-input,
              .cce-select {
                font-size: 16px !important;
                min-height: 50px !important;
              }
              .cce-attendees-title {
                font-size: 15.5px !important;
              }
              .cce-opt-btn {
                font-size: 14px !important;
                padding: 9px 16px !important;
              }
              .cce-attendees-note {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }
              .cce-upload-title {
                font-size: 16.5px !important;
              }
              .cce-upload-desc {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }
              .cce-upload-file-info {
                font-size: 14.5px !important;
              }
              .cce-factura-title {
                font-size: 16px !important;
              }
              .cce-factura-sub {
                font-size: 14px !important;
              }
              .cce-btn-submit {
                font-size: 17px !important;
                padding: 16px 24px !important;
                min-height: 54px !important;
              }
              .cce-form-disclaimer {
                font-size: 13.5px !important;
                line-height: 1.55 !important;
              }
              .cce-confirm-seal {
                font-size: 13.5px !important;
                padding: 8px 18px !important;
              }
              .cce-confirm-title {
                font-size: 28px !important;
              }
              .cce-confirm-msg {
                font-size: 16px !important;
                line-height: 1.6 !important;
              }
              .cce-confirm-field-label {
                font-size: 12.5px !important;
              }
              .cce-confirm-field-val {
                font-size: 15.5px !important;
              }
              .cce-btn-cal {
                font-size: 14.5px !important;
                padding: 14px 22px !important;
              }
              .cce-confirm-note {
                font-size: 14px !important;
                line-height: 1.55 !important;
              }

              /* Footer */
              .cce-footer-motto {
                font-size: 15.5px !important;
              }
              .cce-footer-text {
                font-size: 14.5px !important;
                line-height: 1.65 !important;
              }
              .cce-footer-contact-inline {
                font-size: 14.5px !important;
              }
              .cce-footer-col-title {
                font-size: 15px !important;
              }
              .cce-org-name {
                font-size: 14.5px !important;
              }
              .cce-org-desc {
                font-size: 12.5px !important;
                line-height: 1.35 !important;
              }
              .cce-footer-info-label {
                font-size: 12px !important;
              }
              .cce-footer-info-val {
                font-size: 14.5px !important;
                line-height: 1.45 !important;
              }
              .cce-footer-nav-link {
                font-size: 14.5px !important;
              }
              .cce-footer-privacy-btn {
                font-size: 14px !important;
              }
              .cce-footer-copy {
                font-size: 13px !important;
                line-height: 1.55 !important;
              }
            }

            /* Large Hero Institutional Logo */
            .cce-hero-logo-box {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 10px auto 24px auto;
              position: relative;
            }

            .cce-hero-logo-img {
              width: 100%;
              max-width: 320px;
              height: auto;
              object-fit: contain;
              filter: drop-shadow(0 1px 0px rgba(255, 255, 255, 0.75)) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45));
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-hero-logo-img:hover {
              transform: scale(1.03);
            }

            @media (max-width: 640px) {
              .cce-hero-logo-box {
                margin: 8px auto 16px auto;
              }
              .cce-hero-logo-img {
                max-width: 235px;
              }
            }

            .cce-hero-pill {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 6px 16px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin-bottom: 24px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
              max-width: 100%;
            }

            @media (max-width: 640px) {
              .cce-hero-pill {
                font-size: 12.5px;
                letter-spacing: 0.1em;
                padding: 7px 16px;
                line-height: 1.35;
              }
            }

            .cce-hero-title {
              font-family: 'Cinzel', Georgia, 'Times New Roman', serif;
              font-size: clamp(34px, 6.5vw, 76px);
              font-weight: 800;
              letter-spacing: 0.04em;
              line-height: 1.1;
              text-transform: uppercase;
              margin: 0 0 14px 0;
              word-break: break-word;
              filter: drop-shadow(0 4px 25px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.25));
            }

            @media (max-width: 640px) {
              .cce-hero-title {
                font-size: clamp(36px, 9.5vw, 46px);
                line-height: 1.12;
                letter-spacing: 0.025em;
              }
            }

            .cce-hero-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(13px, 1.8vw, 19px);
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin: 0 0 24px 0;
              line-height: 1.4;
              text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
            }

            @media (max-width: 640px) {
              .cce-hero-motto {
                font-size: 15.5px;
                letter-spacing: 0.08em;
                line-height: 1.45;
              }
            }

            .cce-cta-short {
              display: inline;
            }
            .cce-cta-full {
              display: none;
            }

            @media (min-width: 640px) {
              .cce-cta-short {
                display: none;
              }
              .cce-cta-full {
                display: inline;
              }
            }

            .cce-hero-lead {
              font-size: clamp(15px, 2vw, 18px);
              line-height: 1.65;
              color: #E2E8F0;
              max-width: 820px;
              margin: 0 auto 36px auto;
              font-weight: 400;
            }

            /* Context Badges Grid (4 Badges) */
            .cce-badges-grid {
              display: grid;
              grid-template-columns: repeat(1, 1fr);
              gap: 16px;
              max-width: 1200px;
              margin: 0 auto;
            }

            @media (min-width: 600px) {
              .cce-badges-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
              }
            }

            @media (min-width: 1040px) {
              .cce-badges-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 18px;
              }
            }

            .cce-badge-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              text-align: center;
              padding: 28px 20px 24px 20px;
              background: linear-gradient(145deg, rgba(6, 78, 59, 0.55) 0%, rgba(2, 18, 14, 0.92) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.45);
              border-radius: 22px;
              box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5), inset 0 0 24px rgba(16, 185, 129, 0.12);
              transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
            }

            .cce-badge-card:hover {
              transform: translateY(-3px);
              border-color: rgba(212, 175, 55, 0.85);
              box-shadow: 0 18px 44px rgba(0, 0, 0, 0.65), 0 0 24px rgba(212, 175, 55, 0.22), inset 0 0 28px rgba(16, 185, 129, 0.2);
            }

            .cce-badge-icon {
              width: 58px;
              height: 58px;
              border-radius: 16px;
              background: linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(6, 78, 59, 0.55) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FDF6B2;
              flex-shrink: 0;
              margin-bottom: 16px;
              box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
            }

            .cce-badge-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: 100%;
            }

            .cce-badge-label {
              font-size: 11px;
              font-family: monospace;
              font-weight: 800;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: var(--cce-gold);
              margin-bottom: 6px;
              text-align: center;
            }

            .cce-badge-val {
              font-size: 17.5px;
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.25;
              letter-spacing: -0.01em;
              text-align: center;
            }

            .cce-badge-sub {
              font-size: 12.5px;
              color: #CBD5E1;
              margin-top: 6px;
              line-height: 1.35;
              text-align: center;
            }

            /* =========================================================
               SPRINT 2: MÓDULO PROTAGÓNICO CARLOS LORET & NICHO LAMBRÍN
               ========================================================= */
            .cce-loret-section {
              margin: 70px auto 90px auto;
              max-width: 1120px;
              position: relative;
              z-index: 10;
            }

            @media (max-width: 640px) {
              .cce-loret-section {
                margin: 50px auto 70px auto;
              }
            }

            /* Authentic Photorealistic Teak Lambrín Frame */
            .cce-lambrin-frame {
              position: relative;
              border-radius: 28px;
              border: 2px solid rgba(212, 175, 55, 0.65);
              box-shadow:
                0 35px 95px rgba(0, 0, 0, 0.95),
                0 0 55px rgba(212, 175, 55, 0.35),
                0 0 85px rgba(6, 78, 59, 0.55),
                inset 0 0 60px rgba(0, 0, 0, 0.6);
              overflow: hidden;
              background-color: #2b1a0e;
              padding: 44px 40px;
            }

            @media (max-width: 768px) {
              .cce-lambrin-frame {
                border-radius: 22px;
                padding: 24px 16px;
              }
            }

            /* Photographic Teak Slats */
            .cce-lambrin-slats {
              position: absolute;
              inset: 0;
              background-image: url('/assets/cce-juarez/lambrin_wood_texture.webp');
              background-repeat: repeat-x;
              background-position: center top;
              background-size: 136px 100%;
              opacity: 1;
            }

            /* Warm Architectural Ceiling Spotlight Wash */
            .cce-lambrin-overlay {
              position: absolute;
              inset: 0;
              background: radial-gradient(ellipse 95% 65% at 50% 10%, rgba(255, 245, 210, 0.14) 0%, transparent 70%);
              pointer-events: none;
            }

            /* 2-Column Responsive Layout (Cinematográfico en Desktop) */
            .cce-lambrin-grid {
              position: relative;
              z-index: 10;
              display: grid;
              grid-template-columns: 460px 1fr;
              gap: 48px;
              align-items: center;
            }

            @media (max-width: 1120px) {
              .cce-lambrin-grid {
                grid-template-columns: 400px 1fr;
                gap: 36px;
              }
            }

            @media (max-width: 960px) {
              .cce-lambrin-grid {
                grid-template-columns: 1fr;
                gap: 32px;
              }
            }

            /* Col 1: Video Vertical 9:16 */
            .cce-video-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }

            .cce-video-card {
              position: relative;
              width: 100%;
              max-width: 460px;
              aspect-ratio: 9 / 16;
              border-radius: 22px;
              overflow: hidden;
              border: 1.5px solid rgba(212, 175, 55, 0.55);
              box-shadow:
                0 30px 75px rgba(0, 0, 0, 0.9),
                0 0 45px rgba(212, 175, 55, 0.25);
              background: #000000;
              cursor: pointer;
            }

            @media (max-width: 960px) {
              .cce-video-card {
                max-width: 360px;
              }
            }

            .cce-video-element {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            /* Píldora de Sonido Externa (Debajo del Video) */
            .cce-video-audio-btn-external {
              position: relative;
              margin-top: 18px;
              width: 100%;
              max-width: 460px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 13px 22px;
              border-radius: 9999px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              cursor: pointer;
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
              user-select: none;
              text-align: center;
            }

            @media (max-width: 960px) {
              .cce-video-audio-btn-external {
                max-width: 360px;
              }
            }

            .cce-video-audio-btn-external:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(212, 175, 55, 0.75);
            }

            .cce-audio-btn-muted {
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-weight: 800;
              font-size: 12px;
              letter-spacing: 0.03em;
              border: 1.5px solid #FFF8DC;
              box-shadow: 0 6px 24px rgba(212, 175, 55, 0.65), 0 0 18px rgba(255, 248, 220, 0.35);
              animation: cceAudioPulse 2.2s infinite ease-in-out;
            }

            .cce-audio-btn-active {
              background: rgba(18, 12, 7, 0.88);
              color: #F3E5AB;
              font-weight: 700;
              font-size: 12px;
              border: 1.5px solid rgba(212, 175, 55, 0.6);
              backdrop-filter: blur(14px);
              box-shadow: 0 4px 18px rgba(0, 0, 0, 0.7);
            }

            @keyframes cceAudioPulse {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.65);
              }
              50% {
                transform: scale(1.025);
                box-shadow: 0 6px 28px rgba(212, 175, 55, 0.9), 0 0 25px rgba(243, 229, 171, 0.6);
              }
            }

            /* Video Overlay Play Indicator (Subtle Top-Right) */
            .cce-video-play-badge {
              position: absolute;
              top: 14px;
              right: 14px;
              z-index: 20;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background: rgba(3, 18, 14, 0.75);
              border: 1px solid rgba(212, 175, 55, 0.4);
              backdrop-filter: blur(8px);
              color: #F3E5AB;
              transition: all 0.2s ease;
              cursor: pointer;
            }

            .cce-video-play-badge:hover {
              transform: scale(1.1);
              background: rgba(6, 78, 59, 0.85);
            }

            /* Col 2: Editorial Column */
            .cce-editorial-col {
              background: rgba(3, 18, 14, 0.82);
              border: 1px solid rgba(212, 175, 55, 0.32);
              border-radius: 22px;
              padding: 34px 36px;
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
            }

            @media (max-width: 640px) {
              .cce-editorial-col {
                padding: 22px 18px;
                border-radius: 18px;
              }
            }

            .cce-loret-pill {
              display: inline-flex;
              align-items: center;
              gap: 7px;
              padding: 5px 14px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 10.5px;
              font-weight: 800;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #F3E5AB;
              margin-bottom: 12px;
            }

            .cce-loret-name {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(26px, 3.8vw, 42px);
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.15;
              margin: 0 0 6px 0;
              letter-spacing: 0.025em;
            }

            .cce-loret-role {
              font-size: 12px;
              font-family: monospace;
              font-weight: 700;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold);
              margin-bottom: 14px;
            }

            .cce-loret-keynote-box {
              background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 14px;
              padding: 14px 18px;
              margin-bottom: 20px;
              text-align: left;
            }

            .cce-keynote-tag {
              display: block;
              font-size: 10px;
              font-family: monospace;
              text-transform: uppercase;
              letter-spacing: 0.14em;
              color: var(--cce-gold);
              font-weight: 700;
              margin-bottom: 5px;
            }

            .cce-keynote-title {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(14px, 1.8vw, 16.5px);
              font-weight: 700;
              line-height: 1.4;
              color: #FFFFFF;
              margin: 0;
            }

            .cce-loret-semblanza-box {
              display: flex;
              flex-direction: column;
              gap: 13px;
              background: rgba(18, 11, 6, 0.72);
              border: 1px solid rgba(212, 175, 55, 0.28);
              border-radius: 16px;
              padding: 22px 24px;
              margin-bottom: 24px;
              backdrop-filter: blur(12px);
              box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5);
            }

            .cce-semblanza-lead {
              font-size: clamp(14px, 1.8vw, 15.5px);
              font-weight: 700;
              color: #FFFDF9;
              line-height: 1.55;
              border-left: 3px solid #D4AF37;
              padding-left: 12px;
            }

            .cce-semblanza-p {
              font-size: clamp(12.5px, 1.5vw, 13.5px);
              line-height: 1.65;
              color: #E2E8F0;
              margin: 0;
              font-weight: 400;
            }

            .cce-semblanza-p em {
              color: #F3E5AB;
              font-style: italic;
            }

            /* 3 Thematic Pillars */
            .cce-pillars-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 30px;
            }

            .cce-pillar-item {
              display: flex;
              align-items: flex-start;
              gap: 14px;
              padding: 14px 16px;
              background: rgba(2, 20, 15, 0.65);
              border: 1px solid rgba(212, 175, 55, 0.22);
              border-radius: 14px;
              transition: all 0.2s ease;
            }

            .cce-pillar-item:hover {
              border-color: rgba(212, 175, 55, 0.45);
              background: rgba(6, 78, 59, 0.35);
              transform: translateX(3px);
            }

            .cce-pillar-icon {
              width: 38px;
              height: 38px;
              border-radius: 10px;
              background: rgba(6, 78, 59, 0.65);
              border: 1px solid rgba(16, 185, 129, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #F3E5AB;
              flex-shrink: 0;
            }

            .cce-pillar-text {
              display: flex;
              flex-direction: column;
              min-width: 0;
            }

            .cce-pillar-title {
              font-size: 13.5px;
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.3;
              margin-bottom: 3px;
            }

            .cce-pillar-desc {
              font-size: 12px;
              color: #94A3B8;
              line-height: 1.5;
            }

            .cce-loret-cta {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 13px 26px;
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              border-radius: 9999px;
              border: 1px solid #FFF8DC;
              box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-loret-cta:hover {
              transform: translateY(-2px) scale(1.02);
              box-shadow: 0 10px 28px rgba(212, 175, 55, 0.55);
              background: linear-gradient(135deg, #FFF8DC 0%, #D4AF37 100%);
            }

            @media (max-width: 640px) {
              .cce-loret-cta {
                width: 100%;
                font-size: 15px;
                padding: 15px 22px;
                letter-spacing: 0.05em;
              }
            }

            /* =========================================================
               SECCIÓN 02: ENTREGA DE GALARDONES 2026 STYLES
               ========================================================= */
            .cce-galardones-section {
              max-width: 1200px;
              margin: 0 auto;
              padding: 70px 20px;
            }

            .cce-galardones-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(15px, 2.2vw, 19px);
              font-style: italic;
              color: var(--cce-gold-light);
              margin: -6px auto 16px auto;
              letter-spacing: 0.04em;
            }

            .cce-galardones-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              max-width: 960px;
              margin: 0 auto 32px auto;
            }

            @media (min-width: 768px) {
              .cce-galardones-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            .cce-galardon-card {
              position: relative;
              background: linear-gradient(180deg, rgba(6, 78, 59, 0.3) 0%, rgba(3, 18, 14, 0.85) 100%);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 20px;
              padding: 28px 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
              transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
            }

            .cce-galardon-card:hover {
              transform: translateY(-4px);
              border-color: rgba(212, 175, 55, 0.65);
              box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(212, 175, 55, 0.15);
            }

            .cce-galardon-card-featured {
              border-color: rgba(212, 175, 55, 0.5);
              background: linear-gradient(180deg, rgba(6, 78, 59, 0.45) 0%, rgba(3, 18, 14, 0.9) 100%);
            }

            .cce-galardon-badge {
              font-size: 10px;
              font-family: monospace;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              font-weight: 700;
              color: var(--cce-gold);
              background: rgba(212, 175, 55, 0.12);
              border: 1px solid rgba(212, 175, 55, 0.35);
              padding: 4px 12px;
              border-radius: 9999px;
              margin-bottom: 20px;
            }

            .cce-badge-gold {
              background: rgba(212, 175, 55, 0.22);
              color: #FFF8DC;
              border-color: rgba(212, 175, 55, 0.6);
            }

            .cce-galardon-img-wrap {
              width: 100%;
              max-width: 220px;
              height: 260px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
              border-radius: 16px;
            }

            .cce-galardon-trophy-img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.7));
            }

            .cce-galardon-body {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }

            .cce-galardon-tagline {
              font-size: 11px;
              font-family: monospace;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-weight: 700;
              margin-bottom: 4px;
            }

            .cce-galardon-name {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(18px, 2.4vw, 22px);
              font-weight: 700;
              color: #FFFFFF;
              margin-bottom: 12px;
              letter-spacing: 0.04em;
            }

            .cce-galardon-desc {
              font-size: 13px;
              line-height: 1.6;
              color: #CBD5E1;
              margin-bottom: 18px;
              max-width: 380px;
            }

            .cce-galardon-criteria {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 11.5px;
              color: var(--cce-gold-light);
              background: rgba(6, 78, 59, 0.4);
              padding: 8px 14px;
              border-radius: 10px;
              border: 1px solid rgba(16, 185, 129, 0.25);
              text-align: left;
            }

            .cce-institutional-contact-bar {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              max-width: 680px;
              margin: 0 auto;
              padding: 14px 20px;
              background: rgba(3, 18, 14, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 12px;
              font-size: 12.5px;
              color: #E2E8F0;
              text-align: center;
            }

            .cce-contact-link {
              color: var(--cce-gold);
              font-weight: 700;
              text-decoration: underline;
              margin-left: 4px;
            }

            .cce-contact-link:hover {
              color: #FFF8DC;
            }

            /* =========================================================
               SPRINT 3: PASE 3D BOLETOS, GUÍA SPEI & PUNTOS DE VENTA
               ========================================================= */

            /* Section Common Headers */
            .cce-section-header {
              text-align: center;
              max-width: 820px;
              margin: 0 auto 40px auto;
            }

            .cce-section-pill {
              display: inline-flex;
              align-items: center;
              gap: 7px;
              padding: 6px 16px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin-bottom: 16px;
            }

            .cce-section-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(24px, 4vw, 38px);
              font-weight: 800;
              line-height: 1.25;
              letter-spacing: 0.025em;
              color: #FFFFFF;
              margin: 0 0 12px 0;
            }

            .cce-section-subtitle {
              font-size: clamp(13px, 1.8vw, 15px);
              color: #94A3B8;
              line-height: 1.6;
              margin: 0;
            }

            /* Main 2-Column Grid for Section 02 (Tickets + SPEI) */
            .cce-tickets-grid {
              display: grid;
              grid-template-columns: 1.15fr 0.85fr;
              gap: 36px;
              max-width: 1140px;
              margin: 0 auto 80px auto;
              align-items: start;
            }

            @media (max-width: 960px) {
              .cce-tickets-grid {
                grid-template-columns: 1fr;
                gap: 32px;
              }
            }

            /* "The Emerald & Golden Ticket" Pass (Ticket 3D) */
            .cce-ticket-pass {
              position: relative;
              background: linear-gradient(155deg, rgba(3, 26, 19, 0.96) 0%, rgba(2, 16, 12, 0.98) 100%);
              border: 2px solid rgba(212, 175, 55, 0.55);
              border-radius: 26px;
              box-shadow:
                0 30px 80px rgba(0, 0, 0, 0.85),
                0 0 45px rgba(16, 185, 129, 0.25),
                0 0 30px rgba(212, 175, 55, 0.2);
              padding: 34px 32px;
              overflow: hidden;
            }

            @media (max-width: 640px) {
              .cce-ticket-pass {
                padding: 24px 18px;
                border-radius: 20px;
              }
            }

            /* Ticket Header Stub */
            .cce-ticket-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 10px;
              padding-bottom: 20px;
              border-bottom: 1px dashed rgba(212, 175, 55, 0.35);
              margin-bottom: 24px;
            }

            .cce-ticket-folio {
              font-family: monospace;
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.12em;
              color: var(--cce-gold);
              text-transform: uppercase;
            }

            .cce-ticket-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 10px;
              background: rgba(6, 78, 59, 0.5);
              border: 1px solid rgba(16, 185, 129, 0.4);
              border-radius: 9999px;
              font-size: 10.5px;
              font-weight: 700;
              color: #A7F3D0;
            }

            /* Modality Switcher (Individual vs Mesa) */
            .cce-modality-tabs {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              background: rgba(2, 14, 10, 0.7);
              padding: 6px;
              border-radius: 14px;
              border: 1px solid rgba(212, 175, 55, 0.25);
              margin-bottom: 22px;
            }

            .cce-modality-tab {
              padding: 9px 8px;
              border-radius: 10px;
              border: none;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.02em;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: center;
              color: #CBD5E1;
              background: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              flex-wrap: wrap;
              line-height: 1.25;
            }

            .cce-tab-sub {
              font-size: 10px;
              font-weight: 600;
              opacity: 0.85;
              white-space: nowrap;
            }

            .cce-modality-tab-active {
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
            }

            /* Stepper Controls */
            .cce-stepper-wrap {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 14px 18px;
              background: rgba(2, 20, 15, 0.65);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 14px;
              margin-bottom: 18px;
            }

            .cce-stepper-label {
              font-size: 13px;
              font-weight: 700;
              color: #F8FAFC;
            }

            .cce-stepper-controls {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .cce-stepper-btn {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              border: 1px solid rgba(212, 175, 55, 0.4);
              background: rgba(6, 78, 59, 0.6);
              color: #FFFFFF;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-stepper-btn:hover:not(:disabled) {
              background: #D4AF37;
              color: #03120E;
              transform: scale(1.08);
            }

            .cce-stepper-btn:disabled {
              opacity: 0.35;
              cursor: not-allowed;
            }

            .cce-stepper-value {
              font-size: 18px;
              font-weight: 900;
              color: #FFFFFF;
              font-family: monospace;
              min-width: 24px;
              text-align: center;
            }

            /* Quick Select Pills */
            .cce-quick-picks {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1.85fr;
              gap: 8px;
              margin-bottom: 24px;
            }

            .cce-quick-btn {
              width: 100%;
              padding: 8px 6px;
              background: rgba(6, 78, 59, 0.35);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 9999px;
              color: #E2E8F0;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: center;
              white-space: nowrap;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }

            .cce-quick-btn-mesa {
              padding: 8px 14px;
            }

            @media (max-width: 640px) {
              .cce-quick-picks {
                grid-template-columns: repeat(3, 1fr);
              }
              .cce-quick-btn-mesa {
                grid-column: 1 / -1;
              }
            }

            .cce-quick-btn:hover,
            .cce-quick-btn-active {
              background: rgba(212, 175, 55, 0.2);
              border-color: #D4AF37;
              color: #FFFFFF;
            }

            /* Live Price Summary */
            .cce-ticket-price-box {
              background: rgba(2, 22, 16, 0.85);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 16px;
              padding: 18px 20px;
              margin-bottom: 22px;
              text-align: center;
            }

            .cce-ticket-price-tag {
              font-size: 11px;
              font-family: monospace;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--cce-gold);
              margin-bottom: 4px;
            }

            .cce-ticket-price-val {
              font-size: clamp(28px, 4.5vw, 42px);
              font-weight: 900;
              letter-spacing: -0.01em;
              line-height: 1.1;
              margin-bottom: 4px;
            }

            .cce-ticket-price-note {
              font-size: 11.5px;
              color: #94A3B8;
            }

            /* Scarcity Bar */
            .cce-scarcity-wrap {
              margin-bottom: 24px;
            }

            .cce-scarcity-info {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 11.5px;
              font-weight: 700;
              color: #E2E8F0;
              margin-bottom: 8px;
            }

            .cce-scarcity-bar-bg {
              width: 100%;
              height: 8px;
              background: rgba(2, 20, 15, 0.8);
              border-radius: 9999px;
              overflow: hidden;
              border: 1px solid rgba(212, 175, 55, 0.25);
            }

            .cce-scarcity-bar-fill {
              height: 100%;
              border-radius: 9999px;
              background: linear-gradient(90deg, #10B981 0%, #D4AF37 80%, #F59E0B 100%);
              box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
            }

            /* Benefits Checklist */
            .cce-benefits-list {
              display: flex;
              flex-direction: column;
              gap: 10px;
              margin-bottom: 24px;
              border-top: 1px dashed rgba(212, 175, 55, 0.25);
              padding-top: 20px;
            }

            .cce-benefit-item {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              font-size: 12.5px;
              color: #E2E8F0;
              line-height: 1.45;
            }

            .cce-benefit-icon {
              color: #10B981;
              flex-shrink: 0;
              margin-top: 2px;
            }

            .cce-ticket-footnote {
              font-size: 11px;
              color: #64748B;
              font-style: italic;
              line-height: 1.4;
              margin-bottom: 20px;
            }

            .cce-ticket-submit-btn {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 15px 24px;
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-size: 12.5px;
              font-weight: 900;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              border-radius: 9999px;
              border: 1px solid #FFF8DC;
              box-shadow: 0 8px 24px rgba(212, 175, 55, 0.45);
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-ticket-submit-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 32px rgba(212, 175, 55, 0.6);
              background: linear-gradient(135deg, #FFF8DC 0%, #D4AF37 100%);
            }

            /* SPEI Guide & Bank Card (Right Col) */
            .cce-spei-col {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }

            .cce-spei-steps-card {
              background: rgba(3, 18, 14, 0.82);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 22px;
              padding: 28px 24px;
              backdrop-filter: blur(16px);
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
            }

            .cce-spei-steps-title {
              font-size: 18px;
              font-weight: 800;
              color: #FFFFFF;
              margin: 0 0 6px 0;
            }

            .cce-spei-steps-sub {
              font-size: 12.5px;
              color: #94A3B8;
              margin: 0 0 20px 0;
            }

            .cce-steps-vertical {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .cce-step-row {
              display: flex;
              align-items: flex-start;
              gap: 14px;
            }

            .cce-step-num {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: rgba(6, 78, 59, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.4);
              color: var(--cce-gold-light);
              font-size: 13px;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .cce-step-body-title {
              font-size: 13.5px;
              font-weight: 800;
              color: #FFFFFF;
              margin-bottom: 2px;
            }

            .cce-step-body-desc {
              font-size: 12px;
              color: #CBD5E1;
              line-height: 1.5;
            }

            /* Official Bank Details Card */
            .cce-bank-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.92) 0%, rgba(2, 16, 12, 0.95) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.45);
              border-radius: 22px;
              padding: 26px 24px;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
            }

            .cce-bank-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 20px;
              padding-bottom: 14px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.25);
            }

            .cce-bank-title {
              font-size: 14.5px;
              font-weight: 800;
              color: var(--cce-gold-light);
              margin: 0;
            }

            .cce-bank-field {
              margin-bottom: 14px;
            }

            .cce-bank-field-label {
              font-size: 10.5px;
              font-family: monospace;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: #94A3B8;
              margin-bottom: 3px;
            }

            .cce-bank-field-val {
              font-size: 13.5px;
              font-weight: 700;
              color: #FFFFFF;
            }

            .cce-clabe-box {
              background: rgba(2, 14, 10, 0.85);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 12px;
              padding: 12px 14px;
              margin: 14px 0 16px 0;
            }

            .cce-clabe-num {
              font-family: monospace;
              font-size: 16px;
              font-weight: 800;
              color: #F3E5AB;
              letter-spacing: 0.12em;
              margin-bottom: 8px;
              user-select: all;
            }

            .cce-btn-copy-clabe {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 100%;
              padding: 9px 14px;
              border-radius: 9999px;
              font-size: 11.5px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              cursor: pointer;
              transition: all 0.2s ease;
              border: 1px solid rgba(212, 175, 55, 0.5);
              background: rgba(6, 78, 59, 0.6);
              color: #F8FAFC;
            }

            .cce-btn-copy-clabe:hover {
              background: #D4AF37;
              color: #03120E;
            }

            .cce-btn-copy-success {
              background: rgba(16, 185, 129, 0.3) !important;
              border-color: #10B981 !important;
              color: #A7F3D0 !important;
            }

            /* =========================================================
               PHYSICAL POINTS OF SALE (SECTION 03)
               ========================================================= */
            .cce-pos-section {
              margin: 80px auto;
              max-width: 1140px;
              position: relative;
              z-index: 10;
            }

            .cce-pos-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }

            @media (max-width: 768px) {
              .cce-pos-grid {
                grid-template-columns: 1fr;
                gap: 16px;
              }
            }

            .cce-pos-card {
              background: rgba(3, 18, 14, 0.85);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 20px;
              padding: 24px;
              box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              transition: all 0.2s ease;
            }

            .cce-pos-card:hover {
              border-color: rgba(212, 175, 55, 0.55);
              transform: translateY(-2px);
              box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(16, 185, 129, 0.15);
            }

            .cce-pos-top {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
            }

            .cce-pos-icon-wrap {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              background: rgba(6, 78, 59, 0.6);
              border: 1px solid rgba(16, 185, 129, 0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--cce-gold-light);
              flex-shrink: 0;
            }

            .cce-pos-badge {
              font-size: 10px;
              font-family: monospace;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-weight: 700;
            }

            .cce-pos-name {
              font-size: 16px;
              font-weight: 800;
              color: #FFFFFF;
              margin-bottom: 8px;
              line-height: 1.3;
            }

            .cce-pos-address {
              font-size: 12.5px;
              color: #94A3B8;
              line-height: 1.55;
              margin-bottom: 20px;
            }

            .cce-pos-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 10px 16px;
              border-radius: 9999px;
              background: rgba(6, 78, 59, 0.45);
              border: 1px solid rgba(212, 175, 55, 0.35);
              color: #F8FAFC;
              font-size: 11.5px;
              font-weight: 800;
              letter-spacing: 0.04em;
              text-decoration: none;
              transition: all 0.2s ease;
              width: 100%;
            }

            .cce-pos-btn:hover {
              background: #D4AF37;
              color: #03120E;
              border-color: #F3E5AB;
            }

            /* Direct Contact & Support Box */
            .cce-contact-box {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.94) 0%, rgba(2, 18, 14, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.4);
              border-radius: 22px;
              padding: 32px 30px;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
              text-align: center;
            }

            .cce-contact-title {
              font-size: 20px;
              font-weight: 800;
              color: #FFFFFF;
              margin-bottom: 8px;
            }

            .cce-contact-intro {
              font-size: 13.5px;
              color: #CBD5E1;
              max-width: 650px;
              margin: 0 auto 22px auto;
              line-height: 1.55;
            }

            .cce-contact-channels {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              gap: 14px;
              margin-bottom: 18px;
            }

            .cce-contact-pill {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 20px;
              border-radius: 9999px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.35);
              color: #FFFFFF;
              font-size: 12.5px;
              font-weight: 700;
              text-decoration: none;
              transition: all 0.2s ease;
            }

            .cce-contact-pill:hover {
              background: #D4AF37;
              color: #03120E;
              transform: translateY(-1px);
            }

            .cce-contact-closing {
              font-size: 12.5px;
              font-weight: 800;
              color: var(--cce-gold);
              letter-spacing: 0.08em;
              text-transform: uppercase;
              margin: 0;
            }

            /* =========================================================
               PROPUESTA 1: FOOTER MODULAR CÚPULA EMPRESARIAL
               ========================================================= */
            .cce-footer {
              position: relative;
              z-index: 10;
              border-top: 1.5px solid rgba(212, 175, 55, 0.4);
              background: linear-gradient(180deg, rgba(2, 20, 15, 0.98) 0%, rgba(1, 10, 8, 1) 100%);
              padding: 70px 20px 36px 20px;
              margin-top: 80px;
              overflow: hidden;
            }

            .cce-footer-container {
              max-width: 1200px;
              margin: 0 auto;
              position: relative;
              z-index: 5;
            }

            .cce-footer-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
            }

            @media (min-width: 640px) {
              .cce-footer-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
              }
            }

            @media (min-width: 1024px) {
              .cce-footer-grid {
                grid-template-columns: 1.35fr 1.05fr 1.15fr 1fr;
                gap: 24px;
                align-items: stretch;
              }
            }

            .cce-footer-col {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
              background: linear-gradient(180deg, rgba(3, 24, 18, 0.95) 0%, rgba(1, 14, 10, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.35);
              border-radius: 20px;
              padding: 28px 24px;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              position: relative;
              z-index: 5;
              width: 100%;
            }

            .cce-footer-brand {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              width: 100%;
              filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.7));
            }

            .cce-footer-brand img {
              height: 160px !important;
              width: auto !important;
              max-width: 100%;
            }

            @media (max-width: 640px) {
              .cce-footer-brand img {
                height: 130px !important;
              }
            }

            .cce-footer-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: 14.5px;
              font-style: italic;
              color: var(--cce-gold-light);
              margin-bottom: 12px;
              letter-spacing: 0.03em;
            }

            .cce-footer-text {
              font-size: 13.5px;
              color: #CBD5E1;
              line-height: 1.6;
              margin: 0 0 18px 0;
            }

            .cce-footer-contact-inline {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 13.5px;
              color: #E2E8F0;
              background: rgba(6, 78, 59, 0.35);
              border: 1px solid rgba(212, 175, 55, 0.3);
              padding: 8px 16px;
              border-radius: 9999px;
            }

            .cce-footer-link-highlight {
              color: var(--cce-gold);
              font-weight: 700;
              text-decoration: underline;
              transition: color 0.2s ease;
            }

            .cce-footer-link-highlight:hover {
              color: #FFF8DC;
            }

            .cce-footer-col-title {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: 14.5px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin: 0 0 18px 0;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.25);
              width: 100%;
              display: flex;
              align-items: center;
              gap: 9px;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95);
            }

            .cce-footer-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;
            }

            .cce-footer-org-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 12px;
              padding: 8px 10px;
              border-radius: 12px;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              background: rgba(2, 20, 15, 0.75);
              border: 1px solid rgba(212, 175, 55, 0.2);
              width: 100%;
            }

            .cce-footer-org-item:hover {
              background: rgba(6, 78, 59, 0.4);
              border-color: rgba(212, 175, 55, 0.4);
              transform: translateX(3px);
            }

            .cce-org-logo-wrap {
              width: 34px;
              height: 34px;
              min-width: 34px;
              border-radius: 8px;
              background: rgba(2, 20, 15, 0.85);
              border: 1px solid rgba(212, 175, 55, 0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
              overflow: hidden;
            }

            .cce-org-logo-wrap img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .cce-org-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .cce-org-name {
              font-size: 13.5px;
              font-weight: 800;
              color: #F8FAFC;
              letter-spacing: 0.02em;
            }

            .cce-org-desc {
              font-size: 11.5px;
              color: #94A3B8;
              line-height: 1.3;
            }

            .cce-footer-info-item {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              padding: 10px 12px;
              background: rgba(6, 78, 59, 0.25);
              border: 1px solid rgba(212, 175, 55, 0.2);
              border-radius: 12px;
              width: 100%;
              transition: all 0.2s ease;
            }

            .cce-footer-info-item:hover {
              background: rgba(6, 78, 59, 0.45);
              border-color: rgba(212, 175, 55, 0.45);
            }

            .cce-footer-info-icon {
              width: 30px;
              height: 30px;
              border-radius: 8px;
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid rgba(212, 175, 55, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--cce-gold-light);
              flex-shrink: 0;
              margin-top: 2px;
            }

            .cce-footer-info-label {
              display: block;
              font-size: 11px;
              font-family: monospace;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-weight: 800;
              margin-bottom: 2px;
            }

            .cce-footer-info-val {
              font-size: 13.5px;
              font-weight: 600;
              color: #FFFFFF;
              line-height: 1.4;
            }

            .cce-footer-nav-link {
              font-size: 14px;
              font-weight: 600;
              color: #E2E8F0;
              text-decoration: none;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              border-radius: 10px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              width: 100%;
            }

            .cce-footer-nav-link:hover {
              color: var(--cce-gold-light);
              background: rgba(6, 78, 59, 0.4);
              border-color: rgba(212, 175, 55, 0.4);
              transform: translateX(4px);
            }

            .cce-footer-privacy-btn {
              background: rgba(212, 175, 55, 0.12);
              border: 1px solid rgba(212, 175, 55, 0.35);
              padding: 10px 14px;
              border-radius: 10px;
              color: var(--cce-gold-light);
              font-size: 13px;
              font-weight: 700;
              cursor: pointer;
              text-align: left;
              transition: all 0.2s ease;
              width: 100%;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .cce-footer-privacy-btn:hover {
              background: rgba(212, 175, 55, 0.25);
              color: #FFFFFF;
              border-color: var(--cce-gold);
            }

            .cce-footer-privacy-btn:hover {
              color: #FFF8DC;
            }

            .cce-footer-bottom {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 1px solid rgba(212, 175, 55, 0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }

            .cce-footer-copy {
              font-size: 11.5px;
              font-family: monospace;
              color: #64748B;
              letter-spacing: 0.06em;
              text-align: center;
            }

            /* Privacy Modal Card */
            .cce-privacy-modal-card {
              position: relative;
              width: 100%;
              max-width: 640px;
              max-height: 85vh;
              background: #03140F;
              border: 1px solid rgba(212, 175, 55, 0.45);
              border-radius: 20px;
              padding: 28px;
              box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 78, 59, 0.3);
              display: flex;
              flex-direction: column;
              z-index: 1001;
              overflow-y: auto;
            }

            .cce-privacy-badge {
              font-size: 10px;
              font-family: monospace;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              font-weight: 700;
              color: var(--cce-gold);
            }

            .cce-privacy-title {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: 20px;
              font-weight: 700;
              color: #FFFFFF;
              margin: 4px 0 2px 0;
            }

            .cce-privacy-sub {
              font-size: 12px;
              color: #94A3B8;
            }

            .cce-privacy-modal-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              padding-bottom: 16px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.2);
              margin-bottom: 18px;
            }

            .cce-privacy-modal-body {
              font-size: 13px;
              line-height: 1.65;
              color: #CBD5E1;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .cce-privacy-modal-body h4 {
              font-size: 14px;
              color: var(--cce-gold-light);
              margin: 8px 0 4px 0;
              font-weight: 700;
            }

            .cce-privacy-modal-body ul {
              margin: 0;
              padding-left: 20px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }

            .cce-privacy-modal-footer {
              margin-top: 20px;
              padding-top: 16px;
              border-top: 1px solid rgba(212, 175, 55, 0.2);
              display: flex;
              justify-content: flex-end;
            }

            /* ==========================================================================
               SPRINT 4: REGISTRO OFICIAL, CONFIRMACIÓN Y CRM PRIVADO
               ========================================================================== */

            /* Section 04: Formulario de Registro Oficial */
            .cce-reg-section {
              position: relative;
              z-index: 10;
              max-width: 980px;
              margin: 80px auto 0 auto;
              padding: 0 20px;
            }

            .cce-reg-header {
              text-align: center;
              margin-bottom: 36px;
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
              margin-bottom: 14px;
            }

            .cce-reg-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(24px, 4.2vw, 36px);
              font-weight: 800;
              color: #FFFFFF;
              letter-spacing: 0.025em;
              margin: 0 0 12px 0;
            }

            .cce-reg-subtitle {
              font-size: clamp(14px, 2vw, 16px);
              color: #CBD5E1;
              max-width: 680px;
              margin: 0 auto;
              line-height: 1.55;
            }

            /* Ticket Selected Summary Card */
            .cce-reg-ticket-summary {
              background: linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(3, 26, 19, 0.7) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.4);
              border-radius: 18px;
              padding: 18px 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 14px;
              margin-bottom: 28px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
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
              color: #94A3B8;
            }

            .cce-reg-ticket-val {
              font-size: 16px;
              font-weight: 800;
              color: #FFFFFF;
            }

            .cce-reg-ticket-total {
              text-align: right;
            }

            .cce-reg-ticket-total-label {
              font-size: 11px;
              font-weight: 700;
              color: #94A3B8;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }

            .cce-reg-ticket-total-val {
              font-size: 22px;
              font-weight: 900;
              color: var(--cce-gold-light);
              font-family: monospace;
            }

            /* Main Form Card */
            .cce-form-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.95) 0%, rgba(2, 18, 14, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.45);
              border-radius: 24px;
              padding: clamp(24px, 4vw, 42px);
              box-shadow: 0 25px 65px rgba(0, 0, 0, 0.85);
            }

            .cce-form-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 24px;
            }

            .cce-form-group {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .cce-form-group.cce-full-width {
              grid-column: 1 / -1;
            }

            .cce-label {
              font-size: 13px;
              font-weight: 700;
              color: #E2E8F0;
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
              padding: 12px 16px;
              border-radius: 12px;
              background: rgba(2, 20, 15, 0.85);
              border: 1.5px solid rgba(212, 175, 55, 0.3);
              color: #FFFFFF;
              font-size: 15px;
              transition: all 0.2s ease;
              outline: none;
            }

            .cce-input:focus,
            .cce-select:focus {
              border-color: var(--cce-gold);
              background: rgba(4, 30, 22, 0.95);
              box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
            }

            .cce-input::placeholder {
              color: #64748B;
            }

            .cce-select option {
              background-color: #031A13;
              color: #FFFFFF;
            }

            /* Attendee Assignment Section */
            .cce-attendees-section {
              grid-column: 1 / -1;
              background: rgba(2, 22, 16, 0.65);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 16px;
              padding: 20px;
              margin-top: 6px;
            }

            .cce-attendees-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 12px;
              margin-bottom: 16px;
            }

            .cce-attendees-title {
              font-size: 13.5px;
              font-weight: 800;
              color: #F1F5F9;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .cce-attendees-options {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }

            .cce-opt-btn {
              padding: 7px 14px;
              border-radius: 9999px;
              border: 1px solid rgba(212, 175, 55, 0.3);
              background: rgba(2, 18, 14, 0.8);
              color: #CBD5E1;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-opt-btn.cce-opt-active {
              background: rgba(16, 185, 129, 0.25);
              border-color: #10B981;
              color: #FFFFFF;
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
              color: #94A3B8;
              font-style: italic;
              line-height: 1.5;
            }

            /* Drag and Drop Upload Area */
            .cce-upload-wrap {
              grid-column: 1 / -1;
              margin-top: 10px;
            }

            .cce-upload-zone {
              border: 2px dashed rgba(212, 175, 55, 0.45);
              border-radius: 18px;
              background: rgba(2, 22, 16, 0.55);
              padding: 28px 20px;
              text-align: center;
              cursor: pointer;
              transition: all 0.25s ease;
              position: relative;
            }

            .cce-upload-zone:hover,
            .cce-upload-zone.cce-drag-over {
              border-color: #10B981;
              background: rgba(6, 78, 59, 0.35);
              box-shadow: 0 0 25px rgba(16, 185, 129, 0.2);
            }

            .cce-upload-icon-wrap {
              width: 52px;
              height: 52px;
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
              color: #FFFFFF;
              margin-bottom: 6px;
            }

            .cce-upload-desc {
              font-size: 12.5px;
              color: #94A3B8;
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
              border: 1.5px solid #10B981;
              border-radius: 14px;
              padding: 14px 18px;
              margin-top: 12px;
            }

            .cce-upload-file-info {
              display: flex;
              align-items: center;
              gap: 10px;
              color: #ECFDF5;
              font-size: 13.5px;
              font-weight: 700;
            }

            .cce-upload-remove-btn {
              background: rgba(239, 68, 68, 0.15);
              border: 1px solid rgba(239, 68, 68, 0.35);
              color: #FCA5A5;
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-upload-remove-btn:hover {
              background: #EF4444;
              color: #FFFFFF;
            }

            /* Facturación Accordion Card */
            .cce-factura-toggle-box {
              grid-column: 1 / -1;
              background: rgba(2, 22, 16, 0.65);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 16px;
              padding: 18px 22px;
              margin-top: 10px;
            }

            .cce-factura-toggle-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
            }

            .cce-factura-toggle-info {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .cce-factura-title {
              font-size: 14px;
              font-weight: 800;
              color: #FFFFFF;
              margin: 0;
            }

            .cce-factura-sub {
              font-size: 12px;
              color: #94A3B8;
              margin-top: 2px;
            }

            .cce-toggle-switch {
              width: 46px;
              height: 26px;
              border-radius: 9999px;
              background: rgba(148, 163, 184, 0.3);
              border: 1px solid rgba(212, 175, 55, 0.3);
              position: relative;
              cursor: pointer;
              transition: all 0.25s ease;
              flex-shrink: 0;
            }

            .cce-toggle-switch.cce-active {
              background: #10B981;
              border-color: #10B981;
            }

            .cce-toggle-knob {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #FFFFFF;
              position: absolute;
              top: 2px;
              left: 3px;
              transition: all 0.25s ease;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .cce-toggle-switch.cce-active .cce-toggle-knob {
              left: 21px;
            }

            .cce-factura-fields {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-top: 20px;
              padding-top: 18px;
              border-top: 1px solid rgba(212, 175, 55, 0.2);
            }

            /* Error Banner */
            .cce-form-error-banner {
              background: rgba(185, 28, 28, 0.25);
              border: 1.5px solid #EF4444;
              border-radius: 12px;
              padding: 12px 18px;
              display: flex;
              align-items: center;
              gap: 12px;
              color: #FEE2E2;
              font-size: 13.5px;
              font-weight: 700;
              margin-bottom: 20px;
            }

            /* Submit Button */
            .cce-btn-submit {
              width: 100%;
              min-height: 52px;
              border-radius: 14px;
              background: linear-gradient(135deg, #10B981 0%, #064E3B 50%, #B8860B 100%);
              background-size: 200% auto;
              border: 1.5px solid rgba(245, 222, 152, 0.6);
              color: #FFFFFF;
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 0.02em;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              cursor: pointer;
              box-shadow: 0 12px 35px rgba(6, 78, 59, 0.7);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            .cce-btn-submit:hover:not(:disabled) {
              background-position: right center;
              transform: translateY(-2px);
              box-shadow: 0 16px 45px rgba(16, 185, 129, 0.5);
            }

            .cce-btn-submit:disabled {
              opacity: 0.75;
              cursor: not-allowed;
            }

            .cce-form-disclaimer {
              font-size: 12px;
              color: #94A3B8;
              text-align: center;
              margin-top: 14px;
              line-height: 1.5;
            }

            /* Spinner Animation */
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

            /* ==========================================================================
               CONFIRMATION SCREEN (SPRINT 4)
               ========================================================================== */
            .cce-confirm-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.96) 0%, rgba(2, 18, 14, 0.99) 100%);
              border: 2px solid rgba(212, 175, 55, 0.6);
              border-radius: 26px;
              padding: clamp(28px, 5vw, 50px);
              box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9);
              text-align: center;
            }

            .cce-confirm-seal {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 20px;
              border-radius: 9999px;
              background: rgba(16, 185, 129, 0.2);
              border: 1.5px solid #10B981;
              color: #34D399;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              margin-bottom: 20px;
            }

            .cce-confirm-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(26px, 4.8vw, 40px);
              font-weight: 800;
              color: #FFFFFF;
              letter-spacing: 0.025em;
              margin: 0 0 16px 0;
            }

            .cce-folio-box {
              background: rgba(2, 20, 15, 0.9);
              border: 1.5px solid var(--cce-gold);
              border-radius: 16px;
              padding: 18px 24px;
              max-width: 480px;
              margin: 0 auto 24px auto;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .cce-folio-label {
              font-size: 11px;
              font-weight: 800;
              color: #94A3B8;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              margin-bottom: 6px;
            }

            .cce-folio-row {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
            }

            .cce-folio-code {
              font-size: clamp(20px, 3.5vw, 26px);
              font-weight: 900;
              color: var(--cce-gold-light);
              font-family: monospace;
              letter-spacing: 0.05em;
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
              gap: 4px;
              transition: all 0.2s ease;
            }

            .cce-folio-copy-btn:hover {
              background: var(--cce-gold);
              color: #021812;
            }

            .cce-confirm-msg {
              font-size: clamp(14.5px, 2vw, 16.5px);
              color: #E2E8F0;
              max-width: 660px;
              margin: 0 auto 32px auto;
              line-height: 1.6;
            }

            /* Confirmation Summary Grid */
            .cce-confirm-summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              text-align: left;
              max-width: 680px;
              margin: 0 auto 36px auto;
              background: rgba(2, 22, 16, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 18px;
              padding: 22px;
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
              color: #94A3B8;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }

            .cce-confirm-field-val {
              font-size: 14.5px;
              font-weight: 800;
              color: #FFFFFF;
            }

            /* Calendar & Maps Action Buttons */
            .cce-confirm-actions {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              gap: 14px;
              margin-bottom: 28px;
            }

            .cce-btn-cal {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 22px;
              border-radius: 12px;
              font-size: 13.5px;
              font-weight: 800;
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-btn-cal-google {
              background: rgba(16, 185, 129, 0.2);
              border: 1.5px solid #10B981;
              color: #FFFFFF;
            }

            .cce-btn-cal-google:hover {
              background: #10B981;
              color: #021812;
              transform: translateY(-2px);
            }

            .cce-btn-cal-apple {
              background: rgba(212, 175, 55, 0.2);
              border: 1.5px solid var(--cce-gold);
              color: var(--cce-gold-light);
            }

            .cce-btn-cal-apple:hover {
              background: var(--cce-gold);
              color: #021812;
              transform: translateY(-2px);
            }

            .cce-btn-cal-map {
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.25);
              color: #F1F5F9;
            }

            .cce-btn-cal-map:hover {
              background: rgba(255, 255, 255, 0.18);
              transform: translateY(-2px);
            }

            .cce-confirm-note {
              font-size: 13px;
              color: #94A3B8;
              max-width: 600px;
              margin: 0 auto;
              line-height: 1.55;
            }

            .cce-btn-new-reg {
              display: inline-block;
              margin-top: 24px;
              color: var(--cce-gold);
              font-size: 13px;
              font-weight: 700;
              background: none;
              border: none;
              cursor: pointer;
              text-decoration: underline;
            }

            /* ==========================================================================
               PRIVATE CRM DASHBOARD (SPRINT 4)
               ========================================================================== */
            .cce-crm-banner {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: 40px;
              background: linear-gradient(90deg, #02120C 0%, #064E3B 50%, #B8860B 100%);
              border-bottom: 1px solid var(--cce-gold);
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 16px;
              font-size: 12px;
              font-weight: 700;
              color: #FFFFFF;
            }

            .cce-crm-banner-left {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .cce-crm-view-switch {
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .cce-crm-view-btn {
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 800;
              cursor: pointer;
              border: 1px solid rgba(255, 255, 255, 0.3);
              background: rgba(0, 0, 0, 0.3);
              color: #FFFFFF;
              transition: all 0.2s ease;
            }

            .cce-crm-view-btn.cce-view-active {
              background: var(--cce-gold);
              color: #021812;
              border-color: var(--cce-gold);
            }

            .cce-crm-view-container {
              max-width: 1320px;
              margin: 60px auto 60px auto;
              padding: 0 20px;
            }

            .cce-crm-top-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 16px;
              margin-bottom: 28px;
            }

            .cce-crm-header-title {
              font-size: 26px;
              font-weight: 900;
              color: #FFFFFF;
              margin: 0 0 4px 0;
            }

            .cce-crm-header-sub {
              font-size: 13px;
              color: #94A3B8;
              margin: 0;
            }

            .cce-crm-top-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }

            .cce-crm-action-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 9px 16px;
              border-radius: 10px;
              font-size: 12.5px;
              font-weight: 700;
              cursor: pointer;
              border: 1px solid rgba(212, 175, 55, 0.4);
              background: rgba(6, 78, 59, 0.45);
              color: #FFFFFF;
              transition: all 0.2s ease;
            }

            .cce-crm-action-btn:hover {
              background: var(--cce-gold);
              color: #021812;
            }

            /* Pulse Dot Animation */
            @keyframes ccePulseGreen {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
              70% { transform: scale(1); box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }

            .cce-pulse-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10B981;
              display: inline-block;
              box-shadow: 0 0 8px #10B981;
              animation: ccePulseGreen 2s infinite ease-in-out;
            }

            /* Live Telemetry Radar Banner */
            .cce-crm-telemetry-banner {
              background: linear-gradient(135deg, rgba(2, 22, 16, 0.95) 0%, rgba(1, 14, 10, 0.98) 100%);
              border: 1.5px solid rgba(16, 185, 129, 0.35);
              border-radius: 20px;
              padding: 20px;
              margin-bottom: 24px;
              box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
            }

            .cce-crm-telemetry-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(16, 185, 129, 0.2);
            }

            .cce-crm-telemetry-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 13.5px;
              font-weight: 800;
              color: #FFFFFF;
              letter-spacing: 0.02em;
            }

            .cce-crm-telemetry-status {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 11.5px;
              color: #34D399;
              background: rgba(16, 185, 129, 0.12);
              border: 1px solid rgba(16, 185, 129, 0.3);
              padding: 4px 10px;
              border-radius: 9999px;
            }

            .cce-crm-telemetry-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 14px;
            }

            .cce-crm-telem-card {
              background: rgba(2, 18, 13, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.2);
              border-radius: 14px;
              padding: 14px;
            }

            .cce-crm-telem-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 6px;
            }

            .cce-crm-telem-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #94A3B8;
            }

            .cce-crm-telem-num {
              font-size: 22px;
              font-weight: 900;
              color: #FFFFFF;
              font-family: monospace;
              margin-bottom: 2px;
            }

            .cce-crm-telem-sub {
              font-size: 11px;
              color: #64748B;
            }

            .cce-crm-telem-devices-card {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .cce-crm-devices-pills {
              display: flex;
              align-items: center;
              gap: 6px;
              flex-wrap: wrap;
              margin-bottom: 8px;
            }

            .cce-dev-pill {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 6px;
              background: rgba(255, 255, 255, 0.08);
              color: #CBD5E1;
            }

            .cce-crm-devices-bar {
              height: 7px;
              border-radius: 9999px;
              overflow: hidden;
              background: rgba(255, 255, 255, 0.1);
              display: flex;
              width: 100%;
            }

            /* 4 Stat Metric Cards */
            .cce-crm-stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 24px;
            }

            .cce-crm-stat-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.9) 0%, rgba(2, 18, 14, 0.95) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.35);
              border-radius: 18px;
              padding: 20px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .cce-crm-stat-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
            }

            .cce-crm-stat-icon {
              width: 36px;
              height: 36px;
              border-radius: 10px;
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid rgba(212, 175, 55, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--cce-gold);
            }

            .cce-crm-stat-label {
              font-size: 11.5px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #94A3B8;
            }

            .cce-crm-stat-val {
              font-size: 24px;
              font-weight: 900;
              color: #FFFFFF;
              font-family: monospace;
              margin-bottom: 4px;
            }

            .cce-crm-stat-sub {
              font-size: 11.5px;
              color: #10B981;
            }

            /* Controls: Filter & Search */
            .cce-crm-controls {
              background: rgba(2, 22, 16, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 16px;
              padding: 14px 18px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 14px;
              margin-bottom: 20px;
            }

            .cce-crm-search-box {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(2, 18, 14, 0.9);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 10px;
              padding: 8px 14px;
              min-width: 280px;
              flex: 1;
              max-width: 420px;
            }

            .cce-crm-search-input {
              background: transparent;
              border: none;
              outline: none;
              color: #FFFFFF;
              font-size: 13px;
              width: 100%;
            }

            .cce-crm-filters {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .cce-crm-filter-pill {
              padding: 6px 14px;
              border-radius: 9999px;
              border: 1px solid rgba(212, 175, 55, 0.3);
              background: rgba(2, 18, 14, 0.7);
              color: #CBD5E1;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-crm-filter-pill.cce-filter-active {
              background: #10B981;
              color: #021812;
              border-color: #10B981;
            }

            /* Table Container (Desktop) */
            .cce-crm-desktop-table {
              display: block;
            }

            .cce-crm-table-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.92) 0%, rgba(2, 18, 14, 0.96) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.35);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 15px 45px rgba(0, 0, 0, 0.7);
            }

            .cce-crm-table-scroll {
              overflow-x: auto;
              width: 100%;
            }

            .cce-crm-table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
              font-size: 13px;
            }

            .cce-crm-table th {
              background: rgba(2, 18, 14, 0.95);
              color: #94A3B8;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              padding: 14px 16px;
              border-bottom: 1.5px solid rgba(212, 175, 55, 0.25);
              white-space: nowrap;
            }

            .cce-crm-table td {
              padding: 14px 16px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.12);
              color: #E2E8F0;
              vertical-align: middle;
            }

            .cce-crm-table tr:hover td {
              background: rgba(6, 78, 59, 0.25);
            }

            .cce-crm-badge-status {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              padding: 5px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              cursor: pointer;
              border: 1px solid transparent;
              transition: all 0.2s ease;
            }

            .cce-crm-badge-status.cce-status-validado {
              background: rgba(16, 185, 129, 0.2);
              border-color: #10B981;
              color: #34D399;
            }

            .cce-crm-badge-status.cce-status-pendiente {
              background: rgba(245, 158, 11, 0.2);
              border-color: #F59E0B;
              color: #FCD34D;
            }

            .cce-crm-wa-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 12px;
              border-radius: 8px;
              background: rgba(16, 185, 129, 0.2);
              border: 1px solid #10B981;
              color: #34D399;
              font-size: 11.5px;
              font-weight: 700;
              text-decoration: none;
              transition: all 0.2s ease;
              white-space: nowrap;
            }

            .cce-crm-wa-btn:hover {
              background: #10B981;
              color: #021812;
            }

            .cce-crm-doc-btn {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              padding: 5px 10px;
              border-radius: 6px;
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid rgba(212, 175, 55, 0.35);
              color: var(--cce-gold);
              font-size: 11.5px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .cce-crm-doc-btn:hover {
              background: var(--cce-gold);
              color: #021812;
            }

            /* Mobile Cards View (Touch-optimized) */
            .cce-crm-mobile-cards {
              display: none;
              flex-direction: column;
              gap: 14px;
            }

            .cce-crm-card {
              background: linear-gradient(145deg, rgba(3, 26, 19, 0.95) 0%, rgba(2, 18, 14, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.35);
              border-radius: 16px;
              padding: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
            }

            .cce-crm-card-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.2);
              margin-bottom: 12px;
            }

            .cce-crm-card-folio {
              font-size: 14px;
              font-weight: 900;
              color: var(--cce-gold);
              font-family: monospace;
            }

            .cce-crm-card-fecha {
              font-size: 11px;
              color: #94A3B8;
              margin-top: 2px;
            }

            .cce-crm-card-body {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .cce-crm-card-name {
              font-size: 17px;
              font-weight: 800;
              color: #FFFFFF;
            }

            .cce-crm-card-role {
              font-size: 12.5px;
              color: #CBD5E1;
            }

            .cce-crm-card-loc {
              font-size: 11px;
              color: #94A3B8;
            }

            .cce-crm-card-details {
              display: flex;
              flex-direction: column;
              gap: 6px;
              background: rgba(2, 18, 13, 0.6);
              border: 1px solid rgba(212, 175, 55, 0.15);
              border-radius: 10px;
              padding: 10px 12px;
              margin: 4px 0;
            }

            .cce-crm-card-detail-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 12px;
            }

            .cce-crm-card-detail-label {
              color: #94A3B8;
              font-weight: 600;
            }

            .cce-crm-card-detail-val {
              color: #FFFFFF;
              font-weight: 700;
            }

            .cce-crm-card-actions {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-top: 4px;
            }

            .cce-crm-card-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              padding: 10px 12px;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 700;
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: center;
            }

            .cce-crm-btn-doc {
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid rgba(212, 175, 55, 0.35);
              color: var(--cce-gold);
            }

            .cce-crm-btn-doc:hover {
              background: var(--cce-gold);
              color: #021812;
            }

            .cce-crm-btn-wa {
              background: rgba(16, 185, 129, 0.2);
              border: 1px solid #10B981;
              color: #34D399;
            }

            .cce-crm-btn-wa:hover {
              background: #10B981;
              color: #021812;
            }

            .cce-crm-empty {
              text-align: center;
              padding: 36px 20px;
              background: rgba(2, 22, 16, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 16px;
              color: #94A3B8;
              font-size: 13.5px;
            }

            /* Receipt Preview Modal */
            .cce-modal-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.88);
              backdrop-filter: blur(10px);
              z-index: 2000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
            }

            .cce-modal-card {
              background: #021B14;
              border: 2px solid var(--cce-gold);
              border-radius: 20px;
              max-width: 640px;
              width: 100%;
              max-height: 92vh;
              overflow-y: auto;
              padding: 24px;
              box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95);
            }

            .cce-modal-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            }

            .cce-modal-title {
              font-size: 18px;
              font-weight: 800;
              color: #FFFFFF;
              margin: 4px 0 0 0;
            }

            .cce-modal-close-btn {
              background: none;
              border: none;
              color: #94A3B8;
              cursor: pointer;
              padding: 4px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .cce-modal-close-btn:hover {
              color: #FFFFFF;
              background: rgba(255, 255, 255, 0.1);
            }

            .cce-modal-meta-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 16px;
              background: rgba(2, 18, 13, 0.6);
              border: 1px solid rgba(212, 175, 55, 0.2);
              border-radius: 12px;
              padding: 12px;
            }

            .cce-modal-meta-box {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .cce-modal-meta-lbl {
              font-size: 11px;
              color: #94A3B8;
              font-weight: 600;
            }

            .cce-modal-meta-val {
              font-size: 13px;
              color: #FFFFFF;
              font-weight: 700;
            }

            .cce-modal-preview-box {
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 12px;
              overflow: hidden;
              max-height: 420px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #010E0A;
              padding: 10px;
            }

            .cce-modal-preview-fallback {
              padding: 32px 20px;
              text-align: center;
              background: rgba(2, 20, 15, 0.8);
              border: 1px dashed rgba(212, 175, 55, 0.3);
              border-radius: 12px;
              color: #94A3B8;
            }

            .cce-modal-actions-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 20px;
              padding-top: 14px;
              border-top: 1px solid rgba(212, 175, 55, 0.2);
            }

            /* Responsive Adjustments (Sprint 4 & CMS Audit) */
            @media (max-width: 900px) {
              .cce-crm-telemetry-grid {
                grid-template-columns: repeat(2, 1fr);
              }

              .cce-crm-stats-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            @media (max-width: 768px) {
              .cce-crm-desktop-table {
                display: none;
              }

              .cce-crm-mobile-cards {
                display: flex;
              }

              .cce-modal-meta-grid {
                grid-template-columns: 1fr;
              }
            }

            @media (max-width: 680px) {
              .cce-form-grid {
                grid-template-columns: 1fr;
              }

              .cce-attendees-inputs-grid {
                grid-template-columns: 1fr;
              }

              .cce-factura-fields {
                grid-template-columns: 1fr;
              }

              .cce-confirm-summary-grid {
                grid-template-columns: 1fr;
              }

              .cce-crm-banner {
                padding: 0 10px;
                font-size: 11px;
              }

              .cce-crm-banner-left span:last-child {
                display: none;
              }

              .cce-crm-banner-left::after {
                content: "Admin CCE 2026";
                font-weight: 800;
                font-size: 11px;
                color: #FFFFFF;
              }

              .cce-crm-view-btn {
                padding: 3px 8px;
                font-size: 10px;
              }

              .cce-crm-view-container {
                padding: 0 12px;
                margin-top: 50px;
                overflow-x: hidden;
              }

              .cce-crm-header-title {
                font-size: 21px;
                line-height: 1.25;
                word-break: break-word;
              }

              .cce-crm-header-sub {
                font-size: 12px;
                line-height: 1.4;
              }

              .cce-crm-top-bar {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
              }

              .cce-crm-top-actions {
                width: 100%;
                flex-direction: column;
                align-items: stretch;
                gap: 8px;
              }

              .cce-crm-action-btn {
                width: 100%;
                justify-content: center;
                text-align: center;
                font-size: 11.5px;
                padding: 8px 12px;
              }

              .cce-crm-telemetry-banner {
                padding: 14px;
                border-radius: 16px;
              }

              .cce-crm-telemetry-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
              }

              .cce-crm-telemetry-title {
                font-size: 12px;
                line-height: 1.35;
              }

              .cce-crm-telemetry-status {
                font-size: 10.5px;
                padding: 3px 8px;
              }

              .cce-crm-telemetry-grid {
                grid-template-columns: 1fr;
              }

              .cce-crm-stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
              }

              .cce-crm-controls {
                flex-direction: column;
                align-items: stretch;
              }

              .cce-crm-search-box {
                min-width: 100%;
                max-width: 100%;
              }

              .cce-crm-filters {
                flex-wrap: wrap;
                justify-content: stretch;
              }

              .cce-crm-filter-pill {
                flex: 1;
                text-align: center;
              }

              .cce-crm-card {
                padding: 14px;
              }

              .cce-crm-card-name {
                font-size: 15px;
              }

              .cce-crm-card-detail-item {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 8px;
                font-size: 11.5px;
              }

              .cce-crm-card-detail-val {
                text-align: right;
                word-break: break-word;
                max-width: 60%;
              }

              .cce-crm-card-actions {
                grid-template-columns: 1fr;
                gap: 8px;
              }

              .cce-modal-actions-row {
                flex-direction: column;
                align-items: stretch;
              }

              .cce-modal-actions-row > div {
                width: 100%;
              }

              .cce-modal-actions-row .cce-crm-action-btn {
                width: 100%;
                justify-content: center;
              }
            }

            @media (max-width: 480px) {
              .cce-crm-stats-grid {
                grid-template-columns: 1fr;
              }

              .cce-crm-view-container {
                padding: 0 10px;
                margin-top: 48px;
              }

              .cce-modal-card {
                padding: 16px;
              }
            }
          `,
        }}
      />

      {/* Ambient Living Canvas (Aurora Mesh) */}
      <div className="cce-living-canvas" aria-hidden="true">
        <div className="cce-aurora-orb-1" />
        <div className="cce-aurora-orb-2" />
        <div className="cce-aurora-orb-3" />
      </div>

      {/* Admin Floating Banner (Sprint 4) */}
      {isAdmin && (
        <div className="cce-crm-banner">
          <div className="cce-crm-banner-left">
            <span className="cce-pulse-dot" />
            <span>Consola de Administración CCE Galardón 2026</span>
          </div>
          <div className="cce-crm-view-switch">
            <button
              type="button"
              onClick={() => setCrmView('crm')}
              className={`cce-crm-view-btn ${crmView === 'crm' ? 'cce-view-active' : ''}`}
            >
              Consola CRM
            </button>
            <button
              type="button"
              onClick={() => setCrmView('landing')}
              className={`cce-crm-view-btn ${crmView === 'landing' ? 'cce-view-active' : ''}`}
            >
              Ver Landing
            </button>
          </div>
        </div>
      )}

      {/* Public Landing View (When not in CRM mode) */}
      {(!isAdmin || crmView === 'landing') && (
        <>

      {/* Main Content */}
      <main className="cce-content-wrap">
        {/* Hero Section */}
        <section className="cce-hero" aria-labelledby="hero-main-title">
          {/* Diagonal Beveled Gold Ribbons Full-Bleed ("Cintillos Cruzados en X") */}
          <div className="cce-hero-cintillos-fullbleed" aria-hidden="true">
            {/* Brazo X 1 (Cintillo diagonal detrás del logo CCE) */}
            <div className="cce-x-arm-1">
              <div className="cce-band-sub" />
              <div className="cce-band-main">
                <div className="cce-band-sheen" />
              </div>
            </div>
            {/* Brazo X 2 (Cintillo diagonal en ángulo opuesto formando la X) */}
            <div className="cce-x-arm-2">
              <div className="cce-band-main">
                <div className="cce-band-sheen" />
              </div>
              <div className="cce-band-sub" />
            </div>
            {/* Cintillo Inferior (Cruza en ángulo transversal detrás de las tarjetas) */}
            <div className="cce-sash-bottom-full">
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen" />
              </div>
              <div className="cce-band-sub" />
            </div>
          </div>

          {/* Institutional CCE Juárez Large Green Logo Emblem */}
          <div className="cce-hero-logo-box">
            <Image
              src="/assets/cce-juarez/cce_logo_verde_transparente.png"
              alt="Consejo Coordinador Empresarial Ciudad Juárez"
              width={340}
              height={217}
              priority
              unoptimized
              className="cce-hero-logo-img"
            />
          </div>

          <div className="cce-hero-pill">
            <Sparkles size={14} color="#F3E5AB" />
            <span>Evento Anual Magno · CCE Ciudad Juárez</span>
          </div>

          <h1 id="hero-main-title" className="cce-hero-title cce-gold-shimmer-text">
            Galardones 2026
          </h1>

          <div className="cce-hero-motto">
            Liderazgo que impulsa el futuro en Ciudad Juárez
          </div>

          <p className="cce-hero-lead">
            El encuentro empresarial más relevante de nuestra frontera para reconocer el liderazgo y la
            contribución del sector productivo de Ciudad Juárez, en el marco de la magna conferencia de{' '}
            <strong>Carlos Loret de Mola</strong>: <em>“México y Estados Unidos: Poder, política y economía en tiempos de cambio”</em>.
          </p>

          {/* 4 Context Badges */}
          <div className="cce-badges-grid">
            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Calendar size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Fecha Oficial</span>
                <span className="cce-badge-val">Jueves 19 Noviembre</span>
                <span className="cce-badge-sub">Año 2026</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Clock size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Horario Oficial</span>
                <span className="cce-badge-val">8:30 A.M. Registro</span>
                <span className="cce-badge-sub">9:00 A.M. Inicio Desayuno</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <MapPin size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Sede Oficial</span>
                <span className="cce-badge-val">Centro de Eventos Cibeles</span>
                <span className="cce-badge-sub">Blvd. Tomás Fernández 8450</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Award size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Código de Protocolo</span>
                <span className="cce-badge-val">Vestimenta Formal</span>
                <span className="cce-badge-sub">Gala Empresarial CCE</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           SECCIÓN 01: ENTREGA DE GALARDONES 2026
           ========================================================= */}
        <section
          id="galardones"
          className="cce-galardones-section"
          aria-labelledby="galardones-main-title"
          style={{ scrollMarginTop: '110px' }}
        >
          {/* Cintillo Diagonal en Sección Galardones */}
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-galardones">
              <div className="cce-band-sub" />
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-1" />
              </div>
            </div>
          </div>

          <div className="cce-section-header">
            <div className="cce-section-pill">
              <Award size={13} color="#F3E5AB" />
              <span>Mérito y Liderazgo Empresarial</span>
            </div>
            <h2 id="galardones-main-title" className="cce-section-title">
              Entrega de Galardones 2026
            </h2>
            <div className="cce-galardones-motto">
              “Liderazgo que impulsa el futuro en Juárez”
            </div>
            <p className="cce-section-subtitle">
              Acompáñanos en este evento empresarial donde reconoceremos la trayectoria, el esfuerzo y la visión de quienes impulsan el desarrollo de Ciudad Juárez.
            </p>
          </div>

          <div className="cce-galardones-grid">
            {/* Tarjeta 1: Estrella Ascendente */}
            <div className="cce-galardon-card">
              <div className="cce-galardon-badge">
                <span>Categoría Corporativa</span>
              </div>
              <div className="cce-galardon-img-wrap">
                <Image
                  src="/assets/cce-juarez/trofeo_empresa_ano.png"
                  alt="Trofeo Estrella Ascendente - Empresa del Año 2026"
                  width={200}
                  height={260}
                  unoptimized
                  className="cce-galardon-trophy-img"
                />
              </div>
              <div className="cce-galardon-body">
                <span className="cce-galardon-tagline">Estrella Ascendente</span>
                <h3 className="cce-galardon-name cce-gold-shimmer-text">Empresa del Año 2026</h3>
                <p className="cce-galardon-desc">
                  Distinción a la organización productiva que sobresale por su dinamismo, innovación en procesos, generación de empleo formal de alto valor y sólida visión de futuro en la región fronteriza.
                </p>
                <div className="cce-galardon-criteria">
                  <CheckCircle2 size={15} color="#D4AF37" />
                  <span>Innovación, crecimiento y aporte socioeconómico a Ciudad Juárez</span>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: De Altos Vuelos */}
            <div className="cce-galardon-card cce-galardon-card-featured">
              <div className="cce-galardon-badge cce-badge-gold">
                <span>Máximo Galardón Institucional</span>
              </div>
              <div className="cce-galardon-img-wrap">
                <Image
                  src="/assets/cce-juarez/trofeo_empresario_ano.png"
                  alt="Trofeo De Altos Vuelos - Empresario del Año 2026"
                  width={200}
                  height={260}
                  unoptimized
                  className="cce-galardon-trophy-img"
                />
              </div>
              <div className="cce-galardon-body">
                <span className="cce-galardon-tagline">De Altos Vuelos</span>
                <h3 className="cce-galardon-name cce-gold-shimmer-text">Empresario del Año 2026</h3>
                <p className="cce-galardon-desc">
                  El más alto reconocimiento otorgado por el Consejo Coordinador Empresarial a la trayectoria directiva, integridad ética, resiliencia y liderazgo trascendental que engrandece a nuestra comunidad.
                </p>
                <div className="cce-galardon-criteria">
                  <CheckCircle2 size={15} color="#D4AF37" />
                  <span>Trayectoria directiva consolidada y compromiso social ejemplar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Contact Bar */}
          <div className="cce-institutional-contact-bar">
            <Mail size={16} color="#D4AF37" />
            <span>
              Para confirmaciones y protocolos institucionales del CCE:{' '}
              <a href="mailto:director@ccejuarez.org" className="cce-contact-link">
                director@ccejuarez.org
              </a>
            </span>
          </div>
        </section>

        {/* =========================================================
           SECCIÓN 02: MÓDULO PROTAGÓNICO CARLOS LORET & NICHO DE LAMBRÍN
           ========================================================= */}
        <section
          id="video-loret"
          className="cce-loret-section"
          aria-labelledby="loret-section-title"
          style={{ scrollMarginTop: '110px' }}
        >
          {/* Cintillo Diagonal en Sección Carlos Loret (Ángulo póster oficial) */}
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-loret">
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-2" />
              </div>
              <div className="cce-band-sub" />
            </div>
          </div>

          <div className="cce-lambrin-frame">
            {/* Lambrin Architectural Texture Layers */}
            <div className="cce-lambrin-slats" aria-hidden="true" />
            <div className="cce-lambrin-overlay" aria-hidden="true" />

            {/* Content Grid: Video 9:16 (Col 1) + Editorial (Col 2) */}
            <div className="cce-lambrin-grid">
              {/* Columna Izquierda: Reproductor 9:16 */}
              <div className="cce-video-col">
                <div
                  className="cce-video-card"
                  onClick={toggleMute}
                  role="region"
                  aria-label="Video promocional Carlos Loret de Mola"
                >
                  <video
                    ref={videoRef}
                    className="cce-video-element"
                    src="/assets/cce-juarez/video_loret_916.mp4"
                    poster="/assets/cce-juarez/poster_loret_916.jpg"
                    playsInline
                    autoPlay
                    muted
                    loop
                  />

                  {/* Play/Pause Minimal Badge */}
                  <button
                    type="button"
                    className="cce-video-play-badge"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                  >
                    {isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} style={{ marginLeft: '2px' }} />
                    )}
                  </button>
                </div>

                {/* Píldora de Sonido Externa (Debajo del Video) */}
                <button
                  type="button"
                  className={`cce-video-audio-btn-external ${
                    isMuted ? 'cce-audio-btn-muted' : 'cce-audio-btn-active'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={15} />
                      <span>🔊 Toca para escuchar a Carlos Loret de Mola</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} />
                      <span>🔈 Audio activo · Toca para silenciar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Columna Derecha: Columna Editorial */}
              <div className="cce-editorial-col">
                <div className="cce-loret-pill">
                  <Mic size={13} color="#F3E5AB" />
                  <span>CONFERENCIA MAGISTRAL EXCLUSIVA</span>
                </div>

                <h2 id="loret-section-title" className="cce-loret-name">
                  Carlos Loret de Mola Álvarez
                </h2>

                <div className="cce-loret-role">
                  Periodista, Conductor y Analista · Semblanza Oficial
                </div>

                <div className="cce-loret-keynote-box">
                  <span className="cce-keynote-tag">Conferencia Magistral</span>
                  <h3 className="cce-keynote-title cce-gold-shimmer-text">
                    “México y Estados Unidos: Poder, política y economía en tiempos de cambio”
                  </h3>
                </div>

                {/* Semblanza Oficial Oficialmente Acreditada */}
                <div className="cce-loret-semblanza-box">
                  <div className="cce-semblanza-lead">
                    Carlos Loret de Mola es uno de los periodistas más influyentes de México.
                  </div>
                  <p className="cce-semblanza-p">
                    Es fundador de la plataforma Latinus que rápidamente se volvió uno de los medios de comunicación más importantes del país. Ahí conduce todas las noches el programa <em>Loret en Latinus</em>. También tiene un noticiario diario en W Radio y escribe tres veces a la semana la columna <em>Historias de Reportero</em> en el periódico El Universal.
                  </p>
                  <p className="cce-semblanza-p">
                    Loret nunca ha dejado de ser reportero y se le conoce por sus coberturas de guerra y de algunos de los acontecimientos políticos y desastres naturales más graves en la historia reciente.
                  </p>
                  <p className="cce-semblanza-p">
                    Ha escrito libros sobre el narcotráfico y las guerras que ha cubierto, a la vez que ha participado en varios documentales cinematográficos de talla internacional.
                  </p>
                </div>

                <a
                  href="#boletos"
                  onClick={(e) => scrollToSection(e, 'boletos')}
                  className="cce-loret-cta"
                >
                  <span>Asegurar Asiento en la Conferencia</span>
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           SECCIÓN 03: PASE 3D BOLETOS & CARÁTULA BANCARIA SPEI
           ========================================================= */}
        <section
          id="boletos"
          className="cce-tickets-section"
          aria-labelledby="boletos-main-title"
          style={{ scrollMarginTop: '110px' }}
        >
          {/* Cintillo Diagonal en Sección Boletos / Pase 3D */}
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-tickets">
              <div className="cce-band-sub" />
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-3" />
              </div>
            </div>
          </div>

          <div className="cce-section-header">
            <div className="cce-section-pill">
              <Ticket size={13} color="#F3E5AB" />
              <span>Acreditación y Boletos Oficiales</span>
            </div>
            <h2 id="boletos-main-title" className="cce-section-title">
              Pase de Entrada · Desayuno y Magna Conferencia
            </h2>
            <p className="cce-section-subtitle">
              Cupo estrictamente limitado por protocolo de salón. Adquiere tus boletos y asegura tu
              lugar.
            </p>
          </div>

          <div className="cce-tickets-grid">
            {/* The Emerald & Golden Ticket Pass */}
            <div className="cce-ticket-pass" role="region" aria-label="Calculadora oficial de boletos">
              {/* Header Stub */}
              <div className="cce-ticket-top">
                <span className="cce-ticket-folio">FOLIO OFICIAL: #CCE-2026-GAL-OFICIAL</span>
                <span className="cce-ticket-badge">
                  <ShieldCheck size={13} />
                  <span>Cupo Limitado · Centro de Eventos Cibeles</span>
                </span>
              </div>

              {/* Modality Tabs */}
              <div className="cce-modality-tabs" role="tablist" aria-label="Modalidad de boleto">
                <button
                  type="button"
                  role="tab"
                  aria-selected={ticketQuantity < 8}
                  className={`cce-modality-tab ${
                    ticketQuantity < 8 ? 'cce-modality-tab-active' : ''
                  }`}
                  onClick={() => setTicketQuantity(1)}
                >
                  <span>Boleto Individual</span>
                  <span className="cce-tab-sub">($2,500 MXN)</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={ticketQuantity === 8}
                  className={`cce-modality-tab ${
                    ticketQuantity === 8 ? 'cce-modality-tab-active' : ''
                  }`}
                  onClick={() => setTicketQuantity(8)}
                >
                  <span>Mesa Completa 8 Pax</span>
                  <span className="cce-tab-sub">($20,000 MXN)</span>
                </button>
              </div>

              {/* Stepper Controls */}
              <div className="cce-stepper-wrap">
                <span className="cce-stepper-label">Número de Lugares:</span>
                <div className="cce-stepper-controls">
                  <button
                    type="button"
                    className="cce-stepper-btn"
                    onClick={() => setTicketQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={ticketQuantity <= 1}
                    aria-label="Disminuir número de lugares"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="cce-stepper-value">{ticketQuantity}</span>
                  <button
                    type="button"
                    className="cce-stepper-btn"
                    onClick={() => setTicketQuantity((prev) => Math.min(8, prev + 1))}
                    disabled={ticketQuantity >= 8}
                    aria-label="Aumentar número de lugares"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Picks */}
              <div className="cce-quick-picks">
                <button
                  type="button"
                  className={`cce-quick-btn ${ticketQuantity === 1 ? 'cce-quick-btn-active' : ''}`}
                  onClick={() => setTicketQuantity(1)}
                >
                  1 Boleto
                </button>
                <button
                  type="button"
                  className={`cce-quick-btn ${ticketQuantity === 2 ? 'cce-quick-btn-active' : ''}`}
                  onClick={() => setTicketQuantity(2)}
                >
                  2 Boletos
                </button>
                <button
                  type="button"
                  className={`cce-quick-btn ${ticketQuantity === 4 ? 'cce-quick-btn-active' : ''}`}
                  onClick={() => setTicketQuantity(4)}
                >
                  4 Boletos
                </button>
                <button
                  type="button"
                  className={`cce-quick-btn cce-quick-btn-mesa ${ticketQuantity === 8 ? 'cce-quick-btn-active' : ''}`}
                  onClick={() => setTicketQuantity(8)}
                >
                  ⭐ Mesa Completa (8 Pax)
                </button>
              </div>

              {/* Total Calculation Display */}
              <div className="cce-ticket-price-box">
                <div className="cce-ticket-price-tag">Total de Inversión</div>
                <div className="cce-ticket-price-val cce-gold-shimmer-text">
                  ${(ticketQuantity * 2500).toLocaleString('es-MX')} MXN
                </div>
                <div className="cce-ticket-price-note">
                  {ticketQuantity === 8
                    ? 'Incluye Mesa Reservada Completa para 8 Asistentes'
                    : `${ticketQuantity} ${
                        ticketQuantity === 1 ? 'asiento individual reservado' : 'asientos individuales reservados'
                      }`}
                </div>
              </div>

              {/* Scarcity Bar */}
              <div className="cce-scarcity-wrap">
                <div className="cce-scarcity-info">
                  <span>Aforo en Salón Magno Cibeles:</span>
                  <span style={{ color: '#F3E5AB' }}>84% Reservado</span>
                </div>
                <div className="cce-scarcity-bar-bg">
                  <div className="cce-scarcity-bar-fill" style={{ width: '84%' }} />
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="cce-benefits-list">
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Asiento reservado en zona plenaria del Salón Magno en Centro de Eventos Cibeles.</span>
                </div>
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Desayuno empresarial completo de gala.</span>
                </div>
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Acceso formal a la Conferencia Magistral de Carlos Loret de Mola.</span>
                </div>
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Asistencia a la Magna Entrega del Galardón Empresario del Año 2026.</span>
                </div>
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Espacio de vinculación y networking con líderes de la industria y sectores productivos.</span>
                </div>
                <div className="cce-benefit-item">
                  <CheckCircle2 size={16} className="cce-benefit-icon" />
                  <span>Comprobante fiscal deducible al 100% emitido por el CCE.</span>
                </div>
              </div>

              <div className="cce-ticket-footnote">
                * Pases transferibles a directivos y colaboradores. Registro sujeto a validación de comprobante bancario.
              </div>

              <a
                href="#registro"
                onClick={(e) => scrollToSection(e, 'registro')}
                className="cce-ticket-submit-btn"
              >
                <span>
                  Continuar al Registro con {ticketQuantity}{' '}
                  {ticketQuantity === 1 ? 'Lugar' : 'Lugares'} ($
                  {(ticketQuantity * 2500).toLocaleString('es-MX')} MXN)
                </span>
                <ChevronRight size={16} />
              </a>
            </div>

            {/* SPEI Guide & Bank Details Card */}
            <div className="cce-spei-col">
              {/* SPEI Steps Guide */}
              <div className="cce-spei-steps-card">
                <h3 className="cce-spei-steps-title">¿Cómo Adquirir tus Boletos vía SPEI?</h3>
                <p className="cce-spei-steps-sub">
                  Sigue estos 3 pasos para completar tu registro oficial:
                </p>

                <div className="cce-steps-vertical">
                  <div className="cce-step-row">
                    <div className="cce-step-num">1</div>
                    <div className="cce-step-body">
                      <div className="cce-step-body-title">1. Transfiere vía SPEI</div>
                      <div className="cce-step-body-desc">
                        Realiza tu transferencia por el importe exacto a la cuenta bancaria oficial del CCE
                        con tu nombre o empresa en el concepto.
                      </div>
                    </div>
                  </div>

                  <div className="cce-step-row">
                    <div className="cce-step-num">2</div>
                    <div className="cce-step-body">
                      <div className="cce-step-body-title">2. Adjunta tu Comprobante</div>
                      <div className="cce-step-body-desc">
                        Completa el formulario inferior y adjunta tu comprobante de pago en formato imagen o PDF.
                      </div>
                    </div>
                  </div>

                  <div className="cce-step-row">
                    <div className="cce-step-num">3</div>
                    <div className="cce-step-body">
                      <div className="cce-step-body-title">3. Recibe tu Acreditación</div>
                      <div className="cce-step-body-desc">
                        Nuestro sistema generará de inmediato tu número de folio institucional para tu
                        control y acceso al evento.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Bank Account Card */}
              <div className="cce-bank-card">
                <div className="cce-bank-header">
                  <Building2 size={20} color="#D4AF37" />
                  <h4 className="cce-bank-title">Datos Bancarios Oficiales · Transferencia SPEI</h4>
                </div>

                <div className="cce-bank-field">
                  <div className="cce-bank-field-label">Institución Bancaria</div>
                  <div className="cce-bank-field-val" style={{ fontWeight: 800, color: '#FFFFFF' }}>
                    BANORTE
                  </div>
                </div>

                <div className="cce-bank-field">
                  <div className="cce-bank-field-label">Razón Social / Beneficiario</div>
                  <div className="cce-bank-field-val" style={{ fontWeight: 700, color: '#FFFFFF' }}>
                    CONSEJO COORDINADOR EMPRESARIAL DE CIUDAD JUAREZ A.C.
                  </div>
                </div>

                <div className="cce-bank-field">
                  <div className="cce-bank-field-label">RFC Oficial</div>
                  <div className="cce-bank-field-val" style={{ fontFamily: 'monospace', fontWeight: 700, color: '#D4AF37' }}>
                    CCE040526T14
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="cce-bank-field">
                    <div className="cce-bank-field-label">Sucursal</div>
                    <div className="cce-bank-field-val" style={{ fontFamily: 'monospace' }}>
                      204
                    </div>
                  </div>
                  <div className="cce-bank-field">
                    <div className="cce-bank-field-label">Moneda</div>
                    <div className="cce-bank-field-val">
                      Pesos (MXN)
                    </div>
                  </div>
                </div>

                <div className="cce-bank-field">
                  <div className="cce-bank-field-label">Número de Cuenta</div>
                  <div className="cce-bank-field-val" style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                    131 125 8562
                  </div>
                </div>

                <div className="cce-bank-field">
                  <div className="cce-bank-field-label">Concepto Sugerido</div>
                  <div className="cce-bank-field-val" style={{ color: '#F3E5AB' }}>
                    GALARDON [Tu Nombre o Empresa]
                  </div>
                </div>

                {/* CLABE Box with 1-Click Copy */}
                <div className="cce-clabe-box">
                  <div className="cce-bank-field-label">CLABE Interbancaria (18 dígitos)</div>
                  <div className="cce-clabe-num" style={{ letterSpacing: '0.06em' }}>072 164 013 112 585 620</div>
                  <button
                    type="button"
                    className={`cce-btn-copy-clabe ${clabeCopied ? 'cce-btn-copy-success' : ''}`}
                    onClick={copyClabe}
                    aria-label="Copiar CLABE Interbancaria al portapapeles"
                  >
                    {clabeCopied ? (
                      <>
                        <Check size={14} />
                        <span>¡CLABE Copiada al Portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copiar CLABE Interbancaria</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           SECCIÓN 03: DIRECTORIO DE PUNTOS DE VENTA FÍSICOS
           ========================================================= */}
        <section
          id="puntos-venta"
          className="cce-pos-section"
          aria-labelledby="pos-main-title"
          style={{ scrollMarginTop: '110px' }}
        >
          {/* Cintillo Diagonal en Sección Puntos de Venta */}
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-pos">
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-4" />
              </div>
              <div className="cce-band-sub" />
            </div>
          </div>

          <div className="cce-section-header">
            <div className="cce-section-pill">
              <Store size={13} color="#F3E5AB" />
              <span>Adquisición Presencial</span>
            </div>
            <h2 id="pos-main-title" className="cce-section-title" style={{ textWrap: 'balance' }}>
              Puntos de Adquisición Presencial de Boletos
            </h2>
            <p className="cce-section-subtitle">
              Adquiere tus boletos para el evento Empresario del Año 2026 en cualquiera de los siguientes
              puntos de adquisición presencial autorizados en Ciudad Juárez:
            </p>
          </div>

          <div className="cce-pos-grid">
            {/* Tarjeta 1: CMIC */}
            <div className="cce-pos-card">
              <div>
                <div className="cce-pos-top">
                  <div className="cce-pos-icon-wrap" aria-hidden="true">
                    <Building2 size={20} />
                  </div>
                  <span className="cce-pos-badge">Punto de Adquisición Autorizado</span>
                </div>
                <h3 className="cce-pos-name">
                  1. Cámara Mexicana de la Industria de la Construcción (CMIC)
                </h3>
                <p className="cce-pos-address">
                  📍 Blvd. Teófilo Borunda 8471, Bosques del Sol, C.P. 32617, Ciudad Juárez, Chihuahua.
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=CMIC+Ciudad+Juarez+Blvd+Teofilo+Borunda+8471"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-pos-btn"
              >
                <span>Ver Ubicación en Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 2: INDEX Juárez */}
            <div className="cce-pos-card">
              <div>
                <div className="cce-pos-top">
                  <div className="cce-pos-icon-wrap" aria-hidden="true">
                    <Building2 size={20} />
                  </div>
                  <span className="cce-pos-badge">Punto de Adquisición Autorizado</span>
                </div>
                <h3 className="cce-pos-name">2. INDEX Juárez</h3>
                <p className="cce-pos-address">
                  📍 Av. Paseo de la Victoria 3545, Partido Senecú, C.P. 32460, Ciudad Juárez, Chihuahua.
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=INDEX+Juarez+Av+Paseo+de+la+Victoria+3545"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-pos-btn"
              >
                <span>Ver Ubicación en Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 3: Central de Abastos */}
            <div className="cce-pos-card">
              <div>
                <div className="cce-pos-top">
                  <div className="cce-pos-icon-wrap" aria-hidden="true">
                    <Store size={20} />
                  </div>
                  <span className="cce-pos-badge">Punto de Adquisición Autorizado</span>
                </div>
                <h3 className="cce-pos-name">3. Central de Abastos de Ciudad Juárez</h3>
                <p className="cce-pos-address">
                  📍 Oficinas administrativas, Calle Aeronáutica 6910, Jardines del Aeropuerto, C.P.
                  32695, Ciudad Juárez, Chihuahua.
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Central+de+Abastos+Ciudad+Juarez+Calle+Aeronautica+6910"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-pos-btn"
              >
                <span>Ver Ubicación en Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 4: Asociación de Transportistas de Cd. Juárez */}
            <div className="cce-pos-card">
              <div>
                <div className="cce-pos-top">
                  <div className="cce-pos-icon-wrap" aria-hidden="true">
                    <Truck size={20} />
                  </div>
                  <span className="cce-pos-badge">Punto de Adquisición Autorizado</span>
                </div>
                <h3 className="cce-pos-name">4. Asociación de Transportistas de Cd. Juárez</h3>
                <p className="cce-pos-address">
                  📍 Para conocer la ubicación y disponibilidad de boletos, comunícate con nosotros a
                  través de nuestros medios de contacto.
                </p>
              </div>
              <a
                href="https://wa.me/526561803055?text=Hola,%20solicito%20información%20sobre%20boletos%20en%20Asociación%20de%20Transportistas%20de%20Cd.%20Juárez%20para%20Empresario%20del%20Año%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-pos-btn"
              >
                <MessageSquare size={13} />
                <span>Consultar Disponibilidad vía WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bloque de Informes y Atención Directa CCE */}
          <div className="cce-contact-box">
            <h3 className="cce-contact-title">Informes y Atención al Asistente</h3>
            <p className="cce-contact-intro">
              Si deseas adquirir tus boletos o recibir más información sobre el evento, ponemos a tu
              disposición los siguientes canales de contacto:
            </p>

            <div className="cce-contact-channels">
              <a
                href="https://wa.me/526561803055?text=Hola,%20deseo%20adquirir%20boletos%20para%20Empresario%20del%20Año%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="cce-contact-pill"
              >
                <MessageSquare size={16} color="#10B981" />
                <span>WhatsApp Directo: 656 180 3055</span>
              </a>

              <a href="mailto:director@ccejuarez.org" className="cce-contact-pill">
                <Mail size={16} color="#D4AF37" />
                <span>Correo Oficial: director@ccejuarez.org</span>
              </a>
            </div>

            <div className="cce-contact-closing">
              ¡Te esperamos en Empresario del Año 2026!
            </div>
          </div>
        </section>

        {/* Section 04: Formulario de Registro Oficial & Confirmación */}
        <section
          id="registro"
          className="cce-reg-section"
          aria-labelledby="reg-section-title"
          style={{ scrollMarginTop: '110px' }}
        >
          {/* Cintillo Diagonal en Sección Registro */}
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-reg">
              <div className="cce-band-sub" />
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-5" />
              </div>
            </div>
          </div>

          {!isSubmitted ? (
            <div>
              <div className="cce-reg-header">
                <div className="cce-reg-pill">
                  <ShieldCheck size={14} color="#D4AF37" />
                  <span>Registro Oficial de Asistentes</span>
                </div>
                <h2 id="reg-section-title" className="cce-reg-title">
                  Formulario de Acreditación y Comprobante
                </h2>
                <p className="cce-reg-subtitle">
                  Completa la información del comprador o empresa titular y adjunta el comprobante de
                  transferencia SPEI.
                </p>
              </div>

              {isRegistrationClosed && (
                <div
                  style={{
                    margin: '0 auto 24px auto',
                    maxWidth: '860px',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid var(--cce-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                  role="alert"
                >
                  <Clock size={28} color="var(--cce-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--cce-gold)', fontSize: '16px', fontWeight: 800 }}>
                      Periodo Oficial de Acreditaciones Concluido
                    </h3>
                    <p style={{ margin: 0, color: '#E2E8F0', fontSize: '13.5px', lineHeight: 1.45 }}>
                      El registro y acreditación en línea concluyeron formalmente 2 horas después de iniciado el evento (Jueves 19 de Noviembre de 2026, 11:00 A.M.). Para cualquier consulta protocolaria o acceso especial, favor de dirigirse a la mesa de acreditación en Centro de Eventos Cibeles o comunicarse a <a href="mailto:director@ccejuarez.org" style={{ color: 'var(--cce-gold)', textDecoration: 'underline' }}>director@ccejuarez.org</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Ticket Modality Selected Summary */}
              <div className="cce-reg-ticket-summary">
                <div className="cce-reg-ticket-info">
                  <div className="cce-reg-ticket-badge-icon">
                    <Ticket size={22} />
                  </div>
                  <div>
                    <div className="cce-reg-ticket-label">Modalidad Seleccionada</div>
                    <div className="cce-reg-ticket-val">
                      {ticketQuantity === 8
                        ? '⭐ Mesa Corporativa Completa (8 Pax)'
                        : `${ticketQuantity} ${ticketQuantity === 1 ? 'Boleto Individual' : 'Boletos Individuales'}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Disminuir boletos"
                      className="cce-stepper-btn"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '15px', minWidth: '24px', textAlign: 'center', color: '#FFF' }}>
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity((q) => Math.min(8, q + 1))}
                      aria-label="Aumentar boletos"
                      className="cce-stepper-btn"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cce-reg-ticket-total">
                    <div className="cce-reg-ticket-total-label">Inversión Total</div>
                    <div className="cce-reg-ticket-total-val">
                      ${(ticketQuantity * 2500).toLocaleString('es-MX')} MXN
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Form */}
              <form onSubmit={handleFormSubmit} className="cce-form-card" noValidate>
                {formError && (
                  <div className="cce-form-error-banner" role="alert">
                    <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="cce-form-grid">
                  {/* Nombre Completo */}
                  <div className="cce-form-group">
                    <label htmlFor="reg-nombre" className="cce-label">
                      <span>Nombre Completo del Titular o Representante</span>
                      <span className="cce-req-star">*</span>
                    </label>
                    <input
                      id="reg-nombre"
                      type="text"
                      required
                      placeholder="Ej. Ing. Roberto Valenzuela M."
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="cce-input"
                    />
                  </div>

                  {/* Empresa */}
                  <div className="cce-form-group">
                    <label htmlFor="reg-empresa" className="cce-label">
                      <span>Empresa u Organización</span>
                      <span className="cce-req-star">*</span>
                    </label>
                    <input
                      id="reg-empresa"
                      type="text"
                      required
                      placeholder="Ej. Grupo Industrial Fronterizo"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="cce-input"
                    />
                  </div>

                  {/* Cargo */}
                  <div className="cce-form-group">
                    <label htmlFor="reg-cargo" className="cce-label">
                      <span>Cargo o Puesto Directivo</span>
                      <span className="cce-req-star">*</span>
                    </label>
                    <input
                      id="reg-cargo"
                      type="text"
                      required
                      placeholder="Ej. Director General / Vicepresidente"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="cce-input"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="cce-form-group">
                    <label htmlFor="reg-whatsapp" className="cce-label">
                      <span>Teléfono Celular con WhatsApp (10 dígitos)</span>
                      <span className="cce-req-star">*</span>
                    </label>
                    <input
                      id="reg-whatsapp"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Ej. 6561803055"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      className="cce-input"
                    />
                  </div>

                  {/* Email */}
                  <div className="cce-form-group cce-full-width">
                    <label htmlFor="reg-email" className="cce-label">
                      <span>Correo Electrónico para Envío de Acreditación</span>
                      <span className="cce-req-star">*</span>
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="ejemplo@empresa.com.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cce-input"
                    />
                  </div>

                  {/* Asignación de Nombres para los Boletos */}
                  <div className="cce-attendees-section">
                    <div className="cce-attendees-header">
                      <div className="cce-attendees-title">
                        <Users size={16} color="#D4AF37" />
                        <span>Asignación de Nombres para los Boletos ({ticketQuantity})</span>
                      </div>
                      <div className="cce-attendees-options">
                        <button
                          type="button"
                          onClick={() => setAsignarNombresDespues(false)}
                          className={`cce-opt-btn ${!asignarNombresDespues ? 'cce-opt-active' : ''}`}
                        >
                          Capturar nombres ahora
                        </button>
                        <button
                          type="button"
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
                              placeholder={idx === 0 ? nombre || 'Nombre del Asistente 1 (Titular)' : `Nombre del Asistente #${idx + 1}`}
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
                        📌 Los nombres de los {ticketQuantity} asistentes podrán ser proporcionados y coordinados directamente con la dirección del CCE antes del evento vía WhatsApp.
                      </p>
                    )}
                  </div>

                  {/* Drag and Drop Upload Area */}
                  <div className="cce-upload-wrap">
                    <label className="cce-label" style={{ marginBottom: '8px' }}>
                      <span>Adjuntar Comprobante de Transferencia SPEI</span>
                      <span className="cce-req-star">*</span>
                    </label>

                    <div
                      className={`cce-upload-zone ${isDragging ? 'cce-drag-over' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
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
                        Arrastra tu archivo aquí o haz clic para seleccionarlo
                      </div>
                      <div className="cce-upload-desc">
                        Formatos soportados: PNG, JPG, JPEG, WebP o PDF (tamaño máximo: 10 MB)
                      </div>
                    </div>

                    {comprobanteFileName && (
                      <div className="cce-upload-success-card">
                        <div className="cce-upload-file-info">
                          <CheckCircle2 size={18} color="#10B981" />
                          <span>✓ Comprobante adjuntado correctamente: {comprobanteFileName}</span>
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
                          Quitar archivo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Facturación Electrónica CFDI 4.0 */}
                  <div className="cce-factura-toggle-box">
                    <div
                      className="cce-factura-toggle-row"
                      onClick={() => setRequiereFactura((v) => !v)}
                    >
                      <div className="cce-factura-toggle-info">
                        <FileText size={20} color="#D4AF37" />
                        <div>
                          <div className="cce-factura-title">
                            ¿Requiere Factura Fiscal Electrónica (CFDI)?
                          </div>
                          <div className="cce-factura-sub">
                            El CCE emitirá su factura electrónica con los datos proporcionados.
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
                          <label htmlFor="reg-rfc" className="cce-label">
                            <span>RFC</span>
                            <span className="cce-req-star">*</span>
                          </label>
                          <input
                            id="reg-rfc"
                            type="text"
                            maxLength={13}
                            placeholder="Ej. CCE880101XYZ"
                            value={rfc}
                            onChange={(e) => setRfc(e.target.value.toUpperCase())}
                            className="cce-input"
                          />
                        </div>

                        <div className="cce-form-group">
                          <label htmlFor="reg-razon" className="cce-label">
                            <span>Razón Social</span>
                            <span className="cce-req-star">*</span>
                          </label>
                          <input
                            id="reg-razon"
                            type="text"
                            placeholder="Tal como aparece en Constancia Fiscal"
                            value={razonSocial}
                            onChange={(e) => setRazonSocial(e.target.value)}
                            className="cce-input"
                          />
                        </div>

                        <div className="cce-form-group">
                          <label htmlFor="reg-regimen" className="cce-label">
                            <span>Régimen Fiscal</span>
                            <span className="cce-req-star">*</span>
                          </label>
                          <select
                            id="reg-regimen"
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
                            <option value="621 Incorporación Fiscal">
                              621 Incorporación Fiscal
                            </option>
                          </select>
                        </div>

                        <div className="cce-form-group">
                          <label htmlFor="reg-usocfdi" className="cce-label">
                            <span>Uso de CFDI</span>
                            <span className="cce-req-star">*</span>
                          </label>
                          <select
                            id="reg-usocfdi"
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
                          <label htmlFor="reg-cp" className="cce-label">
                            <span>Código Postal Fiscal</span>
                            <span className="cce-req-star">*</span>
                          </label>
                          <input
                            id="reg-cp"
                            type="text"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formSubmitting || isRegistrationClosed}
                  className="cce-btn-submit"
                  style={isRegistrationClosed ? { opacity: 0.6, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                >
                  {isRegistrationClosed ? (
                    <>
                      <Clock size={18} />
                      <span>Periodo de Registro Concluido</span>
                    </>
                  ) : formSubmitting ? (
                    <>
                      <RefreshCw size={18} className="cce-spinner" />
                      <span>Validando comprobante y generando folio oficial...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>Completar Registro y Enviar Comprobante</span>
                    </>
                  )}
                </button>

                <p className="cce-form-disclaimer">
                  * Al enviar este formulario, tu lugar queda apartado de forma inmediata. El equipo de administración del CCE validará la recepción de la transferencia en un plazo de 24 a 48 horas.
                </p>
              </form>
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="cce-confirm-card">
              <div className="cce-confirm-seal">
                <CheckCircle2 size={16} />
                <span>✓ REGISTRO RECIBIDO · COMPROBANTE EN PROCESO DE VALIDACIÓN</span>
              </div>

              <h2 className="cce-confirm-title">
                ¡Gracias por tu Registro Oficial!
              </h2>

              {/* Folio Control Box */}
              <div className="cce-folio-box">
                <div className="cce-folio-label">FOLIO INSTITUCIONAL DE CONTROL</div>
                <div className="cce-folio-row">
                  <span className="cce-folio-code">{confirmedRecord?.folio}</span>
                  <button
                    type="button"
                    onClick={copyFolio}
                    className="cce-folio-copy-btn"
                  >
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
                Hemos recibido exitosamente tus datos y el comprobante de transferencia bancaria para el evento{' '}
                <strong>Empresario del Año 2026</strong>. Tu lugar se encuentra formalmente apartado en Centro de Eventos Cibeles.
              </p>

              {/* Summary Card */}
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
                  <span className="cce-confirm-field-label">Boletos Solicitados</span>
                  <span className="cce-confirm-field-val">
                    {confirmedRecord?.boletos} {confirmedRecord?.boletos === 1 ? 'Boleto' : 'Boletos'} (${confirmedRecord?.totalMonto.toLocaleString('es-MX')} MXN)
                  </span>
                </div>

                <div className="cce-confirm-field">
                  <span className="cce-confirm-field-label">Modalidad</span>
                  <span className="cce-confirm-field-val">
                    {confirmedRecord?.boletos === 8
                      ? '⭐ Mesa Corporativa (8 Pax)'
                      : `${confirmedRecord?.boletos || 1} ${
                          confirmedRecord?.boletos === 1 ? 'Boleto Individual General' : 'Boletos Individuales'
                        }`}
                  </span>
                </div>

                <div className="cce-confirm-field">
                  <span className="cce-confirm-field-label">Fecha y Horario</span>
                  <span className="cce-confirm-field-val">Jueves 19 Nov 2026 · Registro 8:30 a.m. | Inicio 9:00 a.m.</span>
                </div>

                <div className="cce-confirm-field">
                  <span className="cce-confirm-field-label">Sede Oficial & Protocolo</span>
                  <span className="cce-confirm-field-val">Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450) · Vestimenta Formal</span>
                </div>

                <div className="cce-confirm-field cce-full">
                  <span className="cce-confirm-field-label">Comprobante SPEI Adjunto</span>
                  <span className="cce-confirm-field-val" style={{ fontFamily: 'monospace' }}>
                    📎 {confirmedRecord?.comprobanteFileName}
                  </span>
                </div>
              </div>

              {/* Calendar & Map Actions */}
              <div className="cce-confirm-actions">
                <a
                  href={googleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn-cal cce-btn-cal-google"
                >
                  <CalendarPlus size={16} />
                  <span>Añadir a Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={downloadIcs}
                  className="cce-btn-cal cce-btn-cal-apple"
                >
                  <Download size={16} />
                  <span>Descargar Apple Calendar (.ics)</span>
                </button>

                <a
                  href="https://maps.google.com/?q=Centro+de+Eventos+Cibeles+Av+Valle+de+Juarez+6839+Ciudad+Juarez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn-cal cce-btn-cal-map"
                >
                  <MapPin size={16} />
                  <span>Cómo llegar (Google Maps a Cibeles)</span>
                </a>
              </div>

              <p className="cce-confirm-note">
                Para cualquier duda o aclaración sobre tu acreditación, puedes comunicarte a la línea oficial de WhatsApp del CCE al{' '}
                <a
                  href={`https://wa.me/526561803055?text=Hola,%20solicito%20información%20sobre%20mi%20registro%20de%20acreditación%20con%20Folio:%20${encodeURIComponent(confirmedRecord?.folio || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#10B981', fontWeight: 800, textDecoration: 'underline' }}
                >
                  656 180 3055
                </a>{' '}
                indicando tu número de folio.
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setConfirmedRecord(null);
                  setComprobanteFile(null);
                  setComprobanteFileName('');
                  setComprobantePreview('');
                }}
                className="cce-btn-new-reg"
              >
                ← Realizar otro registro o adquirir más boletos
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  )}

      {/* Private CRM Dashboard View (Sprint 4) */}
      {isAdmin && crmView === 'crm' && (
        <div className="cce-crm-view-container">
          <div className="cce-crm-top-bar">
            <div>
              <div className="cce-reg-pill" style={{ marginBottom: '6px' }}>
                <ShieldCheck size={13} color="#D4AF37" />
                <span>Panel de Acreditaciones Privado</span>
              </div>
              <h2 className="cce-crm-header-title">
                Consola de Acreditaciones · CCE Galardón 2026
              </h2>
              <p className="cce-crm-header-sub">
                Telemetría en tiempo real, validación de comprobantes SPEI y control de aforo para Centro de Eventos Cibeles.
              </p>
            </div>

            <div className="cce-crm-top-actions">
              <button
                type="button"
                onClick={fetchCrmData}
                disabled={crmLoading}
                className="cce-crm-action-btn"
              >
                <RefreshCw size={14} className={crmLoading ? 'cce-spinner' : ''} />
                <span>Actualizar Datos</span>
              </button>

              <button
                type="button"
                onClick={exportCrmCsv}
                className="cce-crm-action-btn"
                style={{ background: 'rgba(212, 175, 55, 0.25)', borderColor: 'var(--cce-gold)' }}
              >
                <FileSpreadsheet size={15} color="#D4AF37" />
                <span>Descargar Listado Completo en Excel (CSV)</span>
              </button>
            </div>
          </div>

          {/* Live Telemetry Radar Banner (Cloud Firestore) */}
          <div className="cce-crm-telemetry-banner">
            <div className="cce-crm-telemetry-header">
              <div className="cce-crm-telemetry-title">
                <span className="cce-pulse-dot" />
                <span>Radar de Tráfico & Telemetría en Vivo · Cloud Firestore</span>
              </div>
              <div className="cce-crm-telemetry-status">
                <Activity size={13} color="#10B981" />
                <span>Sincronización directa (tecza-admin-26)</span>
              </div>
            </div>

            <div className="cce-crm-telemetry-grid">
              <div className="cce-crm-telem-card">
                <div className="cce-crm-telem-top">
                  <span className="cce-crm-telem-label">Visitas Totales</span>
                  <Eye size={15} color="#D4AF37" />
                </div>
                <div className="cce-crm-telem-num">{telemetry?.totalVisits ?? 0}</div>
                <div className="cce-crm-telem-sub">Lecturas de radar en landing</div>
              </div>

              <div className="cce-crm-telem-card">
                <div className="cce-crm-telem-top">
                  <span className="cce-crm-telem-label">Visitantes Únicos</span>
                  <Users size={15} color="#38BDF8" />
                </div>
                <div className="cce-crm-telem-num">{telemetry?.uniqueVisits ?? 0}</div>
                <div className="cce-crm-telem-sub">IPs únicas registradas</div>
              </div>

              <div className="cce-crm-telem-card">
                <div className="cce-crm-telem-top">
                  <span className="cce-crm-telem-label">Tasa de Conversión</span>
                  <TrendingUp size={15} color="#10B981" />
                </div>
                <div className="cce-crm-telem-num" style={{ color: '#34D399' }}>
                  {telemetry?.conversionRate ?? '0%'}
                </div>
                <div className="cce-crm-telem-sub">Comprobantes / Visitas</div>
              </div>

              <div className="cce-crm-telem-card cce-crm-telem-devices-card">
                <div className="cce-crm-telem-top">
                  <span className="cce-crm-telem-label">Desglose de Dispositivos</span>
                  <Laptop size={15} color="#F59E0B" />
                </div>
                <div className="cce-crm-devices-pills">
                  <span className="cce-dev-pill"><Smartphone size={12} /> iOS: {telemetry?.devices?.ios ?? 0}</span>
                  <span className="cce-dev-pill"><Smartphone size={12} /> Android: {telemetry?.devices?.android ?? 0}</span>
                  <span className="cce-dev-pill"><Laptop size={12} /> PC/Mac: {telemetry?.devices?.desktop ?? 0}</span>
                </div>
                <div className="cce-crm-devices-bar">
                  <div
                    style={{
                      width: `${Math.round(((telemetry?.devices?.ios || 0) / Math.max(1, (telemetry?.totalVisits || 1))) * 100)}%`,
                      background: '#38BDF8',
                    }}
                    title={`iOS: ${telemetry?.devices?.ios || 0}`}
                  />
                  <div
                    style={{
                      width: `${Math.round(((telemetry?.devices?.android || 0) / Math.max(1, (telemetry?.totalVisits || 1))) * 100)}%`,
                      background: '#34D399',
                    }}
                    title={`Android: ${telemetry?.devices?.android || 0}`}
                  />
                  <div
                    style={{
                      width: `${Math.round(((telemetry?.devices?.desktop || 0) / Math.max(1, (telemetry?.totalVisits || 1))) * 100)}%`,
                      background: '#F59E0B',
                    }}
                    title={`Desktop: ${telemetry?.devices?.desktop || 0}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Stat Cards */}
          <div className="cce-crm-stats-grid">
            <div className="cce-crm-stat-card">
              <div className="cce-crm-stat-top">
                <span className="cce-crm-stat-label">Recaudación Acumulada</span>
                <div className="cce-crm-stat-icon">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="cce-crm-stat-val">
                ${(telemetry?.totalRecaudado || 0).toLocaleString('es-MX')} MXN
              </div>
              <div className="cce-crm-stat-sub">Ingresos confirmados SPEI</div>
            </div>

            <div className="cce-crm-stat-card">
              <div className="cce-crm-stat-top">
                <span className="cce-crm-stat-label">Boletos Registrados</span>
                <div className="cce-crm-stat-icon">
                  <Ticket size={18} />
                </div>
              </div>
              <div className="cce-crm-stat-val">
                {telemetry?.totalBoletos || 0} / 800
              </div>
              <div className="cce-crm-stat-sub">
                {Math.round(((telemetry?.totalBoletos || 0) / 800) * 100)}% del aforo de Cibeles
              </div>
            </div>

            <div className="cce-crm-stat-card">
              <div className="cce-crm-stat-top">
                <span className="cce-crm-stat-label">Mesas Corporativas</span>
                <div className="cce-crm-stat-icon">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="cce-crm-stat-val">
                {telemetry?.totalMesas || 0} Mesas
              </div>
              <div className="cce-crm-stat-sub">8 personas por mesa</div>
            </div>

            <div className="cce-crm-stat-card">
              <div className="cce-crm-stat-top">
                <span className="cce-crm-stat-label">Comprobantes Pendientes</span>
                <div className="cce-crm-stat-icon" style={{ color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                  <AlertCircle size={18} />
                </div>
              </div>
              <div className="cce-crm-stat-val" style={{ color: '#FCD34D' }}>
                {telemetry?.comprobantesPendientes || 0}
              </div>
              <div className="cce-crm-stat-sub" style={{ color: '#94A3B8' }}>
                {telemetry?.comprobantesValidados || 0} validados
              </div>
            </div>
          </div>

          {/* CRM Controls: Search & Filters */}
          <div className="cce-crm-controls">
            <div className="cce-crm-search-box">
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Buscar por titular, empresa, folio o WhatsApp..."
                value={crmSearch}
                onChange={(e) => setCrmSearch(e.target.value)}
                className="cce-crm-search-input"
              />
            </div>

            <div className="cce-crm-filters">
              <button
                type="button"
                onClick={() => setCrmFilter('todos')}
                className={`cce-crm-filter-pill ${crmFilter === 'todos' ? 'cce-filter-active' : ''}`}
              >
                Todos ({crmRegistrations.length})
              </button>
              <button
                type="button"
                onClick={() => setCrmFilter('pendiente')}
                className={`cce-crm-filter-pill ${crmFilter === 'pendiente' ? 'cce-filter-active' : ''}`}
              >
                ⏳ Pendientes ({crmRegistrations.filter((r) => r.status !== 'validado').length})
              </button>
              <button
                type="button"
                onClick={() => setCrmFilter('validado')}
                className={`cce-crm-filter-pill ${crmFilter === 'validado' ? 'cce-filter-active' : ''}`}
              >
                ✓ Validados ({crmRegistrations.filter((r) => r.status === 'validado').length})
              </button>
            </div>
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="cce-crm-desktop-table">
            <div className="cce-crm-table-card">
              <div className="cce-crm-table-scroll">
                <table className="cce-crm-table">
                  <thead>
                    <tr>
                      <th>Folio & Fecha</th>
                      <th>Titular & Cargo</th>
                      <th>Empresa</th>
                      <th>Contacto</th>
                      <th>Boletos & Total</th>
                      <th>Comprobante</th>
                      <th>Factura CFDI</th>
                      <th>Estatus SPEI</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmRegistrations
                      .filter((reg) => {
                        if (crmFilter === 'pendiente') return reg.status !== 'validado';
                        if (crmFilter === 'validado') return reg.status === 'validado';
                        return true;
                      })
                      .filter((reg) => {
                        if (!crmSearch.trim()) return true;
                        const q = crmSearch.toLowerCase();
                        return (
                          reg.folio?.toLowerCase().includes(q) ||
                          reg.nombre?.toLowerCase().includes(q) ||
                          reg.empresa?.toLowerCase().includes(q) ||
                          reg.whatsapp?.includes(q) ||
                          reg.email?.toLowerCase().includes(q)
                        );
                      })
                      .map((reg) => (
                        <tr key={reg.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--cce-gold)', fontFamily: 'monospace' }}>
                              {reg.folio}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{reg.fecha}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{reg.nombre}</div>
                            <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>{reg.cargo}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{reg.empresa}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{reg.location}</div>
                          </td>
                          <td>
                            <div>
                              <a
                                href={`https://wa.me/52${reg.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#34D399', textDecoration: 'none', fontWeight: 700 }}
                              >
                                📱 {reg.whatsapp}
                              </a>
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{reg.email}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800 }}>
                              {reg.boletos} {reg.boletos === 1 ? 'Boleto' : 'Boletos'}
                            </div>
                            <div style={{ color: 'var(--cce-gold-light)', fontWeight: 800, fontFamily: 'monospace' }}>
                              ${reg.totalMonto?.toLocaleString('es-MX')} MXN
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => setSelectedComprobante(reg)}
                              className="cce-crm-doc-btn"
                            >
                              <Eye size={12} />
                              <span>Ver Archivo</span>
                            </button>
                          </td>
                          <td>
                            {reg.requiereFactura ? (
                              <span style={{ fontSize: '11.5px', color: '#6EE7B7' }}>
                                ✓ RFC: <code>{reg.facturaData?.rfc}</code>
                              </span>
                            ) : (
                              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                                Sin factura
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              disabled={updatingId === reg.id}
                              onClick={() => toggleStatus(reg.id, reg.status)}
                              className={`cce-crm-badge-status ${
                                reg.status === 'validado'
                                  ? 'cce-status-validado'
                                  : 'cce-status-pendiente'
                              }`}
                            >
                              {reg.status === 'validado' ? (
                                <>
                                  <CheckCircle2 size={12} />
                                  <span>Validado</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={12} />
                                  <span>Pendiente</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td>
                            <a
                              href={getCrmWhatsAppUrl(reg)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cce-crm-wa-btn"
                              title="Enviar WhatsApp de confirmación oficial"
                            >
                              <MessageSquare size={13} />
                              <span>Confirmar WA</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    {crmRegistrations.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                          No hay registros de acreditación capturados hasta el momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Cards View (< 768px) */}
          <div className="cce-crm-mobile-cards">
            {crmRegistrations
              .filter((reg) => {
                if (crmFilter === 'pendiente') return reg.status !== 'validado';
                if (crmFilter === 'validado') return reg.status === 'validado';
                return true;
              })
              .filter((reg) => {
                if (!crmSearch.trim()) return true;
                const q = crmSearch.toLowerCase();
                return (
                  reg.folio?.toLowerCase().includes(q) ||
                  reg.nombre?.toLowerCase().includes(q) ||
                  reg.empresa?.toLowerCase().includes(q) ||
                  reg.whatsapp?.includes(q) ||
                  reg.email?.toLowerCase().includes(q)
                );
              })
              .map((reg) => (
                <div key={reg.id} className="cce-crm-card">
                  <div className="cce-crm-card-header">
                    <div>
                      <div className="cce-crm-card-folio">{reg.folio}</div>
                      <div className="cce-crm-card-fecha">{reg.fecha}</div>
                    </div>
                    <button
                      type="button"
                      disabled={updatingId === reg.id}
                      onClick={() => toggleStatus(reg.id, reg.status)}
                      className={`cce-crm-badge-status ${
                        reg.status === 'validado' ? 'cce-status-validado' : 'cce-status-pendiente'
                      }`}
                    >
                      {reg.status === 'validado' ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Validado</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span>Pendiente</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="cce-crm-card-body">
                    <div className="cce-crm-card-name">{reg.nombre}</div>
                    <div className="cce-crm-card-role">
                      {reg.cargo} · <strong style={{ color: '#F1F5F9' }}>{reg.empresa}</strong>
                    </div>
                    <div className="cce-crm-card-loc">{reg.location}</div>

                    <div className="cce-crm-card-details">
                      <div className="cce-crm-card-detail-item">
                        <span className="cce-crm-card-detail-label">Modalidad:</span>
                        <span className="cce-crm-card-detail-val">
                          {reg.boletos} {reg.boletos === 1 ? 'Boleto' : 'Boletos'} ({reg.tipoBoleto === 'mesa' ? 'Mesa 8 Pax' : 'Individual'})
                        </span>
                      </div>
                      <div className="cce-crm-card-detail-item">
                        <span className="cce-crm-card-detail-label">Total Monto:</span>
                        <span className="cce-crm-card-detail-val" style={{ color: 'var(--cce-gold)', fontWeight: 800 }}>
                          ${reg.totalMonto?.toLocaleString('es-MX')} MXN
                        </span>
                      </div>
                      <div className="cce-crm-card-detail-item">
                        <span className="cce-crm-card-detail-label">Contacto:</span>
                        <span className="cce-crm-card-detail-val">
                          <a
                            href={`https://wa.me/52${reg.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#34D399', textDecoration: 'none', fontWeight: 700 }}
                          >
                            📱 {reg.whatsapp}
                          </a>
                        </span>
                      </div>
                      <div className="cce-crm-card-detail-item">
                        <span className="cce-crm-card-detail-label">Factura:</span>
                        <span className="cce-crm-card-detail-val">
                          {reg.requiereFactura ? `✓ RFC: ${reg.facturaData?.rfc || ''}` : 'Sin factura'}
                        </span>
                      </div>
                    </div>

                    <div className="cce-crm-card-actions">
                      <button
                        type="button"
                        onClick={() => setSelectedComprobante(reg)}
                        className="cce-crm-card-btn cce-crm-btn-doc"
                      >
                        <Eye size={14} />
                        <span>Ver Comprobante SPEI</span>
                      </button>

                      <a
                        href={getCrmWhatsAppUrl(reg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cce-crm-card-btn cce-crm-btn-wa"
                      >
                        <MessageSquare size={14} />
                        <span>Confirmar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            {crmRegistrations.length === 0 && (
              <div className="cce-crm-empty">
                No hay registros de acreditación capturados hasta el momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comprobante Preview Modal */}
      {selectedComprobante && (
        <div className="cce-modal-overlay" onClick={() => setSelectedComprobante(null)}>
          <div className="cce-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cce-modal-header">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--cce-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Auditoría de Comprobante Bancario
                </div>
                <h3 className="cce-modal-title">
                  {selectedComprobante.folio} · {selectedComprobante.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComprobante(null)}
                className="cce-modal-close-btn"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cce-modal-meta-grid">
              <div className="cce-modal-meta-box">
                <span className="cce-modal-meta-lbl">Empresa & Cargo:</span>
                <span className="cce-modal-meta-val">{selectedComprobante.empresa} ({selectedComprobante.cargo})</span>
              </div>
              <div className="cce-modal-meta-box">
                <span className="cce-modal-meta-lbl">Inversión & Boletos:</span>
                <span className="cce-modal-meta-val" style={{ color: 'var(--cce-gold-light)', fontWeight: 800 }}>
                  ${selectedComprobante.totalMonto?.toLocaleString('es-MX')} MXN · {selectedComprobante.boletos} boletos
                </span>
              </div>
              <div className="cce-modal-meta-box">
                <span className="cce-modal-meta-lbl">Archivo Registrado:</span>
                <span className="cce-modal-meta-val" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  {selectedComprobante.comprobanteFileName}
                </span>
              </div>
              <div className="cce-modal-meta-box">
                <span className="cce-modal-meta-lbl">Estatus SPEI Actual:</span>
                <span
                  className="cce-modal-meta-val"
                  style={{
                    color: selectedComprobante.status === 'validado' ? '#34D399' : '#FCD34D',
                    fontWeight: 800,
                  }}
                >
                  {selectedComprobante.status === 'validado' ? '✓ Validado Oficialmente' : '⏳ Pendiente de Verificación'}
                </span>
              </div>
            </div>

            {selectedComprobante.comprobanteUrl &&
            !selectedComprobante.comprobanteFileName?.toLowerCase().endsWith('.pdf') &&
            !selectedComprobante.comprobanteUrl.startsWith('data:application/pdf') ? (
              <div className="cce-modal-preview-box">
                <img
                  src={selectedComprobante.comprobanteUrl}
                  alt={`Comprobante ${selectedComprobante.folio}`}
                  style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }}
                />
              </div>
            ) : selectedComprobante.comprobanteUrl &&
              (selectedComprobante.comprobanteFileName?.toLowerCase().endsWith('.pdf') ||
                selectedComprobante.comprobanteUrl.startsWith('data:application/pdf')) ? (
              <div className="cce-modal-preview-fallback">
                <FileText size={48} color="#D4AF37" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '15px' }}>
                  Documento Bancario Oficial (SPEI)
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '12px', marginTop: '4px' }}>
                  <code>{selectedComprobante.comprobanteFileName}</code>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a
                    href={selectedComprobante.comprobanteUrl}
                    download={selectedComprobante.comprobanteFileName || 'comprobante_spei.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cce-crm-action-btn"
                    style={{ background: 'rgba(212, 175, 55, 0.25)', borderColor: 'var(--cce-gold)' }}
                  >
                    <Download size={14} />
                    <span>Descargar Comprobante PDF</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="cce-modal-preview-fallback">
                <FileText size={44} color="#D4AF37" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ color: '#F8FAFC', fontWeight: 700 }}>
                  Archivo Adjunto: <code>{selectedComprobante.comprobanteFileName}</code>
                </div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: '#94A3B8' }}>
                  Comprobante digital transmitido mediante la plataforma institucional del CCE Juárez.
                </div>
              </div>
            )}

            <div className="cce-modal-actions-row">
              <a
                href={getCrmWhatsAppUrl(selectedComprobante)}
                target="_blank"
                rel="noopener noreferrer"
                className="cce-crm-action-btn"
                style={{ background: 'rgba(16, 185, 129, 0.25)', borderColor: '#10B981', color: '#34D399' }}
              >
                <MessageSquare size={14} />
                <span>Contactar vía WhatsApp</span>
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    toggleStatus(selectedComprobante.id, selectedComprobante.status);
                  }}
                  className="cce-crm-action-btn"
                  style={{
                    background: selectedComprobante.status === 'validado' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.35)',
                    borderColor: selectedComprobante.status === 'validado' ? '#F59E0B' : '#10B981',
                    color: selectedComprobante.status === 'validado' ? '#FCD34D' : '#34D399',
                  }}
                >
                  {selectedComprobante.status === 'validado' ? (
                    <>
                      <Clock size={14} />
                      <span>Revertir a Pendiente</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>✓ Validar Comprobante</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedComprobante(null)}
                  className="cce-crm-action-btn"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer (Propuesta 1: Cúpula Empresarial Modular) */}
      <footer className="cce-footer">
        {/* Cintillo Superior en Footer */}
        <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
          <div className="cce-sash-footer">
            <div className="cce-band-main-sash">
              <div className="cce-band-sheen cce-sheen-delay-6" />
            </div>
            <div className="cce-band-sub" />
          </div>
        </div>

        <div className="cce-footer-container">
          <div className="cce-footer-grid">
            {/* Columna 1: Identidad & Organismo Cúpula */}
            <div className="cce-footer-col cce-footer-col-main">
              <div className="cce-footer-brand">
                <Image
                  src="/assets/cce-juarez/cce_logo_hero_white.svg"
                  alt="Consejo Coordinador Empresarial Ciudad Juárez"
                  width={400}
                  height={220}
                  unoptimized
                  style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              <div className="cce-footer-motto">
                “Liderazgo que impulsa el futuro en Juárez”
              </div>

              <p className="cce-footer-text">
                Órgano de concertación y representación del sector productivo privado de Ciudad Juárez.
                Articula el liderazgo empresarial para impulsar la competitividad, la atracción de inversión,
                la certidumbre jurídica y el desarrollo socioeconómico sostenible en la frontera binacional.
              </p>

              <div className="cce-footer-contact-inline">
                <Mail size={14} color="#D4AF37" />
                <a href="mailto:director@ccejuarez.org" className="cce-footer-link-highlight">
                  director@ccejuarez.org
                </a>
              </div>
            </div>

            {/* Columna 2: Cámaras y Organismos Coordinados */}
            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <Building2 size={15} color="#D4AF37" />
                <span>Organismos Coordinados</span>
              </h4>
              <ul className="cce-footer-list">
                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/index_juarez.png"
                      alt="INDEX Juárez"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">INDEX Juárez</span>
                    <span className="cce-org-desc">Industria Manufacturera y de Exportación</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/cmic_juarez_clean.png"
                      alt="CMIC Juárez"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">CMIC Juárez</span>
                    <span className="cce-org-desc">Cámara Mexicana de la Industria de la Construcción</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/canacar_transportistas.svg"
                      alt="Asociación de Transportistas / CANACAR"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">Asociación de Transportistas de Cd. Juárez</span>
                    <span className="cce-org-desc">Sector Autotransporte y Logística de Carga</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/central_abastos_juarez.svg"
                      alt="Central de Abastos de Cd. Juárez"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">Central de Abastos de Cd. Juárez</span>
                    <span className="cce-org-desc">Comercio Mayorista, Abasto y Distribución</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/amexme_juarez.svg"
                      alt="AMEXME Juárez"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">AMEXME Juárez</span>
                    <span className="cce-org-desc">Asociación Mexicana de Mujeres Empresarias</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/ampi_juarez_clean.png"
                      alt="AMPI Juárez"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">AMPI Juárez</span>
                    <span className="cce-org-desc">Asociación Mexicana de Profesionales Inmobiliarios</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/evm_juarez.png"
                      alt="EVM"
                      width={28}
                      height={28}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">EVM</span>
                    <span className="cce-org-desc">Ejecutivos de Ventas y Mercadotecnia</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Columna 3: Evento Magno & Protocolo */}
            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <Calendar size={15} color="#D4AF37" />
                <span>Galardones & Conferencia</span>
              </h4>
              <ul className="cce-footer-list">
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Calendar size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Fecha</span>
                    <span className="cce-footer-info-val">Jueves 19 de Noviembre 2026</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Clock size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Horario</span>
                    <span className="cce-footer-info-val">8:30 A.M. Registro · 9:00 A.M. Desayuno</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><MapPin size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Sede Oficial</span>
                    <span className="cce-footer-info-val">Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450)</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Award size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Protocolo</span>
                    <span className="cce-footer-info-val">Vestimenta Formal</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><MessageSquare size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Línea de Acreditaciones</span>
                    <a href="https://wa.me/526561803055" target="_blank" rel="noopener noreferrer" className="cce-footer-info-val" style={{ textDecoration: 'underline' }}>
                      +52 (656) 180 3055
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Columna 4: Navegación & Marco Legal */}
            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <ShieldCheck size={15} color="#D4AF37" />
                <span>Navegación & Marco Legal</span>
              </h4>
              <ul className="cce-footer-list">
                <li>
                  <a href="#galardones" onClick={(e) => scrollToSection(e, 'galardones')} className="cce-footer-nav-link">
                    → Entrega de Galardones 2026
                  </a>
                </li>
                <li>
                  <a href="#video-loret" onClick={(e) => scrollToSection(e, 'video-loret')} className="cce-footer-nav-link">
                    → Conferencia Carlos Loret de Mola
                  </a>
                </li>
                <li>
                  <a href="#boletos" onClick={(e) => scrollToSection(e, 'boletos')} className="cce-footer-nav-link">
                    → Boletos y Mesas Corporativas
                  </a>
                </li>
                <li>
                  <a href="#puntos-venta" onClick={(e) => scrollToSection(e, 'puntos-venta')} className="cce-footer-nav-link">
                    → Puntos de Adquisición Presencial
                  </a>
                </li>
                <li>
                  <a href="#registro" onClick={(e) => scrollToSection(e, 'registro')} className="cce-footer-nav-link">
                    → Registro y Facturación CFDI 4.0
                  </a>
                </li>
                <li style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="cce-footer-privacy-btn"
                  >
                    ⚖️ Aviso de Privacidad Integral (LFPDPPP)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="cce-footer-bottom">
            <div className="cce-footer-copy">
              © 2026 Consejo Coordinador Empresarial de Ciudad Juárez · Plataforma Oficial de Acreditación.
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Aviso de Privacidad Integral */}
      {showPrivacyModal && (
        <div
          className="cce-crm-modal-backdrop"
          onClick={() => setShowPrivacyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
        >
          <div
            className="cce-privacy-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cce-privacy-modal-header">
              <div>
                <span className="cce-privacy-badge">Marco Jurídico Institucional</span>
                <h3 id="privacy-modal-title" className="cce-privacy-title">
                  Aviso de Privacidad Integral
                </h3>
                <span className="cce-privacy-sub">
                  Consejo Coordinador Empresarial de Ciudad Juárez · Evento Galardones 2026
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="cce-crm-modal-close"
                aria-label="Cerrar aviso de privacidad"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cce-privacy-modal-body">
              <p>
                En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, el <strong>Consejo Coordinador Empresarial de Ciudad Juárez</strong>, como organismo cúpula empresarial responsable del tratamiento de sus datos personales, emite el presente Aviso de Privacidad:
              </p>

              <h4>1. Finalidad del Tratamiento de Datos</h4>
              <p>
                Los datos personales recabados mediante esta plataforma (nombre completo, empresa, cargo directivo, teléfono de WhatsApp, correo electrónico, datos de facturación CFDI 4.0 y comprobantes de transferencia bancaria SPEI) serán utilizados exclusivamente para:
              </p>
              <ul>
                <li>Control y emisión de folios oficiales de acreditación para la Entrega de Galardones 2026 y Conferencia Magistral.</li>
                <li>Asignación de asientos y mesas corporativas en el Centro de Eventos Cibeles.</li>
                <li>Validación y conciliación de pagos bancarios.</li>
                <li>Emisión y timbrado de comprobantes fiscales digitales (CFDI 4.0).</li>
                <li>Notificaciones protocolarias de logística y confirmación vía WhatsApp y correo institucional.</li>
              </ul>

              <h4>2. Transferencia y Confidencialidad</h4>
              <p>
                El Consejo Coordinador Empresarial de Ciudad Juárez no vende, renta ni transfiere sus datos personales a terceros con fines comerciales ni mercadotécnicos. La información únicamente podrá ser compartida con las autoridades tributarias competentes (SAT) para el cumplimiento de obligaciones de facturación electrónica.
              </p>

              <h4>3. Derechos ARCO</h4>
              <p>
                Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información (Rectificación), que la eliminemos de nuestros registros cuando considere que no está siendo utilizada adecuadamente (Cancelación), así como oponerse al uso de sus datos para fines específicos (Oposición). Para el ejercicio de cualquiera de los derechos ARCO, puede enviar su solicitud al correo electrónico oficial: <a href="mailto:director@ccejuarez.org" style={{ color: '#D4AF37', textDecoration: 'underline' }}>director@ccejuarez.org</a>.
              </p>

              <h4>4. Medidas de Seguridad</h4>
              <p>
                Los comprobantes bancarios y datos de registro se encuentran encriptados y protegidos bajo estándares de seguridad SSL/TLS de 256 bits y políticas de acceso restringido a personal administrativo autorizado.
              </p>
            </div>

            <div className="cce-privacy-modal-footer">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="cce-crm-action-btn"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#03120E', fontWeight: 800 }}
              >
                Entendido y de Acuerdo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
