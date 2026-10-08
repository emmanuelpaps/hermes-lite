'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Lock,
  LayoutGrid,
  FileText,
  Sparkles,
  PhoneCall,
  Share2,
  Building2,
  X,
  Briefcase,
  Target,
  Mic,
} from 'lucide-react';

interface TableItem {
  id: number;
  category: 'camaras' | 'vip' | 'consejo' | 'disponibles';
  categoryLabel: string;
  assignedTo: string;
  zone: string;
  capacity: number;
  status: 'Asignada' | 'En Proceso' | 'Disponible';
}

const CHAMBERS_NAMES = [
  'CANACINTRA Ciudad Juárez (Mesa 1)',
  'CANACINTRA Ciudad Juárez (Mesa 2)',
  'COPARMEX Ciudad Juárez (Mesa 3)',
  'COPARMEX Ciudad Juárez (Mesa 4)',
  'CANACO Servytur Juárez (Mesa 5)',
  'CANACO Servytur Juárez (Mesa 6)',
  'INDEX Juárez - Industria de Exportación (Mesa 7)',
  'INDEX Juárez - Industria de Exportación (Mesa 8)',
  'Asociación de Hoteles y Moteles (Mesa 9)',
  'Asociación de Hoteles y Moteles (Mesa 10)',
  'Asociación de Agentes Aduanales AAA (Mesa 11)',
  'Asociación de Agentes Aduanales AAA (Mesa 12)',
  'CMIC - Cámara Mexicana de la Construcción (Mesa 13)',
  'CMIC - Cámara Mexicana de la Construcción (Mesa 14)',
  'CANIRAC - Restaurantes y Alimentos (Mesa 15)',
  'CANIRAC - Restaurantes y Alimentos (Mesa 16)',
  'AMPI - Profesionales Inmobiliarios (Mesa 17)',
  'AMPI - Profesionales Inmobiliarios (Mesa 18)',
  'Desarrollo Económico de Juárez DECJ (Mesa 19)',
  'Desarrollo Económico de Juárez DECJ (Mesa 20)',
  'CANAGRAF - Artes Gráficas (Mesa 21)',
  'CANAGRAF - Artes Gráficas (Mesa 22)',
  'Consejo Coordinador Empresarial Presidium (Mesa 23)',
  'Consejo Coordinador Empresarial Presidium (Mesa 24)',
];

const TABLES_DATA: TableItem[] = Array.from({ length: 60 }, (_, i) => {
  const tableNum = i + 1;
  if (tableNum <= 24) {
    return {
      id: tableNum,
      category: 'camaras',
      categoryLabel: '24 Mesas Cámaras CCE',
      assignedTo: CHAMBERS_NAMES[tableNum - 1],
      zone: tableNum <= 8 ? 'Zona Presidium Principal' : 'Zona Cámaras Institucionales',
      capacity: 10,
      status: 'Asignada',
    };
  } else if (tableNum <= 40) {
    const isReserved = tableNum <= 36;
    return {
      id: tableNum,
      category: 'vip',
      categoryLabel: 'Patrocinios VIP Corporativos',
      assignedTo: isReserved
        ? `Empresa Patrocinadora Diamante #${tableNum - 24}`
        : 'Patrocinio VIP en Proceso de Asignación',
      zone: 'Zona VIP Preferente',
      capacity: 10,
      status: isReserved ? 'Asignada' : 'En Proceso',
    };
  } else if (tableNum <= 52) {
    const isDirect = tableNum <= 48;
    return {
      id: tableNum,
      category: 'consejo',
      categoryLabel: 'Venta Directa Consejo',
      assignedTo: isDirect
        ? `Mesa Reservada Consejo Directivo CCE #${tableNum - 40}`
        : 'Venta Directa en Validación',
      zone: 'Zona Central Ejecutiva',
      capacity: 10,
      status: isDirect ? 'Asignada' : 'En Proceso',
    };
  } else {
    return {
      id: tableNum,
      category: 'disponibles',
      categoryLabel: 'Disponibles',
      assignedTo: 'Mesa Disponible para Asignación Empresarial',
      zone: 'Zona General',
      capacity: 10,
      status: 'Disponible',
    };
  }
});

