'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ChevronRight,
  FileText,
  Sparkles,
  Target,
  Mic,
  Video,
  Layers,
  Palette,
  Bot,
  Tv,
} from 'lucide-react';

export default function CceJuarezClient() {
  const [copiedClabe, setCopiedClabe] = useState(false);

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
  const whatsappApprovalText = encodeURIComponent(
    'Hola Emmanuel, confirmo la aprobación de la propuesta comercial para el Consejo Coordinador Empresarial (CCE) Ciudad Juárez ($16,000 MXN + IVA = $18,560 MXN facturados, incluye $4,000 MXN de pauta en Meta Ads). Procedamos con la orden de trabajo.'
  );
  const whatsappGeneralText = encodeURIComponent(
    'Hola Emmanuel, solicito más información sobre la propuesta ejecutiva de Apolograma para el CCE Ciudad Juárez.'
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
              --cce-wood: #854D0E;
              --cce-cream: #FFFDF9;
              --cce-bg: #FFFDF9;
              --cce-bg-cream: #FFFDF9;
              --cce-bg-white: #FFFFFF;
              --cce-text-dark: #0F172A;
              --cce-text-muted: #475569;
              --cce-slate-card: #0B261D;
            }

            *, *::before, *::after {
              box-sizing: border-box;
            }

            .cce-hero-grid > div,
            .cce-metrics-grid > div,
            .cce-deliverables-grid > div,
            .cce-roadmap-grid > div,
            .cce-financial-box > div,
            .cce-fiscal-grid > div,
            .cce-event-badges-grid > div {
              min-width: 0;
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
              max-width: 100vw;
              min-height: 100vh;
              background: var(--cce-bg-cream);
              box-sizing: border-box;
            }

            /* Typography */
            h1, h2, h3, h4 {
              text-wrap: balance;
              color: var(--cce-text-dark);
              letter-spacing: -0.025em;
              font-weight: 800;
              overflow-wrap: break-word;
              word-break: break-word;
            }

            h1 {
              font-size: clamp(1.4rem, 6vw, 2.85rem);
              line-height: 1.15;
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
              box-sizing: border-box;
            }

            section, header, footer {
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
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
                gap: 28px !important;
              }
              .cce-metrics-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-deliverables-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-event-badges-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-financial-box {
                padding: 1.5rem !important;
              }
              .cce-header-inner {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 8px !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              .cce-brand-group {
                display: flex !important;
                align-items: center !important;
                justify-content: flex-start !important;
                width: 100% !important;
                gap: 8px !important;
                box-sizing: border-box !important;
              }
              .cce-brand-logo-img {
                height: 12px !important;
              }
              .cce-badge-cce {
                padding: 2px 6px !important;
                gap: 4px !important;
                flex-shrink: 0 !important;
              }
              .cce-badge-cce img {
                height: 16px !important;
                width: auto !important;
              }
              .cce-badge-cce span {
                font-size: 10px !important;
                font-weight: 800 !important;
              }
              .cce-btn-header-clabe {
                display: none !important;
              }
              .cce-header-actions {
                display: flex !important;
                width: 100% !important;
                gap: 8px !important;
                box-sizing: border-box !important;
              }
              .cce-header-actions .cce-btn {
                flex: 1 1 0% !important;
                min-width: 0 !important;
                width: calc(50% - 4px) !important;
                max-width: calc(50% - 4px) !important;
                justify-content: center !important;
                padding: 8px 4px !important;
                font-size: 0.78rem !important;
                white-space: nowrap !important;
                min-height: 44px !important;
                box-sizing: border-box !important;
              }
              .cce-hero-section {
                padding: 36px 16px 32px 16px !important;
              }
              header {
                padding: 8px 12px !important;
              }
              .cce-council-tag {
                font-size: 11px !important;
                letter-spacing: 0.4px !important;
                line-height: 1.3 !important;
              }
              h1 {
                font-size: 1.4rem !important;
                line-height: 1.2 !important;
              }
              .cce-studio-label,
              .cce-header-divider {
                display: none !important;
              }
              .cce-roadmap-grid,
              .cce-fiscal-grid {
                grid-template-columns: 1fr !important;
              }
              .cce-hero-ctas {
                flex-direction: column !important;
                width: 100% !important;
              }
              .cce-hero-ctas .cce-btn {
                width: 100% !important;
                justify-content: center !important;
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
          <div className="cce-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/apolograma-logo-v2.png"
              alt="Logo Apolograma Studio"
              className="cce-brand-logo-img"
              style={{
                height: '18px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0.15)',
              }}
            />

            <span className="cce-header-divider" style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: 300 }}>×</span>

            <div
              className="cce-badge-cce"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--cce-emerald-wash)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid #A7F3D0',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/logo_cce.png"
                alt="Logo CCE Ciudad Juárez"
                style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--cce-emerald)',
                }}
              >
                CCE Juárez
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="cce-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="#inversion"
              className="cce-btn cce-btn-outline"
            >
              Ver Inversión
            </a>

            <button
              onClick={handleCopyClabe}
              className="cce-btn cce-btn-primary cce-btn-header-clabe"
            >
              {copiedClabe ? <Check size={16} /> : <Copy size={16} />}
              {copiedClabe ? '¡CLABE Copiada!' : 'Copiar CLABE'}
            </button>

            <a
              href={`${whatsappBaseUrl}?text=${whatsappGeneralText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cce-btn cce-btn-whatsapp"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="cce-hero-section"
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
            className="cce-eyebrow-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--cce-gold-light)',
              border: '1px solid var(--cce-gold-border)',
              padding: '6px 14px',
              borderRadius: '9999px',
              marginBottom: '20px',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Sparkles size={16} color="#B45309" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#B45309',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Propuesta Comercial Ejecutiva · CCE Juárez × Apolograma
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
            {/* Left Column: Title & Proposal Overview */}
            <div>
              <div
                className="cce-council-tag"
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--cce-wood)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  lineHeight: 1.35,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                CONSEJO COORDINADOR EMPRESARIAL CIUDAD JUÁREZ
              </div>

              <h1
                style={{
                  lineHeight: 1.15,
                  marginBottom: '12px',
                  color: 'var(--cce-emerald)',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                ESTRATEGIA DIGITAL,<br />CONTENIDO &amp; CONVOCATORIA
              </h1>

              <div
                className="cce-hero-subtitle"
                style={{
                  fontWeight: 800,
                  color: '#B45309',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                  lineHeight: 1.35,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                Entrega de Galardones 2026 · Conferencia Magistral Carlos Loret de Mola
              </div>

              <p className="cce-flow-text" style={{ fontSize: '1.0625rem', marginBottom: '12px' }}>
                Propuesta tecnológica y creativa de <strong>Apolograma</strong> para la magna entrega de galardones del{' '}
                <strong>Consejo Coordinador Empresarial (CCE) Ciudad Juárez</strong>, encabezado por el <strong>Mtro. Iván Lara</strong>.
              </p>
              <p className="cce-flow-text" style={{ fontSize: '1.0625rem', marginBottom: '24px' }}>
                Despliegue integral de invitación web, estrategia de contenidos en Facebook (Reels y carruseles), pauta
                en Meta Ads y kit digital para rueda de prensa con bot de WhatsApp.
              </p>

              {/* Event Context Badges */}
              <div
                className="cce-event-badges-grid"
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
                  <Clock size={18} color="#059669" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Desayuno Empresarial 9:00 AM
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
                  <ShieldCheck size={18} color="#B45309" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cce-text-dark)' }}>
                    Boletos con Holograma Físico
                  </span>
                </div>
              </div>

              <div className="cce-hero-ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
                <a href="#entregables" className="cce-btn cce-btn-primary">
                  Ver los 4 Entregables
                  <ChevronRight size={18} />
                </a>

                <a href="#inversion" className="cce-btn cce-btn-gold">
                  Propuesta Económica ($16,000 + IVA)
                </a>
              </div>
            </div>

            {/* Right Column: Keynote Speaker & Visual Anchor */}
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
                    decoding="async"
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
                    PONENTE MAGISTRAL
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
                    CONFERENCIA MAGISTRAL
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

              {/* Scope Note */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(6, 78, 59, 0.4)',
                  border: '1px solid rgba(167, 243, 208, 0.25)',
                  fontSize: '0.85rem',
                  color: '#CBD5E1',
                  lineHeight: 1.5,
                }}
              >
                Entrega de preseas Pedro Francisco: «Estrella Ascendente» (Empresa del Año) y «De Altos Vuelos» (Empresario del Año).
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
                <FileText size={18} />
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>INVITACIÓN WEB</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Mobile-First
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Webapp ligera para compartir por WhatsApp con botones directos para comprar boletos.
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cce-wood)', marginBottom: '8px' }}>
                <Video size={18} />
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>FACEBOOK Y REELS</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Reels &amp; Carruseles
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Edición con video oficial de Loret de Mola y elevación de la línea visual institucional.
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
                <Target size={18} />
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>PAUTA META ADS</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                $4,000 MXN Incluidos
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Presupuesto publicitario directo incluido para venta de boletos en Ciudad Juárez y posicionamiento estatal.
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
                <Tv size={18} />
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>KIT RUEDA PRENSA</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cce-text-dark)', marginBottom: '4px' }}>
                Pantallas + Bot WhatsApp
              </div>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Artes para medios el lunes y asistente de WhatsApp para filtro de dudas frecuentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 4 REAL STRATEGIC DELIVERABLES */}
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
              ALCANCE OFICIAL DE SERVICIOS
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--cce-emerald)', marginBottom: '14px' }}>
              Los 4 Entregables de Apolograma
            </h2>
            <p className="cce-flow-text">
              Solución tecnológica diseñada para los frentes prioritarios acordados con el{' '}
              <strong>Mtro. Iván Lara</strong>, garantizando entrega antes del anuncio oficial a medios.
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 1
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Invitación Digital Web / Landing Ejecutiva
                  </h3>
                </div>
              </div>

              {/* Support Image Deliverable 1 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/entregable-1-landing.png"
                alt="Vista previa Invitación Digital Web Mobile-First"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '18/10',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              />

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Plataforma web oficial de carga rápida y diseño mobile-first, lista para compartirse por
                WhatsApp a consejeros y líderes de las cámaras empresariales:
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
                  <strong>Presentación oficial de Carlos Loret de Mola:</strong> Fotografía autorizada, semblanza ejecutiva y ficha de la conferencia magistral.
                </li>
                <li>
                  <strong>Ficha técnica del desayuno:</strong> Jueves 19 de Noviembre en Centro de Eventos Cibeles, registro 8:30 AM e inicio 9:00 AM.
                </li>
                <li>
                  <strong>Adquisición de boletos físicos:</strong> Botón de contacto directo para coordinar la entrega y pago de los boletos impresos con <strong>holograma de seguridad antifalsificación</strong>.
                </li>
                <li>
                  <strong>Enlace directo a WhatsApp institucional:</strong> Canal rápido para resolver dudas sin formularios engorrosos ni registros innecesarios.
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
                  Dominio seguro SSL, alta velocidad de respuesta y maquetación mobile-first.
                </span>
              </div>
            </div>

            {/* ENTREGABLE 2: Contenido & Gestión de Facebook (Reels, Carruseles y Nueva Línea Gráfica) */}
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
                  <Video size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-wood)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 2
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Contenido Facebook: Reels, Carruseles &amp; Línea Gráfica
                  </h3>
                </div>
              </div>

              {/* Support Image Deliverable 2 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/entregable-2-reels.png"
                alt="Vista previa Contenido Facebook Reels y Carruseles"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '18/10',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              />

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Producción de contenidos institucionales para la página oficial de Facebook del CCE Juárez,
                proyectando la investidura del encuentro con sobriedad ejecutiva:
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
                  <strong>Elevación de la línea gráfica:</strong> Respetamos la paleta institucional (verde esmeralda y tonos madera) elevándola con tipografía refinada, espacios limpios y balance formal de alta jerarquía.
                </li>
                <li>
                  <strong>Edición de Reels institucionales:</strong> Edición del video oficial de Carlos Loret de Mola con cortinillas de entrada/salida y cintillas de texto informativas para redes sociales.
                </li>
                <li>
                  <strong>Diseño y publicación de carruseles:</strong> Piezas informativas multislide para Facebook sobre la trayectoria del ponente, los temas de análisis y la relevancia del encuentro empresarial.
                </li>
                <li>
                  <strong>Publicación y calendarización directa:</strong> Difusión programada de piezas hacia el 19 de noviembre para sostener presencia activa y ordenada.
                </li>
              </ul>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--cce-gold-light)',
                  border: '1px solid var(--cce-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Palette size={18} color="#B45309" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>
                  Diseño gráfico editorial contemporáneo sin recurrir a ilustraciones genéricas.
                </span>
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
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 3
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Estrategia y Pauta en Facebook Ads / Meta Ads
                  </h3>
                </div>
              </div>

              {/* Support Image Deliverable 3 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/entregable-3-pauta.png"
                alt="Vista previa Estrategia y Pauta en Facebook Ads Meta Ads"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '18/10',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              />

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Campaña institucional en Meta Ads con <strong>$4,000 MXN de presupuesto publicitario incluido</strong> para impulsar la colocación de boletos y consolidar el
                posicionamiento del CCE en la región:
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
                  <strong>Presupuesto directo de pauta ($4,000 MXN):</strong> Saldo de inversión oficial en Meta Ads integrado en el paquete para pautar anuncios en Facebook e Instagram sin costos adicionales.
                </li>
                <li>
                  <strong>Segmentación B2B de alta dirección:</strong> Campaña en Ciudad Juárez dirigida a propietarios, directores generales, gerentes de planta maquiladora (Index), ejecutivos bancarios y empresarios.
                </li>
                <li>
                  <strong>Estrategia de conversión local:</strong> Pauta enfocada en detonar compras de boletos hacia la invitación web y WhatsApp.
                </li>
                <li>
                  <strong>Posicionamiento estatal selecto:</strong> Difusión institucional en Chihuahua capital para proyectar la fuerza y el liderazgo del Consejo Coordinador Empresarial.
                </li>
                <li>
                  <strong>Monitoreo y optimización técnica:</strong> Supervisión de métricas de alcance, clics y tráfico sin alterar la administración institucional que el CCE mantiene sobre su página de Facebook.
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
                  $4,000 MXN de saldo publicitario directo en Meta Ads ya incluidos en la propuesta.
                </span>
              </div>
            </div>

            {/* ENTREGABLE 4: Kit Gráfico para Rueda de Prensa y Automatización de WhatsApp */}
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
                  <Bot size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--cce-emerald)', letterSpacing: '0.8px' }}>
                    ENTREGABLE 4
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                    Kit Rueda de Prensa &amp; Automatización WhatsApp
                  </h3>
                </div>
              </div>

              {/* Support Image Deliverable 4 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cce-juarez/entregable-4-prensa-bot.png"
                alt="Vista previa Kit Rueda de Prensa y Automatización WhatsApp"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '18/10',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              />

              <p className="cce-flow-text" style={{ marginBottom: '18px' }}>
                Herramientas de soporte visual y operativo para el anuncio ante medios de comunicación y la
                atención fluida de mensajes:
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
                  <strong>Artes digitales para Rueda de Prensa:</strong> Maquetación en alta resolución para pantallas, tótem o backing del anuncio oficial del <strong>Mtro. Iván Lara</strong> ante medios de comunicación.
                </li>
                <li>
                  <strong>Asistente automatizado de WhatsApp:</strong> Respuestas inmediatas a dudas iniciales (horarios, sede Cibeles y boletos físicos) que resuelven inquietudes frecuentes y agilizan la atención oficial del evento.
                </li>
                <li>
                  <strong>Canalización confidencial directa:</strong> Enlace inmediato y discreto con la directiva del CCE ante solicitudes formales de empresas interesadas en patrocinios.
                </li>
                <li>
                  <em>Nota de alcance:</em> La captación y negociación de patrocinios es gestionada 100% por la presidencia del CCE; Apolograma provee la infraestructura técnica de enrutamiento y filtro.
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
                <Bot size={18} color="#059669" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#065F46' }}>
                  Filtro anti-cuello de botella para garantizar atención oportuna 24/7.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP / CRONOGRAMA ACELERADO (5 A 7 DÍAS HÁBILES) */}
      <section style={{ padding: '64px 20px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
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
              Despliegue prioritario enfocado en tener los materiales listos y validados antes de la
              rueda de prensa oficial del <strong>Mtro. Iván Lara</strong> y el Consejo Directivo del CCE.
            </p>
          </div>

          <div
            className="cce-roadmap-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {/* D1-D2 */}
            <div
              style={{
                background: 'var(--cce-bg-cream)',
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
                DÍAS 1 - 2
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Nueva Línea Gráfica &amp; Sistema Visual</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Elevación y refinamiento de la identidad visual institucional (verde esmeralda y madera noble), exploración tipográfica y definición de plantillas maestras.
              </p>
            </div>

            {/* D3-D4 */}
            <div
              style={{
                background: 'var(--cce-bg-cream)',
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
                DÍAS 3 - 4
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Invitación Web &amp; Kit Rueda Prensa</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Maquetación de la landing mobile-first aplicando la línea gráfica aprobada y preparación del kit de visuales para pantallas de la presentación oficial ante medios.
              </p>
            </div>

            {/* D5-D6 */}
            <div
              style={{
                background: 'var(--cce-bg-cream)',
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
                DÍAS 5 - 6
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem' }}>Pauta Meta Ads &amp; Asistente WhatsApp</h4>
              <p className="cce-qr-text" style={{ margin: 0 }}>
                Configuración de audiencias ejecutivas B2B en Meta Ads Manager, activación de los $4,000 MXN de pauta publicitaria y programación de los flujos de respuesta en WhatsApp.
              </p>
            </div>

            {/* D7 */}
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
                DÍA 7
              </span>
              <h4 style={{ margin: '10px 0 6px 0', fontSize: '1.0625rem', color: 'var(--cce-emerald)' }}>
                Reels, Carruseles &amp; Convocatoria
              </h4>
              <p className="cce-qr-text" style={{ margin: 0, color: '#064E3B' }}>
                Edición final de video de Carlos Loret de Mola, publicación de los primeros carruseles informativos y monitoreo continuo rumbo al 19 de noviembre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FINANCIAL PROPOSAL & OFFICIAL BANKING (BANREGIO) */}
      <section id="inversion" style={{ padding: '64px 20px', background: 'var(--cce-bg-cream)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--cce-gold-light)',
                color: 'var(--cce-wood)',
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
              Cubre la totalidad de los 4 entregables estratégicos.
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
                    <span>Invitación Digital Web / Landing Ejecutiva para Carlos Loret de Mola</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Estrategia de Facebook: Edición de Reels, carruseles y nueva línea gráfica</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Campaña de Pauta en Meta Ads con <strong>$4,000 MXN de presupuesto publicitario incluido</strong></span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Kit gráfico para la Rueda de Prensa del lunes (pantallas y tótems)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <span>Asistente automatizado en WhatsApp para filtro de dudas y atención 24/7</span>
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
                  Inversión Base (Incluye Pauta)
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '4px',
                  }}
                >
                  $16,000 MXN
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10B981',
                    color: '#A7F3D0',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '14px',
                  }}
                >
                  <span>✓ Incluye $4,000 MXN de saldo directo en Meta Ads</span>
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
                  href={`${whatsappBaseUrl}?text=${whatsappApprovalText}`}
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
              className="cce-fiscal-grid"
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

      {/* SECCIÓN: PREGUNTAS FRECUENTES (FAQS) */}
      <section style={{ padding: '64px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
              RESOLUCIÓN DE DUDAS
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', color: 'var(--cce-emerald)', marginBottom: '12px' }}>
              Preguntas Frecuentes
            </h2>
            <p className="cce-flow-text">
              Claridad operativa y alcance delimitado para el Consejo Directivo del CCE Juárez.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* FAQ 1 */}
            <details
              style={{
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--cce-text-dark)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '44px',
                }}
              >
                <span>¿Qué incluye el paquete integral de $16,000 MXN + IVA?</span>
                <span style={{ color: 'var(--cce-emerald)', fontSize: '1.25rem', fontWeight: 700 }}>+</span>
              </summary>
              <p className="cce-flow-text" style={{ margin: '14px 0 0 0', fontSize: '0.9375rem' }}>
                Cubre la totalidad de los 4 entregables: Invitación Digital Web, estrategia de contenidos en Facebook
                (Reels y carruseles), campaña en Meta Ads con $4,000 MXN de saldo publicitario directo incluido, y kit digital para la rueda de prensa con bot de atención en WhatsApp.
              </p>
            </details>

            {/* FAQ 2 */}
            <details
              style={{
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--cce-text-dark)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '44px',
                }}
              >
                <span>¿Quién gestiona la captación de patrocinios y cobro de boletos?</span>
                <span style={{ color: 'var(--cce-emerald)', fontSize: '1.25rem', fontWeight: 700 }}>+</span>
              </summary>
              <p className="cce-flow-text" style={{ margin: '14px 0 0 0', fontSize: '0.9375rem' }}>
                La captación y negociación de patrocinios, así como la comercialización y cobro de boletos físicos con
                holograma, es gestionada 100% por la presidencia del CCE Juárez. Apolograma provee exclusivamente la
                infraestructura técnica y digital de filtro y enrutamiento.
              </p>
            </details>

            {/* FAQ 3 */}
            <details
              style={{
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--cce-text-dark)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '44px',
                }}
              >
                <span>¿Cuál es el tiempo de entrega y cuándo estará lista la landing?</span>
                <span style={{ color: 'var(--cce-emerald)', fontSize: '1.25rem', fontWeight: 700 }}>+</span>
              </summary>
              <p className="cce-flow-text" style={{ margin: '14px 0 0 0', fontSize: '0.9375rem' }}>
                El cronograma de entrega es acelerado de 5 a 7 días hábiles a partir de la confirmación, garantizando
                que los materiales estén validados y listos antes de la rueda de prensa oficial del Mtro. Iván Lara ante
                medios de comunicación.
              </p>
            </details>

            {/* FAQ 4 */}
            <details
              style={{
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--cce-text-dark)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '44px',
                }}
              >
                <span>¿Cómo se realiza el pago y qué incluye el presupuesto de pauta?</span>
                <span style={{ color: 'var(--cce-emerald)', fontSize: '1.25rem', fontWeight: 700 }}>+</span>
              </summary>
              <p className="cce-flow-text" style={{ margin: '14px 0 0 0', fontSize: '0.9375rem' }}>
                Se formaliza en una sola exhibición por $18,560 MXN ($16,000 MXN base + $2,560 MXN de 16% IVA), con
                factura electrónica CFDI emitida por TECNOLOGIES TECZA, S. DE R.L. DE C.V. y transferencia a la cuenta
                oficial Banregio. El monto base ya incluye los $4,000 MXN de saldo publicitario en Meta Ads, sin cargos adicionales para el CCE.
              </p>
            </details>

            {/* FAQ 5 */}
            <details
              style={{
                background: 'var(--cce-bg-cream)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--cce-text-dark)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '44px',
                }}
              >
                <span>¿Cómo opera la inversión publicitaria en Meta Ads?</span>
                <span style={{ color: 'var(--cce-emerald)', fontSize: '1.25rem', fontWeight: 700 }}>+</span>
              </summary>
              <p className="cce-flow-text" style={{ margin: '14px 0 0 0', fontSize: '0.9375rem' }}>
                La propuesta cubre el diseño gráfico, segmentación y optimización de las campañas. La inversión directa
                en medios es fijada por el CCE y pagada directamente a Meta Ads desde su método de pago, sin recargos
                ni comisiones de agencia.
              </p>
            </details>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/apolograma-logo-v2.png"
                alt="Logo Apolograma Studio"
                style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
              />
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
              Propuesta comercial ejecutiva para CCE Ciudad Juárez · Entrega de Galardones 2026
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
