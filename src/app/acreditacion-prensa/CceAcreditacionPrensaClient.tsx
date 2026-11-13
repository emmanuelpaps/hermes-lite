'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  UserPlus,
  Building2,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';

interface AcreditacionPrensaRegistration {
  id: string;
  folio: string;
  nombre: string;
  medio: string;
  whatsapp: string;
  asistentes: number;
  acompanantes?: string[];
  acompananteNombre?: string;
  fecha: string;
  timestamp?: number;
  checkIn: boolean;
  location?: string;
  device?: string;
  deviceCategory?: 'ios' | 'android' | 'desktop';
  ip?: string;
}

interface AcreditacionPrensaAttempt {
  attemptId: string;
  status: 'iniciado' | 'fallido' | 'completado';
  nombre: string;
  medio: string;
  whatsapp: string;
  asistentes: number;
  acompanantes?: string[];
  acompananteNombre?: string;
  errorReason?: string;
  fecha: string;
  timestamp: number;
  device: string;
  ip: string;
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
  totalRegistros: number;
  totalMedios: number;
  totalAsistentes: number;
}

const CONFIRMED_STORAGE_KEY = 'cce_acreditacion_prensa_confirmed_v1';

/**
 * Safely normalizes Mexican mobile numbers pasted or autofilled with +52 / +52 1
 * so that iOS/Android autofill never truncates the last 2 digits.
 */
function normalizeMxPhoneInput(raw: string): string {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('521')) {
    digits = digits.slice(3);
  } else if (digits.length === 12 && digits.startsWith('52')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

function formatPhoneDisplay(raw?: string): string {
  const digits = normalizeMxPhoneInput(String(raw || ''));
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw || '—';
}

function getCompanionList(item?: {
  acompanantes?: string[];
  acompananteNombre?: string;
  asistentes?: number;
} | null): string[] {
  if (!item) return [];
  const expected = Math.max(0, (Number(item.asistentes) || 1) - 1);
  if (expected === 0) return [];
  if (Array.isArray(item.acompanantes) && item.acompanantes.length > 0) {
    return item.acompanantes
      .slice(0, expected)
      .map((s) => String(s || '').trim())
      .filter(Boolean);
  }
  if (item.acompananteNombre) {
    return item.acompananteNombre
      .split('·')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, expected);
  }
  return [];
}