export default function CceJuarezClient() {
  const [tableFilter, setTableFilter] = useState<'all' | 'camaras' | 'vip' | 'consejo' | 'disponibles'>('all');
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [copiedClabe, setCopiedClabe] = useState(false);

  const filteredTables = useMemo(() => {
    if (tableFilter === 'all') return TABLES_DATA;
    return TABLES_DATA.filter((t) => t.category === tableFilter);
  }, [tableFilter]);

  const handleCopyClabe = async () => {
    try {
      await navigator.clipboard.writeText('058164657492400290');
      setCopiedClabe(true);
      setTimeout(() => setCopiedClabe(false), 2500);
    } catch {
      setCopiedClabe(true);
      setTimeout(() => setCopiedClabe(false), 2500);
    }
  };

  const whatsappBaseUrl = 'https://wa.me/526563117565';
  const whatsappSponsorshipText = encodeURIComponent(
    'Hola Emmanuel, represento a una empresa interesada en conocer los paquetes de patrocinio y asignación de mesas para el evento Empresario del Año 2026 del CCE Ciudad Juárez con Carlos Loret de Mola. Solicito el dossier confidencial.'
  );
  const whatsappGeneralText = encodeURIComponent(
    'Hola Emmanuel, solicito más información sobre la plataforma ejecutiva para el evento Empresario del Año 2026 del CCE Ciudad Juárez con Carlos Loret de Mola.'
  );

  return (
    <div className="cce-page-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --cce-emerald: #064E3B;
              --cce-emerald-dark: #042E23;
              --cce-emerald-light: #059669;
              --cce-emerald-accent: #10B981;
              --cce-emerald-wash: #ECFDF5;
              --cce-gold: #D4AF37;
              --cce-gold-dark: #B8860B;
              --cce-gold-light: #FFFBEB;
              --cce-gold-border: #FDE68A;
              --cce-cream: #FFFDF9;
              --cce-bg: #FFFDF9;
              --cce-bg-cream: #FFFDF9;
              --cce-bg-white: #FFFFFF;
              --cce-text-dark: #0F172A;
              --cce-text-muted: #475569;
              --cce-slate-card: #0B261D;
            }

            html, body {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
              background-color: var(--cce-bg-cream);
              color: var(--cce-text-dark);
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
            }

            .cce-page-root {
              overflow-x: hidden;
              width: 100%;
              min-height: 100vh;
              background: var(--cce-bg-cream);
            }

            /* Typography */
            h1, h2, h3, h4 {
              text-wrap: balance;
              color: var(--cce-text-dark);
              letter-spacing: -0.025em;
              font-weight: 800;
            }

            .cce-flow-text {
              font-size: 0.9375rem; /* 15px >= 14px */
              line-height: 1.6;
              color: var(--cce-text-muted);
            }

            .cce-qr-text {
              font-size: 0.875rem; /* 14px >= 14px */
              line-height: 1.5;
              color: var(--cce-text-muted);
            }

            /* Buttons & Touch targets */
            .cce-btn {
              min-height: 44px;
              min-width: 44px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 10px 20px;
              border-radius: 8px;
              font-size: 0.9375rem;
              font-weight: 700;
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
              box-sizing: border-box;
            }

            .cce-btn-primary {
              background: var(--cce-emerald);
              color: #FFFFFF;
              border: 1px solid var(--cce-emerald-dark);
            }
            .cce-btn-primary:hover {
              background: var(--cce-emerald-dark);
            }

            .cce-btn-gold {
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #042E23;
              border: 1px solid #D4AF37;
              box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
            }
            .cce-btn-gold:hover {
              filter: brightness(1.08);
            }

            .cce-btn-outline {
              background: transparent;
              color: var(--cce-emerald);
              border: 1.5px solid var(--cce-emerald);
            }
            .cce-btn-outline:hover {
              background: var(--cce-emerald-wash);
            }

            .cce-btn-whatsapp {
              background: #059669;
              color: #FFFFFF;
              border: 1px solid #047857;
            }
            .cce-btn-whatsapp:hover {
              background: #047857;
            }

            /* Inputs */
            .cce-input {
              min-height: 44px;
              font-size: 16px;
              padding: 10px 14px;
              border: 1px solid #CBD5E1;
              border-radius: 8px;
              box-sizing: border-box;
              width: 100%;
              color: var(--cce-text-dark);
              background: #FFFFFF;
            }
            .cce-input:focus {
              outline: none;
              border-color: var(--cce-emerald);
              box-shadow: 0 0 0 3px rgba(6, 78, 59, 0.15);
            }

            /* Category Pills */
            .cce-cat-pill {
              min-height: 44px;
              padding: 8px 16px;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 700;
              cursor: pointer;
              border: 1px solid #E2E8F0;
              background: #FFFFFF;
              color: var(--cce-text-muted);
              display: inline-flex;
              align-items: center;
              gap: 8px;
              transition: all 0.2s ease;
            }
            .cce-cat-pill.active {
              background: var(--cce-emerald);
              color: #FFFFFF;
              border-color: var(--cce-emerald);
              box-shadow: 0 4px 10px rgba(6, 78, 59, 0.2);
            }

            /* Cards */
            .cce-plan-card {
              background: #FFFFFF;
              border: 1px solid #E2E8F0;
              border-radius: 16px;
              padding: 2rem;
              box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
            }

            /* Modal Close Target */
            .cce-modal-close {
              width: 44px;
              height: 44px;
              min-width: 44px;
              min-height: 44px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              background: #F1F5F9;
              border: none;
              cursor: pointer;
              color: #475569;
              transition: background 0.2s ease;
            }
            .cce-modal-close:hover {
              background: #E2E8F0;
              color: #0F172A;
            }

            /* Responsive overrides */
            @media (max-width: 768px) {
              .cce-plan-card {
                padding: 1.5rem;
              }
            }
            @media (max-width: 640px) {
              .cce-plan-card {
                padding: 1.25rem;
              }
              .cce-hero-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-metrics-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-deliverables-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-financial-box {
                padding: 1.5rem !important;
              }
              .cce-seating-grid {
                grid-template-columns: 1fr !important;
              }
            }
            @media (max-width: 640px) {
              .cce-badge-cce {
                display: none !important;
              }
              .cce-header-divider {
                display: none !important;
              }
              .cce-btn-header-clabe {
                display: none !important;
              }
              .cce-studio-label {
                display: none !important;
              }
            }
            @media (max-width: 480px) {
              .cce-plan-card {
                padding: 1rem;
              }
            }
          `,
        }}
      />

      {/* STICKY CO-BRANDING HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/apolograma-logo-v2.png"
                alt="Logo Apolograma Studio"
                style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: 'var(--cce-emerald)',
                }}
              >
                APOLOGRAMA
              </span>
              <span
                className="cce-studio-label"
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  color: 'var(--cce-gold-dark)',
                  borderLeft: '1px solid #CBD5E1',
                  paddingLeft: '8px',
                }}
              >
                STUDIO
              </span>
            </div>

            <span className="cce-header-divider" style={{ color: '#CBD5E1', fontSize: '16px', fontWeight: 300 }}>×</span>

            <div
              className="cce-badge-cce"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--cce-emerald-wash)',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid #A7F3D0',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/logo_cce.png"
                alt="Logo CCE Ciudad Juárez"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--cce-emerald)',
                  letterSpacing: '0.2px',
                }}
              >
                CCE Ciudad Juárez
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="#inversion"
              className="cce-btn cce-btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              Ver Inversión
            </a>

            <button
              onClick={handleCopyClabe}
              className="cce-btn cce-btn-primary cce-btn-header-clabe"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
              {copiedClabe ? '¡CLABE Copiada!' : 'Copiar CLABE'}
            </button>

            <a
              href={`${whatsappBaseUrl}?text=${whatsappGeneralText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cce-btn cce-btn-whatsapp"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '56px 20px 48px 20px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--cce-gold-light)',
              border: '1px solid var(--cce-gold-border)',
              padding: '6px 14px',
              borderRadius: '9999px',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={16} color="#B45309" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#B45309',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Desayuno Empresarial Anual · Noviembre 2026
            </span>
          </div>

          <div
            className="cce-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Title & Institutional Description */}
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  lineHeight: 1.12,
                  marginBottom: '16px',
                  color: 'var(--cce-emerald)',
                }}
              >
                EMPRESARIO DEL AÑO 2026
              </h1>

              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--cce-text-dark)',
                  marginBottom: '14px',
                  lineHeight: 1.4,
                }}
              >
                Consejo Coordinador Empresarial (CCE) de Ciudad Juárez
              </p>

              <p className="cce-flow-text" style={{ fontSize: '1.0625rem', marginBottom: '24px' }}>
                Ecosistema integral de alta jerarquía desarrollado por{' '}
                <strong>Apolograma</strong> para coordinar la investidura anual de los{' '}
                <strong>11 organismos empresariales</strong> de la cúpula juarense bajo el liderazgo
                del Lic. Iván Lara y el Consejo Directivo. Conferencia magistral de{' '}
                <strong>Carlos Loret de Mola</strong>, entrega de las preseas escultóricas creadas
                por el escultor <strong>Pedro Francisco</strong>, canal confidencial de patrocinios
                y control riguroso de 50 a 60 mesas (500 a 600 asistentes).
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="#entregables" className="cce-btn cce-btn-primary">
                  Explorar 4 Entregables
                  <ChevronRight size={18} />
                </a>

                <a
                  href={`${whatsappBaseUrl}?text=${whatsappSponsorshipText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn cce-btn-gold"
                >
                  <Lock size={16} />
                  Canal Confidencial de Patrocinios
                </a>
              </div>
            </div>

            {/* Right Column: Keynote Speaker & Pedro Francisco Awards Card */}
            <div
              style={{
                background: 'var(--cce-slate-card)',
                borderRadius: '24px',
                border: '1.5px solid var(--cce-gold)',
                padding: '28px',
                boxShadow: '0 20px 40px -10px rgba(6, 78, 59, 0.35)',
                color: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle Gold Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--cce-gold)',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/cce-juarez/carlos-loret-de-mola.jpg"
                    alt="Carlos Loret de Mola - Conferencia Magistral CCE Ciudad Juárez"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(212, 175, 55, 0.2)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: 'var(--cce-gold-border)',
                      letterSpacing: '1px',
                      marginBottom: '4px',
                    }}
                  >
                    CONFERENCIA MAGISTRAL
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      color: '#FFFFFF',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                    }}
                  >
                    Carlos Loret de Mola
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#A7F3D0',
                      marginTop: '2px',
                    }}
                  >
                    Periodista y titular de análisis político y económico bilateral
                  </p>
                </div>
              </div>

              {/* Award Sculptures Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '6px',
                  }}
                >
                  <Award size={20} color="#D4AF37" />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#FDE68A',
                      letterSpacing: '0.5px',
                    }}
                  >
                    GALARDONES ESCULTÓRICOS PEDRO FRANCISCO
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                  }}
                >
                  Preseas conmemorativas en bronce fundidas en exclusiva por el reconocido escultor
                  juarense Pedro Francisco para los reconocimientos a la <em>Empresa del Año</em> y{' '}
                  <em>Empresario del Año 2026</em>.
                </p>
              </div>

              {/* Protocol Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '0.875rem',
                  color: '#94A3B8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span>Boletos con Holograma</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="#10B981" />
                  <span>50-60 Mesas (500-600 Pax)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 HIGHLIGHT METRICS GRID */}
      <section style={{ padding: '36px 20px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="cce-metrics-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {/* Metric 1 */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cce-emerald)', marginBottom: '8px' }}>
                <Mic size={18} />
                <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>PONENTE MAGISTRAL</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Carlos Loret de Mola
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Conferencia estelar de perspectiva bilateral y análisis macroeconómico.
              </p>
            </div>

            {/* Metric 2 */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cce-gold-dark)', marginBottom: '8px' }}>
                <Award size={18} />
                <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>PRESEA ESCULTÓRICA</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Pedro Francisco
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Bronce de gala para Empresa y Empresario del Año 2026.
              </p>
            </div>

            {/* Metric 3 */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cce-emerald)', marginBottom: '8px' }}>
                <Calendar size={18} />
                <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>FECHA Y FORMATO</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Noviembre 2026
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Desayuno empresarial en Ciudad Juárez, Chihuahua.
              </p>
            </div>

            {/* Metric 4 */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cce-emerald)', marginBottom: '8px' }}>
                <Users size={18} />
                <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>AFORO ESTRATÉGICO</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                50-60 Mesas
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                500 a 600 asistentes (24 mesas base de cámaras CCE + venta directa).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 4 STRATEGIC DELIVERABLES */}
      <section id="entregables" style={{ padding: '64px 20px', background: 'var(--cce-bg-cream)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-emerald-wash)',
                color: 'var(--cce-emerald)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              PAQUETE INTEGRAL DE DESPLIEGUE
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Los 4 Entregables Estratégicos
            </h2>
            <p className="cce-flow-text">
              Arquitectura técnica, comercial y logística diseñada a la medida del Consejo
              Coordinador Empresarial de Ciudad Juárez para asegurar un evento impecable,
              ordenado y de máximo prestigio binacional.
            </p>
          </div>

          <div
            className="cce-deliverables-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}
          >
            {/* ENTREGABLE 1: Invitación Digital Web / Landing Ejecutiva */}
            <div className="cce-plan-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--cce-emerald-wash)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cce-emerald)',
                  }}
                >
                  <FileText size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 1
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Invitación Digital Web / Landing Ejecutiva
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Plataforma web oficial de alta velocidad orientada a presidentes de cámaras, directivos de
                empresas y líderes de opinión:
              </p>

              <ul
                style={{
                  margin: '0 0 24px 0',
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                className="cce-flow-text"
              >
                <li>
                  <strong>Semblanza y trayectoria de Carlos Loret de Mola:</strong> Conferencia magistral,
                  temas económicos bilaterales y Q&amp;A institucional.
                </li>
                <li>
                  <strong>Agenda ejecutiva del desayuno:</strong> 08:00 Registro con credencialización,
                  08:30 Desayuno y bienvenida CCE, 09:30 Entrega de Galardones Pedro Francisco, 10:15
                  Conferencia Magistral, 11:30 Cierre.
                </li>
                <li>
                  <strong>Mapa de distribución de 50 a 60 mesas:</strong> Visualización esquemática del salón
                  para 500 a 600 asistentes.
                </li>
                <li>
                  <strong>Adquisición de boletos físicos:</strong> Botón de contacto directo para solicitud
                  y entrega de boletos impresos con <strong>holograma de seguridad antifalsificación</strong>.
                </li>
              </ul>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--cce-emerald-wash)',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ShieldCheck size={18} color="#059669" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#065F46' }}>
                  Dominio seguro SSL, optimizada para celulares y carga ultrarrápida.
                </span>
              </div>
            </div>

            {/* ENTREGABLE 2: Canal Automatizado de WhatsApp para Patrocinios */}
            <div className="cce-plan-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--cce-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cce-gold-dark)',
                  }}
                >
                  <MessageCircle size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cce-gold-dark)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 2
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Canal Automatizado de WhatsApp para Patrocinios
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Módulo de atención corporativa confidencial que protege la investidura del evento
                y preserva la discreción en las negociaciones de marcas:
              </p>

              <ul
                style={{
                  margin: '0 0 24px 0',
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                className="cce-flow-text"
              >
                <li>
                  <strong>Confidencialidad absoluta:</strong> CERO tarifas públicas en la página web;
                  las aportaciones de patrocinio se tratan de forma privada y personalizada.
                </li>
                <li>
                  <strong>Enrutamiento automático 1-clic:</strong> Enlace oficial con mensaje pre-estructurado
                  para solicitar el dossier ejecutivo y acordar reunión con el comité organizador.
                </li>
                <li>
                  <strong>Beneficios estratégicos:</strong> Presencia de marca en presidium, mesa preferencial,
                  mención en rueda de prensa y pauta institucional.
                </li>
              </ul>

              <div style={{ marginTop: 'auto' }}>
                <a
                  href={`${whatsappBaseUrl}?text=${whatsappSponsorshipText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn cce-btn-gold"
                  style={{ width: '100%' }}
                >
                  <Lock size={16} />
                  Solicitar Dossier Confidencial
                </a>
              </div>
            </div>

            {/* ENTREGABLE 3: Estrategia y Pauta en Facebook Ads / Meta Ads */}
            <div className="cce-plan-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--cce-emerald-wash)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cce-emerald)',
                  }}
                >
                  <Target size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 3
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Estrategia y Pauta en Facebook Ads / Meta Ads
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Campaña institucional quirúrgica para posicionar el magno evento y asegurar la colocación
                de boletos entre el empresariado calificado:
              </p>

              <ul
                style={{
                  margin: '0 0 24px 0',
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                className="cce-flow-text"
              >
                <li>
                  <strong>Segmentación B2B de alta dirección:</strong> Propietarios, directores generales,
                  gerentes de planta maquiladora (Index), ejecutivos bancarios y presidentes de gremios.
                </li>
                <li>
                  <strong>Cobertura geográfica selecta:</strong> Ciudad Juárez, El Paso TX y la capital
                  del estado de Chihuahua.
                </li>
                <li>
                  <strong>Blindaje ético riguroso:</strong> Estrategia orientada a alcance calificado,
                  prestigio institucional y convocatoria real sin fórmulas opacas.
                </li>
              </ul>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.875rem',
                  color: '#475569',
                }}
              >
                Creativos sobrios aprobados por CCE y monitoreo de tráfico hacia la invitación web.
              </div>
            </div>

            {/* ENTREGABLE 4: Logística y Coordinación de Mesas */}
            <div className="cce-plan-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--cce-emerald-wash)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cce-emerald)',
                  }}
                >
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 4
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Logística y Coordinación de Mesas
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Visualizador interactivo y sistema de control para la distribución de 60 mesas
                (10 personas por mesa = 600 asistentes):
              </p>

              <ul
                style={{
                  margin: '0 0 24px 0',
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                className="cce-flow-text"
              >
                <li>
                  <strong>24 mesas base de cámaras CCE:</strong> Asignadas a los 11 organismos empresariales
                  del consejo (CANACINTRA, COPARMEX, CANACO, INDEX, Hoteles, etc.).
                </li>
                <li>
                  <strong>Patrocinios VIP y Venta Directa:</strong> Mesas preferenciales para empresas
                  patrocinadoras y comitiva del consejo.
                </li>
                <li>
                  <strong>Control en tiempo real:</strong> Evita duplicidades, organiza comensales y
                  facilita la recepción con boletos numerados y holograma.
                </li>
              </ul>

              <a
                href="#mesas-interactivas"
                className="cce-btn cce-btn-outline"
                style={{ width: '100%' }}
              >
                <LayoutGrid size={16} />
                Ver Coordinador Interactivo de 60 Mesas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE 60-TABLE SEATING VISUALIZER */}
      <section
        id="mesas-interactivas"
        style={{
          padding: '64px 20px',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px auto' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-gold-light)',
                color: 'var(--cce-gold-dark)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              LOGÍSTICA Y CONTROL DE AFORO
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Visualizador de Asignación de 60 Mesas
            </h2>
            <p className="cce-flow-text">
              Capacidad total del salón: <strong>50 a 60 mesas redondas</strong> (10 asistentes por mesa =
              500 a 600 comensales). Seleccione una categoría para filtrar las mesas o haga clic en
              cualquier mesa para consultar su asignación en tiempo real.
            </p>
          </div>

          {/* Filter Pills Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <button
              onClick={() => setTableFilter('all')}
              className={`cce-cat-pill ${tableFilter === 'all' ? 'active' : ''}`}
            >
              <span>Todas (60 Mesas)</span>
            </button>

            <button
              onClick={() => setTableFilter('camaras')}
              className={`cce-cat-pill ${tableFilter === 'camaras' ? 'active' : ''}`}
            >
              <span>24 Mesas Cámaras CCE</span>
            </button>

            <button
              onClick={() => setTableFilter('vip')}
              className={`cce-cat-pill ${tableFilter === 'vip' ? 'active' : ''}`}
            >
              <span>Patrocinios VIP (16)</span>
            </button>

            <button
              onClick={() => setTableFilter('consejo')}
              className={`cce-cat-pill ${tableFilter === 'consejo' ? 'active' : ''}`}
            >
              <span>Venta Directa Consejo (12)</span>
            </button>

            <button
              onClick={() => setTableFilter('disponibles')}
              className={`cce-cat-pill ${tableFilter === 'disponibles' ? 'active' : ''}`}
            >
              <span>Disponibles (8)</span>
            </button>
          </div>

          {/* Selected Table Inspection Card (if selected) */}
          {selectedTable && (
            <div
              style={{
                background: 'var(--cce-slate-card)',
                color: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid var(--cce-gold)',
                padding: '24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: '0 10px 30px rgba(6, 78, 59, 0.25)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span
                    style={{
                      background: 'var(--cce-gold)',
                      color: '#042E23',
                      fontWeight: 900,
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    MESA #{selectedTable.id}
                  </span>
                  <span style={{ fontSize: '14px', color: '#A7F3D0', fontWeight: 600 }}>
                    {selectedTable.categoryLabel}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#FFFFFF' }}>
                  {selectedTable.assignedTo}
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#CBD5E1' }}>
                  Capacidad: <strong>{selectedTable.capacity} comensales</strong> · Ubicación:{' '}
                  <strong>{selectedTable.zone}</strong> · Estatus: <strong>{selectedTable.status}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    `Hola Emmanuel, deseo consultar la disponibilidad o asignación de la Mesa #${selectedTable.id} (${selectedTable.categoryLabel}) para el evento Empresario del Año 2026 del CCE Ciudad Juárez.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn cce-btn-gold"
                >
                  <MessageCircle size={16} />
                  Consultar Esta Mesa
                </a>

                <button
                  onClick={() => setSelectedTable(null)}
                  className="cce-modal-close"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
                  aria-label="Cerrar detalle"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* 60 Tables Grid Container */}
          <div
            className="cce-seating-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
              padding: '16px',
              background: 'var(--cce-bg-cream)',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            {filteredTables.map((t) => {
              const isSelected = selectedTable?.id === t.id;
              let bg = '#FFFFFF';
              let borderColor = '#E2E8F0';
              let badgeColor = '#64748B';

              if (t.category === 'camaras') {
                bg = 'var(--cce-emerald-wash)';
                borderColor = '#A7F3D0';
                badgeColor = 'var(--cce-emerald)';
              } else if (t.category === 'vip') {
                bg = 'var(--cce-gold-light)';
                borderColor = 'var(--cce-gold-border)';
                badgeColor = 'var(--cce-gold-dark)';
              } else if (t.category === 'consejo') {
                bg = '#EFF6FF';
                borderColor = '#BFDBFE';
                badgeColor = '#1D4ED8';
              }

              if (isSelected) {
                borderColor = 'var(--cce-gold)';
                bg = '#FEF3C7';
              }

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  style={{
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(212,175,55,0.3)' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        color: badgeColor,
                      }}
                    >
                      MESA {t.id}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        color: badgeColor,
                      }}
                    >
                      10 Pax
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--cce-text-dark)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px',
                    }}
                    title={t.assignedTo}
                  >
                    {t.assignedTo}
                  </div>

                  <div
                    style={{
                      fontSize: '14px',
                      color: '#64748B',
                    }}
                  >
                    {t.zone}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#64748B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--cce-emerald-wash)', border: '1px solid #A7F3D0' }} />
              <span>24 Mesas Cámaras CCE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--cce-gold-light)', border: '1px solid var(--cce-gold-border)' }} />
              <span>Patrocinios VIP Corporativos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#EFF6FF', border: '1px solid #BFDBFE' }} />
              <span>Venta Directa Consejo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#FFFFFF', border: '1px solid #E2E8F0' }} />
              <span>Disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP / CRONOGRAMA ACELERADO (5 A 7 DÍAS HÁBILES) */}
      <section style={{ padding: '64px 20px', background: 'var(--cce-bg-cream)', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-emerald-wash)',
                color: 'var(--cce-emerald)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              TIEMPOS DE ENTREGA
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Cronograma Acelerado: 5 a 7 Días Hábiles
            </h2>
            <p className="cce-flow-text">
              Despliegue prioritario para tener la plataforma web, el canal de WhatsApp y el
              sistema de mesas listos y validados antes de la rueda de prensa oficial de Iván Lara y el CCE.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {/* D1 */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'var(--cce-emerald)',
                  background: 'var(--cce-emerald-wash)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                DÍA 1
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Arquitectura y Dominio</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Configuración del subdominio institucional, DNS SSL y carga de la identidad oficial de CCE Juárez.
              </p>
            </div>

            {/* D2-D3 */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'var(--cce-emerald)',
                  background: 'var(--cce-emerald-wash)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                DÍAS 2 - 3
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Invitación Web y WhatsApp</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Maquetación de la semblanza de Carlos Loret de Mola, agenda y módulo confidencial de patrocinios.
              </p>
            </div>

            {/* D4-D5 */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'var(--cce-emerald)',
                  background: 'var(--cce-emerald-wash)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                DÍAS 4 - 5
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Meta Ads y Mapa 60 Mesas</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Campaña B2B en Facebook Ads, visualizador de 60 mesas y protocolo de hologramas de seguridad.
              </p>
            </div>

            {/* D6-D7 */}
            <div
              style={{
                background: 'var(--cce-emerald-wash)',
                borderRadius: '12px',
                border: '1.5px solid var(--cce-emerald)',
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: 'var(--cce-emerald)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                DÍAS 6 - 7
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem', color: 'var(--cce-emerald)' }}>
                Rueda de Prensa y Lanzamiento
              </h4>
              <p className="cce-qr-text" style={{ margin: 0, color: '#064E3B' }}>
                Entrega 100% terminada, pruebas de estrés y luz verde antes del anuncio oficial a medios de comunicación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FINANCIAL PROPOSAL & OFFICIAL BANKING (BANREGIO) */}
      <section id="inversion" style={{ padding: '64px 20px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-gold-light)',
                color: 'var(--cce-gold-dark)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              PROPUESTA ECONÓMICA OFICIAL
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Inversión Llave en Mano
            </h2>
            <p className="cce-flow-text">
              Propuesta económica acordada con tarifa preferencial para el Consejo Coordinador Empresarial.
              Cubre la totalidad de los 4 entregables sin costos adicionales.
            </p>
          </div>

          {/* Luxury Obsidian / Slate Investment Card */}
          <div
            className="cce-financial-box"
            style={{
              background: 'var(--cce-slate-card)',
              borderRadius: '24px',
              border: '2px solid var(--cce-gold)',
              padding: '40px',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.45)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Corner Glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '36px',
                alignItems: 'center',
              }}
              className="cce-hero-grid"
            >
              {/* Left Column: Scope inclusions */}
              <div>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    color: 'var(--cce-gold-border)',
                    textTransform: 'uppercase',
                  }}
                >
                  PAQUETE INTEGRAL · EVENTO MAGNO
                </span>
                <h3
                  style={{
                    margin: '8px 0 16px 0',
                    fontSize: '1.75rem',
                    color: '#FFFFFF',
                  }}
                >
                  Empresario del Año 2026
                </h3>

                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    fontSize: '0.875rem',
                    color: '#E2E8F0',
                  }}
                >
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Invitación Digital Web / Landing Ejecutiva para el ponente Carlos Loret de Mola</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Canal Automatizado de WhatsApp para Patrocinios con máxima confidencialidad</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Estrategia y Pauta en Facebook Ads / Meta Ads dirigida a directivos C-Level</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Visualizador de 60 mesas (24 mesas base de cámaras CCE + venta directa)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Control de boletos físicos numerados con holograma de seguridad</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Entrega acelerada garantizada en 5 a 7 días hábiles</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Pricing Numbers & Totals */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '28px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '4px' }}>
                  Inversión Base
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '8px',
                  }}
                >
                  $16,000 MXN
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#A7F3D0',
                    marginBottom: '16px',
                  }}
                >
                  <span>+ 16% IVA:</span>
                  <strong>$2,560 MXN</strong>
                </div>

                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    paddingTop: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cce-gold)', letterSpacing: '1px' }}>
                    TOTAL FACTURADO
                  </div>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 900,
                      color: 'var(--cce-gold)',
                      letterSpacing: '-1px',
                    }}
                  >
                    $18,560 MXN
                  </div>
                  <div style={{ fontSize: '14px', color: '#CBD5E1', marginTop: '4px' }}>
                    Inversión en una sola exhibición al formalizar
                  </div>
                </div>

                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    'Hola Emmanuel, confirmo la aprobación de la propuesta comercial para el evento Empresario del Año 2026 del CCE Ciudad Juárez ($16,000 MXN + IVA = $18,560 MXN facturados). Procedamos con la orden de trabajo.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn cce-btn-whatsapp"
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  <Check size={18} />
                  Aprobar Propuesta vía WhatsApp
                </a>

                <button
                  onClick={handleCopyClabe}
                  className="cce-btn cce-btn-gold"
                  style={{ width: '100%' }}
                >
                  {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
                  {copiedClabe ? '¡CLABE Copiada al Portapapeles!' : 'Copiar CLABE Interbancaria'}
                </button>
              </div>
            </div>

            {/* Official Fiscal Billing Card (Banregio) */}
            <div
              style={{
                marginTop: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                fontSize: '0.875rem',
                color: '#CBD5E1',
              }}
            >
              <div>
                <div style={{ color: '#94A3B8', fontSize: '14px', textTransform: 'uppercase' }}>Razón Social</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                  TECNOLOGIES TECZA, S. DE R.L. DE C.V.
                </div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '14px', textTransform: 'uppercase' }}>RFC Oficial</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>TTE170614QI1</div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '14px', textTransform: 'uppercase' }}>Institución Bancaria</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>Banregio</div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '14px', textTransform: 'uppercase' }}>CLABE Interbancaria</div>
                <div
                  style={{
                    fontWeight: 800,
                    color: 'var(--cce-gold)',
                    fontFamily: 'monospace',
                    fontSize: '0.9375rem',
                    marginTop: '2px',
                  }}
                >
                  058164657492400290
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL FOOTER */}
      <footer
        style={{
          background: 'var(--cce-emerald-dark)',
          color: '#E2E8F0',
          padding: '48px 20px 32px 20px',
          borderTop: '1px solid #064E3B',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/logo_cce.png"
                alt="Escudo CCE Ciudad Juárez"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                APOLOGRAMA
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'var(--cce-gold)',
                  letterSpacing: '1px',
                }}
              >
                Software &amp; Design Studio
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
              Propuesta ejecutiva confidencial para CCE Ciudad Juárez · Empresario del Año 2026
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.875rem',
              color: '#94A3B8',
            }}
          >
            <div>
              © 2026 APOLOGRAMA Studio · Todos los derechos reservados. TECNOLOGIES TECZA, S. DE R.L. DE C.V.
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Consejo Coordinador Empresarial</span>
              <span>•</span>
              <span>11 Organismos Empresariales</span>
              <span>•</span>
              <span>Ciudad Juárez, Chihuahua</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
