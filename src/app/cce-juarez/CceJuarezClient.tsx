'use client';

import React, { useState } from 'react';
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
  Mail,
  ChevronRight,
  Lock,
  LayoutGrid,
  FileText,
  Sparkles,
  Shirt,
  Building2,
  X,
  Target,
  Mic,
  Star,
} from 'lucide-react';

interface ZoneItem {
  id: 'camaras' | 'vip' | 'general';
  name: string;
  badge: string;
  description: string;
  allocation: string;
  accessType: string;
  color: string;
  borderColor: string;
  bgColor: string;
  benefits: string[];
}

const ZONES_DATA: ZoneItem[] = [
  {
    id: 'camaras',
    name: 'Zona Cámaras CCE',
    badge: '11 Organismos Cúpula',
    description:
      'Bloque institucional de mesas reservadas para presidentes, directores y comitivas oficiales de los 11 organismos que integran el Consejo Coordinador Empresarial.',
    allocation: '22 - 24 mesas proyectadas (10 comensales por mesa)',
    accessType: 'Asignación Institucional Directa por Organismo',
    color: '#064E3B',
    borderColor: '#A7F3D0',
    bgColor: '#ECFDF5',
    benefits: [
      'Representación de CANACINTRA, COPARMEX, CANACO, INDEX Juárez y Hoteles y Moteles',
      'Presidium y mesas de honor para liderazgo gremial y autoridades invitadas',
      'Recepción y acreditación preferencial de delegaciones empresariales',
      'Acceso con boletos conmemorativos con holograma de seguridad',
    ],
  },
  {
    id: 'vip',
    name: 'Zona Patrocinios VIP',
    badge: 'Corporativo & Marcas Patrocinadoras',
    description:
      'Mesas preferenciales en primera línea frente al escenario y pasarela de premiación, destinadas a empresas e industrias patrocinadoras del magno evento.',
    allocation: '14 - 16 mesas de alta jerarquía (10 comensales por mesa)',
    accessType: 'Adquisición Vía Dossier Confidencial de Patrocinio',
    color: '#B8860B',
    borderColor: '#FDE68A',
    bgColor: '#FFFBEB',
    benefits: [
      'Ubicación estratégica con máxima visibilidad durante la conferencia de Carlos Loret de Mola',
      'Menciones institucionales de patrocinio en medios y pantallas de sala',
      'Mesa corporativa completa reservada a nombre de la empresa',
      'Trato y dossier de aportación gestionado en estricta confidencialidad',
    ],
  },
  {
    id: 'general',
    name: 'Zona General / Invitados Especiales',
    badge: 'Empresariado & Venta Directa',
    description:
      'Mesas de asignación para empresarios independientes, socios directos, directivos de la región Paso del Norte y aliados estratégicos del CCE.',
    allocation: '16 - 20 mesas ejecutivas (10 comensales por mesa)',
    accessType: 'Venta Directa Coordinada por Dirección CCE',
    color: '#1D4ED8',
    borderColor: '#BFDBFE',
    bgColor: '#EFF6FF',
    benefits: [
      'Acceso integral al Desayuno Empresarial en Centro de Eventos Cibeles',
      'Participación en la Conferencia Magistral y sesión de preguntas',
      'Convivencia y networking con más de 500 tomadores de decisiones de la región',
      'Boleto físico individual foliado con candado de autenticidad',
    ],
  },
];