export default function CceAcreditacionPrensaClient() {
  // Navigation & Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<'crm' | 'public'>('crm');
  const [isLoadingCrm, setIsLoadingCrm] = useState(false);
  const [crmData, setCrmData] = useState<{
    telemetry: TelemetryData;
    registrations: AcreditacionPrensaRegistration[];
    failedAttempts: AcreditacionPrensaAttempt[];
  } | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [medio, setMedio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [asistentes, setAsistentes] = useState<'1' | '2'>('1');
  const [acompanantes, setAcompanantes] = useState<[string]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState<AcreditacionPrensaRegistration | null>(null);
  const [wasUpdatedRecord, setWasUpdatedRecord] = useState(false);

  // Search & status filters for CRM table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked' | 'pending'>('all');
  const [checkInUpdatingId, setCheckInUpdatingId] = useState<string | null>(null);
  const checkInUpdatingRef = useRef<string | null>(null);

  const fetchCrmData = useCallback(async (silent = false) => {
    // Avoid overwriting optimistic check-in UI while a PATCH is in flight
    if (silent && checkInUpdatingRef.current) return;
    if (!silent) setIsLoadingCrm(true);
    try {
      const res = await fetch('/api/cce-acreditacion-prensa?admin=cce2026', {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && (!silent || !checkInUpdatingRef.current)) {
          setCrmData({
            telemetry: data.telemetry,
            registrations: data.registrations || [],
            failedAttempts: data.failedAttempts || [],
          });
        }
      }
    } catch (err) {
      console.error('Error fetching CRM data:', err);
    } finally {
      if (!silent) setIsLoadingCrm(false);
    }
  }, []);

  // Detect ?admin=cce2026 on mount, restore saved pass on public view, & auto-refresh CRM silently
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let refreshTimer: ReturnType<typeof setInterval> | null = null;

    try {
      const params = new URLSearchParams(window.location.search);
      const adminToken = params.get('admin');
      const isAuthorizedAdmin = adminToken?.toLowerCase().trim() === 'cce2026';

      if (isAuthorizedAdmin) {
        setIsAdmin(true);
        if (params.get('view') === 'public') {
          setAdminTab('public');
        }
        fetchCrmData(false);
        refreshTimer = setInterval(() => {
          fetchCrmData(true);
        }, 15000);
      } else {
        // Restore confirmed pass from localStorage so journalist can show their Folio at Cibeles
        const savedPass = localStorage.getItem(CONFIRMED_STORAGE_KEY);
        if (savedPass) {
          try {
            const parsed = JSON.parse(savedPass);
            if (parsed && parsed.folio && parsed.nombre) {
              setConfirmedRecord(parsed);
            }
          } catch {
            // Ignore malformed storage
          }
        }

        const isPreview = params.get('preview') === '1';
        const sessionKey = 'cce_acreditacion_prensa_visit_tracked';
        if (!isPreview && !sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          fetch('/api/cce-acreditacion-prensa?action=visit', {
            method: 'GET',
            cache: 'no-store',
          }).catch(() => {});
        }
      }
    } catch {
      // Safe fallback
    }

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [fetchCrmData]);

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const cleanPhone = normalizeMxPhoneInput(whatsapp);

    if (!nombre.trim() || nombre.trim().length < 3) {
      newErrors.nombre = 'Ingrese el nombre completo del periodista o reportero titular.';
    }

    if (!medio.trim() || medio.trim().length < 2) {
      newErrors.medio = 'Ingrese el nombre del medio de comunicación o agencia.';
    }

    if (cleanPhone.length !== 10) {
      newErrors.whatsapp = 'Ingrese un número de WhatsApp válido a 10 dígitos.';
    }

    if (!['1', '2'].includes(asistentes)) {
      newErrors.asistentes = 'Seleccione 1 o 2 personas para su acreditación.';
    }

    const neededCompanions = Math.max(0, Number(asistentes) - 1);
    for (let idx = 0; idx < neededCompanions; idx++) {
      const compVal = (acompanantes[idx] || '').trim();
      if (compVal.length < 3) {
        newErrors[`acompanante_${idx}`] = 'Ingrese el nombre completo del acompañante.';
      }
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

    const cleanPhone = normalizeMxPhoneInput(whatsapp);
    const numAsistentes = Math.min(2, Math.max(1, Number(asistentes) || 1));
    const activeCompanions = acompanantes
      .slice(0, numAsistentes - 1)
      .map((name) => name.trim());
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Pre-flight Zero-Loss checkpoint (<1 KB) so zero press registrations can ever be lost
    fetch('/api/cce-acreditacion-prensa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        action: 'attempt',
        attemptId,
        nombre: nombre.trim(),
        medio: medio.trim(),
        whatsapp: cleanPhone,
        asistentes: numAsistentes,
        acompanantes: activeCompanions.length > 0 ? activeCompanions : undefined,
        acompananteNombre:
          activeCompanions.length > 0 ? activeCompanions.join(' · ') : undefined,
      }),
    }).catch(() => {});

    try {
      const res = await fetch('/api/cce-acreditacion-prensa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          nombre: nombre.trim(),
          medio: medio.trim(),
          whatsapp: cleanPhone,
          asistentes: numAsistentes,
          acompanantes: activeCompanions.length > 0 ? activeCompanions : undefined,
          acompananteNombre:
            activeCompanions.length > 0 ? activeCompanions.join(' · ') : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWasUpdatedRecord(Boolean(data.updated));
        setConfirmedRecord(data.record);
        try {
          localStorage.setItem(CONFIRMED_STORAGE_KEY, JSON.stringify(data.record));
        } catch {
          // Ignore storage quota issues
        }
      } else {
        setSubmitError(
          data.error || 'No fue posible registrar la acreditación. Por favor intente nuevamente.'
        );
      }
    } catch (err) {
      console.error('Error submitting press accreditation:', err);
      setSubmitError('Error de conexión. Verifique su señal de internet e intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    try {
      localStorage.removeItem(CONFIRMED_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setConfirmedRecord(null);
    setWasUpdatedRecord(false);
    setNombre('');
    setWhatsapp('');
    setAsistentes('1');
    setAcompanantes(['']);
    setErrors({});
    setSubmitError('');
  };

  // Calendar & Maps Integrations (Jueves 19 de noviembre de 2026 · 9:00 a.m. Ciudad Juárez = 16:00 UTC)
  const handleGoogleCalendar = () => {
    const folioStr = confirmedRecord?.folio || '#CCE-PRENSA-2026';
    const companions = getCompanionList(confirmedRecord);
    const title = encodeURIComponent(
      'Cobertura de Prensa · Galardones Empresariales 2026 y Conferencia Carlos Loret de Mola'
    );
    const details = encodeURIComponent(
      `Acreditación de prensa del Consejo Coordinador Empresarial de Ciudad Juárez para la Entrega de Galardones Empresariales 2026 y la Conferencia Magistral de Carlos Loret de Mola.\n\nFolio: ${folioStr}\nTitular: ${confirmedRecord?.nombre || ''}\nMedio: ${confirmedRecord?.medio || ''}${
        companions.length > 0 ? `\nAcompañante: ${companions[0]}` : ''
      }\n\nCita de prensa: 9:00 a.m.\nSede: Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450, Ciudad Juárez, Chih.).`
    );
    const location = encodeURIComponent(
      'Centro de Eventos Cibeles, Blvd. Tomás Fernández 8450, Ciudad Juárez, Chih.'
    );
    const dates = '20261119T160000Z/20261119T190000Z';
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sprop=name:CCE%20Juarez`;

    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    const folioStr = confirmedRecord?.folio || '#CCE-PRENSA-2026';
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CCE Ciudad Juárez//Acreditacion Prensa Galardones 2026//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:cce-acreditacion-prensa-20261119-${folioStr.replace(/[^A-Z0-9]/gi, '')}@ccejuarez.org`,
      `DTSTAMP:${dtStamp}`,
      'DTSTART:20261119T160000Z',
      'DTEND:20261119T190000Z',
      'SUMMARY:Cobertura de Prensa · Galardones Empresariales 2026 (CCE Juárez)',
      `DESCRIPTION:Acreditación de prensa (${folioStr}) del Consejo Coordinador Empresarial de Ciudad Juárez para la Entrega de Galardones Empresariales 2026 y la Conferencia Magistral de Carlos Loret de Mola. Cita de prensa: 9:00 a.m. en Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450).`,
      'LOCATION:Centro de Eventos Cibeles, Blvd. Tomás Fernández 8450, Ciudad Juárez, Chihuahua',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Acreditacion_Prensa_CCE_Galardones_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleMaps = () => {
    window.open(
      'https://maps.google.com/?q=Centro+de+Eventos+Cibeles+Blvd+Tomas+Fernandez+8450+Ciudad+Juarez',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Toggle Check-in in CRM
  const handleToggleCheckIn = async (record: AcreditacionPrensaRegistration) => {
    if (!crmData) return;
    const newStatus = !record.checkIn;
    checkInUpdatingRef.current = record.id;
    setCheckInUpdatingId(record.id);

    // Optimistic UI update
    setCrmData((prev) =>
      prev
        ? {
            ...prev,
            registrations: prev.registrations.map((r) =>
              r.id === record.id ? { ...r, checkIn: newStatus } : r
            ),
          }
        : prev
    );

    try {
      const res = await fetch('/api/cce-acreditacion-prensa?admin=cce2026', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, checkIn: newStatus }),
      });
      if (!res.ok) {
        setCrmData((prev) =>
          prev
            ? {
                ...prev,
                registrations: prev.registrations.map((r) =>
                  r.id === record.id ? { ...r, checkIn: record.checkIn } : r
                ),
              }
            : prev
        );
      }
    } catch (err) {
      console.error('Error toggling check-in:', err);
    } finally {
      checkInUpdatingRef.current = null;
      setCheckInUpdatingId(null);
    }
  };

  // Build WhatsApp direct link for CRM rows
  const getWhatsAppUrl = (reg: AcreditacionPrensaRegistration) => {
    const cleanDigits = normalizeMxPhoneInput(String(reg.whatsapp || ''));
    const fullPhone = cleanDigits.length === 10 ? `52${cleanDigits}` : cleanDigits;
    const companions = getCompanionList(reg);
    const acompananteTxt =
      companions.length > 0 ? ` (junto con ${companions.join(', ')})` : '';
    const msg = encodeURIComponent(
      `Estimado(a) ${reg.nombre} (${reg.medio}), confirmamos su acreditación de prensa (${reg.folio})${acompananteTxt} para la cobertura de la Entrega de Galardones Empresariales 2026 y la Conferencia Magistral de Carlos Loret de Mola del CCE Ciudad Juárez. Le esperamos el jueves 19 de noviembre a las 9:00 a.m. en Centro de Eventos Cibeles.`
    );
    return `https://wa.me/${fullPhone}?text=${msg}`;
  };

  // 1-Click CSV Export with UTF-8 BOM (Official Press Accreditation Roster)
  const handleExportCsv = () => {
    if (!crmData || crmData.registrations.length === 0) return;

    const headers = [
      'Folio',
      'Periodista Titular',
      'Acompañante',
      'Medio de Comunicación',
      'WhatsApp',
      'Personas Acreditadas',
      'Fecha de Registro',
      'Check-In Cibeles',
      'Ubicación',
      'Dispositivo',
    ];
    const rows = crmData.registrations.map((r) => {
      const comps = getCompanionList(r);
      return [
        `"${(r.folio || r.id).replace(/"/g, '""')}"`,
        `"${(r.nombre || '').replace(/"/g, '""')}"`,
        `"${(comps[0] || '').replace(/"/g, '""')}"`,
        `"${(r.medio || '').replace(/"/g, '""')}"`,
        `"${String(r.whatsapp || '').replace(/"/g, '""')}"`,
        r.asistentes,
        `"${(r.fecha || '').replace(/"/g, '""')}"`,
        r.checkIn ? 'En Sede (Cibeles)' : 'Pendiente',
        `"${(r.location || '').replace(/"/g, '""')}"`,
        `"${(r.device || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'acreditaciones_prensa_cce_galardones_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const totalRegistrations = crmData?.registrations || [];
  const failedAttempts = crmData?.failedAttempts || [];
  const checkedCount = totalRegistrations.filter((r) => r.checkIn).length;
  const pendingCount = totalRegistrations.filter((r) => !r.checkIn).length;
  const checkedPeopleCount = totalRegistrations
    .filter((r) => r.checkIn)
    .reduce((acc, r) => acc + Math.min(2, Math.max(1, Number(r.asistentes) || 1)), 0);

  const filteredRegistrations = totalRegistrations.filter((r) => {
    if (statusFilter === 'checked' && !r.checkIn) return false;
    if (statusFilter === 'pending' && r.checkIn) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    const companions = getCompanionList(r);
    return (
      (r.nombre && r.nombre.toLowerCase().includes(q)) ||
      companions.some((c) => c.toLowerCase().includes(q)) ||
      (r.acompananteNombre && r.acompananteNombre.toLowerCase().includes(q)) ||
      (r.medio && r.medio.toLowerCase().includes(q)) ||
      (r.folio && r.folio.toLowerCase().includes(q)) ||
      (r.whatsapp && r.whatsapp.includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  });

  // Hero Typography Reveal Variants
  const heroTitleWords = ['Acreditación', 'de', 'Prensa'];

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
      {/* SCOPED CSS ARCHITECTURE */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root,
        .cce-page-container {
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
          --cce-serif: var(--font-cinzel), 'Cinzel', Georgia, serif;

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
          background:
            radial-gradient(1300px 900px at 50% -80px, rgba(16, 185, 129, 0.42) 0%, rgba(6, 78, 59, 0.72) 35%, rgba(4, 38, 28, 0.88) 60%, transparent 78%),
            radial-gradient(1100px 800px at 10% 45%, rgba(5, 150, 105, 0.38) 0%, rgba(6, 78, 59, 0.32) 42%, transparent 70%),
            radial-gradient(1000px 750px at 85% 80%, rgba(6, 78, 59, 0.52) 0%, rgba(4, 46, 35, 0.68) 45%, rgba(2, 24, 18, 0.95) 75%, transparent 85%),
            #02120C;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          color: #F8FAFC;
        }

        .cce-page-container.is-crm {
          background: #F8FAFC;
          color: var(--cce-text-dark);
        }

        .cce-living-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
          contain: paint;
          clip-path: inset(0);
        }

        .cce-page-container.is-crm .cce-living-canvas {
          display: none;
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
          top: 30vh;
          left: -10vw;
          width: 45vw;
          max-width: 450px;
          height: 45vw;
          max-height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 65%);
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

        /* Inline-safe Golden Foil Shimmer (no forced block line-breaks inside paragraphs) */
        .cce-golden-shimmer {
          background: linear-gradient(90deg, #F5DE98 0%, #FFE8A3 25%, #FFFFFF 50%, #D4AF37 75%, #F5DE98 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          display: inline;
          font-weight: 700;
          animation: cceGoldShimmer 4s linear infinite;
        }

        @keyframes cceGoldShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Public Main Wrapper (Matches /cce-galardon-EG top alignment) */
        .cce-public-main {
          position: relative;
          z-index: 10;
          padding: 40px 0 0 0;
          width: 100%;
        }

        @media (max-width: 640px) {
          .cce-public-main {
            padding: 24px 0 0 0;
          }
        }

        /* Hero Section & Full-Bleed Cintillos Cruzados en X (Copied from /cce-galardon-EG) */
        .cce-hero {
          position: relative;
          text-align: center;
          max-width: 1040px;
          margin: 0 auto;
          padding: 20px 20px 36px 20px;
          width: 100%;
        }

        .cce-hero-content {
          position: relative;
          z-index: 5;
        }

        .cce-hero-cintillos-fullbleed {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: calc(100% + 760px);
          min-height: 1180px;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }

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

        .cce-sash-bottom-full {
          position: absolute;
          top: 720px;
          left: 50%;
          width: 145vw;
          transform: translateX(-50%) rotate(9.5deg);
          display: flex;
          flex-direction: column;
          gap: 16px;
          filter: drop-shadow(0 28px 45px rgba(0, 0, 0, 0.95));
          opacity: 0.95;
        }

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

        .cce-sheen-delay-1 { animation-delay: 2.5s; }
        .cce-sheen-delay-2 { animation-delay: 5s; }

        @media (max-width: 768px) {
          .cce-hero {
            padding: 10px 14px 26px 14px;
          }
          .cce-hero-cintillos-fullbleed {
            top: -15px;
            height: calc(100% + 620px);
            min-height: 920px;
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
            top: 20px;
            width: 160vw;
            transform: translateX(-50%) rotate(-9deg);
            gap: 10px;
          }
          .cce-x-arm-2 {
            top: 20px;
            width: 160vw;
            transform: translateX(-50%) rotate(9deg);
            gap: 10px;
          }
          .cce-sash-bottom-full {
            top: 560px;
            width: 160vw;
            transform: translateX(-50%) rotate(14deg);
            gap: 10px;
          }
          .cce-sash-reg {
            top: 45%;
            width: 160vw;
            transform: translateX(-50%) rotate(-12deg);
            gap: 10px;
          }
        }

        .cce-hero-logo-box {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 24px auto;
          position: relative;
          z-index: 5;
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

        .cce-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 78, 59, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.45);
          color: #F5DE98;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 9999px;
          margin-bottom: 22px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          max-width: 100%;
        }

        @media (max-width: 640px) {
          .cce-hero-logo-box {
            margin: 8px auto 16px auto;
          }
          .cce-hero-logo-img {
            max-width: 235px;
          }
          .cce-hero-pill {
            font-size: 9.8px;
            letter-spacing: 0.05em;
            padding: 6px 12px;
            gap: 6px;
            line-height: 1.3;
          }
        }

        .cce-hero-title {
          font-family: var(--cce-serif);
          font-size: clamp(30px, 5.2vw, 52px);
          font-weight: 800;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 35%, #F5DE98 70%, #D4AF37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.15;
          letter-spacing: 0.03em;
          margin-bottom: 14px;
          filter: drop-shadow(0 4px 25px rgba(0, 0, 0, 0.9));
          text-wrap: balance;
        }

        .cce-hero-subtitle {
          font-size: clamp(16px, 2.1vw, 19.5px);
          font-weight: 500;
          color: #E2E8F0;
          max-width: 640px;
          margin: 0 auto 8px auto;
          line-height: 1.55;
          text-wrap: balance;
        }

        /* LUXURY CONVOCATORIA INVITATION CARD & LAMBRÍN NICHE */
        .cce-luxury-card-wrapper {
          max-width: 860px;
          margin: 44px auto 72px auto;
          width: 100%;
          padding: 0 12px;
          position: relative;
          z-index: 5;
        }

        .cce-lambrin-niche {
          position: absolute;
          inset: -44px -50px -48px -50px;
          border-radius: 40px;
          pointer-events: none;
          z-index: 1;
        }

        .cce-lambrin-panel {
          position: absolute;
          inset: 0;
          border-radius: 40px;
          border: 2px solid rgba(212, 175, 55, 0.65);
          box-shadow:
            0 35px 95px rgba(0, 0, 0, 0.96),
            0 0 55px rgba(212, 175, 55, 0.4),
            0 0 85px rgba(6, 78, 59, 0.55),
            inset 0 0 60px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          background-color: #2b1a0e;
        }

        .cce-lambrin-slats {
          position: absolute;
          inset: 0;
          background-image: url('/assets/cce-juarez/lambrin_wood_texture.webp');
          background-repeat: repeat-x;
          background-position: center top;
          background-size: 136px 100%;
          opacity: 1;
        }

        .cce-lambrin-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 95% 70% at 50% 15%, rgba(255, 240, 190, 0.32) 0%, rgba(212, 175, 55, 0.15) 45%, transparent 80%),
            linear-gradient(180deg, rgba(255, 235, 170, 0.22) 0%, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
          pointer-events: none;
        }

        .cce-lambrin-light-column {
          position: absolute;
          top: -8px;
          bottom: -8px;
          width: 10px;
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255, 235, 180, 0.85) 0%, rgba(255, 245, 204, 1) 40%, rgba(245, 222, 152, 1) 60%, rgba(212, 175, 55, 0.85) 100%);
          box-shadow:
            0 0 18px 4px rgba(245, 222, 152, 0.55),
            0 0 36px 10px rgba(212, 175, 55, 0.25);
          animation: cceLambrinBreathing 10s ease-in-out infinite alternate;
          will-change: opacity, filter;
          z-index: 2;
        }
        .cce-lambrin-light-left { left: -18px; }
        .cce-lambrin-light-right { right: -18px; }

        @keyframes cceLambrinBreathing {
          0% { opacity: 0.75; filter: brightness(0.95); }
          50% { opacity: 1; filter: brightness(1.22); }
          100% { opacity: 0.75; filter: brightness(0.95); }
        }

        .cce-luxury-card {
          position: relative;
          z-index: 3;
          background: radial-gradient(135% 120% at 50% -8%, #0f6b4f 0%, #0a553e 25%, #064432 55%, #043527 80%, #03261c 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.7);
          border-radius: 24px;
          padding: 48px 52px;
          box-shadow:
            0 35px 95px rgba(0, 0, 0, 0.85),
            0 0 75px rgba(16, 185, 129, 0.35),
            0 0 35px rgba(212, 175, 55, 0.25),
            inset 0 1px 0 rgba(245, 222, 152, 0.75),
            inset 0 0 60px rgba(16, 185, 129, 0.2);
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cce-luxury-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 42px 105px rgba(0, 0, 0, 0.95),
            0 0 85px rgba(16, 185, 129, 0.5),
            0 0 45px rgba(212, 175, 55, 0.4),
            inset 0 1px 0 rgba(255, 245, 204, 0.85),
            inset 0 0 60px rgba(16, 185, 129, 0.3);
          border-color: rgba(245, 222, 152, 0.9);
        }

        .cce-corner-bracket {
          position: absolute;
          width: 26px;
          height: 26px;
          pointer-events: none;
          z-index: 3;
        }
        .cce-corner-tl { top: 14px; left: 14px; border-top: 2px solid #F5DE98; border-left: 2px solid #F5DE98; }
        .cce-corner-tr { top: 14px; right: 14px; border-top: 2px solid #F5DE98; border-right: 2px solid #F5DE98; }
        .cce-corner-bl { bottom: 14px; left: 14px; border-bottom: 2px solid #F5DE98; border-left: 2px solid #F5DE98; }
        .cce-corner-br { bottom: 14px; right: 14px; border-bottom: 2px solid #F5DE98; border-right: 2px solid #F5DE98; }

        .cce-luxury-watermark {
          position: absolute;
          top: 44%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 440px;
          height: 440px;
          opacity: 0.025;
          pointer-events: none;
          background: url('/assets/cce-juarez/cce_logo_hero_white.svg') no-repeat center center;
          background-size: contain;
        }

        .cce-luxury-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
          position: relative;
          z-index: 2;
        }

        .cce-luxury-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--cce-serif);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FFF6D6;
          padding: 9px 24px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #0d6e52 0%, rgba(212, 175, 55, 0.35) 50%, #064e3b 100%);
          border: 1px solid rgba(245, 222, 152, 0.75);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5), 0 0 22px rgba(16, 185, 129, 0.38), inset 0 1px 0 rgba(255, 245, 204, 0.6);
          margin-bottom: 14px;
        }

        .cce-luxury-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 300px;
          gap: 12px;
        }

        .cce-luxury-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0.6) 100%);
        }

        .cce-luxury-divider-line:last-child {
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.6) 0%, rgba(212, 175, 55, 0) 100%);
        }

        .cce-luxury-divider-emblem {
          color: #F5DE98;
          font-size: 11px;
          filter: drop-shadow(0 0 6px rgba(245, 222, 152, 0.8));
        }

        .cce-luxury-letter {
          position: relative;
          z-index: 2;
          text-align: left;
        }

        .cce-luxury-salutation {
          font-family: var(--cce-serif);
          font-size: clamp(20px, 2.5vw, 24.5px);
          font-weight: 700;
          line-height: 1.35;
          color: #FFFFFF;
          margin-bottom: 20px;
          letter-spacing: 0.015em;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
          text-wrap: balance;
        }

        .cce-luxury-paragraph {
          font-size: clamp(16px, 1.75vw, 18.5px);
          line-height: 1.78;
          color: #E2E8F0;
          margin-bottom: 24px;
          font-weight: 400;
          letter-spacing: 0.004em;
          word-spacing: 0.02em;
          text-wrap: pretty;
        }

        .cce-luxury-paragraph strong {
          color: #FFFFFF;
          font-weight: 700;
        }

        .cce-luxury-schedule {
          display: grid;
          grid-template-columns: 1.08fr 0.88fr 1.14fr;
          gap: 22px;
          margin: 28px 0 26px 0;
          background: linear-gradient(145deg, rgba(14, 105, 78, 0.92) 0%, rgba(6, 62, 46, 0.96) 52%, rgba(4, 46, 34, 0.94) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.55);
          border-radius: 18px;
          padding: 22px 24px;
          box-shadow:
            inset 0 1px 0 rgba(245, 222, 152, 0.45),
            inset 0 0 35px rgba(16, 185, 129, 0.25),
            0 14px 40px rgba(0, 0, 0, 0.55);
        }

        .cce-schedule-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          position: relative;
        }

        .cce-schedule-item + .cce-schedule-item::before {
          content: '';
          position: absolute;
          left: -11px;
          top: 6px;
          bottom: 6px;
          width: 1px;
          background: rgba(212, 175, 55, 0.22);
        }

        .cce-schedule-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.48) 0%, rgba(6, 78, 59, 0.95) 55%, rgba(2, 30, 22, 1) 100%);
          border: 1.5px solid rgba(245, 222, 152, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 16px rgba(52, 211, 153, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          color: #F5DE98;
        }

        .cce-schedule-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .cce-schedule-label {
          font-size: 11px;
          font-weight: 800;
          color: #F5DE98;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: var(--cce-serif);
        }

        .cce-schedule-val {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.005em;
          line-height: 1.32;
        }

        .cce-schedule-hint {
          font-size: 13px;
          font-weight: 600;
          color: #34D399;
          margin-top: 1px;
          line-height: 1.35;
        }

        .cce-luxury-closing {
          font-size: clamp(16.5px, 1.85vw, 19px);
          font-weight: 700;
          color: #F5DE98;
          margin-top: 6px;
          margin-bottom: 28px;
          line-height: 1.55;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
          text-wrap: pretty;
        }

        .cce-luxury-footer-seal {
          position: relative;
          padding-top: 22px;
          border-top: 1px solid rgba(212, 175, 55, 0.22);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .cce-seal-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cce-seal-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .cce-seal-org {
          font-family: var(--cce-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #F5DE98;
        }

        .cce-seal-sub {
          font-size: 13px;
          color: #94A3B8;
        }

        .cce-seal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 15px;
          border-radius: 9999px;
          background: rgba(6, 78, 59, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.3);
          color: #34D399;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .cce-luxury-card { padding: 34px 22px; border-radius: 20px; }
          .cce-luxury-schedule { grid-template-columns: 1fr; padding: 18px; gap: 16px; }
          .cce-schedule-item + .cce-schedule-item::before { display: none; }
          .cce-schedule-item + .cce-schedule-item {
            padding-top: 14px;
            border-top: 1px solid rgba(212, 175, 55, 0.16);
          }
          .cce-luxury-footer-seal { flex-direction: column; align-items: flex-start; gap: 14px; }
        }

        @media (max-width: 640px) {
          .cce-luxury-card-wrapper { margin: 36px auto 56px auto; padding: 0 16px; }
          .cce-lambrin-niche { inset: -18px -14px -22px -14px; border-radius: 26px; }
          .cce-lambrin-panel {
            border-radius: 26px;
            border: 1.5px solid rgba(212, 175, 55, 0.65);
            box-shadow: 0 0 35px rgba(245, 222, 152, 0.35), 0 18px 45px rgba(0, 0, 0, 0.95);
          }
          .cce-lambrin-light-column { display: none; }
          .cce-luxury-card { padding: 28px 18px; border-radius: 18px; }
          .cce-luxury-badge {
            font-size: 10px;
            letter-spacing: 0.08em;
            padding: 7px 14px;
            max-width: 100%;
            text-align: center;
            white-space: normal;
          }
          .cce-luxury-divider { max-width: 220px; }
          .cce-corner-bracket { width: 16px; height: 16px; }
          .cce-corner-tl { top: 8px; left: 8px; }
          .cce-corner-tr { top: 8px; right: 8px; }
          .cce-corner-bl { bottom: 8px; left: 8px; }
          .cce-corner-br { bottom: 8px; right: 8px; }
          .cce-seal-org { font-size: 12px; letter-spacing: 0.04em; word-break: break-word; }
          .cce-seal-sub { font-size: 11.5px; }
          .cce-seal-badge { font-size: 11px; padding: 6px 12px; }
        }

        /* VIP ACCREDITATION TERMINAL */
        .cce-reg-section {
          position: relative;
          overflow: hidden;
          contain: paint;
          padding: 12px 0 100px 0;
          width: 100%;
        }

        .cce-main-content {
          position: relative;
          z-index: 5;
          max-width: 720px;
          margin: 0 auto;
          padding: 0 10px;
          width: 100%;
        }

        .cce-form-card {
          background: radial-gradient(130% 120% at 50% -10%, rgba(16, 185, 129, 0.32) 0%, rgba(6, 55, 38, 0.88) 40%, rgba(2, 20, 14, 0.97) 80%, rgba(1, 12, 8, 1) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(212, 175, 55, 0.52);
          border-radius: 22px;
          padding: 40px 36px;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.88),
            0 0 60px rgba(6, 78, 59, 0.45),
            0 0 30px rgba(212, 175, 55, 0.22),
            inset 0 1px 0 rgba(245, 222, 152, 0.5),
            inset 0 0 40px rgba(6, 78, 59, 0.3);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        @media (max-width: 640px) {
          .cce-main-content { padding: 0 12px; }
          .cce-form-card { padding: 28px 18px; border-radius: 18px; }
        }

        .cce-form-card:hover {
          border-color: rgba(245, 222, 152, 0.85);
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.95),
            0 0 75px rgba(6, 78, 59, 0.6),
            0 0 40px rgba(212, 175, 55, 0.35),
            inset 0 1px 0 rgba(255, 245, 204, 0.7);
        }

        .cce-form-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .cce-form-heading {
          font-family: var(--cce-serif);
          font-size: clamp(22px, 3vw, 27px);
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          margin-bottom: 10px;
          text-wrap: balance;
        }

        .cce-form-subheading {
          font-size: 15px;
          color: #CBD5E1;
          line-height: 1.55;
          max-width: 500px;
          margin: 0 auto;
          text-wrap: balance;
        }

        .cce-form-group {
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .cce-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #F5DE98;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
        }

        .cce-required-dot {
          color: #EF4444;
          margin-left: 4px;
        }

        .cce-input {
          width: 100%;
          min-height: 54px;
          padding: 14px 20px;
          font-size: 17px;
          color: #FFFFFF;
          background: linear-gradient(180deg, rgba(1, 15, 10, 0.88) 0%, rgba(3, 28, 19, 0.78) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.38);
          border-radius: 14px;
          outline: none;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
          transition: border-color 0.25s, box-shadow 0.25s, background-color 0.25s;
        }

        .cce-input::placeholder {
          color: #64748B;
        }

        @media (max-width: 640px) {
          .cce-input {
            font-size: 16px;
            padding: 13px 14px;
          }
          .cce-input::placeholder {
            font-size: 14px;
          }
        }

        .cce-input:focus {
          border-color: #F5DE98;
          background: linear-gradient(180deg, rgba(2, 22, 15, 0.95) 0%, rgba(4, 38, 26, 0.88) 100%);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25), 0 0 28px rgba(212, 175, 55, 0.45), inset 0 1px 0 rgba(245, 222, 152, 0.25);
        }

        .cce-input.error {
          border-color: #EF4444;
          background-color: rgba(239, 68, 68, 0.08);
        }

        .cce-field-error {
          font-size: 13px;
          color: #F87171;
          font-weight: 600;
          margin-top: 2px;
        }

        /* 2-Option Segmented Control (Max 2 per media outlet) */
        .cce-attendees-grid-dual {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .cce-attendee-btn-card {
          min-height: 62px;
          padding: 10px 10px;
          background: rgba(2, 18, 12, 0.72);
          border: 1.5px solid rgba(212, 175, 55, 0.3);
          border-radius: 14px;
          color: #E2E8F0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transition: all 0.2s ease;
          text-align: center;
        }

        .cce-attendee-btn-card:hover {
          border-color: #F5DE98;
          background: rgba(212, 175, 55, 0.12);
          color: #FFFFFF;
        }

        .cce-attendee-btn-card.selected {
          background: linear-gradient(135deg, #FFF8DB 0%, #F5DE98 25%, #D4AF37 65%, #AA8022 100%);
          color: #02120C;
          border-color: #FFE8A3;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.75);
        }

        .cce-attendee-btn-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.015em;
        }

        .cce-attendee-btn-sub {
          font-size: 11.5px;
          font-weight: 600;
          opacity: 0.85;
        }

        .cce-companion-box {
          margin-top: 4px;
          padding: 18px;
          border-radius: 16px;
          background: rgba(6, 78, 59, 0.32);
          border: 1px solid rgba(245, 222, 152, 0.38);
          box-shadow: inset 0 1px 0 rgba(245, 222, 152, 0.2);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Submit Button with Bullion Gradient */
        .cce-submit-btn {
          width: 100%;
          min-height: 58px;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF3C4 20%, #F5DE98 45%, #D4AF37 75%, #996F15 100%);
          border: 1.5px solid #FFF1B8;
          border-radius: 14px;
          color: #02120C;
          font-size: 16.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
          box-shadow: 0 14px 38px rgba(212, 175, 55, 0.5), 0 0 35px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 6px rgba(138, 98, 14, 0.5);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, filter 0.2s ease;
        }

        .cce-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 48px rgba(212, 175, 55, 0.65), 0 0 45px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255, 255, 255, 1);
          filter: brightness(1.08);
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

        .cce-spin-icon {
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

        /* CONFIRMATION CARD */
        .cce-confirmation-card {
          background: radial-gradient(130% 120% at 50% -10%, rgba(16, 185, 129, 0.35) 0%, rgba(6, 55, 38, 0.9) 40%, rgba(2, 20, 14, 0.98) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(212, 175, 55, 0.6);
          border-radius: 22px;
          padding: 40px 32px;
          text-align: center;
          box-shadow:
            0 30px 85px rgba(0, 0, 0, 0.9),
            0 0 65px rgba(6, 78, 59, 0.55),
            0 0 35px rgba(212, 175, 55, 0.3),
            inset 0 1px 0 rgba(245, 222, 152, 0.55);
        }

        @media (max-width: 640px) {
          .cce-confirmation-card {
            padding: 28px 16px;
            border-radius: 18px;
          }
        }

        .cce-confirmed-seal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(6, 78, 59, 0.6) 100%);
          border: 1.5px solid #FFE8A3;
          color: #FFF6D6;
          padding: 10px 24px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .cce-confirmed-title {
          font-family: var(--cce-serif);
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 10px;
        }

        .cce-confirmed-summary {
          background: linear-gradient(145deg, rgba(4, 38, 28, 0.75) 0%, rgba(2, 18, 12, 0.88) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.35);
          border-radius: 14px;
          padding: 22px;
          text-align: left;
          margin: 26px 0;
          box-shadow: inset 0 1px 0 rgba(245, 222, 152, 0.2);
        }

        .cce-summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .cce-summary-row {
            flex-direction: column;
            gap: 3px;
          }
          .cce-summary-val {
            text-align: left !important;
          }
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
          text-align: right;
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
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
          color: #FFFFFF;
          border: 1.5px solid rgba(245, 222, 152, 0.5);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .cce-btn-google:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%);
          border-color: #F5DE98;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
        }

        .cce-btn-apple {
          background: linear-gradient(135deg, #059669 0%, #064E3B 50%, #02261C 100%);
          color: #FFFFFF;
          border: 1.5px solid rgba(52, 211, 153, 0.65);
          box-shadow: 0 4px 20px rgba(5, 150, 105, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .cce-btn-apple:hover {
          background: linear-gradient(135deg, #10B981 0%, #059669 50%, #042E23 100%);
          border-color: #6EE7B7;
        }

        .cce-btn-maps {
          background: linear-gradient(135deg, rgba(245, 222, 152, 0.32) 0%, rgba(212, 175, 55, 0.22) 50%, rgba(138, 98, 14, 0.18) 100%);
          color: #FFF6D6;
          border: 1.5px solid rgba(245, 222, 152, 0.65);
          box-shadow: 0 4px 18px rgba(212, 175, 55, 0.3);
        }

        .cce-btn-maps:hover {
          background: linear-gradient(135deg, rgba(255, 243, 196, 0.45) 0%, rgba(245, 222, 152, 0.32) 50%, rgba(170, 128, 34, 0.25) 100%);
          border-color: #FFE8A3;
        }

        .cce-btn-new-pass {
          margin-top: 18px;
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .cce-btn-new-pass:hover {
          color: #F5DE98;
        }

        /* PRIVATE CRM SECTION */
        .cce-crm-container {
          max-width: 1400px;
          min-width: 0;
          margin: 24px auto 60px auto;
          padding: 0 24px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .cce-crm-container {
            margin: 14px auto 44px auto;
            padding: 0 12px;
          }
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

        @media (max-width: 640px) {
          .cce-crm-banner {
            padding: 16px;
          }
        }

        .cce-crm-banner-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
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
          flex-shrink: 0;
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

        .cce-radar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 960px) {
          .cce-radar-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cce-radar-grid { grid-template-columns: 1fr; gap: 12px; }
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

        /* Media Table & Mobile Cards Section */
        .cce-table-card {
          background: #FFFFFF;
          border: 1px solid var(--cce-border-subtle);
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          min-width: 0;
          width: 100%;
        }

        .cce-table-toolbar {
          padding: 16px 20px;
          border-bottom: 1px solid var(--cce-border-subtle);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #FAFCFA;
        }

        @media (max-width: 640px) {
          .cce-table-toolbar {
            padding: 14px;
            flex-direction: column;
            align-items: stretch;
          }
        }

        .cce-search-box {
          position: relative;
          min-width: 0;
          width: 100%;
          flex: 1 1 240px;
          max-width: 380px;
        }

        @media (max-width: 640px) {
          .cce-search-box {
            max-width: 100%;
            flex: none;
          }
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
          max-width: 100%;
        }

        @media (max-width: 640px) {
          .cce-filter-tabs {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            width: 100%;
          }
        }

        .cce-filter-tab {
          border: none;
          background: transparent;
          padding: 6px 12px;
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

        @media (max-width: 640px) {
          .cce-filter-tab {
            padding: 6px 4px;
            font-size: 11px;
          }
        }

        .cce-filter-tab.active {
          background: #FFFFFF;
          color: var(--cce-emerald-dark);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .cce-empty-state-box {
          text-align: center;
          padding: 52px 20px;
          width: 100%;
        }

        .cce-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .cce-mobile-cards-list {
          display: none;
        }

        @media (max-width: 768px) {
          .cce-desktop-table-only {
            display: none;
          }
          .cce-mobile-cards-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 14px;
            background: #F8FAFC;
          }
        }

        .cce-mobile-reg-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
        }

        .cce-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
          min-width: 920px;
        }

        .cce-th {
          background: #F8FAF8;
          color: var(--cce-text-dark);
          font-weight: 700;
          padding: 12px 12px;
          border-bottom: 2px solid rgba(6, 78, 59, 0.1);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .cce-td {
          padding: 13px 12px;
          border-bottom: 1px solid #F1F5F9;
          color: var(--cce-text-dark);
          vertical-align: middle;
        }

        .cce-row:hover {
          background-color: #FAFCFA;
        }

        .cce-avatar-initials {
          width: 30px;
          height: 30px;
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

        .cce-companion-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          padding: 3px 9px;
          border-radius: 6px;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #92400E;
          font-size: 11.5px;
          font-weight: 700;
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
          min-height: 36px;
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
          padding: 6px 11px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          min-height: 36px;
          box-shadow: 0 2px 6px rgba(37, 211, 102, 0.2);
        }

        .cce-btn-wa-row:hover {
          background: #1EBE5D;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
        }
      `,
        }}
      />

      {/* ATMOSPHERIC LIVING CANVAS (Pure Emerald — Zero Golden Background Glow) */}
      <div className="cce-living-canvas" aria-hidden="true">
        <div className="cce-aurora-orb-1" />
        <div className="cce-aurora-orb-2" />
        <div className="cce-aurora-orb-3" />
      </div>

      {/* FLOATING ADMIN CONTROLS (When authenticated & viewing public page) */}
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

      {/* ADMIN CRM VIEW (?admin=cce2026) */}
      {isAdmin && adminTab === 'crm' ? (
        <main className="cce-crm-container">
          {/* Executive Header Banner */}
          <div className="cce-crm-banner">
            <div className="cce-crm-banner-left">
              <div className="cce-crm-live-badge">
                <span className="cce-pulse-dot" />
                <span>CENTRO DE ACREDITACIÓN DE PRENSA · DÍA DEL EVENTO · CCE JUÁREZ</span>
              </div>
              <h2 className="cce-crm-banner-title">
                <BarChart3 size={22} color="#064E3B" style={{ flexShrink: 0 }} />
                <span>Acreditación de Medios · Galardones Empresariales 2026</span>
              </h2>
              <div className="cce-crm-banner-sub">
                Cobertura de Prensa y Conferencia de Carlos Loret de Mola · Jueves 19 de noviembre, 9:00 a.m. · Centro de Eventos Cibeles
              </div>
            </div>

            <div className="cce-crm-actions">
              <div className="cce-crm-capacity-pill">
                <Users size={15} />
                <span>
                  Prensa acreditada: <b>{crmData?.telemetry.totalAsistentes ?? 0}</b> personas
                </span>
              </div>
              <button
                type="button"
                className="cce-crm-btn cce-crm-btn-secondary"
                onClick={() => setAdminTab('public')}
                title="Ver la landing pública de acreditación de prensa"
              >
                Ver Landing
              </button>
              <button
                type="button"
                className="cce-crm-btn cce-crm-btn-secondary"
                onClick={() => fetchCrmData(false)}
                disabled={isLoadingCrm}
              >
                <RefreshCw size={14} className={isLoadingCrm ? 'cce-spin-icon' : ''} />
                Actualizar
              </button>
              <button
                type="button"
                className="cce-crm-btn cce-crm-btn-primary"
                onClick={handleExportCsv}
                title="Descargar padrón de prensa acreditada en CSV compatible con Excel"
              >
                <FileSpreadsheet size={16} />
                Exportar Padrón CSV
              </button>
            </div>
          </div>

          {/* Zero-Loss Rescue Panel (Only visible if an incomplete/failed press attempt occurred) */}
          {failedAttempts.length > 0 && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #F59E0B',
                borderLeft: '5px solid #D97706',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '22px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  fontSize: '13px',
                  color: '#92400E',
                  marginBottom: '8px',
                }}
              >
                <AlertTriangle size={16} color="#D97706" />
                ALERTA ZERO-LOSS: {failedAttempts.length} intento(s) de acreditación interrumpido(s) detectado(s)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {failedAttempts.map((att) => {
                  const attComps = getCompanionList(att);
                  return (
                  <div
                    key={att.attemptId}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      background: '#FFFFFF',
                      border: '1px solid #FDE68A',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <strong>{att.nombre || 'Sin nombre'}</strong> ·{' '}
                      <span style={{ color: '#064E3B', fontWeight: 700 }}>{att.medio || 'Sin medio'}</span>
                      {attComps.length > 0 ? ` (+ ${attComps.join(', ')})` : ''} · {att.fecha}
                      {att.errorReason && (
                        <span style={{ color: '#B91C1C', marginLeft: '8px' }}>({att.errorReason})</span>
                      )}
                    </div>
                    {att.whatsapp && (
                      <a
                        href={`https://wa.me/52${normalizeMxPhoneInput(att.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cce-btn-wa-row"
                      >
                        <MessageSquare size={13} />
                        Contactar {formatPhoneDisplay(att.whatsapp)}
                      </a>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Telemetry Radar Cards */}
          {crmData?.telemetry && (
            <div className="cce-radar-grid">
              <div className="cce-radar-card cce-radar-card-hero">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Personas Acreditadas</span>
                  <div className="cce-radar-icon-box" style={{ background: '#ECFDF5', color: '#064E3B' }}>
                    <Users size={16} />
                  </div>
                </div>
                <div className="cce-radar-value">{crmData.telemetry.totalAsistentes}</div>
                <div className="cce-radar-subtext">
                  En {crmData.telemetry.totalRegistros} registro(s) de prensa
                </div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Medios Acreditados</span>
                  <div className="cce-radar-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    <Award size={16} />
                  </div>
                </div>
                <div className="cce-radar-value">{crmData.telemetry.totalMedios}</div>
                <div className="cce-radar-subtext">Agencias y medios únicos</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Check-in en Cibeles</span>
                  <div className="cce-radar-icon-box" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div
                  className="cce-radar-value"
                  style={{ color: checkedCount > 0 ? '#059669' : '#64748B' }}
                >
                  {checkedCount}{' '}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>
                    / {totalRegistrations.length}
                  </span>
                </div>
                <div className="cce-radar-subtext">
                  {checkedPeopleCount} acreditados en sede · {pendingCount} por llegar
                </div>
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
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
                    ({crmData.telemetry.uniqueVisits} únicos)
                  </span>
                </div>
                <div className="cce-radar-subtext">Visitas reales sin bots</div>
              </div>

              <div className="cce-radar-card">
                <div className="cce-radar-header">
                  <span className="cce-radar-label">Tasa de Conversión</span>
                  <div className="cce-radar-icon-box" style={{ background: '#FFFBEB', color: '#D97706' }}>
                    <Sparkles size={16} />
                  </div>
                </div>
                <div className="cce-radar-value" style={{ color: '#B45309' }}>
                  {crmData.telemetry.conversionRate}
                </div>
                <div className="cce-radar-subtext">Registros vs. Visitas totales</div>
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

          {/* Media Table & Mobile Reception Cards */}
          <div className="cce-table-card">
            <div className="cce-table-toolbar">
              <div className="cce-search-box">
                <Search size={16} className="cce-search-icon" />
                <input
                  type="text"
                  placeholder="Buscar periodista, acompañante, medio o WhatsApp..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
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
                  ✓ En Cibeles ({checkedCount})
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
                Mostrando <b>{filteredRegistrations.length}</b> acreditaciones
              </div>
            </div>

            {totalRegistrations.length === 0 ? (
              <div className="cce-empty-state-box">
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#064E3B',
                    }}
                  >
                    <Inbox size={22} />
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>
                    Sin Acreditaciones de Prensa Registradas Aún
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748B',
                      maxWidth: '460px',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Colección Cloud Firestore dedicada y conectada en tiempo real. Cada periodista y camarógrafo acreditado para el evento aparecerá aquí automáticamente.
                  </p>
                </div>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="cce-empty-state-box" style={{ padding: '36px 20px', color: '#94A3B8', fontSize: '13.5px' }}>
                No se encontraron acreditaciones que coincidan con la búsqueda o filtro aplicado.
              </div>
            ) : (
              <>
                {/* Desktop Executive Table */}
                <div className="cce-table-wrapper cce-desktop-table-only">
                  <table className="cce-table">
                    <thead>
                      <tr>
                        <th className="cce-th" style={{ width: '12%' }}>Folio</th>
                        <th className="cce-th" style={{ width: '28%' }}>Periodista y Equipo</th>
                        <th className="cce-th" style={{ width: '20%' }}>Medio</th>
                        <th className="cce-th" style={{ width: '14%' }}>WhatsApp</th>
                        <th className="cce-th" style={{ width: '8%', textAlign: 'center' }}>Personas</th>
                        <th className="cce-th" style={{ width: '9%' }}>Registro</th>
                        <th className="cce-th" style={{ width: '9%', textAlign: 'center' }}>Acceso Cibeles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="cce-row">
                          <td className="cce-td">
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                fontWeight: 800,
                                color: '#064E3B',
                                background: '#ECFDF5',
                                padding: '3px 7px',
                                borderRadius: '6px',
                                border: '1px solid #A7F3D0',
                              }}
                            >
                              {reg.folio || '#CCE-PRENSA'}
                            </span>
                          </td>
                          <td className="cce-td">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <span className="cce-avatar-initials">
                                {reg.nombre.slice(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{reg.nombre}</div>
                                {getCompanionList(reg).map((compName, idx, arr) => (
                                  <div key={idx} className="cce-companion-pill">
                                    <UserPlus size={12} />
                                    <span>
                                      {arr.length === 1 ? 'Acompañante' : `Acompañante ${idx + 1}`}:{' '}
                                      {compName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="cce-td">
                            <span className="cce-medio-badge">{reg.medio}</span>
                          </td>
                          <td className="cce-td">
                            {reg.whatsapp ? (
                              <a
                                href={getWhatsAppUrl(reg)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cce-btn-wa-row"
                                title={`Enviar WhatsApp a ${reg.nombre}`}
                              >
                                <MessageSquare size={13} />
                                {formatPhoneDisplay(reg.whatsapp)}
                              </a>
                            ) : (
                              <span style={{ color: '#94A3B8' }}>—</span>
                            )}
                          </td>
                          <td className="cce-td" style={{ textAlign: 'center' }}>
                            <span className="cce-asistentes-pill">
                              <Users size={12} />
                              {reg.asistentes}
                            </span>
                          </td>
                          <td className="cce-td" style={{ color: '#64748B', fontSize: '12px' }}>
                            {reg.fecha}
                          </td>
                          <td className="cce-td" style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className={`cce-status-badge ${
                                reg.checkIn ? 'cce-status-checked' : 'cce-status-pending'
                              }`}
                              onClick={() => handleToggleCheckIn(reg)}
                              disabled={checkInUpdatingId === reg.id}
                              title="Registrar asistencia en Centro de Eventos Cibeles"
                            >
                              <CheckCircle2 size={13} />
                              {reg.checkIn ? 'En Cibeles' : 'Check-in'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Reception Cards (< 768px — 1-thumb Check-in in Cibeles) */}
                <div className="cce-mobile-cards-list">
                  {filteredRegistrations.map((reg) => (
                    <div key={reg.id} className="cce-mobile-reg-card">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 800,
                            color: '#064E3B',
                            background: '#ECFDF5',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #A7F3D0',
                          }}
                        >
                          {reg.folio || '#CCE-PRENSA'}
                        </span>
                        <span className="cce-asistentes-pill">
                          <Users size={12} />
                          {reg.asistentes} persona{Number(reg.asistentes) === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                          {reg.nombre}
                        </div>
                        {getCompanionList(reg).map((compName, idx, arr) => (
                          <div key={idx} className="cce-companion-pill">
                            <UserPlus size={12} />
                            <span>
                              {arr.length === 1 ? 'Acompañante' : `Acompañante ${idx + 1}`}:{' '}
                              {compName}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span className="cce-medio-badge">{reg.medio}</span>
                        <span style={{ fontSize: '11.5px', color: '#64748B' }}>{reg.fecha}</span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: reg.whatsapp ? '1fr 1fr' : '1fr',
                          gap: '8px',
                          marginTop: '4px',
                        }}
                      >
                        {reg.whatsapp && (
                          <a
                            href={getWhatsAppUrl(reg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cce-btn-wa-row"
                            style={{ width: '100%' }}
                          >
                            <MessageSquare size={13} />
                            WhatsApp
                          </a>
                        )}
                        <button
                          type="button"
                          className={`cce-status-badge ${
                            reg.checkIn ? 'cce-status-checked' : 'cce-status-pending'
                          }`}
                          style={{ width: '100%' }}
                          onClick={() => handleToggleCheckIn(reg)}
                          disabled={checkInUpdatingId === reg.id}
                        >
                          <CheckCircle2 size={14} />
                          {reg.checkIn ? 'En Cibeles' : 'Check-in'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      ) : (
        /* PUBLIC PRESS ACCREDITATION LANDING VIEW */
        <main className="cce-public-main">
          {/* HERO SECTION */}
          <section className="cce-hero">
            {/* Diagonal Beveled Gold Ribbons Full-Bleed (Cintillos Cruzados en X from /cce-galardon-EG) */}
            <div className="cce-hero-cintillos-fullbleed" aria-hidden="true">
              <div className="cce-x-arm-1">
                <div className="cce-band-sub" />
                <div className="cce-band-main">
                  <div className="cce-band-sheen" />
                </div>
              </div>
              <div className="cce-x-arm-2">
                <div className="cce-band-main">
                  <div className="cce-band-sheen cce-sheen-delay-1" />
                </div>
                <div className="cce-band-sub" />
              </div>
              <div className="cce-sash-bottom-full">
                <div className="cce-band-main-sash">
                  <div className="cce-band-sheen cce-sheen-delay-2" />
                </div>
                <div className="cce-band-sub" />
              </div>
            </div>

            <motion.div
              className="cce-hero-content"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <motion.div
                className="cce-hero-logo-box"
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <img
                  src="/assets/cce-juarez/cce_logo_verde_transparente.png"
                  width={340}
                  height={217}
                  alt="Consejo Coordinador Empresarial Ciudad Juárez"
                  className="cce-hero-logo-img"
                />
              </motion.div>

              <div className="cce-hero-pill">
                <Sparkles size={14} />
                Convocatoria a Medios · Cobertura del Evento
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
                <span className="cce-golden-shimmer">
                  Entrega de Galardones Empresariales 2026
                </span>{' '}
                y Conferencia Magistral de{' '}
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>Carlos Loret de Mola</strong>
              </div>
            </motion.div>
          </section>

          {/* LUXURY CONVOCATORIA & PRESS ACCREDITATION CARD */}
          <div className="cce-luxury-card-wrapper">
            <div className="cce-lambrin-niche" aria-hidden="true">
              <div className="cce-lambrin-light-column cce-lambrin-light-left" />
              <div className="cce-lambrin-light-column cce-lambrin-light-right" />
              <div className="cce-lambrin-panel">
                <div className="cce-lambrin-slats" />
                <div className="cce-lambrin-overlay" />
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="cce-luxury-card"
            >
              <div className="cce-corner-bracket cce-corner-tl" />
              <div className="cce-corner-bracket cce-corner-tr" />
              <div className="cce-corner-bracket cce-corner-bl" />
              <div className="cce-corner-bracket cce-corner-br" />

              <div className="cce-luxury-watermark" aria-hidden="true" />

              <div className="cce-luxury-header">
                <div className="cce-luxury-badge">
                  <Sparkles size={13} color="#F5DE98" />
                  INVITACIÓN INSTITUCIONAL
                  <Sparkles size={13} color="#F5DE98" />
                </div>
                <div className="cce-luxury-divider">
                  <span className="cce-luxury-divider-line" />
                  <span className="cce-luxury-divider-emblem">✦</span>
                  <span className="cce-luxury-divider-line" />
                </div>
              </div>

              <div className="cce-luxury-letter">
                <div className="cce-luxury-salutation">
                  Estimados compañeros de los medios de comunicación:
                </div>

                <p className="cce-luxury-paragraph">
                  El <strong>Consejo Coordinador Empresarial de Ciudad Juárez</strong> les invita
                  cordialmente a acreditar a su equipo para la cobertura de la{' '}
                  <span className="cce-golden-shimmer" style={{ fontWeight: 800 }}>
                    Entrega de Galardones Empresariales 2026
                  </span>
                  , en sus categorías <em>Estrella Ascendente</em> y <em>De Altos Vuelos</em>, así
                  como de la Conferencia Magistral impartida por{' '}
                  <strong>Carlos Loret de Mola</strong>.
                </p>

                {/* Coordinate Schedule Grid */}
                <div className="cce-luxury-schedule">
                  {/* Segment 1: Fecha */}
                  <div className="cce-schedule-item">
                    <div className="cce-schedule-icon-wrap" aria-hidden="true">
                      <Calendar size={22} color="#F5DE98" />
                    </div>
                    <div className="cce-schedule-info">
                      <span className="cce-schedule-label">FECHA DEL EVENTO</span>
                      <strong className="cce-schedule-val">Jueves 19 de noviembre</strong>
                      <span className="cce-schedule-hint">Galardones y Conferencia 2026</span>
                    </div>
                  </div>

                  {/* Segment 2: Horario (Vector Gold Clock Icon) */}
                  <div className="cce-schedule-item">
                    <div className="cce-schedule-icon-wrap" aria-hidden="true">
                      <Clock size={22} color="#F5DE98" />
                    </div>
                    <div className="cce-schedule-info">
                      <span className="cce-schedule-label">CITA DE PRENSA</span>
                      <strong className="cce-schedule-val">9:00 a.m.</strong>
                      <span className="cce-schedule-hint">Recepción de medios acreditados</span>
                    </div>
                  </div>

                  {/* Segment 3: Sede Oficial Centro de Eventos Cibeles */}
                  <div className="cce-schedule-item">
                    <div className="cce-schedule-icon-wrap" aria-hidden="true">
                      <Building2 size={22} color="#F5DE98" />
                    </div>
                    <div className="cce-schedule-info">
                      <span className="cce-schedule-label">SEDE</span>
                      <strong className="cce-schedule-val">Centro de Eventos Cibeles</strong>
                      <span className="cce-schedule-hint">Blvd. Tomás Fernández 8450</span>
                    </div>
                  </div>
                </div>

                <p className="cce-luxury-paragraph">
                  Para confirmar su acreditación, les solicitamos registrar los datos del periodista
                  titular y, en caso de requerirlo, el nombre de su acompañante (camarógrafo,
                  fotógrafo o equipo editorial). El registro está limitado a un máximo de{' '}
                  <strong>dos personas por medio</strong>.
                </p>

                <div className="cce-luxury-closing">
                  Agradecemos de antemano su puntual asistencia y cobertura periodística.
                </div>

                <div className="cce-luxury-footer-seal">
                  <div className="cce-seal-content">
                    <div className="cce-seal-text">
                      <div className="cce-seal-org">
                        CONSEJO COORDINADOR EMPRESARIAL DE CIUDAD JUÁREZ
                      </div>
                      <div className="cce-seal-sub">
                        Coordinación de Comunicación y Prensa · Galardones 2026
                      </div>
                    </div>
                  </div>

                  <div className="cce-seal-badge">
                    <ShieldCheck size={14} />
                    <span>Acceso Exclusivo Prensa</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MAIN FORM / CONFIRMATION SECTION */}
          <div className="cce-reg-section">
            <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
              <div className="cce-sash-reg">
                <div className="cce-band-sub" />
                <div className="cce-band-main-sash">
                  <div className="cce-band-sheen cce-sheen-delay-1" />
                </div>
              </div>
            </div>

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
                    {wasUpdatedRecord ? 'Acreditación Actualizada' : 'Acreditación Registrada'} ·{' '}
                    {confirmedRecord.folio}
                  </div>

                  <h2 className="cce-confirmed-title">
                    {wasUpdatedRecord
                      ? 'Datos de acreditación actualizados'
                      : 'Acreditación confirmada'}
                  </h2>

                  <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    Su acreditación quedó registrada en el padrón de prensa del CCE Ciudad Juárez
                    para el jueves 19 de noviembre a las 9:00 a.m. en Centro de Eventos Cibeles.
                  </p>

                  <div className="cce-confirmed-summary">
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Folio de prensa:</span>
                      <span className="cce-summary-val" style={{ color: '#F5DE98' }}>
                        {confirmedRecord.folio}
                      </span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Periodista titular:</span>
                      <span className="cce-summary-val">{confirmedRecord.nombre}</span>
                    </div>
                    {getCompanionList(confirmedRecord).map((compName, idx, arr) => (
                      <div key={idx} className="cce-summary-row">
                        <span className="cce-summary-label">
                          {arr.length === 1
                            ? 'Acompañante acreditado:'
                            : `Acompañante ${idx + 1}:`}
                        </span>
                        <span className="cce-summary-val">{compName}</span>
                      </div>
                    ))}
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Medio de comunicación:</span>
                      <span className="cce-summary-val">{confirmedRecord.medio}</span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">WhatsApp registrado:</span>
                      <span className="cce-summary-val">
                        {formatPhoneDisplay(confirmedRecord.whatsapp)}
                      </span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Personas acreditadas:</span>
                      <span className="cce-summary-val">
                        {confirmedRecord.asistentes} persona
                        {Number(confirmedRecord.asistentes) === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Cita de prensa:</span>
                      <span className="cce-summary-val">
                        Jueves 19 de noviembre · 9:00 a.m.
                      </span>
                    </div>
                    <div className="cce-summary-row">
                      <span className="cce-summary-label">Sede:</span>
                      <span className="cce-summary-val">
                        Centro de Eventos Cibeles · Blvd. Tomás Fernández 8450
                      </span>
                    </div>
                  </div>

                  {/* 3 ACTION BUTTONS */}
                  <div className="cce-action-buttons-grid">
                    <button
                      type="button"
                      className="cce-action-btn cce-btn-google"
                      onClick={handleGoogleCalendar}
                    >
                      <Calendar size={18} />
                      Añadir a Google Calendar
                    </button>

                    <button
                      type="button"
                      className="cce-action-btn cce-btn-apple"
                      onClick={handleDownloadIcs}
                    >
                      <Download size={18} />
                      Añadir a Apple Calendar (.ics)
                    </button>

                    <button
                      type="button"
                      className="cce-action-btn cce-btn-maps"
                      onClick={handleGoogleMaps}
                    >
                      <MapPin size={18} />
                      Ubicación en Google Maps
                      <ExternalLink size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cce-btn-new-pass"
                    onClick={handleRegisterAnother}
                  >
                    <PlusCircle size={14} />
                    Registrar a otro integrante de prensa
                  </button>
                </motion.div>
              ) : (
                /* PRESS ACCREDITATION FORM */
                <motion.div
                  key="form"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="cce-form-card"
                >
                  <div className="cce-form-header">
                    <h2 className="cce-form-heading">Registro de Prensa</h2>
                    <p className="cce-form-subheading">
                      Complete los datos de quienes asistirán a cubrir el evento para confirmar su
                      acreditación.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Campo 1: Nombre Completo del Titular */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="nombre">
                        <span>
                          Periodista o Reportero Titular
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: '#94A3B8',
                            fontWeight: 500,
                            textTransform: 'none',
                          }}
                        >
                          Titular acreditado
                        </span>
                      </label>
                      <input
                        id="nombre"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Nombre y apellidos completos"
                        value={nombre}
                        onChange={(e) => {
                          setNombre(e.target.value);
                          if (errors.nombre) setErrors({ ...errors, nombre: '' });
                        }}
                        className={`cce-input ${errors.nombre ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.nombre && <span className="cce-field-error">{errors.nombre}</span>}
                    </div>

                    {/* Campo 2: Medio de Comunicación */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="medio">
                        <span>
                          Medio de Comunicación
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: '#94A3B8',
                            fontWeight: 500,
                            textTransform: 'none',
                          }}
                        >
                          Prensa, radio, TV o medio digital
                        </span>
                      </label>
                      <input
                        id="medio"
                        name="organization"
                        type="text"
                        autoComplete="organization"
                        placeholder="Nombre del medio o plataforma informativa"
                        value={medio}
                        onChange={(e) => {
                          setMedio(e.target.value);
                          if (errors.medio) setErrors({ ...errors, medio: '' });
                        }}
                        className={`cce-input ${errors.medio ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.medio && <span className="cce-field-error">{errors.medio}</span>}
                    </div>

                    {/* Campo 3: WhatsApp (10 dígitos — compatible con autofill +52) */}
                    <div className="cce-form-group">
                      <label className="cce-label" htmlFor="whatsapp">
                        <span>
                          WhatsApp de Contacto
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: whatsapp.length === 10 ? '#34D399' : '#94A3B8',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {whatsapp.length > 0 ? `${whatsapp.length}/10 dígitos` : '10 dígitos'}
                        </span>
                      </label>
                      <input
                        id="whatsapp"
                        name="tel"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={20}
                        placeholder="Número celular a 10 dígitos"
                        value={whatsapp}
                        onChange={(e) => {
                          const normalized = normalizeMxPhoneInput(e.target.value);
                          setWhatsapp(normalized);
                          if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
                        }}
                        className={`cce-input ${errors.whatsapp ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.whatsapp && <span className="cce-field-error">{errors.whatsapp}</span>}
                    </div>

                    {/* Campo 4: Personas a Acreditar (Topado de 1 a 2 por medio) */}
                    <div className="cce-form-group">
                      <label className="cce-label">
                        <span>
                          Personas a Acreditar
                          <span className="cce-required-dot">*</span>
                        </span>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: '#94A3B8',
                            fontWeight: 500,
                            textTransform: 'none',
                          }}
                        >
                          Máximo 2 por medio
                        </span>
                      </label>
                      <div className="cce-attendees-grid-dual">
                        {(
                          [
                            { val: '1', title: '1 Persona', sub: 'Individual' },
                            { val: '2', title: '2 Personas', sub: 'Titular + Acompañante' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            className={`cce-attendee-btn-card ${asistentes === opt.val ? 'selected' : ''}`}
                            onClick={() => {
                              setAsistentes(opt.val);
                              const nextErrors: Record<string, string> = { ...errors, asistentes: '' };
                              if (opt.val === '1') {
                                nextErrors.acompanante_0 = '';
                              }
                              setErrors(nextErrors);
                            }}
                            disabled={isSubmitting}
                          >
                            <span className="cce-attendee-btn-title">{opt.title}</span>
                            <span className="cce-attendee-btn-sub">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                      {errors.asistentes && (
                        <span className="cce-field-error">{errors.asistentes}</span>
                      )}
                    </div>

                    {/* Campo Condicional: Nombre del Acompañante (cuando elige 2 Personas) */}
                    <AnimatePresence initial={false}>
                      {asistentes === '2' && (
                        <motion.div
                          key="companions-fields"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.24 }}
                          style={{ overflow: 'hidden', marginBottom: '12px' }}
                        >
                          <div className="cce-companion-box">
                            <div className="cce-form-group" style={{ marginBottom: 0 }}>
                              <label className="cce-label" htmlFor="acompanante_0">
                                <span>
                                  Nombre del Acompañante
                                  <span className="cce-required-dot">*</span>
                                </span>
                                <span
                                  style={{
                                    fontSize: '11.5px',
                                    color: '#34D399',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                  }}
                                >
                                  Persona 2 de 2
                                </span>
                              </label>
                              <input
                                id="acompanante_0"
                                type="text"
                                autoComplete="off"
                                placeholder="Nombre y apellidos completos del acompañante"
                                value={acompanantes[0]}
                                onChange={(e) => {
                                  setAcompanantes([e.target.value]);
                                  if (errors.acompanante_0) {
                                    setErrors({ ...errors, acompanante_0: '' });
                                  }
                                }}
                                className={`cce-input ${errors.acompanante_0 ? 'error' : ''}`}
                                disabled={isSubmitting}
                              />
                              {errors.acompanante_0 && (
                                <span className="cce-field-error">{errors.acompanante_0}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {submitError && <div className="cce-submit-alert-error">{submitError}</div>}

                    <button type="submit" className="cce-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="cce-spinner" />
                          <span>Registrando acreditación...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Confirmar Acreditación</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
