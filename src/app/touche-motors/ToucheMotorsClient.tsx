"use client";

import React, { useState, useEffect } from "react";

// Production Rig & Workflow Definition for the Interactive Director's Viewfinder HUD
interface ProductionRig {
  id: "drone" | "gimbal" | "studio";
  tabLabel: string;
  name: string;
  badge: string;
  gear: string;
  image: string;
  shutter: string;
  audioTelemetry: string;
  afTrack: string;
  clipName: string;
  viewfinderMode: string;
}

const PRODUCTION_RIGS: Record<"drone" | "gimbal" | "studio", ProductionRig> = {
  drone: {
    id: "drone",
    tabLabel: "01 // TOMAS AÉREAS DJI MAVIC AIR 2",
    name: "Tomas Aéreas DJI Mavic Air 2",
    badge: "FACHADA PASEO TRIUNFO & PATIO DE EXHIBICIÓN",
    gear: "Dron DJI Mavic Air 2 (4K HDR)",
    image: "/assets/touche-motors/bts_fpv_drone.jpg",
    shutter: "4K 60fps · Sensor 1/2\" · Apertura f/2.8 · Gimbal 3-Axis",
    audioTelemetry: "SISTEMA DE VUELO: Estabilización GPS · Sensores Anticolisión",
    afTrack: "AF-TRACK: FACHADA_PASEO_TRIUNFO",
    clipName: "CLIP_01_AERIAL_PANORAMA_4K",
    viewfinderMode: "DJI MAVIC AIR 2 // 4K 60FPS",
  },
  gimbal: {
    id: "gimbal",
    tabLabel: "02 // RECORRIDOS DJI OSMO & CABINA",
    name: "Recorridos Estabilizados DJI Osmo",
    badge: "SHOWROOM, CABINA & SONIDO DE MOTOR",
    gear: "Cámara & Estabilizador DJI Osmo 4K",
    image: "/assets/touche-motors/bts_gimbal_osmo.jpg",
    shutter: "4K 60fps · Estabilización 3-Ejes · Captura de Interiores",
    audioTelemetry: "CAPTURA DE AUDIO: Sonido de Encendido & Motor",
    afTrack: "AF-TRACK: SHOWROOM_WALKAROUND",
    clipName: "CLIP_04_CABINA_DETALLE_4K",
    viewfinderMode: "DJI OSMO // 4K 60FPS",
  },
  studio: {
    id: "studio",
    tabLabel: "03 // FOTOGRAFÍA COMERCIAL DE CATÁLOGO",
    name: "Fotografía de Inventario y Catálogo",
    badge: "BAHÍA DE ENTREGA // PUSH COMERCIAL",
    gear: "Fotografía Profesional de Alta Resolución",
    image: "/assets/touche-motors/bts_studio_photo.jpg",
    shutter: "Alta Resolución · Luz Difusa · Retoque Cromático",
    audioTelemetry: "ILUMINACIÓN: Set en Bahía de Entrega",
    afTrack: "AF-TRACK: INVENTARIO_CATALOGO",
    clipName: "STILL_CATALOG_INVENTARIO",
    viewfinderMode: "FOTOGRAFÍA RAW // HI-RES",
  },
};

// Formats Showcase Data
interface FormatSpec {
  id: "reels" | "feed" | "carousel";
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  captionTitle: string;
  captionText: string;
  whatsappCta: string;
  metricLabel: string;
  metricValue: string;
}

const FORMATS: Record<"reels" | "feed" | "carousel", FormatSpec> = {
  reels: {
    id: "reels",
    tabLabel: "REELS & STORIES 9:16",
    badge: "FORMATO VERTICAL DINÁMICO // 9:16",
    title: "Reels de Alto Impacto con Hooks de Venta Directa",
    description: "Cada pieza está concebida para atrapar al comprador en los primeros 1.5 segundos mediante un encuadre aéreo del showroom, recorrido de acabados o sonido de motor en Paseo Triunfo 6080.",
    captionTitle: "TOUCHÉ MOTORS // PASEO TRIUNFO 6080",
    captionText: "Entrega inmediata y planes de leasing empresarial en Ciudad Juárez. Conoce el catálogo y agenda tu cita por WhatsApp.",
    whatsappCta: "Enviar WhatsApp a Asesor de Ventas",
    metricLabel: "Enfoque Algorítmico",
    metricValue: "Hooks en 1.5s",
  },
  feed: {
    id: "feed",
    tabLabel: "FEED 4:5 CATÁLOGO",
    badge: "FORMATO 4:5 // PUBLICACIÓN EDITORIAL",
    title: "Carruseles Técnicos & Fotografía Editorial Oficial",
    description: "Publicaciones de alto valor estético para el feed oficial de Instagram y Facebook. Diseñadas para que el prospecto examine acabados, equipamiento y opciones de financiamiento antes de acudir a la agencia.",
    captionTitle: "CATÁLOGO OFICIAL // ENTREGA INMEDIATA",
    captionText: "Desliza para examinar acabados en piel nappa, consola táctil y equipamiento de inventario disponible.",
    whatsappCta: "Solicitar Ficha de Inventario por WhatsApp",
    metricLabel: "Calidad de Contenido",
    metricValue: "100% In-Situ",
  },
  carousel: {
    id: "carousel",
    tabLabel: "CAROUSELS HQ (ADS)",
    badge: "META SPONSORED ADS // TRÁFICO DIRECTO",
    title: "Pauta Segmentada C-Suite Juárez & El Paso",
    description: "Creativos optimizados con botón directo de conversión a WhatsApp Business de Touché. Exclusión de tráfico irrelevante para asegurar prospectos con solvencia comprobada.",
    captionTitle: "LEASING EMPRESARIAL TOUCHÉ MOTORS",
    captionText: "Adquiere tu unidad con deducibilidad fiscal inmediata. Atención directa y confidencial con Gerencia Comercial.",
    whatsappCta: "Contactar a Gerencia por WhatsApp",
    metricLabel: "Segmentación de Pauta",
    metricValue: "Juárez y El Paso",
  },
};

