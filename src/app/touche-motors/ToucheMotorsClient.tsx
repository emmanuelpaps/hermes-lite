"use client";

import React, { useState, useEffect } from "react";

// Vehicle Data Definition for the Interactive Flagship Showcase
interface VehicleSpec {
  id: "ram" | "jeep" | "dodge";
  name: string;
  badge: string;
  engine: string;
  power: string;
  motorDesc: string;
  accel: string;
  traction: string;
  image: string;
  tagline: string;
  description: string;
  reticleTop: string;
  reticleBottom: string;
}

const VEHICLES: Record<"ram" | "jeep" | "dodge", VehicleSpec> = {
  ram: {
    id: "ram",
    name: "RAM 1500 TRX Flagship",
    badge: "HELLCAT 6.2L SUPERCHARGED",
    engine: "6.2L HEMI",
    power: "702 HP",
    motorDesc: "V8 Supercharged",
    accel: "4.5s",
    traction: "4×4 Launch",
    image: "/assets/touche-motors/hero_ram_trx.jpg",
    tagline: "El Máximo Exponente del Poder Americano",
    description: "Dominio visual inigualable en pauta y reels. La camioneta de producción más rápida y potente del mundo, filmada con drones y estabilizadores a ras de piso.",
    reticleTop: "┌ PADDOCK.01 ┐",
    reticleBottom: "└ 6080.PASEO ┘",
  },
  jeep: {
    id: "jeep",
    name: "Jeep Grand Cherokee Summit",
    badge: "LUJO & CAPACIDAD 4×4 STELLANTIS",
    engine: "Quadra-Drive II",
    power: "375 HP",
    motorDesc: "Arquitectura Premium",
    accel: "5.8s",
    traction: "4×4 Selec-Terrain",
    image: "/assets/touche-motors/hero_jeep.jpg",
    tagline: "La Cumbre del Confort Ejecutivo Familiar",
    description: "Interiores en piel Palermo, sonido McIntosh y estética refinada. Campañas dirigidas a directivos y familias de alto poder adquisitivo de Juárez y El Paso.",
    reticleTop: "┌ PADDOCK.02 ┐",
    reticleBottom: "└ SUMMIT.6080 ┘",
  },
  dodge: {
    id: "dodge",
    name: "Dodge Charger SRT Hellcat",
    badge: "MOTORSPORT WIDEBODY HERITAGE",
    engine: "6.2L Supercharged",
    power: "717 HP",
    motorDesc: "HEMI Puro Músculo",
    accel: "3.6s",
    traction: "SRT Drive Modes",
    image: "/assets/touche-motors/hero_dodge.jpg",
    tagline: "Adrenalina y Sonido Inconfundible en Pista",
    description: "Grabación con microfonía direccional en escapes y tomas cinemáticas de aceleración para cautivar a los entusiastas de alto desempeño en la región.",
    reticleTop: "┌ PADDOCK.03 ┐",
    reticleBottom: "└ SRT.HELLCAT ┘",
  },
};

// Formats Showcase Data
interface FormatSpec {
  id: "reels" | "feed" | "ads";
  tabLabel: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
  mockupBadge: string;
  mockupHookTitle: string;
  mockupHookDesc: string;
  mockupCta: string;
  metricLabel: string;
  metricValue: string;
  bullet1Title: string;
  bullet1Desc: string;
  bullet2Title: string;
  bullet2Desc: string;
}

const FORMATS: Record<"reels" | "feed" | "ads", FormatSpec> = {
  reels: {
    id: "reels",
    tabLabel: "Stories & Reels 9:16",
    icon: "smart_display",
    badge: "Formato 9:16 Vertical Dinámico",
    title: "Reels de Alto Impacto con Hooks de Venta Directa",
    description: "Cada pieza está concebida para atrapar al comprador en los primeros 1.5 segundos mediante un corte de aceleración, rugido de motor HEMI o encendido de luces diurnas LED en el showroom de Paseo Triunfo 6080.",
    mockupBadge: "REEL 9:16",
    mockupHookTitle: "¿Listo para domar 702 caballos de fuerza?",
    mockupHookDesc: "Unidad disponible para entrega inmediata en Paseo Triunfo 6080. Agenda tu prueba de manejo privada hoy.",
    mockupCta: "Contactar a Ventas Touché",
    metricLabel: "Índice de Retención Algorítmica Estimado",
    metricValue: "+78% vs fotos estáticas",
    bullet1Title: "CALL TO ACTION CLARO",
    bullet1Desc: "Dirección directa a WhatsApp de Gerencia Comercial sin fricciones.",
    bullet2Title: "AUDIO INMERSIVO DE MOTOR",
    bullet2Desc: "Tomas con micrófonos dedicados capturando el sonido real de los escapes.",
  },
  feed: {
    id: "feed",
    tabLabel: "Feed 4:5 / 1:1 Catálogo",
    icon: "grid_view",
    badge: "Formato 4:5 / 1:1 Catálogo Oficial",
    title: "Carruseles de Especificación & Fotos Editoriales",
    description: "Publicaciones de alto valor estético para el feed oficial de Instagram y Facebook. Diseñadas para que el prospecto guarde la ficha técnica y compare equipamiento antes de visitar la agencia.",
    mockupBadge: "CATÁLOGO FEED",
    mockupHookTitle: "RAM 1500 TRX 2026 • Ficha Técnica Oficial",
    mockupHookDesc: "Desliza para ver interiores en piel nappa, cluster digital configurado y disponibilidad en inventario físico.",
    mockupCta: "Solicitar Ficha Técnica",
    metricLabel: "Tasa de Guardados e Interacción Cualificada",
    metricValue: "3.4x Mayor Frecuencia",
    bullet1Title: "LOOK EDITORIAL STELLANTIS",
    bullet1Desc: "Color grading cinematográfico respetando los lineamientos de marca.",
    bullet2Title: "CONVERSIÓN DE FEED A SALA",
    bullet2Desc: "Copywriting enfocado en disponibilidad inmediata y opciones de arrendamiento.",
  },
  ads: {
    id: "ads",
    tabLabel: "Meta Sponsored Ads",
    icon: "campaign",
    badge: "Meta Ads (Click-to-WhatsApp)",
    title: "Pauta Segmentada C-Suite Juárez & El Paso",
    description: "Creativos optimizados con botón directo de conversión a WhatsApp Business de Touché. Exclusión de tráfico irrelevante para asegurar prospectos con solvencia comprobada.",
    mockupBadge: "PATROCINADO DIRECTO",
    mockupHookTitle: "Oportunidad de Leasing Empresarial Touché",
    mockupHookDesc: "Adquiere tu RAM TRX con 100% de deducibilidad fiscal. Contacta directamente a Dirección de Ventas.",
    mockupCta: "Enviar WhatsApp a Ventas",
    metricLabel: "Costo por Conversión a Chat Comercial",
    metricValue: "Leads Filtrados Directos",
    bullet1Title: "GEO-SEGMENTACIÓN QUIRÚRGICA",
    bullet1Desc: "Focalización en zonas residenciales premium y directores de empresa.",
    bullet2Title: "PAGO DIRECTO A META",
    bullet2Desc: "Touché fondea directo su cuenta publicitaria sin sobrecostos de agencia.",
  },
};