export default function CceJuarezClient() {
  const [activeZone, setActiveZone] = useState<'camaras' | 'vip' | 'general'>('camaras');
  const [copiedClabe, setCopiedClabe] = useState(false);

  const selectedZoneData = ZONES_DATA.find((z) => z.id === activeZone) || ZONES_DATA[0];

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
    'Hola Emmanuel, represento a una empresa interesada en conocer los paquetes de patrocinio y asignación de mesas para la Entrega de Galardones 2026 del CCE Ciudad Juárez con Carlos Loret de Mola en Cibeles. Solicito el dossier confidencial.'
  );
  const whatsappGeneralText = encodeURIComponent(
    'Hola Emmanuel, solicito más información sobre la plataforma ejecutiva para la Entrega de Galardones 2026 del CCE Ciudad Juárez con Carlos Loret de Mola.'
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
              overflow-wrap: break-word;
            }

            h1 {
              word-break: break-word;
            }

            .cce-flow-text {
              font-size: 0.9375rem;
              line-height: 1.6;
              color: var(--cce-text-muted);
            }

            .cce-qr-text {
              font-size: 0.875rem;
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

            /* Cards */
            .cce-plan-card {
              background: #FFFFFF;
              border: 1px solid #E2E8F0;
              border-radius: 16px;
              padding: 2rem;
              box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
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
              .cce-sculptures-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-financial-box {
                padding: 1.5rem !important;
              }
              .cce-header-inner {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 10px !important;
              }
              .cce-brand-group {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
              }
              .cce-brand-title {
                font-size: 16px !important;
              }
              .cce-badge-cce {
                padding: 4px 10px !important;
              }
              .cce-badge-cce span {
                font-size: 12px !important;
              }
              .cce-btn-header-clabe {
                display: none !important;
              }
              .cce-header-actions {
                display: flex !important;
                width: 100% !important;
                gap: 8px !important;
              }
              .cce-header-actions .cce-btn {
                flex: 1 1 0% !important;
                justify-content: center !important;
                padding: 8px 12px !important;
                font-size: 0.85rem !important;
                min-height: 44px !important;
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
          className="cce-header-inner"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Brand Group */}
          <div className="cce-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/apolograma-logo-v2.png"
                alt="Logo Apolograma Studio"
                style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
              />
              <span
                className="cce-brand-title"
                style={{
                  fontSize: '17px',
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
                  fontSize: '13px',
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
          <div className="cce-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                fontSize: '13px',
                fontWeight: 800,
                color: '#B45309',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Evento Empresarial Oficial · Jueves 19 de Noviembre 2026
            </span>
          </div>

          <div
            className="cce-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Title & Institutional Description */}
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--cce-gold-dark)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                CONSEJO COORDINADOR EMPRESARIAL CIUDAD JUÁREZ
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.65rem, 5vw, 3rem)',
                  lineHeight: 1.15,
                  marginBottom: '12px',
                  color: 'var(--cce-emerald)',
                }}
              >
                ENTREGA DE GALARDONES 2026
              </h1>

              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#B45309',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                }}
              >
                «Liderazgo que impulsa el futuro en Juárez»
              </div>

              <p className="cce-flow-text" style={{ fontSize: '1.0625rem', marginBottom: '24px' }}>
                Ecosistema integral de alta jerarquía desarrollado por{' '}
                <strong>Apolograma</strong> para coordinar la investidura anual del{' '}
                <strong>Consejo Coordinador Empresarial (CCE)</strong> de Ciudad Juárez. Conferencia
                magistral de <strong>Carlos Loret de Mola</strong>, entrega de las preseas escultóricas
                creadas por el escultor <strong>Pedro Francisco</strong> para la <em>Empresa del Año</em>{' '}
                («Estrella Ascendente») y el <em>Empresario del Año</em> («De Altos Vuelos»), canal
                confidencial de patrocinios y coordinación logística para más de 500 líderes empresariales
                en <strong>Centro de Eventos Cibeles</strong>.
              </p>

              {/* Protocol Badges Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Calendar size={18} color="#059669" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Jueves 19 Noviembre 2026
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="#059669" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Registro 8:30 AM · Desayuno 9:00 AM
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <MapPin size={18} color="#059669" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Centro de Eventos Cibeles
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Shirt size={18} color="#B45309" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Vestimenta Formal
                  </span>
                </div>
              </div>

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
                  Dossier Confidencial de Patrocinios
                </a>
              </div>
            </div>

            {/* Right Column: Keynote Speaker Card */}
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
                    width: '94px',
                    height: '94px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--cce-gold)',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    background: '#042E23',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/cce-juarez/loret_oficial.png"
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
                      fontSize: '13px',
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
                      fontSize: '1.35rem',
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
                    Periodista y analista político-económico
                  </p>
                </div>
              </div>

              {/* Conference Topic Card */}
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
                  <Mic size={18} color="#D4AF37" />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#FDE68A',
                      letterSpacing: '0.5px',
                    }}
                  >
                    TEMA DE LA CONFERENCIA
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                  }}
                >
                  «México y Estados Unidos: Poder, política y economía en tiempos de cambio»
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
                  <span>Meta: 500+ Asistentes</span>
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
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>CONFERENCIA MAGISTRAL</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Carlos Loret de Mola
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Análisis macroeconómico, política y la relación bilateral México - EE.UU.
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
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>PRESEAS ESCULTÓRICAS</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Pedro Francisco
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Esculturas oficiales «Estrella Ascendente» y «De Altos Vuelos».
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
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>FECHA Y SEDE</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                19 Noviembre 2026
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Centro de Eventos Cibeles · Registro 8:30 AM · Desayuno 9:00 AM.
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
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>CONVOCATORIA CÚPULA</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                500+ Asistentes
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                11 Cámaras del CCE, empresas patrocinadoras e invitados especiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SCULPTURES PEDRO FRANCISCO SHOWCASE */}
      <section style={{ padding: '64px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-gold-light)',
                color: 'var(--cce-gold-dark)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              OBRAS ESCULTÓRICAS EN BRONCE
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Los Galardones de Pedro Francisco
            </h2>
            <p className="cce-flow-text">
              El Consejo Coordinador Empresarial honra la trayectoria, visión y compromiso social de la comunidad
              productiva de Ciudad Juárez a través de dos piezas monumentales fundidas en exclusiva por el reconocido
              escultor juarense Pedro Francisco.
            </p>
          </div>

          <div
            className="cce-sculptures-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Galardón 1: Estrella Ascendente */}
            <div
              className="cce-plan-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '180px',
                  height: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/cce-juarez/sculpture_estrella_ascendente.png"
                  alt="Presea Escultórica Estrella Ascendente - Pedro Francisco"
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--cce-emerald-wash)',
                  color: 'var(--cce-emerald)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                }}
              >
                <Star size={14} />
                EMPRESA DEL AÑO 2026
              </div>

              <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', color: 'var(--cce-text-dark)' }}>
                «Estrella Ascendente»
              </h3>

              <p className="cce-flow-text" style={{ margin: '0 0 16px 0', maxWidth: '440px' }}>
                Presea otorgada a la organización destacada por su crecimiento exponencial, solidez corporativa,
                generación de empleos de calidad y aportación al desarrollo económico sostenible de la frontera.
              </p>

              <div
                style={{
                  marginTop: 'auto',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'var(--cce-bg-cream)',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.85rem',
                  color: '#64748B',
                }}
              >
                Escultura conmemorativa original fundida en bronce · Certificado de autor Pedro Francisco
              </div>
            </div>

            {/* Galardón 2: De Altos Vuelos */}
            <div
              className="cce-plan-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '180px',
                  height: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/cce-juarez/sculpture_de_altos_vuelos.png"
                  alt="Presea Escultórica De Altos Vuelos - Pedro Francisco"
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--cce-gold-light)',
                  color: 'var(--cce-gold-dark)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                }}
              >
                <Award size={14} />
                EMPRESARIO DEL AÑO 2026
              </div>

              <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', color: 'var(--cce-text-dark)' }}>
                «De Altos Vuelos»
              </h3>

              <p className="cce-flow-text" style={{ margin: '0 0 16px 0', maxWidth: '440px' }}>
                Máximo galardón conferido al líder empresarial que con su talento, integridad y perseverancia
                ha alcanzado cumbres de éxito sin perder el arraigo, descendiendo para extender la mano e impulsar
                el porvenir de su comunidad.
              </p>

              <div
                style={{
                  marginTop: 'auto',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'var(--cce-bg-cream)',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.85rem',
                  color: '#64748B',
                }}
              >
                Placa grabada oficial CCE · Firma en bronce del maestro escultor Pedro Francisco
              </div>
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
                fontSize: '13px',
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
              Arquitectura técnica, comercial y logística desarrollada por Apolograma para el Consejo
              Coordinador Empresarial de Ciudad Juárez, garantizando un evento impecable, ordenado y de
              máximo prestigio binacional.
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
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
                  <strong>Semblanza y conferencia de Carlos Loret de Mola:</strong> «México y Estados Unidos:
                  Poder, política y economía en tiempos de cambio».
                </li>
                <li>
                  <strong>Agenda ejecutiva del desayuno:</strong> 08:30 Registro con credencialización,
                  09:00 Inicio de Desayuno y mensaje CCE, 09:45 Entrega de Galardones Pedro Francisco,
                  10:30 Conferencia Magistral, 11:45 Cierre.
                </li>
                <li>
                  <strong>Sede y logística oficial:</strong> Centro de Eventos Cibeles (Blvd. Tomás Fernández
                  No. 8450) con geolocalización en 1-clic y protocolo de vestimenta formal.
                </li>
                <li>
                  <strong>Adquisición de boletos físicos:</strong> Canal directo para solicitud y entrega de
                  boletos impresos con <strong>holograma de seguridad antifalsificación</strong>.
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-gold-dark)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 2
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Canal Automatizado de WhatsApp para Patrocinios
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Módulo de atención corporativa confidencial que protege la investidura del evento
                y preserva la discreción en las aportaciones de marcas:
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
                  <strong>Canal institucional alterno:</strong> Botón de contacto directo por correo a{' '}
                  <strong>director@ccejuarez.org</strong> para cartas formales de intención.
                </li>
                <li>
                  <strong>Beneficios estratégicos:</strong> Presencia de marca en presidium, mesa preferencial,
                  mención en rueda de prensa y pauta institucional.
                </li>
              </ul>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
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
                  gerentes de planta maquiladora (Index), ejecutivos de banca y presidentes de cámaras.
                </li>
                <li>
                  <strong>Cobertura geográfica selecta:</strong> Ciudad Juárez, El Paso TX y Chihuahua capital.
                </li>
                <li>
                  <strong>Blindaje ético riguroso:</strong> Estrategia orientada a alcance calificado,
                  prestigio institucional y convocatoria real sin fórmulas especulativas.
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
                Creativos sobrios con la fotografía autorizada de Carlos Loret de Mola y logotipo oficial del CCE.
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald-light)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 4
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Logística y Coordinación de Distribución
                  </h3>
                </div>
              </div>

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Sistema de control y visualización de asignación para más de 500 comensales proyectados
                en Centro de Eventos Cibeles:
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
                  <strong>Zona Cámaras CCE:</strong> Bloque base para los 11 organismos empresariales de la cúpula.
                </li>
                <li>
                  <strong>Zona Patrocinios VIP:</strong> Mesas preferenciales reservadas para marcas e industrias.
                </li>
                <li>
                  <strong>Zona General / Venta Directa:</strong> Coordinada centralizadamente por el CCE.
                </li>
                <li>
                  <strong>Control en tiempo real:</strong> Evita duplicidades y agiliza la recepción con
                  boletos foliados con holograma de seguridad.
                </li>
              </ul>

              <a
                href="#esquema-zonas"
                className="cce-btn cce-btn-outline"
                style={{ width: '100%' }}
              >
                <LayoutGrid size={16} />
                Ver Esquema de Distribución por 3 Zonas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 3-ZONE CONCEPTUAL SEATING SCHEME (NO FAKE 60-TABLE MATRIX) */}
      <section
        id="esquema-zonas"
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
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              LOGÍSTICA Y CONTROL DE AFORO
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Esquema de Distribución por 3 Zonas
            </h2>
            <p className="cce-flow-text">
              Meta proyectada: <strong>500+ asistentes</strong> en Centro de Eventos Cibeles.
              La logística oficial del CCE Ciudad Juárez se organiza en tres bloques estratégicos para
              asegurar el orden protocolario, la visibilidad de patrocinadores y la comodidad de las comitivas.
            </p>
          </div>

          {/* 3 Zone Selector Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {ZONES_DATA.map((z) => {
              const isSelected = activeZone === z.id;
              return (
                <div
                  key={z.id}
                  onClick={() => setActiveZone(z.id)}
                  style={{
                    background: isSelected ? z.bgColor : '#FFFFFF',
                    border: `2px solid ${isSelected ? z.color : '#E2E8F0'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 10px 25px rgba(6, 78, 59, 0.12)' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      background: z.bgColor,
                      border: `1px solid ${z.borderColor}`,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: z.color,
                      letterSpacing: '0.5px',
                      marginBottom: '10px',
                    }}
                  >
                    {z.badge}
                  </div>

                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: isSelected ? z.color : 'var(--cce-text-dark)' }}>
                    {z.name}
                  </h3>

                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--cce-text-muted)', marginBottom: '12px' }}>
                    {z.allocation}
                  </div>

                  <p className="cce-qr-text" style={{ margin: 0 }}>
                    {z.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Zone Banner */}
          <div
            style={{
              background: 'var(--cce-slate-card)',
              color: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid var(--cce-gold)',
              padding: '32px',
              boxShadow: '0 15px 35px rgba(6, 78, 59, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                paddingBottom: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span
                    style={{
                      background: 'var(--cce-gold)',
                      color: '#042E23',
                      fontWeight: 900,
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    DETALLE OPERATIVO
                  </span>
                  <span style={{ fontSize: '14px', color: '#A7F3D0', fontWeight: 600 }}>
                    {selectedZoneData.badge}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#FFFFFF' }}>
                  {selectedZoneData.name}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    `Hola Emmanuel, deseo consultar los detalles de asignación para la ${selectedZoneData.name} en el evento Entrega de Galardones 2026 del CCE Ciudad Juárez.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-btn cce-btn-gold"
                >
                  <MessageCircle size={16} />
                  Consultar Esta Zona vía WhatsApp
                </a>

                <a
                  href="mailto:director@ccejuarez.org?subject=Consulta%20de%20Zona%20-%20Galardones%20CCE%202026"
                  className="cce-btn cce-btn-outline"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}
                >
                  <Mail size={16} />
                  director@ccejuarez.org
                </a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Capacidad Estimada
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FDE68A' }}>
                  {selectedZoneData.allocation}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Mecanismo de Acceso
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#A7F3D0' }}>
                  {selectedZoneData.accessType}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>
                Protocolo y Beneficios Integrados
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {selectedZoneData.benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#E2E8F0' }}>
                    <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
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
                fontSize: '13px',
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
              Despliegue prioritario para tener la plataforma web, el canal confidencial de WhatsApp y la
              estrategia de pauta listos antes de la rueda de prensa oficial de Iván Lara y el CCE.
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
                  fontSize: '13px',
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
                  fontSize: '13px',
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
                Maquetación con las fotografías oficiales de Carlos Loret de Mola y las esculturas de Pedro Francisco.
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
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--cce-emerald)',
                  background: 'var(--cce-emerald-wash)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                DÍAS 4 - 5
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Meta Ads y Logística</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Campaña B2B en Facebook Ads, esquema de 3 zonas y protocolo de boletos físicos con holograma.
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
                  fontSize: '13px',
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
                Entrega 100% terminada, pruebas de estrés y luz verde antes del anuncio oficial a medios.
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
                fontSize: '13px',
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
                    fontSize: '13px',
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
                    fontSize: '1.65rem',
                    color: '#FFFFFF',
                  }}
                >
                  Entrega de Galardones 2026
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
                    <span>Invitación Digital Web / Landing Ejecutiva con semblanza y fotos oficiales</span>
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
                    <span>Esquema de distribución por 3 zonas para 500+ asistentes en Cibeles</span>
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
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-gold)', letterSpacing: '1px' }}>
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
                  <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>
                    Inversión en una sola exhibición al formalizar
                  </div>
                </div>

                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent(
                    'Hola Emmanuel, confirmo la aprobación de la propuesta comercial para la Entrega de Galardones 2026 del CCE Ciudad Juárez ($16,000 MXN + IVA = $18,560 MXN facturados). Procedamos con la orden de trabajo.'
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
                <div style={{ color: '#94A3B8', fontSize: '13px', textTransform: 'uppercase' }}>Razón Social</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                  TECNOLOGIES TECZA, S. DE R.L. DE C.V.
                </div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '13px', textTransform: 'uppercase' }}>RFC Oficial</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>TTE170614QI1</div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '13px', textTransform: 'uppercase' }}>Institución Bancaria</div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>Banregio</div>
              </div>

              <div>
                <div style={{ color: '#94A3B8', fontSize: '13px', textTransform: 'uppercase' }}>CLABE Interbancaria</div>
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
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--cce-gold)',
                  letterSpacing: '1px',
                }}
              >
                Software &amp; Design Studio
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
              Propuesta ejecutiva confidencial para CCE Ciudad Juárez · Entrega de Galardones 2026
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
