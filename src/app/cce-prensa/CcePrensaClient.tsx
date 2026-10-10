'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Send,
  Download,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Search,
  RefreshCw,
  Award,
  Sparkles,
  FileSpreadsheet,
  Inbox,
} from 'lucide-react';

interface PrensaRegistration {
  id: string;
  nombre: string;
  medio: string;
  asistentes: string | number;
  whatsapp: string;
  fecha: string;
  timestamp?: number;
  checkIn: boolean;
  location?: string;
  device?: string;
  deviceCategory?: 'ios' | 'android' | 'desktop';
  ip?: string;
}

interface TelemetryData {
  totalVisits: number;
  uniqueVisits: number;
  conversionRate: string;
  devices: {
    ios: number;
    android: number;
    desktop: number;
  };
  totalMedios: number;
  totalAsistentes: number;
}

export default function CcePrensaClient() {
  // Navigation & Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<'crm' | 'public'>('crm');
  const [isLoadingCrm, setIsLoadingCrm] = useState(false);
  const [crmData, setCrmData] = useState<{
    telemetry: TelemetryData;
    registrations: PrensaRegistration[];
  } | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [medio, setMedio] = useState('');
  const [asistentes, setAsistentes] = useState('1');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState<PrensaRegistration | null>(null);

  // Search & status filters for CRM table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked' | 'pending'>('all');
  const [checkInUpdatingId, setCheckInUpdatingId] = useState<string | null>(null);

  const fetchCrmData = async () => {
    setIsLoadingCrm(true);
    try {
      const res = await fetch('/api/cce-prensa-registro?admin=cce2026');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCrmData({
            telemetry: data.telemetry,
            registrations: data.registrations || [],
          });
        }
      }
    } catch (err) {
      console.error('Error fetching CRM data:', err);
    } finally {
      setIsLoadingCrm(false);
    }
  };

  // Detect ?admin=cce2026 on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const adminToken = params.get('admin');
      const isAuthorizedAdmin = adminToken?.toLowerCase().trim() === 'cce2026';

      if (isAuthorizedAdmin) {
        setTimeout(() => {
          setIsAdmin(true);
          fetchCrmData();
        }, 0);
      } else {
        // Track public visit once per session
        const sessionKey = 'cce_prensa_visit_tracked';
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          fetch('/api/cce-prensa-registro?action=visit', { method: 'GET' }).catch(() => {});
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Form Validation & Submission
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim() || nombre.trim().length < 3) {
      newErrors.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    }

    if (!medio.trim() || medio.trim().length < 2) {
      newErrors.medio = 'Ingresa el nombre de tu medio de comunicación.';
    }

    if (!asistentes) {
      newErrors.asistentes = 'Selecciona el número de personas que asistirán.';
    }

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.whatsapp = 'El número de WhatsApp debe contener exactamente 10 dígitos.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError('');
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const cleanPhone = whatsapp.replace(/\D/g, '');
      const res = await fetch('/api/cce-prensa-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          medio: medio.trim(),
          asistentes,
          whatsapp: cleanPhone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedRecord(data.record);
      } else {
        setSubmitError(data.error || 'Ocurrió un error al enviar tu acreditación. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error submitting accreditation:', err);
      setSubmitError('Error de conexión. Por favor verifica tu señal e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Integrations
  const handleGoogleCalendar = () => {
    const title = encodeURIComponent('Desayuno y Rueda de Prensa · CCE Ciudad Juárez');
    const details = encodeURIComponent(
      'Acreditación oficial de prensa para la presentación de galardones escultóricos de Pedro Francisco y conferencia magistral de Carlos Loret de Mola para Empresario del Año 2026.\n\nSede: Taquería La No 4 (Av. Paseo Triunfo de la República 5617).\nContacto de confirmación: CCE Ciudad Juárez.'
    );
    const location = encodeURIComponent('Taquería La No 4, Av. Paseo Triunfo de la República 5617, Ciudad Juárez, Chih.');
    const dates = '20261012T150000Z/20261012T163000Z';
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sprop=name:CCE%20Juarez`;

    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CCE Ciudad Juárez//Acreditacion Prensa 2026//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:cce-prensa-20261012@ccejuarez.org',
      'DTSTAMP:20261010T000000Z',
      'DTSTART:20261012T150000Z',
      'DTEND:20261012T163000Z',
      'SUMMARY:Desayuno y Rueda de Prensa · CCE Ciudad Juárez (Empresario del Año 2026)',
      'DESCRIPTION:Presentación oficial de los galardones escultóricos de Pedro Francisco y la conferencia magistral de Carlos Loret de Mola para Empresario del Año 2026. Evento exclusivo para medios y reporteros acreditados. Ubicación: Taquería La No 4: https://maps.app.goo.gl/6PvgdE8poTMiSxcN6',
      'LOCATION:Taquería La No 4, Av. Paseo Triunfo de la República 5617, Ciudad Juárez, Chihuahua',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Acreditacion_CCE_Prensa_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/6PvgdE8poTMiSxcN6', '_blank', 'noopener,noreferrer');
  };

  // Toggle Check-in in CRM
  const handleToggleCheckIn = async (record: PrensaRegistration) => {
    if (!crmData) return;
    const newStatus = !record.checkIn;
    setCheckInUpdatingId(record.id);

    // Optimistic UI update
    setCrmData({
      ...crmData,
      registrations: crmData.registrations.map(r => (r.id === record.id ? { ...r, checkIn: newStatus } : r)),
    });

    try {
      const res = await fetch('/api/cce-prensa-registro?admin=cce2026', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, checkIn: newStatus }),
      });
      if (!res.ok) {
        // Revert on error
        setCrmData({
          ...crmData,
          registrations: crmData.registrations.map(r => (r.id === record.id ? { ...r, checkIn: record.checkIn } : r)),
        });
      }
    } catch (err) {
      console.error('Error toggling check-in:', err);
    } finally {
      setCheckInUpdatingId(null);
    }
  };

  // WhatsApp 1-Click Message with Option C
  const getWhatsAppOptionCLink = (reg: PrensaRegistration) => {
    const cleanPhone = String(reg.whatsapp).replace(/\D/g, '');
    const numAsistentes = reg.asistentes;
    const asistentesLabel = String(numAsistentes) === '1' ? '1 asistente' : `${numAsistentes} asistentes`;
    const message = `Buen día ${reg.nombre}. Confirmada la acreditación de ${reg.medio} (${asistentesLabel}) para el desayuno y rueda de prensa del CCE Juárez. Lunes 12 de octubre, 9:00 a.m. en Taquería La No 4: https://maps.app.goo.gl/6PvgdE8poTMiSxcN6. ¡Agradecemos tu cobertura!`;
    return `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // 1-Click CSV Export with UTF-8 BOM
  const handleExportCsv = () => {
    if (!crmData || crmData.registrations.length === 0) return;

    const headers = ['ID', 'Nombre', 'Medio', 'Asistentes', 'WhatsApp', 'Fecha', 'Check-In', 'Ubicación', 'Dispositivo'];
    const rows = crmData.registrations.map(r => [
      r.id,
      `"${(r.nombre || '').replace(/"/g, '""')}"`,
      `"${(r.medio || '').replace(/"/g, '""')}"`,
      r.asistentes,
      `"${(r.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(r.fecha || '').replace(/"/g, '""')}"`,
      r.checkIn ? 'Acreditado en Puerta' : 'Pendiente',
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.device || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'acreditaciones_cce_prensa_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalRegistrations = crmData?.registrations || [];
  const checkedCount = totalRegistrations.filter(r => r.checkIn).length;
  const pendingCount = totalRegistrations.filter(r => !r.checkIn).length;

  const filteredRegistrations = totalRegistrations.filter(r => {
    if (statusFilter === 'checked' && !r.checkIn) return false;
    if (statusFilter === 'pending' && r.checkIn) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      r.nombre.toLowerCase().includes(q) ||
      r.medio.toLowerCase().includes(q) ||
      r.whatsapp.includes(q) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  });

  // Hero Typography Reveal Variants (R2)
  const heroTitleWords = ['Acreditación', 'Oficial', 'de', 'Prensa'];

  const titleContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const titleWordVariants: Variants = {
    hidden: {
      opacity: 1,
      y: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className={`cce-page-container ${isAdmin && adminTab === 'crm' ? 'is-crm' : 'is-gala'}`}>
      {/* SCOPED CSS ARCHITECTURE (Vanilla CSS / No Tailwind) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --cce-emerald: #064E3B;
          --cce-emerald-dark: #042E23;
          --cce-emerald-light: #059669;
          --cce-emerald-wash: #ECFDF5;
          --cce-gold: #D4AF37;
          --cce-gold-dark: #B8860B;
          --cce-gold-light: #FFFBEB;
          --cce-gold-border: #FDE68A;
          --cce-cream: #FFFDF9;
          --cce-bg: #FFFDF9;
          --cce-text-dark: #0F172A;
          --cce-text-muted: #475569;
          --cce-border-subtle: #E2E8F0;

          /* Obsidian Emerald Gala Tokens */
          --cce-obsidian: #02120C;
          --cce-obsidian-surface: #041D14;
          --cce-obsidian-card: rgba(4, 29, 20, 0.78);
          --cce-obsidian-border: rgba(212, 175, 55, 0.35);
          --cce-gold-foil: #F5DE98;
          --cce-gold-pure: #D4AF37;
          --cce-gold-burnished: #AA8022;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, html {
          max-width: 100vw;
          overflow-x: hidden;
          background-color: #02120C;
          color: var(--cce-text-dark);
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .cce-page-container {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          background: #02120C;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          color: #F8FAFC;
        }

        .cce-page-container.is-crm {
          background: #F8FAFC;
          color: var(--cce-text-dark);
        }

        /* Theatrical Spotlight & Atmospheric Living Canvas */
        .cce-living-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
          contain: paint;
        }

        .cce-page-container.is-crm .cce-living-canvas {
          display: none;
        }

        .cce-spotlight {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 65vh;
          background: radial-gradient(ellipse at 50% 0%, rgba(6, 78, 59, 0.42) 0%, rgba(212, 175, 55, 0.08) 45%, transparent 75%);
          pointer-events: none;
        }

        /* Top Theatrical Golden Beam */
        .cce-spotlight-gold {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 90vw;
          max-width: 1100px;
          height: 60vh;
          background: radial-gradient(ellipse at 50% 10%, rgba(245, 222, 152, 0.42) 0%, rgba(212, 175, 55, 0.24) 30%, rgba(212, 175, 55, 0.05) 58%, transparent 75%);
          filter: blur(45px);
          animation: cceGoldSpotlightBreath 7s ease-in-out infinite alternate;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes cceGoldSpotlightBreath {
          0% {
            opacity: 0.45;
            transform: translateX(-50%) scale(0.92);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-50%) scale(1.12) translateY(22px);
          }
          100% {
            opacity: 0.55;
            transform: translateX(-50%) scale(0.96) translateY(-5px);
          }
        }

        /* Central Breathing Golden Core (Behind Hero & Form) */
        .cce-gold-ambient-center {
          position: absolute;
          top: 35vh;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 58vw;
          max-width: 750px;
          height: 58vw;
          max-height: 750px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 222, 152, 0.38) 0%, rgba(212, 175, 55, 0.22) 32%, rgba(243, 202, 64, 0.08) 60%, transparent 75%);
          filter: blur(75px);
          animation: cceGoldPulseCenter 9s ease-in-out infinite alternate;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes cceGoldPulseCenter {
          0% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.5;
          }
          50% {
            transform: translate(-48%, -52%) scale(1.22);
            opacity: 0.95;
          }
          100% {
            transform: translate(-52%, -48%) scale(0.92);
            opacity: 0.6;
          }
        }

        /* Floating Golden Nebula Orb */
        .cce-gold-ambient-floating {
          position: absolute;
          top: 50vh;
          left: 60%;
          width: 48vw;
          max-width: 620px;
          height: 48vw;
          max-height: 620px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 232, 163, 0.35) 0%, rgba(212, 175, 55, 0.2) 35%, rgba(170, 128, 34, 0.06) 65%, transparent 75%);
          filter: blur(85px);
          animation: cceGoldFloat 13s ease-in-out infinite alternate;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes cceGoldFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0.45;
          }
          50% {
            transform: translate3d(-15vw, 12vh, 0) scale(1.18);
            opacity: 0.92;
          }
          100% {
            transform: translate3d(-6vw, -10vh, 0) scale(1.02);
            opacity: 0.55;
          }
        }

        /* Slow Theatrical Golden Aurora Sweep */
        .cce-gold-shimmer-ray {
          position: absolute;
          top: -20vh;
          left: 20%;
          width: 80vw;
          height: 80vh;
          background: conic-gradient(from 180deg at 50% 50%, rgba(212, 175, 55, 0) 0deg, rgba(245, 222, 152, 0.18) 60deg, rgba(212, 175, 55, 0) 120deg, rgba(243, 202, 64, 0.14) 220deg, rgba(212, 175, 55, 0) 360deg);
          filter: blur(65px);
          animation: cceGoldRayRotate 32s linear infinite;
          pointer-events: none;
          opacity: 0.75;
          will-change: transform;
        }

        @keyframes cceGoldRayRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.12);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .cce-canvas-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          will-change: transform, opacity;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .cce-canvas-orb {
            filter: blur(55px);
          }
          .cce-spotlight-gold {
            filter: blur(35px);
            width: 100vw;
            height: 45vh;
          }
          .cce-gold-ambient-center {
            filter: blur(55px);
            width: 80vw;
            height: 80vw;
          }
          .cce-gold-ambient-floating {
            filter: blur(60px);
            width: 70vw;
            height: 70vw;
          }
          .cce-gold-shimmer-ray {
            display: none;
          }
        }

        .cce-orb-1 {
          top: -10%;
          left: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, #064E3B 0%, rgba(6, 78, 59, 0) 70%);
          animation: cceOrbMove1 22s ease-in-out infinite alternate;
          transform: translate3d(0, 0, 0);
          opacity: 0.32;
        }

        .cce-orb-2 {
          top: 15%;
          right: -10%;
          width: 48vw;
          height: 48vw;
          background: radial-gradient(circle, #F5DE98 0%, #D4AF37 40%, rgba(212, 175, 55, 0) 70%);
          animation: cceOrbMove2 14s ease-in-out infinite alternate;
          transform: translate3d(0, 0, 0);
        }

        .cce-orb-3 {
          bottom: -15%;
          left: 10%;
          width: 55vw;
          height: 55vw;
          background: radial-gradient(circle, #042E23 0%, rgba(4, 46, 35, 0) 70%);
          animation: cceOrbMove3 26s ease-in-out infinite alternate;
          transform: translate3d(0, 0, 0);
          opacity: 0.35;
        }

        .cce-orb-4 {
          bottom: 15%;
          right: 5%;
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, #FFE8A3 0%, #F3CA40 40%, rgba(243, 202, 64, 0) 70%);
          animation: cceOrbMove4 16s ease-in-out infinite alternate;
          transform: translate3d(0, 0, 0);
        }

        @keyframes cceOrbMove1 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(8vw, 6vh, 0) scale(1.1); }
          100% { transform: translate3d(-4vw, 12vh, 0) scale(0.95); }
        }

        @keyframes cceOrbMove2 {
          0% { transform: translate3d(0, 0, 0) scale(0.92); opacity: 0.4; }
          50% { transform: translate3d(-8vw, 10vh, 0) scale(1.22); opacity: 0.88; }
          100% { transform: translate3d(6vw, -6vh, 0) scale(0.96); opacity: 0.5; }
        }

        @keyframes cceOrbMove3 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(12vw, -10vh, 0) scale(1.08); }
          100% { transform: translate3d(-6vw, -4vh, 0) scale(0.96); }
        }

        @keyframes cceOrbMove4 {
          0% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.38; }
          50% { transform: translate3d(-7vw, -10vh, 0) scale(1.2); opacity: 0.85; }
          100% { transform: translate3d(8vw, 8vh, 0) scale(0.95); opacity: 0.45; }
        }

        /* Banknote / Official Document Micro-Texture */
        .cce-canvas-texture {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: 
            radial-gradient(#D4AF37 0.75px, transparent 0.75px),
            repeating-linear-gradient(45deg, #064E3B 0, #064E3B 0.5px, transparent 0, transparent 24px),
            repeating-linear-gradient(-45deg, #D4AF37 0, #D4AF37 0.5px, transparent 0, transparent 24px);
          background-size: 16px 16px, 32px 32px, 32px 32px;
          pointer-events: none;
        }

        /* High-Contrast Golden Foil Shimmer Animation */
        .cce-golden-shimmer {
          background: linear-gradient(
            90deg,
            #F5DE98 0%,
            #FFE8A3 25%,
            #FFFFFF 50%,
            #D4AF37 75%,
            #F5DE98 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 700;
          animation: cceGoldShimmer 4s linear infinite;
        }

        @keyframes cceGoldShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Top Brand Header */
        .cce-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(2, 18, 12, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.22);
          padding: 14px 24px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .cce-header.is-crm-header {
          background: rgba(255, 253, 249, 0.95);
          border-bottom: 1px solid rgba(6, 78, 59, 0.1);
        }

        .cce-header-inner {
          max-width: 1360px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .cce-brand-left {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .cce-logo-img {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        @media (max-width: 640px) {
          .cce-header {
            padding: 10px 14px;
          }
          .cce-header-inner {
            gap: 8px;
          }
          .cce-brand-left {
            gap: 8px;
          }
          .cce-logo-img {
            height: 28px;
          }
          .cce-brand-divider {
            height: 18px;
          }
          .cce-header.has-admin .cce-council-tag,
          .cce-header.has-admin .cce-brand-divider {
            display: none;
          }
          .cce-header.has-admin .cce-apolograma-brand-logo {
            display: none;
          }
          .cce-apolograma-brand-logo {
            height: 18px !important;
            max-width: 100px !important;
          }
          .cce-admin-badge span {
            display: none;
          }
          .cce-admin-badge {
            padding: 6px 8px;
          }
          .cce-tab-btn {
            padding: 5px 9px;
            font-size: 11px;
            min-height: 34px;
            white-space: nowrap;
          }
        }

        .cce-brand-divider {
          width: 1px;
          height: 26px;
          background-color: rgba(212, 175, 55, 0.35);
        }

        .cce-header.is-crm-header .cce-brand-divider {
          background-color: rgba(6, 78, 59, 0.2);
        }

        .cce-council-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #F5DE98;
          font-family: 'Cinzel', serif;
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .cce-header.is-crm-header .cce-council-tag {
          color: var(--cce-emerald);
          font-family: inherit;
        }

        .cce-council-tag span {
          font-size: 9px;
          color: #34D399;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .cce-header.is-crm-header .cce-council-tag span {
          color: var(--cce-gold-dark);
        }

        .cce-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cce-admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          background-color: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #F5DE98;
          font-size: 12px;
          font-weight: 600;
        }

        .cce-tab-toggle {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 2px;
        }

        .cce-header.is-crm-header .cce-tab-toggle {
          background: #E2E8F0;
        }

        .cce-tab-btn {
          border: none;
          background: none;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          color: #CBD5E1;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .cce-header.is-crm-header .cce-tab-btn {
          color: #475569;
        }

        .cce-tab-btn.active {
          background: #D4AF37;
          color: #02120C;
          font-weight: 800;
        }

        .cce-header.is-crm-header .cce-tab-btn.active {
          background: #FFFFFF;
          color: var(--cce-emerald);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Hero Section */
        .cce-hero {
          position: relative;
          z-index: 1;
          padding: 64px 20px 32px 20px;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
          width: 100%;
        }

        /* Hero Institutional Logo (En Grande) */
        .cce-hero-logo-box {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 24px auto;
          position: relative;
        }

        .cce-hero-logo-img {
          width: 100%;
          max-width: 320px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.3));
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cce-hero-logo-img:hover {
          transform: scale(1.03);
        }

        @media (max-width: 640px) {
          .cce-hero {
            padding-top: 44px;
          }
          .cce-hero-logo-box {
            margin-bottom: 18px;
          }
          .cce-hero-logo-img {
            max-width: 220px;
          }
        }

        .cce-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.35);
          color: #F5DE98;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 9999px;
          margin-bottom: 22px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .cce-hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.15;
          letter-spacing: 0.03em;
          margin-bottom: 16px;
          text-shadow: 0 4px 25px rgba(0, 0, 0, 0.8);
        }

        .cce-hero-subtitle {
          font-size: clamp(16px, 2.4vw, 20px);
          font-weight: 600;
          color: #E2E8F0;
          margin-bottom: 18px;
          line-height: 1.4;
        }

        .cce-hero-description {
          font-size: 15px;
          line-height: 1.7;
          color: #94A3B8;
          max-width: 740px;
          margin: 0 auto 26px auto;
        }

        .cce-protocol-badge {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          color: #E2E8F0;
          background: rgba(6, 40, 28, 0.65);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 18px;
          border-radius: 9999px;
          margin-bottom: 32px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .cce-protocol-badge b {
          color: #F5DE98;
        }

        /* MONOLITHIC VIP CREDENTIAL PASS BAR (REPLACES 3 LOOSE CARDS) */
        .cce-details-strip.cce-vip-pass-bar {
          max-width: 920px;
          margin: 0 auto 36px auto;
          width: 100%;
          padding: 0 10px;
          display: block;
        }

        .cce-vip-pass-inner {
          background: linear-gradient(180deg, rgba(6, 40, 28, 0.75) 0%, rgba(2, 18, 12, 0.92) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.38);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(245, 222, 152, 0.25);
          position: relative;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .cce-vip-pass-inner:hover {
          border-color: rgba(245, 222, 152, 0.65);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(212, 175, 55, 0.25);
        }

        .cce-vip-pass-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          padding: 24px 28px;
        }

        @media (max-width: 820px) {
          .cce-vip-pass-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 20px 18px;
          }
        }

        .cce-detail-card.cce-vip-pass-col {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
          background: none;
          border: none;
          box-shadow: none;
          padding: 0;
          border-radius: 0;
        }

        .cce-detail-icon.cce-vip-pass-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(6, 78, 59, 0.4) 100%);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #F5DE98;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .cce-vip-pass-divider {
          width: 1px;
          height: 52px;
          background: linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.35) 50%, transparent);
        }

        @media (max-width: 820px) {
          .cce-vip-pass-divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.35) 50%, transparent);
          }
        }

        .cce-detail-label.cce-vip-pass-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #F5DE98;
          margin-bottom: 4px;
          font-family: 'Cinzel', serif;
        }

        .cce-detail-value.cce-vip-pass-value {
          font-size: 16px;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.3;
        }

        .cce-detail-hint.cce-vip-pass-hint {
          font-size: 12px;
          color: #34D399;
          margin-top: 3px;
          font-weight: 500;
        }

        .cce-notice-pill.cce-vip-pass-footer {
          border-top: 1px solid rgba(212, 175, 55, 0.22);
          background: rgba(2, 18, 12, 0.65);
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #F5DE98;
          letter-spacing: 0.02em;
          border-radius: 0;
          max-width: 100%;
          margin: 0;
        }

        /* KEYNOTE POSTER SHOWCASE (R3: CARLOS LORET DE MOLA) */
        .cce-keynote-wrapper {
          max-width: 920px;
          margin: 0 auto 40px auto;
          width: 100%;
          padding: 0 10px;
          position: relative;
          z-index: 1;
        }

        .cce-keynote-card {
          position: relative;
          background: linear-gradient(135deg, rgba(6, 40, 28, 0.8) 0%, rgba(2, 18, 12, 0.95) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 22px;
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(245, 222, 152, 0.25);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .cce-keynote-card:hover {
          transform: translateY(-3px);
          border-color: #F5DE98;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.3);
        }

        /* Luxury Corner Filigree Brackets */
        .cce-keynote-card::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 12px;
          width: 24px;
          height: 24px;
          border-top: 2px solid #F5DE98;
          border-left: 2px solid #F5DE98;
          pointer-events: none;
        }

        .cce-keynote-card::after {
          content: '';
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          border-bottom: 2px solid #F5DE98;
          border-right: 2px solid #F5DE98;
          pointer-events: none;
        }

        .cce-keynote-inner {
          display: flex;
          flex-direction: row;
          gap: 32px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .cce-keynote-inner {
            flex-direction: column;
            text-align: center;
          }
        }

        .cce-keynote-media {
          flex-shrink: 0;
          width: 230px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 768px) {
          .cce-keynote-media {
            width: 100%;
            max-width: 220px;
            margin: 0 auto;
          }
        }

        .cce-keynote-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
          border: 2px solid #D4AF37;
        }

        .cce-keynote-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cce-keynote-card:hover .cce-keynote-img {
          transform: scale(1.04);
        }

        .cce-keynote-frame-border {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          box-shadow: inset 0 -35px 30px rgba(2, 18, 12, 0.8), inset 0 0 15px rgba(212, 175, 55, 0.3);
          pointer-events: none;
        }

        .cce-keynote-caption {
          margin-top: 12px;
          text-align: center;
        }

        .cce-keynote-role {
          font-size: 11px;
          font-weight: 800;
          color: #F5DE98;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: 'Cinzel', serif;
        }

        .cce-keynote-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .cce-keynote-content {
            text-align: center;
            align-items: center;
          }
        }

        .cce-keynote-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .cce-keynote-badges {
            justify-content: center;
          }
        }

        .cce-badge-pulse {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 9999px;
          animation: goldPulse 3s ease-in-out infinite;
        }

        .cce-badge-gold {
          background: rgba(212, 175, 55, 0.15);
          color: #F5DE98;
          border: 1px solid rgba(212, 175, 55, 0.5);
        }

        .cce-badge-emerald {
          background: rgba(6, 78, 59, 0.35);
          color: #34D399;
          border: 1px solid rgba(52, 211, 153, 0.35);
        }

        @keyframes goldPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
            border-color: rgba(212, 175, 55, 0.5);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(212, 175, 55, 0);
            border-color: rgba(245, 222, 152, 0.9);
          }
        }

        .cce-keynote-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(22px, 2.6vw, 28px);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.25;
          letter-spacing: 0.02em;
        }

        .cce-keynote-bio {
          font-size: 14px;
          line-height: 1.65;
          color: #CBD5E1;
        }

        .cce-keynote-protocol {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 18px;
          background: rgba(2, 18, 12, 0.65);
          border-left: 3px solid #D4AF37;
          border-radius: 0 10px 10px 0;
          font-size: 13px;
          color: #E2E8F0;
          text-align: left;
        }

        @media (max-width: 768px) {
          .cce-keynote-protocol {
            text-align: left;
            width: 100%;
          }
        }

        .cce-protocol-item b {
          color: #F5DE98;
        }

        /* VIP ACCREDITATION TERMINAL (R4) */
        .cce-main-content {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto 60px auto;
          padding: 0 10px;
          width: 100%;
        }

        .cce-form-card {
          background: linear-gradient(180deg, rgba(6, 40, 28, 0.8) 0%, rgba(2, 18, 12, 0.94) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 22px;
          padding: 40px 36px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(245, 222, 152, 0.2);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .cce-form-card:hover {
          border-color: rgba(245, 222, 152, 0.6);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.25);
        }

        @media (max-width: 640px) {
          .cce-form-card {
            padding: 28px 20px;
          }
        }

        .cce-form-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .cce-form-heading {
          font-family: 'Cinzel', serif;
          font-size: clamp(22px, 3vw, 26px);
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          margin-bottom: 8px;
        }

        .cce-form-subheading {
          font-size: 14px;
          color: #94A3B8;
        }

        .cce-form-group {
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cce-label {
          font-size: 13px;
          font-weight: 700;
          color: #F5DE98;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cce-required-dot {
          color: #EF4444;
          margin-left: 4px;
        }

        .cce-input {
          width: 100%;
          min-height: 50px;
          padding: 12px 18px;
          font-size: 16px; /* Prevents iOS auto-zoom */
          color: #FFFFFF;
          background-color: rgba(2, 18, 12, 0.7);
          border: 1.5px solid rgba(212, 175, 55, 0.28);
          border-radius: 12px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background-color 0.25s;
        }

        .cce-input::placeholder {
          color: #64748B;
        }

        .cce-input:focus {
          border-color: #F5DE98;
          background-color: rgba(2, 18, 12, 0.9);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.35);
        }

        .cce-input.error {
          border-color: #EF4444;
          background-color: rgba(239, 68, 68, 0.08);
        }

        .cce-field-error {
          font-size: 12px;
          color: #F87171;
          font-weight: 600;
          margin-top: 2px;
        }

        /* Attendees Segmented Control */
        .cce-attendees-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .cce-attendee-btn {
          min-height: 48px;
          background: rgba(2, 18, 12, 0.65);
          border: 1.5px solid rgba(212, 175, 55, 0.28);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          color: #E2E8F0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .cce-attendee-btn:hover {
          border-color: #F5DE98;
          background: rgba(212, 175, 55, 0.1);
          color: #FFFFFF;
        }

        .cce-attendee-btn.selected {
          background: linear-gradient(135deg, #F5DE98 0%, #D4AF37 50%, #AA8022 100%);
          color: #02120C;
          border-color: #FFE8A3;
          font-weight: 800;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        /* Submit Button with Bullion Gradient */
        .cce-submit-btn {
          width: 100%;
          min-height: 54px;
          background: linear-gradient(135deg, #FFF6D6 0%, #F5DE98 30%, #D4AF37 70%, #AA8022 100%);
          border: 1px solid #FFE8A3;
          border-radius: 14px;
          color: #02120C;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, filter 0.2s ease;
        }

        .cce-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          filter: brightness(1.05);
        }

        .cce-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .cce-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cce-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(2, 18, 12, 0.3);
          border-top-color: #02120C;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cce-submit-alert-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #EF4444;
          color: #FCA5A5;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 16px;
          text-align: center;
        }

        /* CONFIRMATION CARD (R4) */
        .cce-confirmation-card {
          background: linear-gradient(180deg, rgba(6, 40, 28, 0.85) 0%, rgba(2, 18, 12, 0.95) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.5);
          border-radius: 22px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.25);
        }

        .cce-confirmed-seal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(6, 78, 59, 0.4) 100%);
          border: 1.5px solid #F5DE98;
          color: #F5DE98;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .cce-confirmed-title {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 10px;
        }

        .cce-confirmed-summary {
          background: rgba(2, 18, 12, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 14px;
          padding: 22px;
          text-align: left;
          margin: 26px 0;
        }

        .cce-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          font-size: 14px;
        }

        .cce-summary-row:last-child {
          border-bottom: none;
        }

        .cce-summary-label {
          color: #94A3B8;
          font-weight: 500;
        }

        .cce-summary-val {
          color: #FFFFFF;
          font-weight: 700;
        }

        .cce-action-buttons-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .cce-action-btn {
          min-height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          padding: 12px 18px;
        }

        .cce-btn-google {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border: 1.5px solid rgba(212, 175, 55, 0.4);
        }

        .cce-btn-google:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #F5DE98;
        }

        .cce-btn-apple {
          background: linear-gradient(135deg, #064E3B 0%, #042E23 100%);
          color: #FFFFFF;
          border: 1.5px solid rgba(52, 211, 153, 0.4);
        }

        .cce-btn-apple:hover {
          background: linear-gradient(135deg, #059669 0%, #064E3B 100%);
          border-color: #34D399;
        }

        .cce-btn-maps {
          background: rgba(212, 175, 55, 0.15);
          color: #F5DE98;
          border: 1.5px solid rgba(212, 175, 55, 0.5);
        }

        .cce-btn-maps:hover {
          background: rgba(212, 175, 55, 0.25);
          border-color: #FFE8A3;
        }

        /* PRIVATE CRM SECTION */
        .cce-crm-container {
          max-width: 1360px;
          margin: 24px auto 60px auto;
          padding: 0 24px;
          width: 100%;
        }

        .cce-crm-banner {
          background: #FFFFFF;
          border: 1px solid rgba(6, 78, 59, 0.14);
          border-left: 5px solid var(--cce-emerald);
          border-radius: 14px;
          padding: 20px 24px;
          color: var(--cce-text-dark);
          margin-bottom: 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 4px 16px rgba(6, 78, 59, 0.05);
        }

        .cce-crm-banner-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cce-crm-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: var(--cce-emerald);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .cce-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          display: inline-block;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          animation: ccePulse 2s infinite;
        }

        @keyframes ccePulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .cce-crm-banner-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--cce-emerald-dark);
          letter-spacing: -0.01em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cce-crm-banner-sub {
          font-size: 13px;
          color: var(--cce-text-muted);
        }

        .cce-crm-capacity-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          background: var(--cce-emerald-wash);
          border: 1px solid #A7F3D0;
          color: var(--cce-emerald);
          font-size: 13px;
          font-weight: 600;
        }

        .cce-crm-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cce-crm-btn {
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .cce-crm-btn-primary {
          background: var(--cce-gold);
          color: #042E23;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.25);
        }

        .cce-crm-btn-primary:hover {
          background: #F3CA40;
          transform: translateY(-1px);
        }

        .cce-crm-btn-secondary {
          background: #FFFFFF;
          color: var(--cce-text-dark);
          border: 1px solid var(--cce-border-subtle);
        }

        .cce-crm-btn-secondary:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        /* Telemetry Radar Cards Grid (2 rows of 3 balanced cards) */
        .cce-radar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 960px) {
          .cce-radar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .cce-radar-grid {
            grid-template-columns: 1fr;
          }
        }

        .cce-radar-card {
          background: #FFFFFF;
          border: 1px solid rgba(6, 78, 59, 0.12);
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 2px 8px rgba(6, 78, 59, 0.03);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cce-radar-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 78, 59, 0.06);
        }

        .cce-radar-card-hero {
          border-top: 3px solid var(--cce-emerald);
          background: linear-gradient(180deg, #FAFCFA 0%, #FFFFFF 100%);
        }

        .cce-radar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .cce-radar-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--cce-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cce-radar-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cce-radar-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--cce-emerald);
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .cce-radar-subtext {
          font-size: 11px;
          color: var(--cce-text-muted);
          font-weight: 600;
          margin-top: 6px;
        }

        .cce-device-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .cce-dev-pill {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        /* Media Table Section */
        .cce-table-card {
          background: #FFFFFF;
          border: 1px solid var(--cce-border-subtle);
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .cce-table-toolbar {
          padding: 16px 20px;
          border-bottom: 1px solid var(--cce-border-subtle);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #FAFCFA;
        }

        .cce-search-box {
          position: relative;
          min-width: 240px;
          flex: 1;
          max-width: 360px;
        }

        .cce-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .cce-search-input {
          width: 100%;
          min-height: 40px;
          padding: 8px 12px 8px 36px;
          font-size: 14px;
          border: 1px solid var(--cce-border-subtle);
          border-radius: 8px;
          outline: none;
          background: #FFFFFF;
        }

        .cce-search-input:focus {
          border-color: var(--cce-emerald);
          box-shadow: 0 0 0 3px rgba(6, 78, 59, 0.08);
        }

        .cce-filter-tabs {
          display: inline-flex;
          align-items: center;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }

        .cce-filter-tab {
          border: none;
          background: transparent;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          color: #64748B;
          transition: all 0.15s ease;
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .cce-filter-tab.active {
          background: #FFFFFF;
          color: var(--cce-emerald-dark);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* Scrollable Table Wrapper */
        .cce-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .cce-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
          min-width: 760px;
        }

        .cce-th {
          background: #F8FAF8;
          color: var(--cce-text-dark);
          font-weight: 700;
          padding: 12px 10px;
          border-bottom: 2px solid rgba(6, 78, 59, 0.1);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .cce-td {
          padding: 12px 10px;
          border-bottom: 1px solid #F1F5F9;
          color: var(--cce-text-dark);
          vertical-align: middle;
        }

        .cce-row:hover {
          background-color: #FAFCFA;
        }

        .cce-avatar-initials {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--cce-emerald-wash);
          border: 1px solid #A7F3D0;
          color: var(--cce-emerald-dark);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .cce-medio-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(6, 78, 59, 0.06);
          color: var(--cce-emerald-dark);
          font-weight: 700;
          font-size: 12px;
          border: 1px solid rgba(6, 78, 59, 0.12);
        }

        .cce-asistentes-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: #F1F5F9;
          color: #1E293B;
          font-weight: 700;
          font-size: 12px;
        }

        .cce-status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 11px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          min-height: 34px;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .cce-status-checked {
          background: var(--cce-emerald-wash);
          color: var(--cce-emerald-dark);
          border: 1px solid #A7F3D0;
        }

        .cce-status-checked:hover {
          background: #D1FAE5;
        }

        .cce-status-pending {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        .cce-status-pending:hover {
          background: #FDE68A;
        }

        .cce-btn-wa-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #25D366;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          min-height: 34px;
          box-shadow: 0 2px 6px rgba(37, 211, 102, 0.2);
        }

        .cce-btn-wa-row:hover {
          background: #1EBE5D;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
        }

        /* Footer */
        .cce-footer {
          margin-top: auto;
          background: #010B07;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          padding: 30px 20px;
          text-align: center;
          font-size: 13px;
          color: #94A3B8;
          position: relative;
          z-index: 1;
        }

        .cce-page-container.is-crm .cce-footer {
          background: #FFFFFF;
          border-top: 1px solid rgba(6, 78, 59, 0.08);
          color: var(--cce-text-muted);
        }

        .cce-footer-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .cce-footer-inner b {
          color: #F5DE98;
        }

        .cce-page-container.is-crm .cce-footer-inner b {
          color: var(--cce-emerald);
        }

        .cce-footer-sub {
          font-size: 12px;
          color: #64748B;
        }
      `,
        }}
      />

      {/* ATMOSPHERIC LIVING CANVAS (R1: THEATRICAL GOLD SPOTLIGHT + AMBIENT PULSE & ORBS) */}
      <div className="cce-living-canvas" aria-hidden="true">
        <div className="cce-spotlight" />
        <div className="cce-spotlight-gold" />
        <div className="cce-gold-ambient-center" />
        <div className="cce-gold-ambient-floating" />
        <div className="cce-gold-shimmer-ray" />
        <div className="cce-canvas-orb cce-orb-1" />
        <div className="cce-canvas-orb cce-orb-2" />
        <div className="cce-canvas-orb cce-orb-3" />
        <div className="cce-canvas-orb cce-orb-4" />
        <div className="cce-canvas-texture" />
      </div>

      {/* FLOATING ADMIN CONTROLS (Only visible when authenticated with ?admin=cce2026 and viewing public registration) */}
      {isAdmin && adminTab === 'public' && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(2, 18, 12, 0.92)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '9999px',
            padding: '6px 14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <ShieldCheck size={14} color="#F5DE98" />
          <span style={{ fontSize: '11px', color: '#F5DE98', fontWeight: 700 }}>Admin Conectado</span>
          <button
            type="button"
            onClick={() => setAdminTab('crm')}
            style={{
              background: '#D4AF37',
              color: '#02120C',
              border: 'none',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Panel CRM
          </button>
        </div>
      )}

      {/* ADMIN CRM VIEW (Visible when ?admin=cce2026 and adminTab === 'crm') */}
      {isAdmin && adminTab === 'crm' ? (
        <main className="cce-crm-container">
          {/* Executive Header Banner */}
          <div className="cce-crm-banner">
            <div className="cce-crm-banner-left">
              <div className="cce-crm-live-badge">
                <span className="cce-pulse-dot" />
                CENTRO DE CONTROL &amp; TELEMETRÍA · CCE JUÁREZ
              </div>
              <h2 className="cce-crm-banner-title">
                <BarChart3 size={22} color="#064E3B" />
                Acreditación de Prensa · Empresario del Año 2026
              </h2>
              <div className="cce-crm-banner-sub">
                Desayuno y Rueda de Prensa Oficial · Lunes 12 de Octubre, 9:00 a.m. · Taquería La No 4
              </div>
            </div>

            <div className="cce-crm-actions">
              <div className="cce-crm-capacity-pill">
                <Users size={15} />
                <span>Capacidad confirmada: <b>{crmData?.telemetry.totalAsistentes ?? 0}</b> asistentes</span>
              </div>
              <button
                type="button"
                className="cce-crm-btn cce-crm-btn-secondary"
                onClick={() => setAdminTab('public')}
                title="Ver la landing pública de acreditación"
              >
                Ver Landing
              </button>
              <button className="cce-crm-btn cce-crm-btn-secondary" onClick={fetchCrmData} disabled={isLoadingCrm}>
                <RefreshCw size={14} className={isLoadingCrm ? 'cce-spinner' : ''} />
                Actualizar
              </button>
              <button className="cce-crm-btn cce-crm-btn-primary" onClick={handleExportCsv} title="Descargar lista de acreditados en formato CSV compatible con Excel">
                <FileSpreadsheet size={16} />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Telemetry Radar Cards */}
          {crmData?.telemetry && (
            <div className="cce-radar-grid">
              <div className="cce-radar-card cce-radar-card-hero">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Total Asistentes</span>
                  <div className="cce-radar-icon-box" style={{ background: '#ECFDF5', color: '#064E3B' }}>
                    <Users size={16} />
                  </div>
                </div>
                <div className="cce-radar-value">{crmData.telemetry.totalAsistentes}</div>
                <div className="cce-radar-subtext">Lugares confirmados en mesa</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Medios Registrados</span>
                  <div className="cce-radar-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    <Award size={16} />
                  </div>
                </div>
                <div className="cce-radar-value">{crmData.telemetry.totalMedios}</div>
                <div className="cce-radar-subtext">Agencias y medios únicos</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Check-in en Sede</span>
                  <div className="cce-radar-icon-box" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="cce-radar-value" style={{ color: checkedCount > 0 ? '#059669' : '#64748B' }}>
                  {checkedCount} <span style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>/ {totalRegistrations.length}</span>
                </div>
                <div className="cce-radar-subtext">{pendingCount} reporteros pendientes por llegar</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Tráfico Web</span>
                  <div className="cce-radar-icon-box" style={{ background: '#F8FAFC', color: '#475569' }}>
                    <BarChart3 size={16} />
                  </div>
                </div>
                <div className="cce-radar-value">
                  {crmData.telemetry.totalVisits}{' '}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>({crmData.telemetry.uniqueVisits} únicos)</span>
                </div>
                <div className="cce-radar-subtext">Visitas auditadas en tiempo real</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Tasa de Conversión</span>
                  <div className="cce-radar-icon-box" style={{ background: '#FFFBEB', color: '#D97706' }}>
                    <Sparkles size={16} />
                  </div>
                </div>
                <div className="cce-radar-value" style={{ color: '#B45309' }}>{crmData.telemetry.conversionRate}</div>
                <div className="cce-radar-subtext">Acreditados vs. Total visitantes</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Dispositivos</span>
                  <div className="cce-radar-icon-box" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="cce-device-pills">
                  <span className="cce-dev-pill">📱 iOS {crmData.telemetry.devices.ios}%</span>
                  <span className="cce-dev-pill">🤖 Android {crmData.telemetry.devices.android}%</span>
                  <span className="cce-dev-pill">💻 Desktop {crmData.telemetry.devices.desktop}%</span>
                </div>
                <div className="cce-radar-subtext">Distribución de hardware en prensa</div>
              </div>
            </div>
          )}

          {/* Media Table */}
          <div className="cce-table-card">
            <div className="cce-table-toolbar">
              <div className="cce-search-box">
                <Search size={16} className="cce-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por periodista, medio o teléfono..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="cce-search-input"
                />
              </div>

              <div className="cce-filter-tabs">
                <button
                  type="button"
                  className={`cce-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Todos ({totalRegistrations.length})
                </button>
                <button
                  type="button"
                  className={`cce-filter-tab ${statusFilter === 'checked' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('checked')}
                >
                  ✓ En Sede ({checkedCount})
                </button>
                <button
                  type="button"
                  className={`cce-filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  ⏳ Pendientes ({pendingCount})
                </button>
              </div>

              <div style={{ fontSize: '13px', color: '#64748B' }}>
                Mostrando <b>{filteredRegistrations.length}</b> registros
              </div>
            </div>

            <div className="cce-table-wrapper">
              <table className="cce-table">
                <thead>
                  <tr>
                    <th className="cce-th" style={{ width: '22%' }}>Periodista / Nombre</th>
                    <th className="cce-th" style={{ width: '18%' }}>Medio</th>
                    <th className="cce-th" style={{ width: '8%', textAlign: 'center' }}>
                      Asistentes
                    </th>
                    <th className="cce-th" style={{ width: '14%' }}>Teléfono</th>
                    <th className="cce-th" style={{ width: '11%' }}>Fecha</th>
                    <th className="cce-th" style={{ width: '12%', textAlign: 'center' }}>
                      Check-in
                    </th>
                    <th className="cce-th" style={{ width: '15%', textAlign: 'right' }}>
                      WhatsApp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {totalRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '56px 20px' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064E3B' }}>
                            <Inbox size={22} />
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>
                            Sin Acreditaciones Registradas Aún
                          </div>
                          <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                            Base de datos Cloud Firestore conectada y lista. Las confirmaciones de los medios en la landing pública se registrarán aquí automáticamente en tiempo real.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                        No se encontraron registros de prensa que coincidan con la búsqueda o filtro aplicado.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map(reg => (
                      <tr key={reg.id} className="cce-row">
                        <td className="cce-td">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="cce-avatar-initials">{reg.nombre.slice(0, 2).toUpperCase()}</span>
                            <span style={{ fontWeight: 700 }}>{reg.nombre}</span>
                          </div>
                        </td>
                        <td className="cce-td">
                          <span className="cce-medio-badge">{reg.medio}</span>
                        </td>
                        <td className="cce-td" style={{ textAlign: 'center' }}>
                          <span className="cce-asistentes-pill">
                            <Users size={12} />
                            {reg.asistentes}
                          </span>
                        </td>
                        <td className="cce-td" style={{ fontFamily: 'monospace', fontSize: '13px', color: '#334155' }}>
                          {reg.whatsapp}
                        </td>
                        <td className="cce-td" style={{ color: '#64748B', fontSize: '12px' }}>
                          {reg.fecha}
                        </td>
                        <td className="cce-td" style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className={`cce-status-badge ${reg.checkIn ? 'cce-status-checked' : 'cce-status-pending'}`}
                            onClick={() => handleToggleCheckIn(reg)}
                            disabled={checkInUpdatingId === reg.id}
                            title="Check-in en Taquería La No 4"
                            aria-label="Check-in en Taquería La No 4"
                          >
                            <CheckCircle2 size={13} />
                            {reg.checkIn ? 'Acreditado' : 'Check-in'}
                          </button>
                        </td>
                        <td className="cce-td" style={{ textAlign: 'right' }}>
                          <a
                            href={getWhatsAppOptionCLink(reg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cce-btn-wa-row"
                            title="Enviar confirmación oficial Opción C con 1 clic"
                          >
                            <MessageSquare size={13} />
                            Enviar WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      ) : (
        /* PUBLIC ACCREDITATION LANDING VIEW */
        <main>
          {/* HERO SECTION (EDITORIAL TYPOGRAPHY REVEAL & GOLDEN SHIMMER) */}
          <section className="cce-hero">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {/* INSTITUTIONAL CCE JUÁREZ LOGO (LARGE HERO EMBLEM) */}
              <motion.div
                className="cce-hero-logo-box"
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <img
                  src="/assets/cce-juarez/cce_logo_hero_prestige.svg"
                  alt="Consejo Coordinador Empresarial Ciudad Juárez"
                  className="cce-hero-logo-img"
                />
              </motion.div>

              <div className="cce-hero-pill">
                <Sparkles size={14} />
                Desayuno y Rueda de Prensa Oficial
              </div>

              <motion.h1
                className="cce-hero-title"
                variants={titleContainerVariants}
                initial={false}
                animate="visible"
              >
                {heroTitleWords.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={titleWordVariants}
                    style={{
                      display: 'inline-block',
                      marginRight: i < heroTitleWords.length - 1 ? '0.3em' : 0,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <div className="cce-hero-subtitle">
                Consejo Coordinador Empresarial de Ciudad Juárez | <span className="cce-golden-shimmer">Empresario del Año 2026</span>
              </div>

              <p className="cce-hero-description">
                El Consejo Coordinador Empresarial de Ciudad Juárez convoca formalmente a los medios de comunicación y
                reporteros de la frontera a la rueda de prensa y desayuno oficial con motivo de la presentación de los
                galardones escultóricos de Pedro Francisco y la conferencia magistral de <span className="cce-golden-shimmer">Carlos Loret de Mola</span>.
              </p>

              <div className="cce-protocol-badge">
                Preside el evento: <b>Mtro. Iván Lara</b> · Presidente del CCE Ciudad Juárez
              </div>
            </motion.div>

            {/* MONOLITHIC VIP CREDENTIAL PASS BAR (REPLACES 3 LOOSE CARDS) */}
            <div className="cce-details-strip cce-vip-pass-bar">
              <div className="cce-vip-pass-inner">
                <div className="cce-vip-pass-grid">
                  {/* Segment 1: Fecha */}
                  <div className="cce-detail-card cce-vip-pass-col">
                    <div className="cce-detail-icon cce-vip-pass-icon-box">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div className="cce-detail-label cce-vip-pass-label">Fecha Oficial</div>
                      <div className="cce-detail-value cce-vip-pass-value">Lunes 12 de Octubre, 2026</div>
                      <div className="cce-detail-hint cce-vip-pass-hint">Recepción y Desayuno</div>
                    </div>
                  </div>

                  <div className="cce-vip-pass-divider" />

                  {/* Segment 2: Horario */}
                  <div className="cce-detail-card cce-vip-pass-col">
                    <div className="cce-detail-icon cce-vip-pass-icon-box">
                      <Clock size={22} />
                    </div>
                    <div>
                      <div className="cce-detail-label cce-vip-pass-label">Horario Protocolario</div>
                      <div className="cce-detail-value cce-vip-pass-value">9:00 a.m. en punto</div>
                      <div className="cce-detail-hint cce-vip-pass-hint">Rueda de Prensa y Preguntas</div>
                    </div>
                  </div>

                  <div className="cce-vip-pass-divider" />

                  {/* Segment 3: Sede */}
                  <div className="cce-detail-card cce-vip-pass-col">
                    <div className="cce-detail-icon cce-vip-pass-icon-box">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <div className="cce-detail-label cce-vip-pass-label">Sede del Evento</div>
                      <div className="cce-detail-value cce-vip-pass-value">Taquería La No 4</div>
                      <div className="cce-detail-hint cce-vip-pass-hint">Av. Paseo Triunfo 5617</div>
                    </div>
                  </div>
                </div>

                {/* Integrated Exclusivity Strip */}
                <div className="cce-notice-pill cce-vip-pass-footer">
                  <ShieldCheck size={16} />
                  <span>Evento exclusivo para medios de comunicación, agencias y reporteros acreditados.</span>
                </div>
              </div>
            </div>
          </section>

          {/* KEYNOTE POSTER SHOWCASE (CARLOS LORET DE MOLA) */}
          <div className="cce-keynote-wrapper">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="cce-keynote-card"
            >
              <div className="cce-keynote-inner">
                <div className="cce-keynote-media">
                  <div className="cce-keynote-frame">
                    <img
                      src="/assets/cce-juarez/carlos_loret_de_mola.jpg"
                      alt="Carlos Loret de Mola"
                      className="cce-keynote-img"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/cce-juarez/carlos-loret-de-mola.jpg";
                      }}
                    />
                    <div className="cce-keynote-frame-border" />
                  </div>
                  <div className="cce-keynote-caption">
                    <span className="cce-keynote-role">Periodista y Analista</span>
                  </div>
                </div>

                <div className="cce-keynote-content">
                  <div className="cce-keynote-badges">
                    <span className="cce-badge-pulse cce-badge-gold">
                      <Award size={14} />
                      CONFERENCIA MAGISTRAL EXCLUSIVA
                    </span>
                    <span className="cce-badge-pulse cce-badge-emerald">
                      <ShieldCheck size={14} />
                      CCE CIUDAD JUÁREZ
                    </span>
                  </div>

                  <h2 className="cce-keynote-title">
                    Conferencia Magistral con <span className="cce-golden-shimmer">Carlos Loret de Mola</span>
                  </h2>

                  <p className="cce-keynote-bio">
                    En el marco de la magna entrega del galardón <strong className="cce-golden-shimmer">Empresario del Año 2026</strong>, Carlos Loret de Mola impartirá una conferencia magistral exclusiva de análisis económico, perspectiva geopolítica y coyuntura bilateral para el sector productivo de Ciudad Juárez y la frontera norte.
                  </p>

                  <div className="cce-keynote-protocol">
                    <div className="cce-protocol-item">
                      <b>Preside:</b> Mtro. Iván Lara · Presidente del CCE Ciudad Juárez
                    </div>
                    <div className="cce-protocol-item">
                      <b>Presentación Oficial:</b> Develación de los galardones escultóricos de Pedro Francisco
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MAIN FORM / CONFIRMATION SECTION */}
          <section className="cce-main-content">
            <AnimatePresence mode="wait">
              {confirmedRecord ? (
                /* CONFIRMATION SCREEN */
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="cce-confirmation-card"
                >
                  <div className="cce-confirmed-seal">
                    <CheckCircle2 size={16} />
                    Asistencia Confirmada · Prensa Acreditada
                  </div>

                  <h2 className="cce-confirmed-title">¡Acreditación Registrada con Éxito!</h2>

                  <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    Hemos registrado tu acreditación de prensa para el desayuno y rueda de prensa del CCE Ciudad Juárez. Te
                    esperamos puntualmente en Taquería La No 4.
                  </p>

                  <div className="cce-confirmed-summary">
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Periodista:</span>
                      <span className="cce-summary-val">{confirmedRecord.nombre}</span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Medio de Comunicación:</span>
                      <span className="cce-summary-val">{confirmedRecord.medio}</span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">No. de Asistentes:</span>
                      <span className="cce-summary-val">
                        {confirmedRecord.asistentes} persona{String(confirmedRecord.asistentes) === '1' ? '' : 's'}
                      </span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">WhatsApp Registrado:</span>
                      <span className="cce-summary-val">{confirmedRecord.whatsapp}</span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Fecha y Hora:</span>
                      <span className="cce-summary-val">Lunes 12 de Octubre, 2026 · 9:00 a.m.</span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Ubicación:</span>
                      <span className="cce-summary-val">Taquería La No 4 (Av. Paseo Triunfo 5617)</span>
                    </div>
                  </div>

                  {/* 3 ACTION BUTTONS (GOOGLE CALENDAR, APPLE CALENDAR, GOOGLE MAPS) */}
                  <div className="cce-action-buttons-grid">
                    <button type="button" className="cce-action-btn cce-btn-google" onClick={handleGoogleCalendar}>
                      <Calendar size={18} />
                      Añadir a Google Calendar
                    </button>

                    <button type="button" className="cce-action-btn cce-btn-apple" onClick={handleDownloadIcs}>
                      <Download size={18} />
                      Añadir a Apple Calendar (.ics)
                    </button>

                    <button type="button" className="cce-action-btn cce-btn-maps" onClick={handleGoogleMaps}>
                      <MapPin size={18} />
                      Cómo llegar (Google Maps)
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ACCREDITATION FORM (VIP DESK TERMINAL) */
                <motion.div
                  key="form"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="cce-form-card"
                >
                  <div className="cce-form-header">
                    <h2 className="cce-form-heading">Formulario de Acreditación</h2>
                    <p className="cce-form-subheading">Completa tus datos para confirmar tu lugar y acceso de prensa</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Campo 1: Nombre */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="nombre">
                        <span>
                          Nombre Completo
                          <span className="cce-required-dot">*</span>
                        </span>
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        placeholder="Ej. Lic. Alejandro Morales"
                        value={nombre}
                        onChange={e => {
                          setNombre(e.target.value);
                          if (errors.nombre) setErrors({ ...errors, nombre: '' });
                        }}
                        className={`cce-input ${errors.nombre ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.nombre && <span className="cce-field-error">{errors.nombre}</span>}
                    </div>

                    {/* Campo 2: Medio */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="medio">
                        <span>
                          Medio de Comunicación
                          <span className="cce-required-dot">*</span>
                        </span>
                      </label>
                      <input
                        id="medio"
                        type="text"
                        placeholder="Ej. El Diario de Juárez / Canal 44 / Radio Net / Digital"
                        value={medio}
                        onChange={e => {
                          setMedio(e.target.value);
                          if (errors.medio) setErrors({ ...errors, medio: '' });
                        }}
                        className={`cce-input ${errors.medio ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.medio && <span className="cce-field-error">{errors.medio}</span>}
                    </div>

                    {/* Campo 3: Asistentes */}
                    <div className="cce-form-group">
                      <label className="cce-label">
                        <span>
                          No. de Asistentes
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                          Reporteros / Camarógrafos
                        </span>
                      </label>
                      <div className="cce-attendees-grid">
                        {['1', '2', '3', '4+'].map(val => (
                          <button
                            key={val}
                            type="button"
                            className={`cce-attendee-btn ${asistentes === val ? 'selected' : ''}`}
                            onClick={() => {
                              setAsistentes(val);
                              if (errors.asistentes) setErrors({ ...errors, asistentes: '' });
                            }}
                            disabled={isSubmitting}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      {errors.asistentes && <span className="cce-field-error">{errors.asistentes}</span>}
                    </div>

                    {/* Campo 4: WhatsApp */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="whatsapp">
                        <span>
                          Teléfono de Contacto (WhatsApp)
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>10 dígitos</span>
                      </label>
                      <input
                        id="whatsapp"
                        type="tel"
                        placeholder="656 123 4567"
                        maxLength={14}
                        value={whatsapp}
                        onChange={e => {
                          setWhatsapp(e.target.value);
                          if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
                        }}
                        className={`cce-input ${errors.whatsapp ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.whatsapp && <span className="cce-field-error">{errors.whatsapp}</span>}
                    </div>

                    {submitError && <div className="cce-submit-alert-error">{submitError}</div>}

                    {/* Botón Confirmar Asistencia */}
                    <button type="submit" className="cce-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="cce-spinner" />
                          <span>Enviando acreditación...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Confirmar Asistencia</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="cce-footer">
        <div className="cce-footer-inner">
          <img
            src="/assets/apolograma-logo-v2.png"
            alt="Apolograma Studio"
            style={{
              height: '18px',
              width: 'auto',
              opacity: 0.85,
              marginBottom: '6px',
              filter: isAdmin && adminTab === 'crm' ? 'brightness(0.12)' : 'brightness(0) invert(1)',
            }}
          />
          <div>
            <b>Consejo Coordinador Empresarial de Ciudad Juárez</b> · Comité Organizador Empresario del Año 2026
          </div>
          <div className="cce-footer-sub">
            Plataforma institucional de acreditación de prensa desarrollada y operada por <b>Apolograma Studio</b>.
          </div>
          {/* Institutional Asset Reference: /assets/cce-juarez/logo_cce.png */}
        </div>
      </footer>
    </div>
  );
}