export default function ToucheMotorsClient() {
  const [selectedVehicle, setSelectedVehicle] = useState<"ram" | "jeep" | "dodge">("ram");
  const [selectedFormat, setSelectedFormat] = useState<"reels" | "feed" | "ads">("reels");
  const [selectedPlan, setSelectedPlan] = useState<"B" | "A">("B");
  const [taxRate, setTaxRate] = useState<number>(0.16);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Financial Calculations
  const apologramaFee = selectedPlan === "B" ? 10000 : 20000;
  const apologramaTax = apologramaFee * taxRate;
  const apologramaTotal = apologramaFee + apologramaTax;

  const metaAdsBudget = selectedPlan === "B" ? 2000 : 4000;
  const totalCombinedMonthly = apologramaTotal + metaAdsBudget;

  const currentVehicleData = VEHICLES[selectedVehicle];
  const currentFormatData = FORMATS[selectedFormat];

  // Telemetry on mount (with 3-layer exclusion)
  useEffect(() => {
    try {
      const isLocalhost = Boolean(
        typeof window !== "undefined" && (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.startsWith("192.168.") ||
          window.location.hostname.endsWith(".local")
        )
      );

      const showToast = (msg: string) => {
        if (typeof document === "undefined") return;
        let toast = document.getElementById("apolo-admin-toast");
        if (!toast) {
          toast = document.createElement("div");
          toast.id = "apolo-admin-toast";
          toast.style.cssText =
            "position:fixed;top:20px;right:20px;z-index:99999;background:rgba(18,20,26,0.95);border:1px solid rgba(212,175,55,0.6);color:#f5f3ee;padding:10px 18px;border-radius:12px;font-family:sans-serif;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,0.8);backdrop-filter:blur(10px);transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;display:flex;align-items:center;gap:8px;";
          document.body.appendChild(toast);
        }
        toast.innerHTML = msg;
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          if (toast) {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-10px)";
          }
        }, 3500);
      };

      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("admin") || urlParams.has("bypass") || urlParams.has("preview")) {
          const val = urlParams.get("admin") || urlParams.get("bypass") || urlParams.get("preview") || "";
          if (val === "0" || val === "false" || val === "off") {
            localStorage.removeItem("apolo_admin_device");
            showToast("🔔 <b>Alertas Reactivadas:</b> Notificaciones encendidas.");
          } else {
            localStorage.setItem("apolo_admin_device", "true");
            showToast("🛡️ <b>Modo Administrador:</b> Alertas silenciadas en este dispositivo.");
          }
        }
      }

      const isAdminDevice = typeof localStorage !== "undefined" && localStorage.getItem("apolo_admin_device") === "true";

      if (!isLocalhost && !isAdminDevice) {
        const slug = "touche-motors";
        const sessionKey = "apolo_opened_" + slug;
        const lastNotified = sessionStorage.getItem(sessionKey);

        if (!lastNotified || Date.now() - parseInt(lastNotified, 10) >= 300000) {
          sessionStorage.setItem(sessionKey, Date.now().toString());

          fetch("/api/notify-open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientName: "Touché Motors (Stellantis)",
              clientSlug: "touche-motors",
              url: window.location.href,
              referrer: document.referrer || "Directo / WhatsApp",
              screenResolution: window.screen.width + "x" + window.screen.height,
            }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.debug("Telemetry error:", e);
    }
  }, []);

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    const planName = selectedPlan === "B" ? "Plan B: Impulso Táctico" : "Plan A: Dominio Total";
    const taxLabel = taxRate === 0.16 ? "IVA 16%" : "IVA 8% Fronterizo";
    return `Hola Apolograma, hemos revisado la propuesta VIP Paddock Club para Touché Motors Paseo Triunfo 6080.

Deseamos arrancar con:
• ${planName}
• Honorarios Apolograma: $${apologramaFee.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN (+ ${taxLabel} = $${apologramaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN)
• Inversión Directa en Meta Ads: $${metaAdsBudget.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN (fondeada por Touché)
• Desembolso Mensual Total: $${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN

Agendemos la primera sesión de scouting presencial in-situ para coordinar la producción bimestral.`;
  };

  const handleOpenWhatsApp = () => {
    const msg = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/526563155799?text=${msg}`, "_blank");
    setIsModalOpen(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopiedToast("¡Mensaje copiado al portapapeles!");
    setTimeout(() => setCopiedToast(null), 2500);
  };

  return (
    <div className="paddock-wrapper">
      {/* External Typography & Icons for VIP Paddock Club */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Comprehensive, Bulletproof CSS Styles for VIP Paddock Club */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* === RESET & VARIABLES === */
        .paddock-wrapper {
          --obsidian-deep: #07080a;
          --obsidian-bg: #0b0c10;
          --obsidian-soft: #12141a;
          --obsidian-glass: rgba(18, 20, 26, 0.78);
          --champagne: #d4af37;
          --champagne-light: #f3e5ab;
          --champagne-dim: #8e7834;
          --champagne-halo: rgba(212, 175, 55, 0.14);
          --ivory: #f5f3ee;
          --ivory-muted: #c6c2b8;
          --ivory-subtle: #8e8a82;

          background-color: #07080a;
          background-image: 
            radial-gradient(at 15% 10%, rgba(212, 175, 55, 0.08) 0px, transparent 45%),
            radial-gradient(at 85% 35%, rgba(229, 26, 36, 0.06) 0px, transparent 50%),
            radial-gradient(at 50% 85%, rgba(212, 175, 55, 0.07) 0px, transparent 60%);
          color: var(--ivory);
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          min-height: 100vh;
          padding-bottom: 140px;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }

        .paddock-wrapper * {
          box-sizing: border-box;
        }

        /* Typography */
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: 300;
          font-size: 20px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }

        /* Glassmorphism & Gold Styling */
        .gold-hairline {
          border: 1px solid rgba(212, 175, 55, 0.24);
        }
        .gold-hairline-subtle {
          border: 1px solid rgba(212, 175, 55, 0.12);
        }
        .gold-glow {
          box-shadow: 0 14px 45px -10px rgba(212, 175, 55, 0.2), inset 0 1px 0 0 rgba(243, 229, 171, 0.22);
        }
        .smoked-card {
          background: linear-gradient(145deg, rgba(22, 24, 32, 0.85) 0%, rgba(13, 14, 18, 0.94) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        .smoked-card-elevated {
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.92) 0%, rgba(16, 18, 24, 0.97) 100%);
          backdrop-filter: blur(36px);
          -webkit-backdrop-filter: blur(36px);
        }
        .gold-gradient-text {
          background: linear-gradient(135deg, #ffffff 10%, #f3e5ab 60%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Header Navigation */
        .paddock-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(212, 175, 55, 0.14);
          background: rgba(11, 12, 16, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .header-brand-cluster {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          color: var(--champagne);
          font-size: 13px;
        }
        .header-brand-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ivory);
        }
        .header-brand-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(243, 229, 171, 0.75);
        }
        .header-confidential-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          padding: 5px 12px;
          border-radius: 9999px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--champagne-light);
          text-transform: uppercase;
          font-weight: 600;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--champagne);
          box-shadow: 0 0 8px var(--champagne);
        }

        /* Sub-Header Strip */
        .paddock-substrip {
          padding-top: 68px;
          padding-bottom: 12px;
          padding-left: 24px;
          padding-right: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(7, 8, 10, 0.75);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ivory-subtle);
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Main Container */
        .paddock-main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 32px 20px 60px 20px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* Section Headings */
        .section-header-block {
          border-left: 2px solid var(--champagne);
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 20px;
        }
        .section-tag-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--champagne);
        }
        .section-headline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--ivory);
          line-height: 1.15;
          margin: 0;
        }
        .section-subtitle-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ivory-subtle);
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        /* Hero Status Pills */
        .hero-status-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-bottom: 16px;
        }
        .hero-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Hero Typography */
        .hero-editorial-headline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 48px;
          font-weight: 400;
          line-height: 1.1;
          color: var(--ivory);
          margin: 8px 0 16px 0;
        }
        .hero-description {
          font-size: 15px;
          line-height: 1.65;
          color: var(--ivory-muted);
          max-width: 680px;
          font-weight: 300;
        }

        /* Vehicle Selector Tabs */
        .vehicle-tabs-row {
          display: flex;
          gap: 8px;
          padding: 6px;
          border-radius: 14px;
          background: rgba(22, 24, 32, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.15);
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .vehicle-tab-btn {
          flex: 1;
          min-width: 140px;
          padding: 10px 14px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          color: var(--ivory-muted);
        }
        .vehicle-tab-btn.active {
          background: var(--champagne);
          color: #07080a;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
        }

        /* Showcase Flagship Card */
        .showcase-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.92) 0%, rgba(16, 18, 24, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.26);
          box-shadow: 0 18px 50px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.12);
        }
        .showcase-header-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent);
        }
        .showcase-media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #000;
        }
        .showcase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.92;
          transition: transform 0.8s ease;
        }
        .showcase-card:hover .showcase-img {
          transform: scale(1.03);
        }
        .showcase-reticle-tl { position: absolute; top: 14px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(212,175,55,0.6); }
        .showcase-reticle-tr { position: absolute; top: 14px; right: 16px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(212,175,55,0.6); }
        .showcase-reticle-bl { position: absolute; bottom: 14px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(243,229,171,0.8); letter-spacing: 0.15em; }
        .showcase-reticle-br { position: absolute; bottom: 14px; right: 16px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--ivory-subtle); letter-spacing: 0.15em; }

        /* Telemetry Grid */
        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(212, 175, 55, 0.16);
          background: rgba(0, 0, 0, 0.45);
        }
        .telemetry-cell {
          padding: 16px 20px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }
        .telemetry-cell:last-child {
          border-right: none;
        }
        .telemetry-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.85);
        }
        .telemetry-val {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--ivory);
          margin-top: 2px;
        }
        .telemetry-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--ivory-subtle);
          margin-top: 2px;
        }

        /* Rhythm Banner */
        .rhythm-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-radius: 16px;
          background: linear-gradient(145deg, rgba(22, 24, 32, 0.85) 0%, rgba(13, 14, 18, 0.94) 100%);
          border: 1px solid rgba(212, 175, 55, 0.22);
          gap: 16px;
          flex-wrap: wrap;
        }
        .rhythm-badge-box {
          padding: 10px 16px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.2);
          text-align: right;
        }

        /* 4 Pillars Grid */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }
        .pillar-card-box {
          border-radius: 16px;
          padding: 24px;
          background: linear-gradient(145deg, rgba(22, 24, 32, 0.8) 0%, rgba(13, 14, 18, 0.92) 100%);
          border: 1px solid rgba(212, 175, 55, 0.14);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pillar-card-box:hover {
          border-color: rgba(212, 175, 55, 0.4);
          transform: translateY(-2px);
        }
        .pillar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pillar-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--champagne);
        }
        .pillar-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ivory);
          margin: 0;
        }
        .pillar-desc {
          font-size: 13px;
          line-height: 1.6;
          color: var(--ivory-muted);
          font-weight: 300;
          margin: 0;
        }
        .pillar-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ivory-subtle);
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Formats Showcase Container */
        .formats-box {
          border-radius: 20px;
          padding: 28px;
          background: linear-gradient(145deg, rgba(22, 24, 32, 0.85) 0%, rgba(13, 14, 18, 0.95) 100%);
          border: 1px solid rgba(212, 175, 55, 0.22);
        }
        .formats-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 36px;
          align-items: center;
        }

        /* Phone Simulator 9:16 */
        .phone-shell {
          width: 290px;
          border-radius: 40px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.95) 0%, rgba(16, 18, 24, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.12);
          margin: 0 auto;
        }
        .phone-notch {
          width: 90px;
          height: 14px;
          background: #000;
          border-radius: 9999px;
          margin: 0 auto 8px auto;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .phone-screen {
          border-radius: 28px;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          background: #000;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .phone-header-overlay {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
        }
        .phone-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
        }
        .phone-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%);
        }
        .phone-bottom-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .phone-hook-card {
          padding: 12px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .phone-cta-btn {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--champagne);
          color: #07080a;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: none;
          text-decoration: none;
          cursor: pointer;
        }

        /* Financial Ledger Section */
        .plans-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .plan-card {
          border-radius: 18px;
          padding: 24px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          background: linear-gradient(145deg, rgba(22, 24, 32, 0.85) 0%, rgba(13, 14, 18, 0.94) 100%);
          border: 1px solid rgba(212, 175, 55, 0.16);
        }
        .plan-card.active {
          border-color: var(--champagne);
          box-shadow: 0 14px 45px -10px rgba(212, 175, 55, 0.22);
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.94) 0%, rgba(16, 18, 24, 0.98) 100%);
        }
        .plan-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .plan-price-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 600;
          color: var(--champagne-light);
        }

        /* Fiscal Ledger Table */
        .ledger-table-box {
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.92) 0%, rgba(16, 18, 24, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.24);
        }
        .ledger-toolbar {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.16);
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .tax-btn {
          padding: 5px 12px;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .tax-btn.active {
          background: var(--champagne);
          color: #07080a;
          font-weight: 700;
        }
        .tax-btn.inactive {
          background: rgba(255, 255, 255, 0.05);
          color: var(--ivory-muted);
          border: 1px solid rgba(212, 175, 55, 0.15);
        }
        .ledger-row {
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          gap: 16px;
        }
        .ledger-total-row {
          padding: 24px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to right, rgba(212, 175, 55, 0.12), transparent);
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          gap: 16px;
        }

        /* Roadmap Grid */
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .roadmap-card {
          border-radius: 14px;
          padding: 18px;
          background: rgba(22, 24, 32, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.14);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Floating Concierge Dock */
        .floating-dock-container {
          position: fixed;
          bottom: 64px;
          left: 0;
          width: 100%;
          z-index: 40;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          pointer-events: none;
        }
        .floating-dock-card {
          pointer-events: auto;
          max-width: 580px;
          width: 100%;
          border-radius: 18px;
          padding: 12px 18px;
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.95) 0%, rgba(16, 18, 24, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .dock-cta-btn {
          padding: 10px 18px;
          border-radius: 12px;
          background: var(--champagne);
          color: #07080a;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .dock-cta-btn:hover {
          background: var(--champagne-light);
          transform: translateY(-1px);
        }

        /* Bottom Nav Bar */
        .paddock-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          background: rgba(11, 12, 16, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(212, 175, 55, 0.16);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 16px;
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: var(--ivory-subtle);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          gap: 2px;
          transition: color 0.2s;
        }
        .bottom-nav-item:hover, .bottom-nav-item.active {
          color: var(--champagne);
        }

        /* Modal Backdrop & Dialog */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-dialog {
          max-width: 540px;
          width: 100%;
          border-radius: 20px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(28, 31, 42, 0.98) 0%, rgba(16, 18, 24, 0.99) 100%);
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-textarea {
          width: 100%;
          height: 140px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--ivory);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.5;
          resize: none;
          outline: none;
        }

        /* === RESPONSIVE MEDIA QUERIES === */
        @media (max-width: 768px) {
          .paddock-header { padding: 12px 16px; }
          .paddock-substrip { padding-top: 62px; padding-left: 16px; padding-right: 16px; }
          .paddock-main { padding: 24px 14px 60px 14px; gap: 40px; }
          .hero-editorial-headline { font-size: 32px; }
          .section-headline { font-size: 26px; }
          .telemetry-grid { grid-template-columns: 1fr 1fr; }
          .telemetry-cell:nth-child(2) { border-right: none; }
          .pillars-grid { grid-template-columns: 1fr; }
          .formats-grid { grid-template-columns: 1fr; }
          .plans-comparison-grid { grid-template-columns: 1fr; }
          .roadmap-grid { grid-template-columns: 1fr; }
          .ledger-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .ledger-total-row { flex-direction: column; align-items: flex-start; gap: 8px; }
          .format-metric-box { flex-direction: column; align-items: flex-start !important; gap: 6px; }
        }

        @media (max-width: 480px) {
          .vehicle-tab-btn { min-width: 95px; padding: 8px 8px; font-size: 9px; }
          .plan-header-row { flex-direction: column; align-items: flex-start; gap: 8px; }
          .plan-header-row > div:last-child { text-align: left !important; }
          .plan-price-num { font-size: 28px; }
          .floating-dock-card { padding: 10px 14px; }
          .floating-dock-card .dock-cta-btn { padding: 8px 12px; font-size: 11px; }
        }
      `}} />

      {/* TOP CONCIERGE BAR */}
      <header className="paddock-header">
        <div className="header-brand-cluster">
          <div className="header-logo-icon">✦</div>
          <div>
            <div className="header-brand-title">
              Apolograma <span style={{ color: "#d4af37", fontWeight: 300 }}>×</span> Touché Motors
            </div>
            <div className="header-brand-sub">
              Private Memorandum • Stellantis Luxury Division
            </div>
          </div>
        </div>
        <div className="header-confidential-badge">
          <span className="pulse-dot"></span>
          <span>2026 Confidencial</span>
        </div>
      </header>

      {/* SUB-HEADER AMBIENT STRIP */}
      <div className="paddock-substrip">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#d4af37" }}>Paseo Triunfo 6080</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Concesionario Oficial Stellantis</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#c6c2b8" }}>Dir. General & Ventas</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ color: "#f3e5ab" }}>Cd. Juárez / El Paso</span>
        </div>
      </div>

      {/* MAIN VIP SALON CANVAS */}
      <main className="paddock-main">

        {/* SECTION 1: HERO DISPLAY (FLAGSHIP ART PIECE & DYNAMIC HUD) */}
        <section id="hud">
          {/* Status Tags */}
          <div className="hero-status-row">
            <span
              className="hero-status-pill smoked-card gold-hairline"
              style={{ color: "#d4af37", fontWeight: 500 }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }}></span>
              Propuesta Privada 2026
            </span>
            <span
              className="hero-status-pill"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#c6c2b8" }}
            >
              Contrato Bimestral Exclusivo
            </span>
          </div>

          {/* Editorial Headline */}
          <p className="section-tag-mono">Curaduría Audiovisual & Pauta Digital</p>
          <h1 className="hero-editorial-headline">
            Producción de Alto Impacto <span className="gold-gradient-text" style={{ fontStyle: "italic" }}>para el Élite</span> Automotriz
          </h1>
          <p className="hero-description">
            Dominio cinematográfico de inventario flagship (<strong style={{ color: "#f5f3ee", fontWeight: 500 }}>RAM TRX, Jeep Grand Cherokee, Dodge SRT</strong>) en la frontera Ciudad Juárez — El Paso. Diseñado con la distinción y precisión de un club privado automotriz.
          </p>

          {/* Vehicle Selector Tabs */}
          <div className="vehicle-tabs-row" style={{ marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => setSelectedVehicle("ram")}
              className={`vehicle-tab-btn ${selectedVehicle === "ram" ? "active" : ""}`}
            >
              <span>RAM 1500 TRX</span>
              {selectedVehicle === "ram" && <span>✦</span>}
            </button>
            <button
              type="button"
              onClick={() => setSelectedVehicle("jeep")}
              className={`vehicle-tab-btn ${selectedVehicle === "jeep" ? "active" : ""}`}
            >
              <span>Jeep Grand Cherokee</span>
              {selectedVehicle === "jeep" && <span>✦</span>}
            </button>
            <button
              type="button"
              onClick={() => setSelectedVehicle("dodge")}
              className={`vehicle-tab-btn ${selectedVehicle === "dodge" ? "active" : ""}`}
            >
              <span>Dodge Charger SRT</span>
              {selectedVehicle === "dodge" && <span>✦</span>}
            </button>
          </div>

          {/* Gallery Showcase Card with Dynamic Vehicle Media */}
          <div className="showcase-card">
            {/* Top Specs Bar */}
            <div className="showcase-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#dc2626", boxShadow: "0 0 8px #dc2626" }}></span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", fontWeight: 600 }}>
                  Flagship Asset: {currentVehicleData.name}
                </span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#8e8a82" }}>
                [{currentVehicleData.badge}]
              </div>
            </div>

            {/* Vehicle Image Frame */}
            <div className="showcase-media-frame">
              <img
                src={currentVehicleData.image}
                alt={currentVehicleData.name}
                className="showcase-img"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #07080a 0%, transparent 60%, rgba(0,0,0,0.4) 100%)" }}></div>
              
              {/* Luminous Reticle Crosshairs */}
              <span className="showcase-reticle-tl">{currentVehicleData.reticleTop}</span>
              <span className="showcase-reticle-tr">{currentVehicleData.reticleBottom}</span>
              <span className="showcase-reticle-bl">✦ STELLANTIS DYNAMICS</span>
              <span className="showcase-reticle-br">[4K UHD CINEMA]</span>
            </div>

            {/* Bespoke Telemetry Grid */}
            <div className="telemetry-grid">
              <div className="telemetry-cell">
                <div className="telemetry-label">Potencia</div>
                <div className="telemetry-val">
                  {currentVehicleData.power.split(" ")[0]} <span style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: 300, color: "#8e8a82" }}>HP</span>
                </div>
                <div className="telemetry-sub">Dinamismo Puro</div>
              </div>
              <div className="telemetry-cell">
                <div className="telemetry-label">Motorización</div>
                <div className="telemetry-val">{currentVehicleData.engine}</div>
                <div className="telemetry-sub">{currentVehicleData.motorDesc}</div>
              </div>
              <div className="telemetry-cell">
                <div className="telemetry-label">Aceleración</div>
                <div className="telemetry-val">{currentVehicleData.accel}</div>
                <div className="telemetry-sub">0 a 100 km/h</div>
              </div>
              <div className="telemetry-cell">
                <div className="telemetry-label">Tracción</div>
                <div className="telemetry-val">{currentVehicleData.traction}</div>
                <div className="telemetry-sub">Control Inteligente</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BI-MONTHLY PRODUCTION PROTOCOL */}
        <section id="ritmo">
          <div className="section-header-block">
            <span className="section-tag-mono">Protocolo de Operación Frecuencial</span>
            <h2 className="section-headline">Ritmo de Producción Bimestral</h2>
            <div className="section-subtitle-mono">DESPLIEGUE TÉCNICO IN-SITU • PASEO TRIUNFO 6080</div>
          </div>

          {/* Banner Feature */}
          <div className="rhythm-banner">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(212, 175, 55, 0.35)", background: "rgba(212, 175, 55, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af37", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>autorenew</span>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, margin: 0, color: "#f5f3ee" }}>
                  Visitas Intensivas In-Situ Cada 60 Días
                </h4>
                <p style={{ fontSize: "13px", color: "#c6c2b8", margin: "4px 0 0 0", fontWeight: 300 }}>
                  Producción cinematográfica sin interrumpir la operación comercial ni la entrega a clientes en piso.
                </p>
              </div>
            </div>
            <div className="rhythm-badge-box">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase" }}>
                Stock Garantizado por Ciclo
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700, color: "#f3e5ab", marginTop: "2px" }}>
                +24 PIEZAS VIDEO + 40 STILLS HD
              </div>
            </div>
          </div>

          {/* Curated 4-Pillar Grid */}
          <div className="pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card-box">
              <div className="pillar-card-header">
                <div className="pillar-icon-box">
                  <span className="material-symbols-outlined">flight</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(243,229,171,0.85)" }}>
                  [FPV CINEMA 4K]
                </span>
              </div>
              <h3 className="pillar-title">Vuelos FPV & Tomas Dinámicas</h3>
              <p className="pillar-desc">
                Incursiones aéreas cinemáticas en los patios de maniobra y pasillo central de exhibición. Perspectivas agresivas que transmiten la escala masiva del inventario RAM y Jeep.
              </p>
              <ul className="pillar-bullets">
                <li><span style={{ color: "#d4af37" }}>✦</span> Pases a ras de asfalto y rampa de entregas</li>
                <li><span style={{ color: "#d4af37" }}>✦</span> Drones cinewhoop con protectores certificados</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card-box">
              <div className="pillar-card-header">
                <div className="pillar-icon-box">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(243,229,171,0.85)" }}>
                  [OSMO 3-AXIS]
                </span>
              </div>
              <h3 className="pillar-title">DJI Osmo & Gimbal Walkarounds</h3>
              <p className="pillar-desc">
                Reels verticales ultra-estabilizados con audio binaural: rugido real de escapes HEMI, texturas en piel nappa, costuras rojas TRX y cluster digital SRT en funcionamiento.
              </p>
              <ul className="pillar-bullets">
                <li><span style={{ color: "#d4af37" }}>✦</span> Microfonía dedicada a escape y sonido de motor</li>
                <li><span style={{ color: "#d4af37" }}>✦</span> Detalle macro de interiores e ingeniería de consola</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card-box">
              <div className="pillar-card-header">
                <div className="pillar-icon-box">
                  <span className="material-symbols-outlined">flare</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(243,229,171,0.85)" }}>
                  [MASTER CATALOG]
                </span>
              </div>
              <h3 className="pillar-title">Fotografía de Catálogo Oficial</h3>
              <p className="pillar-desc">
                Esquemas de iluminación continua y flashes en taller y entrega. Look publicitario editorial alineado a los estándares globales de Stellantis North America.
              </p>
              <ul className="pillar-bullets">
                <li><span style={{ color: "#d4af37" }}>✦</span> Portadas de pauta con alto CTR calificado</li>
                <li><span style={{ color: "#d4af37" }}>✦</span> Color grading automotriz con calidad cine</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card-box">
              <div className="pillar-card-header">
                <div className="pillar-icon-box">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(243,229,171,0.85)" }}>
                  [RETENTION ENGINE]
                </span>
              </div>
              <h3 className="pillar-title">Meta High-Retention & Pauta</h3>
              <p className="pillar-desc">
                Estructuras con hook inmediato de 1.5 segundos dirigidas exclusivamente a empresarios de Ciudad Juárez y compradores binacionales de El Paso, Texas.
              </p>
              <ul className="pillar-bullets">
                <li><span style={{ color: "#d4af37" }}>✦</span> Segmentación C-Suite de alto poder adquisitivo</li>
                <li><span style={{ color: "#d4af37" }}>✦</span> Embudo directo a atención comercial WhatsApp</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: CREATIVE FORMATS SHOWCASE */}
        <section id="formatos">
          <div className="section-header-block">
            <span className="section-tag-mono">Colección de Anuncios</span>
            <h2 className="section-headline">Formatos & Creativos de Alto Rendimiento</h2>
            <div className="section-subtitle-mono">OPTIMIZADOS PARA ALGORITMO META 2026</div>
          </div>

          {/* Segment Selector Pills */}
          <div className="vehicle-tabs-row">
            <button
              type="button"
              onClick={() => setSelectedFormat("reels")}
              className={`vehicle-tab-btn ${selectedFormat === "reels" ? "active" : ""}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>smart_display</span>
              Stories & Reels 9:16
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("feed")}
              className={`vehicle-tab-btn ${selectedFormat === "feed" ? "active" : ""}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>grid_view</span>
              Feed 4:5 / 1:1
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("ads")}
              className={`vehicle-tab-btn ${selectedFormat === "ads" ? "active" : ""}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>campaign</span>
              Meta Sponsored Ads
            </button>
          </div>

          {/* Formats Container with Phone Mockup */}
          <div className="formats-box">
            <div className="formats-grid">
              
              {/* Phone Simulator */}
              <div>
                <div className="phone-shell">
                  <div className="phone-notch"></div>
                  <div className="phone-screen">
                    <img
                      src={currentVehicleData.image}
                      alt="Mockup Visual"
                      className="phone-bg-img"
                    />
                    <div className="phone-gradient-overlay"></div>

                    {/* Top Overlay */}
                    <div className="phone-header-overlay">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f3e5ab", fontWeight: 700 }}>
                        <span>TOUCHÉ MOTORS</span>
                        <span style={{ color: "#d4af37" }}>✦</span>
                      </div>
                      <span style={{ background: "rgba(212,175,55,0.25)", color: "#f3e5ab", border: "1px solid rgba(212,175,55,0.4)", padding: "2px 6px", borderRadius: "4px", fontSize: "8px", textTransform: "uppercase" }}>
                        {currentFormatData.mockupBadge}
                      </span>
                    </div>

                    {/* Bottom Captions Card & CTA */}
                    <div className="phone-bottom-content">
                      <div className="phone-hook-card">
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "14px", fontWeight: 600, color: "#f3e5ab", margin: 0, lineHeight: 1.3 }}>
                          {currentFormatData.mockupHookTitle}
                        </p>
                        <p style={{ fontSize: "11px", color: "#c6c2b8", margin: "4px 0 0 0", lineHeight: 1.3, fontWeight: 300 }}>
                          {currentFormatData.mockupHookDesc}
                        </p>
                      </div>
                      <a href="#inversion" className="phone-cta-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>chat</span>
                        <span>{currentFormatData.mockupCta}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Specifications Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "9999px", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase" }}>
                    {currentFormatData.badge}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#8e8a82", textTransform: "uppercase" }}>
                    100% Retención Visual
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 400, color: "#f5f3ee", margin: 0, lineHeight: 1.25 }}>
                  {currentFormatData.title}
                </h3>

                <p style={{ fontSize: "14px", color: "#c6c2b8", lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
                  {currentFormatData.description}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                  <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(22,24,32,0.7)", border: "1px solid rgba(212,175,55,0.12)" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#d4af37", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>touch_app</span>
                      <span>{currentFormatData.bullet1Title}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#c6c2b8", marginTop: "4px", fontWeight: 300 }}>
                      {currentFormatData.bullet1Desc}
                    </div>
                  </div>
                  <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(22,24,32,0.7)", border: "1px solid rgba(212,175,55,0.12)" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#d4af37", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>gps_fixed</span>
                      <span>{currentFormatData.bullet2Title}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#c6c2b8", marginTop: "4px", fontWeight: 300 }}>
                      {currentFormatData.bullet2Desc}
                    </div>
                  </div>
                </div>

                <div className="format-metric-box" style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.24)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#c6c2b8" }}>
                    {currentFormatData.metricLabel}
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#f3e5ab" }}>
                    {currentFormatData.metricValue}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: EXECUTIVE FINANCIAL LEDGER & TRANSPARENCY */}
        <section id="inversion">
          <div className="section-header-block">
            <span className="section-tag-mono">Ingeniería Financiera Transparente</span>
            <h2 className="section-headline">Inversión Mensual & Desglose Fiscal</h2>
            <div className="section-subtitle-mono">COTIZACIÓN MENSUAL EN MONEDA NACIONAL (MXN)</div>
          </div>

          {/* Plan Comparison Cards */}
          <div className="plans-comparison-grid">
            {/* Plan B */}
            <div
              onClick={() => setSelectedPlan("B")}
              className={`plan-card ${selectedPlan === "B" ? "active" : ""}`}
            >
              <div className="plan-header-row">
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase", fontWeight: 700 }}>
                    PLAN BASE RECOMENDADO
                  </span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", color: "#f5f3ee", margin: "4px 0 0 0", fontWeight: 700 }}>
                    Plan B: Impulso Táctico
                  </h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="plan-price-num">$10,000</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#8e8a82" }}>
                    MXN + IVA / MES
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#c6c2b8", fontWeight: 300, lineHeight: 1.55, margin: "0 0 16px 0" }}>
                Producción bimestral in-situ con dron 4K y gimbal para posicionamiento continuo del inventario insignia y captura sistemática de leads ejecutivos.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#f3e5ab", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: selectedPlan === "B" ? "#d4af37" : "transparent", border: selectedPlan === "B" ? "none" : "1px solid #8e8a82" }}></span>
                <span>{selectedPlan === "B" ? "Seleccionado actualmente" : "Hacer clic para activar Plan B"}</span>
              </div>
            </div>

            {/* Plan A */}
            <div
              onClick={() => setSelectedPlan("A")}
              className={`plan-card ${selectedPlan === "A" ? "active" : ""}`}
            >
              <div style={{ position: "absolute", top: "-10px", right: "20px", padding: "3px 10px", borderRadius: "9999px", background: "#d4af37", color: "#07080a", fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                MÁXIMA COBERTURA
              </div>
              <div className="plan-header-row">
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(212,175,55,0.8)", textTransform: "uppercase", fontWeight: 700 }}>
                    ESCALA COMPLETA
                  </span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", color: "#f5f3ee", margin: "4px 0 0 0", fontWeight: 700 }}>
                    Plan A: Dominio Total
                  </h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="plan-price-num">$20,000</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#8e8a82" }}>
                    MXN + IVA / MES
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#c6c2b8", fontWeight: 300, lineHeight: 1.55, margin: "0 0 16px 0" }}>
                Doble volumen de cobertura: Showroom Paseo Triunfo 6080 + pruebas dinámicas en carretera, mayor aceleración de pauta y cobertura completa de toda la gama.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: selectedPlan === "A" ? "#d4af37" : "transparent", border: selectedPlan === "A" ? "none" : "1px solid #8e8a82" }}></span>
                <span>{selectedPlan === "A" ? "Seleccionado actualmente" : "Hacer clic para activar Plan A"}</span>
              </div>
            </div>
          </div>

          {/* Fiscal Ledger Breakdown Table */}
          <div className="ledger-table-box">
            {/* Toolbar */}
            <div className="ledger-toolbar">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "#d4af37" }}>receipt_long</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#f5f3ee", fontWeight: 700 }}>
                  Desglose Fiscal & Estructura de Pagos
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82" }}>Régimen IVA:</span>
                <button
                  type="button"
                  onClick={() => setTaxRate(0.16)}
                  className={`tax-btn ${taxRate === 0.16 ? "active" : "inactive"}`}
                >
                  16% General
                </button>
                <button
                  type="button"
                  onClick={() => setTaxRate(0.08)}
                  className={`tax-btn ${taxRate === 0.08 ? "active" : "inactive"}`}
                >
                  8% Estímulo Fronterizo
                </button>
              </div>
            </div>

            {/* Line Items */}
            <div>
              {/* Row 1: Apolograma Fee */}
              <div className="ledger-row">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, color: "#f5f3ee" }}>
                    <span>Honorarios de Producción Bimestral & Curaduría de Pauta</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(212,175,55,0.15)", color: "#f3e5ab", border: "1px solid rgba(212,175,55,0.3)" }}>
                      Factura Apolograma
                    </span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82", marginTop: "3px" }}>
                    Dron 4K, DJI Osmo estabilizado, fotografía de catálogo, guiones técnicos, edición y optimización semanal
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 600, color: "#f5f3ee", whiteSpace: "nowrap" }}>
                  ${apologramaFee.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 2: IVA */}
              <div className="ledger-row">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#c6c2b8" }}>Impuesto al Valor Agregado (IVA sobre honorarios)</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(212,175,55,0.1)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.2)" }}>
                    {taxRate === 0.16 ? "16% Ley" : "8% Decreto Fronterizo"}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#8e8a82", whiteSpace: "nowrap" }}>
                  ${apologramaTax.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 3: Subtotal Apolograma */}
              <div className="ledger-row" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", textTransform: "uppercase", color: "#c6c2b8", fontWeight: 600 }}>
                    Subtotal Facturable por Apolograma (CFDI 4.0)
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#8e8a82" }}>
                    100% Deducible de impuestos para Touché Motors
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 700, color: "#f3e5ab", whiteSpace: "nowrap" }}>
                  ${apologramaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 4: Meta Ads Budget */}
              <div className="ledger-row" style={{ background: "rgba(212, 175, 55, 0.03)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500, color: "#d4af37" }}>
                    <span>Presupuesto Publicitario Meta Ads (Tráfico Directo)</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "#c6c2b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Pago Directo a Meta
                    </span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82", marginTop: "3px" }}>
                    Ingresado directamente por Touché Motors en su administrador con tarjeta corporativa (Factura expedida por Meta con RFC de Touché)
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 600, color: "#d4af37", whiteSpace: "nowrap" }}>
                  ${metaAdsBudget.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 5: Total Combined Monthly */}
              <div className="ledger-total-row">
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#f5f3ee", fontWeight: 800 }}>
                    Desembolso Total Mensual Consolidado
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#d4af37", marginTop: "4px" }}>
                    HONORARIOS AGENCIA CON IVA ($ {apologramaTotal.toLocaleString("es-MX")}) + PAUTA DIRECTA META ($ {metaAdsBudget.toLocaleString("es-MX")})
                  </div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 600, color: "#f3e5ab", whiteSpace: "nowrap" }}>
                  ${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            <span style={{ padding: "6px 14px", borderRadius: "9999px", background: "rgba(22,24,32,0.8)", border: "1px solid rgba(212,175,55,0.16)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#c6c2b8" }}>
              <span style={{ color: "#d4af37" }}>✦</span> Guión Técnico Aprobado
            </span>
            <span style={{ padding: "6px 14px", borderRadius: "9999px", background: "rgba(22,24,32,0.8)", border: "1px solid rgba(212,175,55,0.16)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#c6c2b8" }}>
              <span style={{ color: "#d4af37" }}>✦</span> Color Grading Cine Davinci Resolve
            </span>
            <span style={{ padding: "6px 14px", borderRadius: "9999px", background: "rgba(22,24,32,0.8)", border: "1px solid rgba(212,175,55,0.16)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#c6c2b8" }}>
              <span style={{ color: "#d4af37" }}>✦</span> Copywriting Directo a WhatsApp
            </span>
            <span style={{ padding: "6px 14px", borderRadius: "9999px", background: "rgba(22,24,32,0.8)", border: "1px solid rgba(212,175,55,0.16)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#c6c2b8" }}>
              <span style={{ color: "#d4af37" }}>✦</span> Optimización Semanal de Pauta
            </span>
          </div>
        </section>

        {/* SECTION 5: EXECUTIVE ROADMAP */}
        <section style={{ padding: "28px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(28, 31, 42, 0.92) 0%, rgba(16, 18, 24, 0.98) 100%)", border: "1px solid rgba(212, 175, 55, 0.22)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span className="section-tag-mono">Cronograma de Arranque Inmediato</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", color: "#f5f3ee", margin: "4px 0 0 0" }}>
                Activación en 5 Días Hábiles
              </h3>
            </div>
            <div style={{ padding: "4px 12px", borderRadius: "9999px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase" }}>
              Disponibilidad Confirmada
            </div>
          </div>

          <div className="roadmap-grid">
            <div className="roadmap-card">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#d4af37", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Paso 01 • Día 1-2
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "#f5f3ee" }}>
                Firma & Scouting Showroom
              </div>
              <div style={{ fontSize: "12px", color: "#c6c2b8", lineHeight: 1.5, fontWeight: 300 }}>
                Selección de unidades clave en Paseo Triunfo 6080 (RAM TRX, Rubicon, Hellcat) y definición de fechas de rodaje.
              </div>
            </div>

            <div className="roadmap-card">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#d4af37", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Paso 02 • Día 3
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "#f5f3ee" }}>
                Jornada de Rodaje In-Situ
              </div>
              <div style={{ fontSize: "12px", color: "#c6c2b8", lineHeight: 1.5, fontWeight: 300 }}>
                Despliegue de drones, cámaras estabilizadas y grabación de audio de motor sin interferir con ventas en sala.
              </div>
            </div>

            <div className="roadmap-card">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#d4af37", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Paso 03 • Día 5
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "#f5f3ee" }}>
                Entrega & Lanzamiento Meta
              </div>
              <div style={{ fontSize: "12px", color: "#c6c2b8", lineHeight: 1.5, fontWeight: 300 }}>
                Primer paquete de piezas entregado y campañas de tráfico patrocinadas activas generando prospectos hacia WhatsApp.
              </div>
            </div>
          </div>

          {/* Endorsement Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "18px", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ color: "#f3e5ab", fontWeight: 600 }}>APOLOGRAMA STUDIO</span> • Dirección Creativa Audiovisual
            </div>
            <div>
              <span style={{ color: "#f3e5ab", fontWeight: 600 }}>TOUCHÉ MOTORS</span> • Dirección General & Ventas
            </div>
          </div>
        </section>

      </main>

      {/* BOTTOM AMBIENT NAVIGATION BAR */}
      <nav className="paddock-bottom-nav">
        <a href="#hud" className="bottom-nav-item active">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>speed</span>
          <span>TRX HUD</span>
        </a>
        <a href="#ritmo" className="bottom-nav-item">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>schedule</span>
          <span>Ritmo</span>
        </a>
        <a href="#formatos" className="bottom-nav-item">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>perm_media</span>
          <span>Formatos</span>
        </a>
        <a href="#inversion" className="bottom-nav-item">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>receipt_long</span>
          <span>Inversión</span>
        </a>
      </nav>

      {/* FLOATING VIP CONCIERGE DOCK */}
      <div className="floating-dock-container">
        <div className="floating-dock-card">
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase", fontWeight: 700 }}>
              Propuesta Ejecutiva
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#f5f3ee" }}>
              Plan {selectedPlan}: ${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN neto/mes
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="dock-cta-btn"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chat</span>
            <span>Concierge WhatsApp</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP VIP CONCIERGE MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af37" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>verified_user</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", color: "#f5f3ee", margin: 0, fontWeight: 500 }}>
                    Concierge Touché Motors 2026
                  </h4>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#8e8a82", margin: "2px 0 0 0" }}>
                    Línea Directa con Dirección Creativa Apolograma
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#8e8a82", cursor: "pointer", padding: "4px" }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#d4af37", textTransform: "uppercase" }}>
                  Mensaje Pre-configurado para Validación:
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  style={{ background: "transparent", border: "none", color: "#f3e5ab", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>content_copy</span>
                  <span>Copiar texto</span>
                </button>
              </div>
              <textarea
                readOnly
                value={generateWhatsAppMessage()}
                className="modal-textarea"
              />
              {copiedToast && (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#d4af37", textAlign: "right", margin: "4px 0 0 0" }}>
                  {copiedToast}
                </p>
              )}
            </div>

            <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(22,24,32,0.8)", border: "1px solid rgba(212,175,55,0.15)", fontSize: "12px", color: "#c6c2b8", display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="material-symbols-outlined" style={{ color: "#d4af37", fontSize: "18px" }}>lock</span>
              <span>Enlace directo para confirmación de agenda y scouting presencial con Dirección General.</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "6px" }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#c6c2b8", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                style={{ padding: "10px 20px", borderRadius: "10px", background: "#d4af37", color: "#07080a", fontFamily: "'Syne', sans-serif", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(212,175,55,0.3)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>send</span>
                <span>Abrir WhatsApp Concierge</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