export default function ToucheMotorsClient() {
  const [selectedRig, setSelectedRig] = useState<"drone" | "gimbal" | "studio">("drone");
  const [selectedFormat, setSelectedFormat] = useState<"reels" | "feed" | "carousel">("reels");
  const [selectedPlan, setSelectedPlan] = useState<"B" | "A">("B");
  const [taxRate, setTaxRate] = useState<number>(0.16); // 16% General vs 8% Fronterizo
  const [isColorGraded, setIsColorGraded] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Financial Calculations
  const apologramaFee = selectedPlan === "B" ? 10000 : 20000;
  const apologramaTax = apologramaFee * taxRate;
  const apologramaTotal = apologramaFee + apologramaTax;

  const metaAdsBudget = selectedPlan === "B" ? 2000 : 4000;
  const totalCombinedMonthly = apologramaTotal + metaAdsBudget;

  const currentRig = PRODUCTION_RIGS[selectedRig];
  const currentFormat = FORMATS[selectedFormat];

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
            "position:fixed;top:20px;right:20px;z-index:99999;background:#0f172a;border:1px solid #e51a24;color:#ffffff;padding:10px 18px;border-radius:6px;font-family:monospace;font-size:12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;display:flex;align-items:center;gap:8px;";
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
    const planName = selectedPlan === "B" ? "PLAN B: IMPULSO TÁCTICO" : "PLAN A: DOMINIO TOTAL";
    const taxLabel = taxRate === 0.16 ? "IVA 16%" : "IVA 8% Fronterizo";
    return `Hola Apolograma, hemos revisado la propuesta de producción cinematográfica para Touché Motors Paseo Triunfo 6080.

Deseamos validar:
• ${planName}
• Honorarios Apolograma: $${apologramaFee.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN (+ ${taxLabel} = $${apologramaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN facturable)
• Pauta Publicitaria Meta Ads: $${metaAdsBudget.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN (fondeada directamente por Touché Motors)
• Desembolso Mensual Consolidado: $${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN

Agendemos la sesión de scouting presencial in-situ para coordinar la primera jornada de rodaje bimestral.`;
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
    <div className="telemetry-app-wrapper">
      {/* External Typography & Icons */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Comprehensive, Autonomous CSS Stylesheet (Light Telemetry / High-Energy Motorsport) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* === RESET & COLOR PALETTE: LIGHT TELEMETRY === */
        .telemetry-app-wrapper {
          --bg-canvas: #ffffff;
          --bg-sub: #f8fafc;
          --bg-card: #f1f5f9;
          --text-primary: #0f172a;
          --text-muted: #475569;
          --text-subtle: #64748b;
          --border-line: #e2e8f0;
          --border-hard: #cbd5e1;
          --flame-red: #e51a24;
          --flame-red-dim: #fff1f2;
          --mopar-blue: #0051ff;
          --mopar-blue-dim: #eff4ff;
          --status-green: #10b981;

          background-color: var(--bg-canvas);
          color: var(--text-primary);
          font-family: 'Hanken Grotesk', -apple-system, sans-serif;
          min-height: 100vh;
          padding-bottom: 130px;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }

        .telemetry-app-wrapper * {
          box-sizing: border-box;
        }

        /* Typography */
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Hanken Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: 400;
          font-size: 20px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }

        /* Top Header */
        .telemetry-header {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-line);
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-brand-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .header-brand-loc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-subtle);
          margin-top: 2px;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .nav-link-item {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link-item:hover {
          color: var(--flame-red);
        }
        .header-right-badges {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sys-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 4px;
          background: var(--bg-sub);
          border: 1px solid var(--border-line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .rec-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--flame-red);
          animation: recPulse 1.2s infinite ease-in-out;
        }
        @keyframes recPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .confidential-tag {
          padding: 4px 10px;
          border-radius: 4px;
          background: var(--mopar-blue-dim);
          border: 1px solid rgba(0, 81, 255, 0.3);
          color: var(--mopar-blue);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Main Container */
        .telemetry-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px 60px 20px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* Hero Stage */
        .hero-panel {
          border: 1px solid var(--border-line);
          background: var(--bg-canvas);
          padding: 32px;
          border-radius: 8px;
          position: relative;
        }
        .hero-calibration-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-line);
          padding-bottom: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
        }
        .hero-pretitle-pill {
          background: var(--flame-red);
          color: #ffffff;
          padding: 3px 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .hero-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 46px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
        }
        .hero-headline .underline-red {
          color: var(--flame-red);
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 4px;
        }
        .hero-description {
          font-size: 17px;
          line-height: 1.65;
          color: var(--text-muted);
          max-width: 760px;
          margin: 0 0 24px 0;
        }

        /* Metric Spec Cards */
        .spec-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .spec-card {
          border: 1px solid var(--border-line);
          background: var(--bg-sub);
          padding: 14px 16px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .spec-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-subtle);
          letter-spacing: 0.1em;
        }
        .spec-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 4px 0;
        }
        .spec-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--text-muted);
        }

        /* Vehicle Selector Bar */
        .vehicle-selector-bar {
          display: flex;
          gap: 8px;
          border: 1px solid var(--border-line);
          background: var(--bg-sub);
          padding: 6px;
          border-radius: 6px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .vehicle-btn {
          flex: 1;
          min-width: 140px;
          padding: 10px 14px;
          border: 1px solid transparent;
          border-radius: 4px;
          background: transparent;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .vehicle-btn.active {
          background: var(--text-primary);
          color: #ffffff;
          border-color: var(--text-primary);
        }

        /* Director's Monitor Viewfinder Rig */
        .viewfinder-box {
          border: 2px solid #334155;
          border-radius: 8px;
          background: #0f172a;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.25);
        }
        .viewfinder-header-hud {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(15, 23, 42, 0.9), transparent);
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
        }
        .viewfinder-rec-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--flame-red);
          color: #ffffff;
          padding: 4px 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          border-radius: 3px;
        }
        .viewfinder-media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000000;
          overflow: hidden;
        }
        .viewfinder-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.95;
          transition: filter 0.4s ease;
        }
        .viewfinder-img.log-mode {
          filter: contrast(0.7) saturate(0.6) brightness(1.1);
        }
        .viewfinder-img.graded-mode {
          filter: contrast(1.15) saturate(1.2) brightness(0.98);
        }

        /* Reticle Rule of Thirds Overlay */
        .viewfinder-reticle-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .reticle-cell {
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.35);
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 200;
        }
        .reticle-cell:nth-child(3), .reticle-cell:nth-child(6), .reticle-cell:nth-child(9) {
          border-right: none;
        }
        .reticle-cell:nth-child(7), .reticle-cell:nth-child(8), .reticle-cell:nth-child(9) {
          border-bottom: none;
        }
        .center-crosshair {
          width: 60px;
          height: 60px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .center-dot {
          width: 4px;
          height: 4px;
          background: var(--flame-red);
          border-radius: 50%;
        }

        /* Bottom Viewfinder HUD Strip */
        .viewfinder-bottom-hud {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
          color: #ffffff;
          gap: 16px;
          flex-wrap: wrap;
        }
        .lens-badge-box {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 4px;
        }
        .audio-vu-meter-box {
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 4px;
          min-width: 240px;
        }
        .audio-bar-row {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 3px;
          height: 8px;
          background: #1e293b;
          padding: 2px;
          margin: 4px 0;
        }
        .audio-bar-seg { height: 100%; }
        .seg-green { background: #10b981; }
        .seg-yellow { background: #f59e0b; }
        .seg-red { background: #e51a24; }
        .seg-off { background: #334155; }

        /* Scrubber Bar */
        .scrubber-bar {
          border-top: 1px solid #334155;
          background: #1e293b;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Production Rhythm Section */
        .section-tag-box {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .tag-pill-red {
          background: var(--flame-red);
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .tag-pill-blue {
          background: var(--mopar-blue);
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .section-title-large {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }
        .rhythm-callout-banner {
          background: var(--mopar-blue-dim);
          border-left: 4px solid var(--mopar-blue);
          padding: 16px 20px;
          border-radius: 0 6px 6px 0;
          margin: 16px 0 24px 0;
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        /* 3 Rig Modules Grid */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .module-card {
          border: 1px solid var(--border-line);
          background: var(--bg-sub);
          border-radius: 6px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s;
        }
        .module-card:hover {
          border-color: var(--text-primary);
        }
        .module-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .module-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .module-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-muted);
          margin: 0;
        }
        .module-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-primary);
          border-top: 1px solid var(--border-line);
          padding-top: 12px;
        }

        /* Formats Showcase Container */
        .formats-container {
          border: 1px solid var(--border-line);
          background: var(--bg-canvas);
          padding: 32px;
          border-radius: 8px;
        }
        .formats-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: center;
          margin-top: 24px;
        }

        /* Real Phone Mockup */
        .phone-mockup-frame {
          width: 300px;
          background: #000000;
          border: 4px solid #1e293b;
          border-radius: 36px;
          padding: 10px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
          margin: 0 auto;
        }
        .phone-notch-pill {
          width: 80px;
          height: 14px;
          background: #0f172a;
          border-radius: 9999px;
          margin: 0 auto 8px auto;
        }
        .phone-screen-content {
          border-radius: 24px;
          aspect-ratio: 9 / 16;
          position: relative;
          overflow: hidden;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px;
        }
        .phone-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }
        .phone-shadow-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%);
        }
        .phone-meta-header {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-size: 11px;
        }
        .phone-bottom-ad-card {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .phone-caption-box {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 10px;
          border-radius: 8px;
          color: #ffffff;
        }
        .whatsapp-lead-btn {
          width: 100%;
          background: #25d366;
          color: #064e3b;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: none;
          text-decoration: none;
          cursor: pointer;
        }

        /* Financial Ledger Section */
        .plans-toggle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .plan-box {
          border: 1px solid var(--border-line);
          background: var(--bg-sub);
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .plan-box.selected {
          border: 2px solid var(--flame-red);
          background: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(229, 26, 36, 0.15);
        }
        .plan-badge-selected {
          position: absolute;
          top: -10px;
          right: 16px;
          background: var(--flame-red);
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 3px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .plan-price-large {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        /* Ledger Table */
        .financial-table-box {
          border: 1px solid var(--border-line);
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }
        .table-toolbar-header {
          background: var(--bg-sub);
          border-bottom: 1px solid var(--border-line);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tax-toggle-btn {
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-line);
          background: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        .tax-toggle-btn.active {
          background: var(--text-primary);
          color: #ffffff;
          border-color: var(--text-primary);
        }
        .ledger-line-row {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-line);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .ledger-total-highlight {
          padding: 20px;
          background: var(--flame-red-dim);
          border-top: 2px solid var(--flame-red);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        /* 3-Step Roadmap */
        .roadmap-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        .roadmap-card-item {
          border: 1px solid var(--border-line);
          background: var(--bg-sub);
          border-radius: 6px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Sticky Bottom Concierge Dock */
        .sticky-dock-bar {
          position: fixed;
          bottom: 56px;
          left: 0;
          width: 100%;
          z-index: 40;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          pointer-events: none;
        }
        .dock-inner-card {
          pointer-events: auto;
          max-width: 640px;
          width: 100%;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 2px solid var(--text-primary);
          border-radius: 6px;
          padding: 10px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.25);
          gap: 12px;
        }
        .dock-cta-button {
          background: var(--flame-red);
          color: #ffffff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .dock-cta-button:hover {
          background: #c8151e;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          background: #ffffff;
          border-top: 1px solid var(--border-line);
          justify-content: space-around;
          align-items: center;
          padding: 8px 12px;
        }
        .nav-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-subtle);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          gap: 2px;
        }
        .nav-tab-btn.active {
          color: var(--flame-red);
        }

        /* Modal Backdrop */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-window {
          max-width: 560px;
          width: 100%;
          background: #ffffff;
          border: 2px solid var(--text-primary);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* === RESPONSIVE BREAKPOINTS === */
        @media (max-width: 1024px) {
          .nav-links-desktop { display: none; }
          .spec-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .modules-grid { grid-template-columns: 1fr; }
          .formats-layout { grid-template-columns: 1fr; }
          .roadmap-3col { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav { display: flex; }
          .telemetry-main { padding: 20px 14px 70px 14px; gap: 36px; }
          .hero-panel { padding: 20px 16px; }
          .hero-headline { font-size: 30px; }
          .hero-description { font-size: 15px; }
          .spec-cards-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .plans-toggle-grid { grid-template-columns: 1fr; }
          .ledger-line-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .ledger-total-highlight { flex-direction: column; align-items: flex-start; gap: 8px; }
          .sticky-dock-bar { bottom: 58px; }
          .dock-inner-card { padding: 8px 12px; }
          .dock-inner-card .dock-cta-button { padding: 8px 12px; font-size: 11px; }
        }

        @media (max-width: 480px) {
          .vehicle-btn { min-width: 95px; font-size: 9px; padding: 8px 6px; }
          .hero-headline { font-size: 26px; }
          .spec-card { padding: 8px 10px !important; }
          .spec-label { font-size: 8.5px !important; letter-spacing: 0.05em; }
          .spec-value { font-size: 19px !important; }
          .spec-sub { font-size: 8.5px !important; }
        }
      `}} />

      {/* TOP TECHNICAL STATUS BAR */}
      <header className="telemetry-header">
        <div>
          <div className="header-brand-title">
            <span className="material-symbols-outlined" style={{ color: "#e51a24" }}>speed</span>
            <span>APOLOGRAMA // TOUCHÉ MOTORS</span>
          </div>
          <div className="header-brand-loc">
            PASEO TRIUNFO 6080 // CD. JUÁREZ - EL PASO
          </div>
        </div>

        <nav className="nav-links-desktop">
          <a href="#hero" className="nav-link-item">HUD Telemetry</a>
          <a href="#workflow" className="nav-link-item">Production</a>
          <a href="#ad-formats" className="nav-link-item">Ad Formats</a>
          <a href="#investment" className="nav-link-item">Investment</a>
        </nav>

        <div className="header-right-badges">
          <div className="sys-badge">
            <span className="rec-dot"></span>
            <span>SYS.ACTIVE // 60FPS</span>
          </div>
          <div className="confidential-tag">
            CONFIDENCIAL 2026
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="telemetry-main">

        {/* HERO SECTION WITH INTEGRATED RIG TELEMETRY */}
        <section className="hero-panel" id="hero">
          <div className="hero-calibration-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="hero-pretitle-pill">[PROPUESTA AUDIOVISUAL EJECUTIVA 2026]</span>
              <span style={{ color: "#0051ff", fontWeight: 700 }}>// MOPAR & STELLANTIS DEDICATED RIG</span>
            </div>
            <div style={{ color: "#64748b" }}>
              COORDENADAS: <strong>31.7371° N, 106.4357° W</strong>
            </div>
          </div>

          <h1 className="hero-headline">
            Contenido Audiovisual de <span className="underline-red">Alta Calidad</span> para Cautivar al Comprador Automotriz.
          </h1>

          <p className="hero-description">
            Producción cinematográfica in-situ y pauta publicitaria ultra-segmentada para captar compradores directivos y de alto poder adquisitivo en Ciudad Juárez y El Paso.
          </p>

          {/* 4 Production Telemetry Cards */}
          <div className="spec-cards-grid">
            <div className="spec-card">
              <span className="spec-label">Cadencia In-Situ</span>
              <span className="spec-value" style={{ color: "#e51a24" }}>Bimestral</span>
              <span className="spec-sub">1 Jornada cada 2 Meses</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Producción de Video</span>
              <span className="spec-value" style={{ color: "#0051ff" }}>4 Reels</span>
              <span className="spec-sub">Bimestrales (2 al mes)</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Fotografía Fija</span>
              <span className="spec-value" style={{ color: "#0f172a" }}>Catálogo HQ</span>
              <span className="spec-sub">Luz Difusa & Retoque</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Pauta Activa</span>
              <span className="spec-value" style={{ color: "#16a34a" }}>5 Días</span>
              <span className="spec-sub">De Rodaje a Meta Ads</span>
            </div>
          </div>

          {/* Production Workflow Switcher Bar */}
          <div className="vehicle-selector-bar">
            <button
              type="button"
              onClick={() => setSelectedRig("drone")}
              className={`vehicle-btn ${selectedRig === "drone" ? "active" : ""}`}
            >
              <span>01 // Dron Aéreo DJI Mavic Air 2</span>
              {selectedRig === "drone" && <span>✦</span>}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRig("gimbal")}
              className={`vehicle-btn ${selectedRig === "gimbal" ? "active" : ""}`}
            >
              <span>02 // Recorridos DJI Osmo 3-Axis</span>
              {selectedRig === "gimbal" && <span>✦</span>}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRig("studio")}
              className={`vehicle-btn ${selectedRig === "studio" ? "active" : ""}`}
            >
              <span>03 // Set Fotografía de Catálogo</span>
              {selectedRig === "studio" && <span>✦</span>}
            </button>
          </div>

          {/* Director's Monitor Viewfinder HUD (Live Production Rig Simulation) */}
          <div className="viewfinder-box" id="viewfinder">
            {/* Top Viewfinder HUD */}
            <div className="viewfinder-header-hud">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="viewfinder-rec-chip">
                  <span className="rec-dot" style={{ width: "6px", height: "6px", background: "#ffffff" }}></span>
                  <span>{currentRig.viewfinderMode}</span>
                </div>
                <span style={{ background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: "3px" }}>
                  TC: 01:24:59:18
                </span>
                <span style={{ background: "rgba(0,0,0,0.6)", color: "#4ade80", padding: "3px 8px", borderRadius: "3px" }}>
                  BAT 98% (6.2h)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsColorGraded(!isColorGraded)}
                  style={{
                    background: isColorGraded ? "#0051ff" : "#475569",
                    color: "#ffffff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "3px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {isColorGraded ? "LUT: REC.709 AUTOMOTRIZ [ON]" : "LOG PROFILE [RAW]"}
                </button>
              </div>
            </div>

            {/* Viewfinder Media Canvas */}
            <div className="viewfinder-media-frame">
              <img
                src={currentRig.image}
                alt={currentRig.name}
                className={`viewfinder-img ${isColorGraded ? "graded-mode" : "log-mode"}`}
              />

              {/* Rule of Thirds & Crosshair Overlay */}
              <div className="viewfinder-reticle-grid">
                <div className="reticle-cell">
                  <span style={{ position: "absolute", top: "8px", left: "10px", fontSize: "9px" }}>CH_01 [NW]</span>
                </div>
                <div className="reticle-cell">+</div>
                <div className="reticle-cell">
                  <span style={{ position: "absolute", top: "8px", right: "10px", fontSize: "9px" }}>CH_02 [NE]</span>
                </div>
                <div className="reticle-cell">+</div>
                <div className="reticle-cell">
                  <div className="center-crosshair">
                    <div className="center-dot"></div>
                  </div>
                  <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "9px", color: "#e51a24", fontWeight: 700 }}>
                    {currentRig.afTrack}
                  </span>
                </div>
                <div className="reticle-cell">+</div>
                <div className="reticle-cell">
                  <span style={{ position: "absolute", bottom: "8px", left: "10px", fontSize: "9px" }}>DJI AIR 2 GPS LOCK</span>
                </div>
                <div className="reticle-cell">+</div>
                <div className="reticle-cell">
                  <span style={{ position: "absolute", bottom: "8px", right: "10px", fontSize: "9px" }}>OSMO GYRO: CALIBRADO</span>
                </div>
              </div>

              {/* Bottom Viewfinder HUD */}
              <div className="viewfinder-bottom-hud">
                <div className="lens-badge-box">
                  <div style={{ textTransform: "uppercase", fontSize: "9px", color: "#94a3b8", fontWeight: 700 }}>
                    CALIBRACIÓN TÉCNICA EN SALA
                  </div>
                  <div style={{ color: "#ffffff", fontWeight: 600, marginTop: "2px" }}>
                    {currentRig.shutter}
                  </div>
                </div>

                <div className="audio-vu-meter-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px" }}>
                    <span style={{ color: "#e51a24", fontWeight: 700 }}>MONITOREO DE AUDIO & TELEMETRÍA</span>
                    <span style={{ color: "#ffffff" }}>{currentRig.audioTelemetry}</span>
                  </div>
                  <div className="audio-bar-row">
                    <div className="audio-bar-seg seg-green"></div>
                    <div className="audio-bar-seg seg-green"></div>
                    <div className="audio-bar-seg seg-green"></div>
                    <div className="audio-bar-seg seg-green"></div>
                    <div className="audio-bar-seg seg-yellow"></div>
                    <div className="audio-bar-seg seg-yellow"></div>
                    <div className="audio-bar-seg seg-yellow"></div>
                    <div className="audio-bar-seg seg-yellow"></div>
                    <div className="audio-bar-seg seg-red"></div>
                    <div className="audio-bar-seg seg-red"></div>
                    <div className="audio-bar-seg seg-off"></div>
                    <div className="audio-bar-seg seg-off"></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94a3b8" }}>
                    <span>-40dB</span>
                    <span>-18dB</span>
                    <span>-6dB</span>
                    <span style={{ color: "#e51a24" }}>0dB [LIMIT]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrubber Ribbon */}
            <div className="scrubber-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ color: "#e51a24", fontSize: "16px" }}>play_circle</span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentRig.clipName}</span>
                <span>// PRORES 422HQ (3840×2160)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>EXPORT MASTER:</span>
                <span style={{ background: "#ffffff", color: "#0f172a", padding: "2px 6px", fontWeight: 800, borderRadius: "2px" }}>
                  META REELS (9:16)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: BI-MONTHLY PRODUCTION RHYTHM */}
        <section id="workflow">
          <div className="section-tag-box">
            <span className="tag-pill-blue">// SEC_02: OPERATIONAL CADENCE</span>
          </div>
          <h2 className="section-title-large">Ritmo de Producción Bimestral</h2>

          <div className="rhythm-callout-banner">
            <strong>Protocolo Cero Fricción Touché Motors:</strong> Cada sesión de rodaje bimestral genera <strong>4 Reels Cinematográficos 4K (2 por mes)</strong> y <strong>Fotografía Comercial de Catálogo</strong> para alimentar las campañas de pauta y presencia digital de Touché, con un despliegue técnico planificado milimétricamente para <strong>no obstaculizar el flujo de ventas ni el acceso a taller</strong> en Paseo Triunfo 6080.
          </div>

          <div className="modules-grid">
            {/* Module 01 */}
            <div className="module-card">
              <div className="module-card-header">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#e51a24" }}>MODULE_01</span>
                <span className="material-symbols-outlined" style={{ color: "#0f172a" }}>flight</span>
              </div>
              <h3 className="module-title">Tomas Aéreas con Dron DJI Mavic Air 2</h3>
              <p className="module-desc">
                Tomas panorámicas en 4K para dimensionar la presencia de la agencia en Paseo Triunfo 6080, vista aérea del patio de inventario alineado y encuadres cenitales para apertura de reels.
              </p>
              <ul className="module-bullets">
                <li>✦ Vuelo exterior estable y seguro</li>
                <li>✦ Vista panorámica de instalaciones y patio</li>
                <li>✦ Tomas cenitales de inventario alineado</li>
              </ul>
            </div>

            {/* Module 02 */}
            <div className="module-card">
              <div className="module-card-header">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#0051ff" }}>MODULE_02</span>
                <span className="material-symbols-outlined" style={{ color: "#0f172a" }}>graphic_eq</span>
              </div>
              <h3 className="module-title">Recorridos Dinámicos con DJI Osmo</h3>
              <p className="module-desc">
                Recorridos fluidos y estabilizados por el showroom y bahías de exhibición. Tomas de detalle en cabina (volante, consola central, tapicería) y encendido de motor para capturar la experiencia sonora.
              </p>
              <ul className="module-bullets">
                <li>✦ Walkarounds estabilizados 4K en 3 ejes</li>
                <li>✦ Detalles de cabina, asientos y consola</li>
                <li>✦ Captura sonora de encendido y motor</li>
              </ul>
            </div>

            {/* Module 03 */}
            <div className="module-card">
              <div className="module-card-header">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#0f172a" }}>MODULE_03</span>
                <span className="material-symbols-outlined" style={{ color: "#0f172a" }}>photo_camera</span>
              </div>
              <h3 className="module-title">Fotografía Comercial de Catálogo</h3>
              <p className="module-desc">
                Fotografía fija de alta resolución con iluminación difusa en bahía de entrega. Stills de producto listos para anuncios en Meta Ads, carruseles de catálogo en redes sociales y atención comercial en WhatsApp.
              </p>
              <ul className="module-bullets">
                <li>✦ Iluminación automotriz en bahía de entrega</li>
                <li>✦ Retoque cromático de pintura y carrocería</li>
                <li>✦ Material listo para pauta y WhatsApp</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: HIGH-RETENTION AD FORMATS */}
        <section className="formats-container" id="ad-formats">
          <div className="section-tag-box">
            <span className="tag-pill-red">// SEC_03: REVENUE ENGINE</span>
          </div>
          <h2 className="section-title-large">Formatos de Alto Rendimiento (Meta Ads)</h2>

          {/* Format Selector Pills */}
          <div className="vehicle-selector-bar" style={{ marginTop: "16px" }}>
            <button
              type="button"
              onClick={() => setSelectedFormat("reels")}
              className={`vehicle-btn ${selectedFormat === "reels" ? "active" : ""}`}
            >
              <span>REELS & STORIES 9:16</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("feed")}
              className={`vehicle-btn ${selectedFormat === "feed" ? "active" : ""}`}
            >
              <span>FEED 4:5 CATÁLOGO</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("carousel")}
              className={`vehicle-btn ${selectedFormat === "carousel" ? "active" : ""}`}
            >
              <span>CAROUSELS HQ (ADS)</span>
            </button>
          </div>

          <div className="formats-layout">
            {/* Phone Mockup Frame */}
            <div>
              <div className="phone-mockup-frame">
                <div className="phone-notch-pill"></div>
                <div className="phone-screen-content">
                  <img
                    src="/assets/touche-motors/ad_reel_ram.jpg"
                    alt="Mockup Phone Ad"
                    className="phone-bg-photo"
                  />
                  <div className="phone-shadow-overlay"></div>

                  {/* Header */}
                  <div className="phone-meta-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#e51a24", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "9px" }}>
                        TM
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, lineHeight: 1 }}>touche.motors</div>
                        <span style={{ fontSize: "9px", color: "#cbd5e1" }}>Publicidad Oficial · Paseo Triunfo</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>more_vert</span>
                  </div>

                  {/* Caption Card & CTA */}
                  <div className="phone-bottom-ad-card">
                    <div className="phone-caption-box">
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#f87171", fontWeight: 800 }}>
                        {currentFormat.captionTitle}
                      </div>
                      <div style={{ fontSize: "11px", marginTop: "3px", lineHeight: 1.35 }}>
                        {currentFormat.captionText}
                      </div>
                    </div>
                    <a
                      href="#investment"
                      className="whatsapp-lead-btn"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>chat</span>
                      <span>{currentFormat.whatsappCta}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Technical Selling Points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#0051ff" }}>
                {currentFormat.badge}
              </span>

              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {currentFormat.title}
              </h3>

              <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#475569", margin: 0 }}>
                {currentFormat.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                <div style={{ padding: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#0051ff", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>radar</span>
                    <span>GEOFENCING BINACIONAL</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0 0" }}>
                    Impacto en códigos postales de alto poder adquisitivo en Ciudad Juárez y El Paso, TX.
                  </p>
                </div>
                <div style={{ padding: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#e51a24", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>trending_up</span>
                    <span>RETENCIÓN ALGORÍTMICA</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0 0 0" }}>
                    Edición de alta retención que maximiza el tiempo de visualización (+78% vs fotos de stock).
                  </p>
                </div>
              </div>

              <div style={{ padding: "14px 20px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#475569", fontWeight: 700 }}>
                  {currentFormat.metricLabel}
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 800, color: "#e51a24" }}>
                  {currentFormat.metricValue}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: FINANCIAL ARCHITECTURE & TRANSPARENCY */}
        <section id="investment">
          <div className="section-tag-box">
            <span className="tag-pill-red">// SEC_04: FINANCIAL ARCHITECTURE</span>
          </div>
          <h2 className="section-title-large">Ingeniería Financiera Transparente</h2>

          {/* Plan Selection Cards */}
          <div className="plans-toggle-grid" style={{ marginTop: "16px" }}>
            
            {/* PLAN B: IMPULSO TÁCTICO */}
            <div
              onClick={() => setSelectedPlan("B")}
              className={`plan-box ${selectedPlan === "B" ? "selected" : ""}`}
            >
              {selectedPlan === "B" && (
                <div className="plan-badge-selected">RECOMENDADO // ACTIVO</div>
              )}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#e51a24", textTransform: "uppercase" }}>
                PROPUESTA BASE DIRECTIVA
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                PLAN B: Impulso Táctico
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 16px 0" }}>
                Cadencia bimestral in-situ con alto impacto en catálogo e inventario clave de Paseo Triunfo 6080.
              </p>
              <div style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "12px 0", margin: "12px 0" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748b", display: "block" }}>HONORARIOS BASE</span>
                <div className="plan-price-large">$10,000 <span style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", color: "#64748b", fontWeight: 500 }}>MXN / mes + IVA</span></div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#e51a24", fontWeight: 700, marginTop: "4px" }}>
                  Factura Apolograma: $11,600 MXN mensuales
                </div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px", color: "#0f172a", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>✓ <strong>1 Jornada de Filmación Bimestral In-Situ</strong> en agencia</li>
                <li>✓ <strong>2 Videos Reel 4K al mes</strong> (4 reels por ciclo bimestral)</li>
                <li>✓ <strong>Fotografía Comercial de Catálogo</strong> de unidades clave retocadas</li>
                <li>✓ <strong>Pauta Sugerida:</strong> $2,000 MXN / mes (Directo a Meta)</li>
              </ul>
            </div>

            {/* PLAN A: DOMINIO TOTAL */}
            <div
              onClick={() => setSelectedPlan("A")}
              className={`plan-box ${selectedPlan === "A" ? "selected" : ""}`}
            >
              {selectedPlan === "A" && (
                <div className="plan-badge-selected">ESCALA COMPLETA</div>
              )}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 800, color: "#0051ff", textTransform: "uppercase" }}>
                ESCALABILIDAD COMPLETA
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                PLAN A: Dominio Total
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 16px 0" }}>
                Despliegue mensual continuo para cubrir el 100% de altas de inventario y eventos especiales en Juárez.
              </p>
              <div style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "12px 0", margin: "12px 0" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748b", display: "block" }}>HONORARIOS BASE</span>
                <div className="plan-price-large">$20,000 <span style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", color: "#64748b", fontWeight: 500 }}>MXN / mes + IVA</span></div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#0051ff", fontWeight: 700, marginTop: "4px" }}>
                  Factura Apolograma: $23,200 MXN mensuales
                </div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px", color: "#0f172a", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>✓ <strong>1 Jornada de Filmación Mensual</strong> fija en agencia</li>
                <li>✓ <strong>4 Videos Reel 4K al mes</strong> para alta rotación de inventario</li>
                <li>✓ <strong>Fotografías de Catálogo Mensuales</strong> para pauta y redes</li>
                <li>✓ <strong>Pauta Sugerida:</strong> $4,000 MXN / mes (Directo a Meta)</li>
              </ul>
            </div>

          </div>

          {/* Ledger Table */}
          <div className="financial-table-box">
            <div className="table-toolbar-header">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                DESGLOSE FISCAL DETALLADO (CFDI 4.0 // {selectedPlan === "B" ? "PLAN B RECOMENDADO" : "PLAN A"})
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b" }}>Régimen IVA:</span>
                <button
                  type="button"
                  onClick={() => setTaxRate(0.16)}
                  className={`tax-toggle-btn ${taxRate === 0.16 ? "active" : ""}`}
                >
                  16% General
                </button>
                <button
                  type="button"
                  onClick={() => setTaxRate(0.08)}
                  className={`tax-toggle-btn ${taxRate === 0.08 ? "active" : ""}`}
                >
                  8% Estímulo Fronterizo
                </button>
              </div>
            </div>

            <div>
              {/* Row 1: Apolograma Fee */}
              <div className="ledger-line-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                    Honorarios de Producción & Post-Producción Cinematográfica Apolograma
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {selectedPlan === "B"
                      ? "2 reels al mes (4 bimestrales), fotografía de catálogo, Dron DJI Mavic Air 2, DJI Osmo y gestión de Meta Ads"
                      : "4 reels al mes, fotografía de catálogo continua, Dron DJI Mavic Air 2, DJI Osmo y gestión de Meta Ads"}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                  ${apologramaFee.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 2: IVA */}
              <div className="ledger-line-row">
                <div>
                  <div style={{ fontSize: "14px", color: "#475569" }}>
                    IVA Trasladado ({taxRate === 0.16 ? "16% General de Ley" : "8% Decreto Fronterizo"})
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    IVA Acreditable para Touché Motors (SAT)
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#64748b", whiteSpace: "nowrap" }}>
                  ${apologramaTax.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 3: Subtotal Facturado */}
              <div className="ledger-line-row" style={{ background: "#f8fafc" }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 800, color: "#e51a24" }}>
                    TOTAL FACTURA APOLOGRAMA (100% Deducible CFDI 4.0)
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b" }}>
                    Gasto de Producción Publicitaria Estricto
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 800, color: "#e51a24", whiteSpace: "nowrap" }}>
                  ${apologramaTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 4: Direct Meta Ads */}
              <div className="ledger-line-row" style={{ background: "#eff4ff" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#0051ff" }}>
                    Pauta Publicitaria Meta Ads (Inyección Directa de Tráfico)
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Pagado directo por Touché a Meta Platforms con tarjeta corporativa sin comisiones intermediarias de agencia
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 800, color: "#0051ff", whiteSpace: "nowrap" }}>
                  ${metaAdsBudget.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Row 5: Total Combined Outflow */}
              <div className="ledger-total-highlight">
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                    Desembolso Total Mensual Consolidado
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#e51a24", fontWeight: 700, marginTop: "2px" }}>
                    HONORARIOS APOLOGRAMA CON IVA ($ {apologramaTotal.toLocaleString("es-MX")}) + PAUTA DIRECTA META ($ {metaAdsBudget.toLocaleString("es-MX")})
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 800, color: "#e51a24", whiteSpace: "nowrap" }}>
                  ${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: 5-DAY ACTIVATION ROADMAP */}
        <section style={{ border: "1px solid var(--border-line)", background: "#ffffff", padding: "28px", borderRadius: "8px" }}>
          <div className="section-tag-box">
            <span className="tag-pill-blue">// SEC_05: DEPLOYMENT SPRINT</span>
          </div>
          <h2 className="section-title-large">Cronograma de Activación en 5 Días Hábiles</h2>

          <div className="roadmap-3col">
            <div className="roadmap-card-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, color: "#e51a24" }}>01</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", background: "#e2e8f0", padding: "2px 6px", borderRadius: "2px", fontWeight: 700 }}>DÍA 1 - 2</span>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Firma & Scouting Showroom
              </h4>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                Validación de propuesta, alineación de unidades insignia disponibles en patio/piso de venta y calendario de escaleta técnica.
              </p>
            </div>

            <div className="roadmap-card-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, color: "#0051ff" }}>02</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", background: "#dbeafe", color: "#1e40af", padding: "2px 6px", borderRadius: "2px", fontWeight: 700 }}>DÍA 3</span>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Jornada de Rodaje In-Situ
              </h4>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                Jornada de producción in-situ sin afectar el flujo de la sala de ventas. Tomas aéreas con DJI Mavic Air 2, recorridos con DJI Osmo y fotografía comercial para los 4 reels del ciclo bimestral.
              </p>
            </div>

            <div className="roadmap-card-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, color: "#10b981" }}>03</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "2px", fontWeight: 700 }}>DÍA 5</span>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Primer Master & Ads Live
              </h4>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                Entrega del primer lote de reels (2 videos al mes) y fotografías de catálogo. Activación y optimización de campañas en Meta Ads.
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <strong style={{ color: "#0f172a" }}>APOLOGRAMA STUDIO</strong> // Dirección Creativa Audiovisual
            </div>
            <div>
              <strong style={{ color: "#0f172a" }}>TOUCHÉ MOTORS</strong> // Dirección General & Ventas
            </div>
          </div>
        </section>

      </main>

      {/* STICKY BOTTOM CONCIERGE DOCK */}
      <div className="sticky-dock-bar">
        <div className="dock-inner-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="rec-dot"></span>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                PLAN {selectedPlan} // TOUCHÉ MOTORS
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                ${totalCombinedMonthly.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#64748b", fontWeight: 500 }}>mensual total</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="dock-cta-button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>chat</span>
            <span>VALIDAR PROPUESTA VÍA WHATSAPP</span>
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav">
        <a href="#hero" className="nav-tab-btn active">
          <span className="material-symbols-outlined">speed</span>
          <span>HUD Telemetry</span>
        </a>
        <a href="#workflow" className="nav-tab-btn">
          <span className="material-symbols-outlined">schedule</span>
          <span>Production</span>
        </a>
        <a href="#ad-formats" className="nav-tab-btn">
          <span className="material-symbols-outlined">smart_display</span>
          <span>Ad Formats</span>
        </a>
        <a href="#investment" className="nav-tab-btn">
          <span className="material-symbols-outlined">receipt_long</span>
          <span>Investment</span>
        </a>
      </nav>

      {/* WHATSAPP MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-window">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "4px", background: "#e51a24", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>verified</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Validación Directa con Dirección Apolograma
                  </h4>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b", margin: "2px 0 0 0" }}>
                    TOUCHÉ MOTORS // PASEO TRIUNFO 6080
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#0f172a", textTransform: "uppercase" }}>
                  Mensaje Pre-configurado para Envío:
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  style={{ background: "transparent", border: "none", color: "#0051ff", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>content_copy</span>
                  <span>Copiar texto</span>
                </button>
              </div>
              <textarea
                readOnly
                value={generateWhatsAppMessage()}
                style={{ width: "100%", height: "140px", padding: "12px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #cbd5e1", color: "#0f172a", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", lineHeight: 1.5, resize: "none", outline: "none" }}
              />
              {copiedToast && (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#e51a24", textAlign: "right", margin: "4px 0 0 0" }}>
                  {copiedToast}
                </p>
              )}
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "6px", background: "#eff4ff", border: "1px solid #bfdbfe", fontSize: "12px", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#0051ff", fontSize: "18px" }}>lock</span>
              <span>Línea privada cifrada con Dirección Creativa para confirmar scouting y rodaje.</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: "4px", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#475569", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                style={{ padding: "10px 20px", borderRadius: "4px", background: "#e51a24", color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>send</span>
                <span>Abrir WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
