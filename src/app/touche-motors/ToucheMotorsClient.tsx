"use client";

import React, { useState, useEffect, useRef } from "react";

interface AddonItem {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: number;
  type: "monthly" | "onetime";
  badge?: string;
  isIncludedByDefault?: boolean;
}

const ADDONS_CATALOG: AddonItem[] = [
  {
    id: "stories_pack",
    name: "Lote Ampliado de Variantes Stories & Reels 9:16",
    category: "FORMATO VERTICAL MÓVIL",
    description: "Adaptaciones verticales continuas (+12 variantes mensuales) diseñadas para capturar el 80% de atención móvil en Instagram con llamados de acción directa.",
    amount: 3500,
    type: "monthly",
    badge: "ALTO ALCANCE",
  },
  {
    id: "pauta_pro",
    name: "Optimización Avanzada de Pauta Meta Ads",
    category: "DISTRIBUCIÓN QUIRÚRGICA",
    description: "Pruebas A/B continuas de creativos y segmentación de alto poder adquisitivo (Campestre, Campos Elíseos, El Paso) para alimentar de prospectos a tu Call Center.",
    amount: 3000,
    type: "monthly",
    badge: "LEADS DIRECTOS",
  },
  {
    id: "foto_entregas",
    name: "Cobertura de Entregas Nuevas en Piso (Reels VIP)",
    category: "PRUEBA SOCIAL EN SALA",
    description: "Sesión mensual en Paseo Triunfo 6080 documentando la entrega de llaves y emoción de clientes estrenando sus unidades (video corto de alto impacto).",
    amount: 4500,
    type: "monthly",
  },
  {
    id: "landing_web",
    name: "Plataforma Web & Catálogo Digital de Inventario",
    category: "SHOWROOM DIGITAL (FASE 3/4)",
    description: "Webapp de ultra-baja latencia con catálogo dinámico de inventario Paseo Triunfo y cotizador de financiamiento para clientes web.",
    amount: 40000,
    type: "onetime",
    badge: "PAGO ÚNICO",
  },
];

interface Pillar2ArtData {
  model: string;
  badge: string;
  tagline: string;
  headline: string;
  feedSpecs: string;
  storyHook: string;
  creativeApproval: string;
}

const PILLAR2_DATA: Record<"ram" | "jeep" | "dodge", Pillar2ArtData> = {
  ram: {
    model: "RAM 1500 TRX Supercharged",
    badge: "LÍNEA CORPORATIVA // FLAME RED",
    tagline: "Poder de Negocio & Deducción Fiscal 100%",
    headline: "702 HP SOBREALIMENTADOS // ARRENDAMIENTO PURO DEDUCIBLE",
    feedSpecs: "Formato 1:1 / 4:5 • Tipografía Stellantis • Aprobado para pauta",
    storyHook: "¿Tu empresa lista para deducir con 702 HP? Cotiza en sala.",
    creativeApproval: "SUPERVISIÓN: AHIEZER, LUIS & JESSICA // IA ASISTIDA",
  },
  jeep: {
    model: "Jeep Grand Cherokee Summit Reserve",
    badge: "LÍNEA EJECUTIVA // DIAMOND BLACK",
    tagline: "Lujo Silencioso & Estatus Familiar",
    headline: "LA CUMBRE DEL CONFORT 4X4 // PIEL PALERMO & MCINTOSH",
    feedSpecs: "Formato 1:1 / 4:5 • Paleta de Lujo Silencioso • Entrega inmediata",
    storyHook: "El confort y seguridad que tu familia merece en Juárez.",
    creativeApproval: "SUPERVISIÓN: AHIEZER, LUIS & JESSICA // IA ASISTIDA",
  },
  dodge: {
    model: "Dodge Charger SRT Hellcat",
    badge: "LÍNEA MOTORSPORT // INDIGO BLUE",
    tagline: "Músculo Americano & Adrenalina Pura",
    headline: "MÚSCULO AMERICANO AUTÉNTICO // MOTOR HEMI SOBREALIMENTADO",
    feedSpecs: "Formato 1:1 / 4:5 • Contraste Deportivo • Unidad Demo en Sala",
    storyHook: "Siente el rugido HEMI en Paseo Triunfo 6080.",
    creativeApproval: "SUPERVISIÓN: AHIEZER, LUIS & JESSICA // IA ASISTIDA",
  },
};

interface CampaignModelData {
  id: number;
  vehicleName: string;
  vehicleBadge: string;
  vehicleCategory: string;
  image: string;
  priceTag: string;
  // Bloque 1: Feed Banner (1:1 / 4:5)
  feedHeadline: string;
  feedCopy: string;
  feedBenefit: string;
  feedSpecs: string;
  // Bloque 2: Story 9:16 Vertical
  storyHook: string;
  storyTag: string;
  storyCta: string;
  // Bloque 3: Campaña de Pauta (Meta Ads para Call Center)
  adTargeting: string;
  adAngle: string;
  adObjective: string;
  adDailyLeads: string;
}

const CAMPAIGN_SYSTEM_DATA: Record<number, CampaignModelData> = {
  1: {
    id: 1,
    vehicleName: "RAM 1500 TRX Supercharged",
    vehicleBadge: "CAMPAÑA: PODER BRUTO & DEDUCCIÓN 100%",
    vehicleCategory: "Pickup Insignia 702 HP",
    image: "/assets/touche-motors/hero_ram_trx.jpg?v=20260918_center",
    priceTag: "Enganche estimado desde $280,000 MXN",
    feedHeadline: "702 HP DE FUERZA SOBREALIMENTADA // DEDUCCIÓN FISCAL TOTAL",
    feedCopy: "La pickup más imponente del planeta disponible en Paseo Triunfo 6080. Planes de arrendamiento puro y crédito empresarial deducibles al 100%.",
    feedBenefit: "Deducción de impuestos para empresas + Asignación inmediata de unidad",
    feedSpecs: "Motor HEMI 6.2L Supercharged • 0-100 km/h en 4.5s • Tracción 4x4 Off-Road",
    storyHook: "¿Tu empresa necesita deducir este trimestre con 702 HP?",
    storyTag: "NUEVO INVENTARIO PASEO TRIUNFO",
    storyCta: "Desliza para cotizar con un asesor ➔",
    adTargeting: "Directivos, constructores y empresarios en Ciudad Juárez y El Paso",
    adAngle: "Beneficio fiscal en arrendamiento puro + Estatus de poder",
    adObjective: "Alimentar al Call Center con empresarios y dueños de negocio",
    adDailyLeads: "Flujo constante de empresarios solicitando cotización fiscal",
  },
  2: {
    id: 2,
    vehicleName: "Jeep Grand Cherokee Summit",
    vehicleBadge: "CAMPAÑA: CONFORT FAMILIAR & ESTATUS EJECUTIVO",
    vehicleCategory: "SUV Premium 4x4",
    image: "/assets/touche-motors/hero_jeep.jpg?v=20260918_center",
    priceTag: "Entrega inmediata en sala Paseo Triunfo",
    feedHeadline: "LA CUMBRE DEL CONFORT 4X4 // PIEL PALERMO & SONIDO MCINTOSH",
    feedCopy: "El estándar de lujo que tu familia merece en Juárez. Máxima calificación de seguridad internacional, suspensión neumática y acabados artesanales.",
    feedBenefit: "Seguridad blindada para tu familia + Tasa preferencial Stellantis",
    feedSpecs: "Interiores piel Palermo • Sonido McIntosh 19 bocinas • Tracción Quadra-Trac II",
    storyHook: "El verdadero lujo silencioso para tu familia en Ciudad Juárez.",
    storyTag: "SALA DE EXHIBICIÓN // DISPONIBLE HOY",
    storyCta: "Toca para agendar cita en sala ➔",
    adTargeting: "Familias de alto patrimonio en Campestre, Campos Elíseos y San Jerónimo",
    adAngle: "Confort supremo, seguridad para hijos y distinción ejecutiva",
    adObjective: "Citas presenciales en sala con médicos, especialistas y ejecutivos",
    adDailyLeads: "Contactos de familias interesadas en pruebas de manejo familiares",
  },
  3: {
    id: 3,
    vehicleName: "Dodge Charger SRT Hellcat",
    vehicleBadge: "CAMPAÑA: MÚSCULO AMERICANO & PURA ADRENALINA",
    vehicleCategory: "Muscle Car Deportivo",
    image: "/assets/touche-motors/hero_dodge.jpg?v=20260918_center",
    priceTag: "Unidad de prueba disponible con cita previa",
    feedHeadline: "MÚSCULO AMERICANO AUTÉNTICO // LA FIERA DE LAS CALLES",
    feedCopy: "Aceleración sin concesiones con garantía de fábrica Touché Motors. Siente la potencia del motor HEMI en el asfalto de Ciudad Juárez.",
    feedBenefit: "Crédito automotriz pre-aprobado + Garantía oficial de planta",
    feedSpecs: "Carrocería Widebody • Frenos Brembo 6 pistones • Escape activo deportivo",
    storyHook: "Siente el rugido del motor HEMI antes de que termine el mes.",
    storyTag: "EDICIÓN ESPECIAL // SOLO EN TOUCHÉ",
    storyCta: "Toca para apartar tu prueba de manejo ➔",
    adTargeting: "Profesionistas jóvenes, ingenieros y entusiastas automotrices",
    adAngle: "Emoción al volante, exclusividad y sonido de escape inigualable",
    adObjective: "Prospectos calificados de alto ingreso listos para prueba de manejo",
    adDailyLeads: "Leads calificados con interés en crédito y pruebas en pista",
  },
};

export default function ToucheMotorsClient() {
  // Telemetry & Admin Mode
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
          toast.style.cssText = "position:fixed;top:76px;right:24px;z-index:99999;background:rgba(11,11,13,0.96);border:1px solid rgba(213,197,169,0.5);color:#fff;padding:10px 18px;border-radius:4px;font-family:monospace;font-size:11px;box-shadow:0 10px 30px rgba(0,0,0,0.8);backdrop-filter:blur(10px);transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;display:flex;align-items:center;gap:8px;";
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
          localStorage.setItem("apolo_admin_device", "true");
          document.cookie = "apolo_admin_device=true; path=/; max-age=31536000";
          showToast("🛡️ <strong>MODO ADMINISTRADOR APOLOGRAMA:</strong> Alertas Telegram Silenciadas");
        }

        const isAdmin = localStorage.getItem("apolo_admin_device") === "true" ||
                        document.cookie.includes("apolo_admin_device=true") ||
                        navigator.webdriver === true ||
                        window.location.search.includes("admin=1");

        if (!isAdmin && !isLocalhost) {
          fetch("/api/notify-open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientSlug: "touche-motors",
              clientName: "Touché Motors Cd. Juárez (Stellantis)",
              path: window.location.pathname,
              userAgent: navigator.userAgent
            })
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Telemetry init skipped", e);
    }
  }, []);

  // Widget 1: Before / After Slider State
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  // Widget 2: Dirección de Arte & Banners Multiformato State
  const [activeLeadKey, setActiveLeadKey] = useState<"ram" | "jeep" | "dodge">("ram");
  const currentPillar2 = PILLAR2_DATA[activeLeadKey];

  // Gallery Stage State (Sistema Visual de Campaña: RAM, Jeep, Dodge)
  const [galleryTab, setGalleryTab] = useState<number>(1);

  // Widget 3 & Pricing Engine: Interactive Proposal Calculator State
  const [basePlan, setBasePlan] = useState<"b" | "a">("b");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Pricing Math
  const basePrice = basePlan === "b" ? 10000 : 20000;
  const platformAdSpend = 2000; // Fixed direct to Meta

  const monthlyAddonsCost = selectedAddons.reduce((acc, id) => {
    const addon = ADDONS_CATALOG.find(a => a.id === id);
    if (!addon) return acc;
    return addon.type === "monthly" ? acc + addon.amount : acc;
  }, 0);

  const onetimeAddonsCost = selectedAddons.reduce((acc, id) => {
    const addon = ADDONS_CATALOG.find(a => a.id === id);
    if (!addon) return acc;
    return addon.type === "onetime" ? acc + addon.amount : acc;
  }, 0);

  // Retainer Monthly Math (Billed 100% upfront at start of each service month)
  const totalAgencyFeeMonthly = basePrice + monthlyAddonsCost;
  const ivaMonthly = Math.round(totalAgencyFeeMonthly * 0.16);
  const totalAgencyWithIVA = totalAgencyFeeMonthly + ivaMonthly;

  // One-time software development (50% upfront retainer if selected)
  const onetimeAnticipo = Math.round(onetimeAddonsCost * 0.5);
  const onetimeIVA = Math.round(onetimeAnticipo * 0.16);

  // Totals for Month 1 / Start
  const initialMonthSubtotal = totalAgencyFeeMonthly + platformAdSpend + onetimeAnticipo;
  const initialMonthTotalNeto = totalAgencyWithIVA + platformAdSpend + onetimeAnticipo + onetimeIVA;

  // WhatsApp Dynamic URL Builder
  const getDynamicWhatsAppUrl = () => {
    const planText = basePlan === "b" ? "Paquete B ($10,000 MXN / mes)" : "Paquete A ($20,000 MXN / mes)";
    const activeAddonNames = selectedAddons.map(id => ADDONS_CATALOG.find(a => a.id === id)?.name).filter(Boolean);
    const addonsSummary = activeAddonNames.length > 0 ? activeAddonNames.join(" + ") : "Sin addons adicionales";

    let onetimeLine = "";
    if (onetimeAddonsCost > 0) {
      onetimeLine = `• Desarrollo Web One-Time (50% anticipo): $${onetimeAnticipo.toLocaleString("es-MX")} MXN (+ IVA)%0A`;
    }

    const msg = `Hola Apolograma, hemos ratificado formalmente la propuesta ejecutiva para Touché Motors:%0A%0A` +
      `• Plan Seleccionado: ${planText}%0A` +
      `• Módulos Activos: ${addonsSummary}%0A` +
      `• Factura Agencia Mes 1: $${totalAgencyFeeMonthly.toLocaleString("es-MX")} MXN (+ IVA $${ivaMonthly.toLocaleString("es-MX")} = $${totalAgencyWithIVA.toLocaleString("es-MX")} MXN)%0A` +
      onetimeLine +
      `• Pauta Directa Meta Ads: $${platformAdSpend.toLocaleString("es-MX")} MXN / mes (facturada a Touché)%0A` +
      `• Total Desembolso de Arranque Mes 1: $${initialMonthSubtotal.toLocaleString("es-MX")} MXN (+ IVA en servicios = $${initialMonthTotalNeto.toLocaleString("es-MX")} MXN)%0A%0A` +
      `Favor de confirmar fecha para el rodaje de estudio en Paseo Triunfo 6080.`;

    return `https://wa.me/526563261237?text=${msg}`;
  };

  const handleAuthorize = () => {
    if (isAuthorized) return;
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setIsAuthorized(true);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.open(getDynamicWhatsAppUrl(), "_blank");
        }
      }, 700);
    }, 900);
  };

  return (
    <div className="apolo-mandate-root">
      {/* Global CSS Embedded for 100% Visual Fidelity & Zero External Framework Discrepancy */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .apolo-mandate-root {
          --bg-main: #0A0A0C;
          --bg-surface: #111215;
          --bg-surface-low: #16171B;
          --bg-surface-high: #202126;
          --text-primary: #FFFFFF;
          --text-on-surface: #E8E6E3;
          --text-muted: #9E9D97;
          --accent-champagne: #F5C563;
          --accent-champagne-light: #FFD982;
          --accent-mopar-red: #FF2A44;
          --accent-mopar-dark: #C40E24;
          --border-subtle: rgba(255, 255, 255, 0.09);
          --border-gold: rgba(245, 197, 99, 0.4);
          --border-red: rgba(255, 42, 68, 0.45);

          background-color: var(--bg-main);
          background-image: 
            radial-gradient(circle at 50% 0%, rgba(255, 42, 68, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 85% 25%, rgba(245, 197, 99, 0.09) 0%, transparent 50%),
            radial-gradient(circle at 15% 70%, rgba(255, 42, 68, 0.06) 0%, transparent 55%);
          color: var(--text-on-surface);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .apolo-mandate-root * {
          box-sizing: border-box;
        }

        /* Typography Classes */
        .apolo-font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .apolo-font-mono {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .apolo-tabular-num {
          font-family: 'JetBrains Mono', monospace;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        /* Layout Containers */
        .apolo-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 1024px) {
          .apolo-container {
            padding: 0 48px;
          }
        }

        /* Header */
        .apolo-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          background: rgba(11, 11, 13, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          height: 64px;
        }

        .apolo-header-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .apolo-brand-lockup {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .apolo-logo-img {
          height: 18px;
          width: auto;
          display: block;
        }

        .apolo-brand-divider {
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.2);
        }

        .apolo-client-logo-img {
          height: 16px;
          width: auto;
          display: block;
          filter: brightness(1.2);
        }

        .apolo-protocol-badge {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          font-size: 10px;
          color: var(--text-muted);
        }

        @media (min-width: 860px) {
          .apolo-protocol-badge {
            display: flex;
          }
        }

        .apolo-status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: var(--accent-champagne);
        }

        .apolo-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-champagne);
          box-shadow: 0 0 10px var(--accent-champagne);
        }

        /* Section Rhythm */
        .apolo-section {
          padding: 80px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        @media (min-width: 1024px) {
          .apolo-section {
            padding: 104px 0;
          }
        }

        /* Hero */
        .apolo-hero-pre {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        @media (min-width: 768px) {
          .apolo-hero-pre {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .apolo-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-top: 40px;
        }

        @media (min-width: 1024px) {
          .apolo-hero-grid {
            grid-template-columns: 7fr 5fr;
            gap: 56px;
            align-items: end;
          }
        }

        .apolo-hero-h1 {
          font-size: clamp(34px, 5.5vw, 64px);
          line-height: 1.05;
          font-weight: 400;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .apolo-hero-h1 span.apolo-italic {
          font-style: italic;
          color: var(--accent-champagne);
        }

        .apolo-hero-lead {
          font-size: 15px;
          line-height: 1.75;
          color: #B2B0A8;
          border-left: 1px solid var(--border-subtle);
          padding-left: 24px;
          margin: 0;
        }

        /* Stats Cards */
        .apolo-stats-strip {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }

        @media (min-width: 768px) {
          .apolo-stats-strip {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .apolo-stat-item {
          padding: 16px 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid var(--border-subtle);
          border-radius: 2px;
          transition: border-color 0.3s ease;
        }

        .apolo-stat-item:hover {
          border-color: var(--border-gold);
        }

        .apolo-stat-val {
          font-size: 26px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
        }

        .apolo-stat-lbl {
          font-size: 9px;
          color: var(--text-muted);
          margin-top: 8px;
          display: block;
        }

        /* Museum Vitrine */
        .apolo-vitrine {
          position: relative;
          margin-top: 56px;
          padding: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9);
        }

        @media (min-width: 768px) {
          .apolo-vitrine {
            padding: 24px;
          }
        }

        .apolo-crosshair {
          position: absolute;
          font-family: monospace;
          color: var(--border-gold);
          font-size: 14px;
          line-height: 1;
          user-select: none;
        }

        .apolo-crosshair.tl { top: 8px; left: 8px; }
        .apolo-crosshair.tr { top: 8px; right: 8px; }
        .apolo-crosshair.bl { bottom: 8px; left: 8px; }
        .apolo-crosshair.br { bottom: 8px; right: 8px; }

        .apolo-vitrine-inner {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #050507;
          border: 1px solid var(--border-subtle);
        }

        .apolo-vitrine-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .apolo-vitrine:hover .apolo-vitrine-img {
          transform: scale(1.015);
        }

        .apolo-vitrine-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 14px;
          background: rgba(11, 11, 13, 0.9);
          border: 1px solid var(--border-subtle);
          backdrop-filter: blur(8px);
          font-size: 9px;
          letter-spacing: 0.25em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .apolo-vitrine-meta {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 10px;
          color: var(--text-muted);
        }

        @media (min-width: 768px) {
          .apolo-vitrine-meta {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        /* Tangible Widgets Section */
        .apolo-widgets-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-top: 48px;
        }

        @media (min-width: 1024px) {
          .apolo-widgets-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        .apolo-widget-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid var(--border-subtle);
          border-radius: 2px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          transition: border-color 0.3s ease;
        }

        .apolo-widget-card:hover {
          border-color: rgba(213, 197, 169, 0.4);
        }

        /* Widget 1: Before / After Slider */
        .apolo-ba-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #000;
          border: 1px solid var(--border-subtle);
          margin-top: 18px;
          user-select: none;
          cursor: ew-resize;
        }

        .apolo-ba-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .apolo-ba-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #FFFFFF;
          box-shadow: 0 0 12px rgba(255,255,255,0.8);
          transform: translateX(-50%);
        }

        .apolo-ba-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-main);
          border: 2px solid var(--accent-champagne);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: var(--accent-champagne);
        }

        .apolo-ba-chip {
          position: absolute;
          bottom: 8px;
          padding: 3px 8px;
          font-size: 8px;
          background: rgba(11,11,13,0.88);
          border: 1px solid var(--border-subtle);
          color: #FFF;
          pointer-events: none;
        }

        /* Widget 2: Lead Simulator */
        .apolo-lead-btn-group {
          display: flex;
          gap: 6px;
          margin-top: 14px;
        }

        .apolo-lead-btn {
          flex: 1;
          padding: 8px 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 9px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .apolo-lead-btn.active {
          border-color: var(--accent-champagne);
          color: var(--text-primary);
          background: var(--bg-surface-high);
        }

        .apolo-lead-card {
          margin-top: 14px;
          padding: 14px;
          background: #0D0E12;
          border: 1px solid rgba(213, 197, 169, 0.25);
          font-size: 11px;
        }

        /* Widget 3: Radar HUD */
        .apolo-radar-hud-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          margin-top: 18px;
          border: 1px solid var(--border-subtle);
          background: #050507;
        }

        .apolo-radar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
        }

        .apolo-radar-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .apolo-radar-blip {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-champagne);
          box-shadow: 0 0 12px var(--accent-champagne);
          animation: radarPulse 2s infinite ease-in-out;
        }

        @keyframes radarPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Funnel Section Styling (Propuesta 3: Del Anuncio al Piso de Venta) */
        .apolo-funnel-selector {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .apolo-funnel-tab-btn {
          background: var(--bg-surface-low);
          border: 1px solid var(--border-subtle);
          padding: 10px 18px;
          font-size: 11px;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .apolo-funnel-tab-btn:hover {
          border-color: rgba(213, 197, 169, 0.4);
          color: var(--text-primary);
        }

        .apolo-funnel-tab-btn.active {
          background: linear-gradient(135deg, rgba(255, 42, 68, 0.18) 0%, rgba(245, 197, 99, 0.14) 100%);
          border-color: var(--accent-mopar-red);
          color: #FFF;
          box-shadow: 0 4px 20px rgba(255, 42, 68, 0.25);
        }

        .apolo-funnel-stage {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 32px;
        }

        @media (min-width: 1024px) {
          .apolo-funnel-stage {
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;
          }
        }

        .apolo-step-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: border-color 0.25s ease;
        }

        .apolo-step-card:hover {
          border-color: var(--border-gold);
        }

        .apolo-step-header {
          padding: 14px 18px;
          background: var(--bg-surface-low);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 10px;
        }

        .apolo-step-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Mockup 1: Feed Master Art (1:1 / 4:5) */
        .apolo-mockup-feed {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
          margin-bottom: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .apolo-feed-header {
          padding: 8px 12px;
          background: #141519;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .apolo-feed-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #050507;
          overflow: hidden;
        }

        .apolo-feed-copy-box {
          padding: 12px;
          background: #111216;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .apolo-feed-cta-bar {
          padding: 10px 14px;
          background: linear-gradient(90deg, #18191E 0%, #22242B 100%);
          color: var(--accent-champagne);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10.5px;
          font-weight: 600;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Mockup 2: Vertical Story & Reel (9:16) */
        .apolo-mockup-story {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 13;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6);
        }

        .apolo-story-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.95;
        }

        .apolo-story-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.9) 100%);
        }

        .apolo-story-top {
          position: relative;
          z-index: 2;
          padding: 10px 12px;
        }

        .apolo-story-progress-strip {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }

        .apolo-story-progress-bar {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 1px;
        }

        .apolo-story-progress-bar.active {
          background: #FFFFFF;
        }

        .apolo-story-bottom {
          position: relative;
          z-index: 2;
          padding: 14px;
        }

        .apolo-story-sticker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-mopar-red);
          color: #FFF;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(255, 42, 68, 0.4);
          margin-top: 10px;
        }

        /* Mockup 3: Meta Ads Ops -> Call Center */
        .apolo-mockup-adops {
          background: #101116;
          border: 1px solid rgba(245, 197, 99, 0.3);
          overflow: hidden;
          margin-bottom: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .apolo-adops-header {
          padding: 9px 12px;
          background: linear-gradient(90deg, rgba(255,42,68,0.22) 0%, rgba(245,197,99,0.12) 100%);
          border-bottom: 1px solid rgba(245, 197, 99, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 9.5px;
        }

        .apolo-adops-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .apolo-adops-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Pillars Summary Strip */
        .apolo-funnel-summary-strip {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 24px;
          background: var(--bg-surface-low);
          border: 1px solid var(--border-subtle);
        }

        @media (min-width: 1024px) {
          .apolo-funnel-summary-strip {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        .apolo-pillar-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .apolo-pillar-num {
          font-size: 10px;
          color: var(--accent-champagne);
        }

        .apolo-pillar-title {
          font-size: 16px;
          color: var(--text-primary);
          margin: 0;
          font-weight: 500;
        }

        .apolo-pillar-desc {
          font-size: 12px;
          color: #A1A09A;
          margin: 0;
          line-height: 1.5;
        }

        /* Interactive Proposal Calculator */
        .apolo-calc-container {
          margin-top: 40px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .apolo-calc-header {
          padding: 24px;
          background: var(--bg-surface-low);
          border-bottom: 1px solid var(--border-subtle);
        }

        .apolo-plan-selector-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        @media (min-width: 768px) {
          .apolo-plan-selector-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .apolo-plan-card {
          padding: 20px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-main);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .apolo-plan-card.active {
          border-color: var(--accent-champagne);
          background: linear-gradient(180deg, rgba(213,197,169,0.08) 0%, rgba(213,197,169,0.01) 100%);
        }

        .apolo-addon-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-subtle);
          align-items: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .apolo-addon-row:hover {
          background: var(--bg-surface-low);
        }

        .apolo-checkbox-custom {
          width: 18px;
          height: 18px;
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .apolo-checkbox-custom.checked {
          background: var(--accent-champagne);
          color: #121316;
        }

        .apolo-calc-summary-bar {
          padding: 32px 24px;
          background: var(--bg-surface-high);
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 860px) {
          .apolo-calc-summary-bar {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            padding: 32px 36px;
          }
        }

        /* Ratification Button */
        .apolo-auth-btn {
          background: var(--accent-champagne);
          color: #121316;
          border: none;
          padding: 18px 40px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }

        .apolo-auth-btn:hover {
          background: var(--accent-champagne-light);
          transform: translateY(-1px);
        }

        .apolo-vip-link {
          color: var(--accent-champagne);
          font-size: 11px;
          text-decoration: none;
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 4px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .apolo-vip-link:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
      `}} />

      {/* 00. ATELIER CO-BRANDED HEADER */}
      <header className="apolo-header">
        <div className="apolo-container apolo-header-inner">
          <div className="apolo-brand-lockup">
            <img
              src="/assets/apolograma-logo-v2.png"
              alt="Apolograma Interactive Studio"
              className="apolo-logo-img"
            />
            <div className="apolo-brand-divider"></div>
            <img
              src="/assets/touche-motors/logo-white.png"
              alt="Touché Motors Stellantis"
              className="apolo-client-logo-img"
            />
          </div>

          <div className="apolo-font-mono apolo-protocol-badge">
            <span className="apolo-pulse-dot"></span>
            <span>MANDATE PROTOCOL // DOSSIER NO. 084-TOUCHE</span>
          </div>

          <div className="apolo-status-indicator apolo-font-mono">
            <span className="apolo-pulse-dot"></span>
            <span>READY FOR REVIEW</span>
          </div>
        </div>
      </header>

      {/* 01. FRONTISPIECE & HERO MONOGRAPH */}
      <section className="apolo-section" style={{ paddingTop: "120px" }}>
        <div className="apolo-container">
          <div className="apolo-hero-pre apolo-font-mono" style={{ fontSize: "11px" }}>
            <div style={{ color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="apolo-pulse-dot"></span>
              <span>01 / PROPUESTA ESTRATÉGICA // TOUCHÉ MOTORS PASEO TRIUNFO</span>
            </div>
            <div style={{ color: "var(--text-muted)", display: "flex", gap: "12px" }}>
              <span>MMXXVI PRIVATE CLIENT EDITION</span>
              <span>/</span>
              <span>DOCUMENTO PRIVADO // DIRECCIÓN GENERAL TOUCHÉ</span>
            </div>
          </div>

          <div className="apolo-hero-grid">
            <div>
              <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)", display: "block", marginBottom: "14px" }}>
                PROPUESTA ESTRATÉGICA DE PRODUCCIÓN COMERCIAL
              </span>
              <h1 className="apolo-hero-h1 apolo-font-serif">
                Producción Visual de Agencia. <br />
                <span className="apolo-italic">Captación de Alto Ticket.</span>
              </h1>
            </div>

            <div>
              <p className="apolo-hero-lead">
                Desarrollamos la dirección de arte publicitaria, banners para feed, adaptaciones verticales para stories y pauta quirúrgica en Meta Ads para que Touché Motors posicione su inventario insignia en Ciudad Juárez y nutra de prospectos calificados a su Call Center.
              </p>
              <div className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span>ENFOQUE MULTIMARCA // RAM, JEEP &amp; DODGE</span>
                <span style={{ color: "var(--accent-champagne)" }}>•</span>
                <span>FORMATOS: FEED 1:1 • STORIES 9:16 • META ADS</span>
              </div>
            </div>
          </div>

          {/* Hard Metrics Strip (Numbers in Crisp Mono Tabular) */}
          <div className="apolo-stats-strip">
            <div className="apolo-stat-item">
              <div className="apolo-stat-val apolo-tabular-num" style={{ color: "var(--accent-mopar-red)" }}>3 MARCAS</div>
              <span className="apolo-stat-lbl apolo-font-mono">HOMOLOGACIÓN // RAM, JEEP &amp; DODGE</span>
            </div>
            <div className="apolo-stat-item">
              <div className="apolo-stat-val apolo-tabular-num" style={{ color: "var(--accent-champagne)" }}>9:16 + 1:1</div>
              <span className="apolo-stat-lbl apolo-font-mono">MULTIFORMATO // FEED &amp; STORIES VERTICAL</span>
            </div>
            <div className="apolo-stat-item">
              <div className="apolo-stat-val apolo-tabular-num" style={{ color: "#FFF" }}>5 ASESORES</div>
              <span className="apolo-stat-lbl apolo-font-mono">CALL CENTER NUTRIDO // PROSPECTOS REALES</span>
            </div>
            <div className="apolo-stat-item">
              <div className="apolo-stat-val apolo-tabular-num" style={{ color: "var(--accent-champagne)" }}>0%</div>
              <span className="apolo-stat-lbl apolo-font-mono">DESPERDICIO // GEOCERCAS ALTO PATRIMONIO</span>
            </div>
          </div>

          {/* Museum Vitrine: Perfectly Centered RAM 1500 TRX */}
          <div className="apolo-vitrine">
            <span className="apolo-crosshair tl">+</span>
            <span className="apolo-crosshair tr">+</span>
            <span className="apolo-crosshair bl">+</span>
            <span className="apolo-crosshair br">+</span>

            <div className="apolo-vitrine-inner">
              <img
                src="/assets/touche-motors/hero_ram_trx.jpg?v=20260918_center"
                alt="RAM 1500 TRX Stellantis Touché Motors Paseo Triunfo"
                className="apolo-vitrine-img"
              />
              <div className="apolo-vitrine-badge apolo-font-mono">
                <span className="apolo-pulse-dot"></span>
                <span style={{ color: "var(--text-primary)" }}>ATELIER MASTER PLATE // RAM 1500 TRX</span>
              </div>
            </div>

            <div className="apolo-vitrine-meta apolo-font-mono">
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "var(--accent-champagne)" }}>EXHIBIT 01:</span>
                <span style={{ color: "var(--text-primary)" }}>RAM 1500 TRX SUPERCHARGED HEMI</span>
                <span>//</span>
                <span>HASSELBLAD H6D-100C • 80MM HC // ISO 64</span>
              </div>
              <div>
                <span>16:9 RAW MASTER // D55 LIGHT STAGE PASEO TRIUNFO 6080</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. DOCTRINE & CAPABILITIES // 3 TANGIBLE INTERACTIVE WIDGETS (NO TEXT WALLS) */}
      <section className="apolo-section" style={{ background: "var(--bg-surface-low)" }}>
        <div className="apolo-container">
          <div style={{ paddingBottom: "32px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)", display: "block", marginBottom: "8px" }}>
              METODOLOGÍA Y EVIDENCIA EN VIVO
            </span>
            <h2 className="apolo-font-serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, fontWeight: 400, color: "var(--text-primary)" }}>
              Los Tres Pilares de Ejecución Comercial
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "12px", maxWidth: "680px" }}>
              Pruebas tangibles en lugar de promesas teóricas. Tres motores que ejecutan en perpetua sincronía para Touché Motors.
            </p>
          </div>

          <div className="apolo-widgets-grid">
            {/* WIDGET 1: SLIDER INTERACTIVO BEFORE / AFTER */}
            <div className="apolo-widget-card">
              <div>
                <div className="apolo-font-mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-champagne)", fontSize: "11px" }}>
                  <span>PILAR I</span>
                  <span style={{ color: "var(--text-muted)" }}>01 / MEDIA</span>
                </div>
                <h3 className="apolo-font-serif" style={{ fontSize: "22px", margin: "12px 0 8px 0", color: "var(--text-primary)" }}>
                  Fotografía Editorial &amp; Retoque Grado Cine
                </h3>
                <p style={{ fontSize: "13px", color: "#A1A09A", margin: 0 }}>
                  Compara la fotografía típica de lote contra el tratamiento editorial con IA y retoque de estudio de Apolograma:
                </p>

                {/* The Interactive Slider */}
                <div
                  ref={sliderRef}
                  className="apolo-ba-wrapper"
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={(e) => isDragging && handleSliderMove(e.clientX)}
                  onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                  onClick={(e) => handleSliderMove(e.clientX)}
                >
                  {/* Image After (Full Background) */}
                  <img
                    src="/assets/touche-motors/ba_after.jpg"
                    alt="Arte Editorial con IA Apolograma"
                    className="apolo-ba-img"
                  />
                  {/* Image Before (Clipped by percentage) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: `${sliderPos}%`,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="/assets/touche-motors/ba_before.jpg"
                      alt="Foto patio sin iluminación"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : "100%",
                        height: "100%",
                        maxWidth: "none",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Vertical Divider Line */}
                  <div className="apolo-ba-divider" style={{ left: `${sliderPos}%` }}>
                    <div className="apolo-ba-handle">⟷</div>
                  </div>

                  {/* Chips */}
                  <span className="apolo-ba-chip apolo-font-mono" style={{ left: "8px" }}>
                    ANTES: FOTO PATIO
                  </span>
                  <span className="apolo-ba-chip apolo-font-mono" style={{ right: "8px", background: "rgba(213,197,169,0.9)", color: "#121316", fontWeight: "bold" }}>
                    DESPUÉS: APOLOGRAMA IA
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>INTERACCIÓN TÁCTIL: ARRASTRA PARA COMPARAR DETALLE</span>
              </div>
            </div>

            {/* WIDGET 2: DIRECCIÓN DE ARTE & BANNERS MULTIFORMATO */}
            <div className="apolo-widget-card">
              <div>
                <div className="apolo-font-mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-champagne)", fontSize: "11px" }}>
                  <span>PILAR II</span>
                  <span style={{ color: "var(--text-muted)" }}>02 / CREATIVE DIRECTION</span>
                </div>
                <h3 className="apolo-font-serif" style={{ fontSize: "22px", margin: "12px 0 8px 0", color: "var(--text-primary)" }}>
                  Dirección de Arte &amp; Multiformato
                </h3>
                <p style={{ fontSize: "13px", color: "#A1A09A", margin: 0 }}>
                  Adaptación simultánea para Feed (1:1/4:5) y Stories (9:16) con tipografía oficial Stellantis y supervisión de directores creativos senior:
                </p>

                {/* Model Selector Buttons */}
                <div className="apolo-lead-btn-group apolo-font-mono">
                  <button
                    className={`apolo-lead-btn ${activeLeadKey === "ram" ? "active" : ""}`}
                    onClick={() => setActiveLeadKey("ram")}
                  >
                    RAM TRX
                  </button>
                  <button
                    className={`apolo-lead-btn ${activeLeadKey === "jeep" ? "active" : ""}`}
                    onClick={() => setActiveLeadKey("jeep")}
                  >
                    JEEP SUMMIT
                  </button>
                  <button
                    className={`apolo-lead-btn ${activeLeadKey === "dodge" ? "active" : ""}`}
                    onClick={() => setActiveLeadKey("dodge")}
                  >
                    CHARGER SRT
                  </button>
                </div>

                {/* Rendered Live Art Specification Box */}
                <div className="apolo-lead-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px", color: "var(--accent-champagne)", fontSize: "9px", marginBottom: "8px" }} className="apolo-font-mono">
                    <span>{currentPillar2.badge}</span>
                    <span style={{ background: "rgba(255,42,68,0.15)", color: "var(--accent-mopar-red)", padding: "2px 6px", border: "1px solid rgba(255,42,68,0.3)" }}>STELLANTIS</span>
                  </div>
                  <div style={{ color: "#FFF", fontWeight: 700, fontSize: "12.5px", marginBottom: "4px", lineHeight: 1.35 }}>
                    {currentPillar2.headline}
                  </div>
                  <div style={{ color: "var(--accent-champagne)", fontSize: "11px", marginBottom: "6px" }}>
                    🎯 <strong>Ángulo:</strong> {currentPillar2.tagline}
                  </div>
                  <div style={{ color: "#CCC", fontSize: "10.5px", marginBottom: "3px" }}>
                    📐 <strong>Feed:</strong> {currentPillar2.feedSpecs}
                  </div>
                  <div style={{ color: "#CCC", fontSize: "10.5px", marginBottom: "6px" }}>
                    📱 <strong>Story 9:16:</strong> &quot;{currentPillar2.storyHook}&quot;
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "9px", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "6px" }} className="apolo-font-mono">
                    {currentPillar2.creativeApproval}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>DIRECCIÓN DE ARTE // SUPERVISIÓN SENIOR &amp; ASISTENCIA IA</span>
              </div>
            </div>

            {/* WIDGET 3: RADAR SATELITAL DE GEOCERCAS HUD */}
            <div className="apolo-widget-card">
              <div>
                <div className="apolo-font-mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-champagne)", fontSize: "11px" }}>
                  <span>PILAR III</span>
                  <span style={{ color: "var(--text-muted)" }}>03 / DISTRIBUTION</span>
                </div>
                <h3 className="apolo-font-serif" style={{ fontSize: "22px", margin: "12px 0 8px 0", color: "var(--text-primary)" }}>
                  Geocercas de Alto Poder Adquisitivo
                </h3>
                <p style={{ fontSize: "13px", color: "#A1A09A", margin: 0 }}>
                  Geocercas de exclusividad en Paseo Triunfo 6080, Campestre, Campos Elíseos y corredores comerciales de El Paso:
                </p>

                {/* Radar Box */}
                <div className="apolo-radar-hud-box">
                  <img
                    src="/assets/touche-motors/map_satellite.jpg"
                    alt="Radar de Geocercas Satelital Touché Motors"
                    className="apolo-radar-img"
                  />
                  <div className="apolo-radar-overlay"></div>
                  {/* Blip 1: Paseo Triunfo */}
                  <div className="apolo-radar-blip" style={{ top: "45%", left: "48%" }} title="Sala Paseo Triunfo 6080"></div>
                  {/* Blip 2: Campestre */}
                  <div className="apolo-radar-blip" style={{ top: "35%", left: "60%" }} title="Zona Campestre"></div>
                  {/* HUD Info */}
                  <div style={{ position: "absolute", bottom: "8px", left: "8px", right: "8px", background: "rgba(11,11,13,0.9)", padding: "4px 8px", border: "1px solid var(--border-subtle)", fontSize: "8px", display: "flex", justifyContent: "space-between" }} className="apolo-font-mono">
                    <span style={{ color: "var(--accent-champagne)" }}>HUD ACTIVO: 31.6904° N</span>
                    <span style={{ color: "#FFF" }}>PASEO TRIUNFO // CAMPESTRE</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>PROSPECCIÓN QUIRÚRGICA // CITAS EN SALA CON ENGANCHE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. EL SISTEMA VISUAL DE CAMPAÑA // FEED, STORIES 9:16 Y PAUTA META ADS */}
      <section className="apolo-section">
        <div className="apolo-container">
          <div style={{ paddingBottom: "24px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)", display: "block", marginBottom: "8px" }}>
              02 / EL SISTEMA VISUAL DE CAMPAÑA // FEED, STORIES 9:16 Y PAUTA META ADS
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2 className="apolo-font-serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, fontWeight: 400, color: "var(--text-primary)" }}>
                  El Sistema Visual de Campaña: Feed, Stories y Pauta
                </h2>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "var(--text-muted)", maxWidth: "800px" }}>
                  Diseñamos y pautamos los tres formatos visuales clave que detienen el scroll en Ciudad Juárez y El Paso, elevan la percepción de Touché Motors a nivel de agencia internacional y entregan prospectos calificados directamente a tu Call Center de 5 ejecutivos.
                </p>
              </div>

              <div className="apolo-font-mono" style={{ padding: "6px 14px", background: "var(--bg-surface-low)", border: "1px solid var(--border-subtle)", fontSize: "10px", color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="apolo-pulse-dot"></span>
                <span>ARTE MULTIFORMATO HOMOLOGADO // SUCURSAL PASEO TRIUNFO</span>
              </div>
            </div>

            {/* Model Selector Tabs */}
            <div className="apolo-funnel-selector apolo-font-mono">
              <button
                className={`apolo-funnel-tab-btn ${galleryTab === 1 ? "active" : ""}`}
                onClick={() => setGalleryTab(1)}
              >
                <span>01.</span>
                <span>RAM 1500 TRX</span>
                <span style={{ fontSize: "9px", opacity: 0.8 }}>[PODER &amp; NEGOCIO]</span>
              </button>
              <button
                className={`apolo-funnel-tab-btn ${galleryTab === 2 ? "active" : ""}`}
                onClick={() => setGalleryTab(2)}
              >
                <span>02.</span>
                <span>JEEP GRAND CHEROKEE</span>
                <span style={{ fontSize: "9px", opacity: 0.8 }}>[LUJO FAMILIAR]</span>
              </button>
              <button
                className={`apolo-funnel-tab-btn ${galleryTab === 3 ? "active" : ""}`}
                onClick={() => setGalleryTab(3)}
              >
                <span>03.</span>
                <span>DODGE CHARGER SRT</span>
                <span style={{ fontSize: "9px", opacity: 0.8 }}>[DEPORTIVO HEMI]</span>
              </button>
            </div>
          </div>

          {/* 3-Column Campaign Grid */}
          <div className="apolo-funnel-stage">
            {/* COLUMN 1: FEED MASTER ART (1:1 / 4:5) */}
            <div className="apolo-step-card">
              <div className="apolo-step-header apolo-font-mono">
                <span style={{ color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="apolo-pulse-dot"></span>
                  FORMATO 01 // FEED MAESTRO
                </span>
                <span style={{ color: "var(--text-muted)" }}>1:1 &amp; 4:5 RETINA</span>
              </div>

              <div className="apolo-step-body">
                {/* Visual Mockup: Feed Post */}
                <div className="apolo-mockup-feed">
                  <div className="apolo-feed-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#000", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                        <img src="/assets/touche-motors/logo-white.png" alt="Touché" style={{ width: "100%", height: "auto" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#FFF", lineHeight: 1 }}>touchemotorsjuarez</div>
                        <div style={{ fontSize: "9px", color: "var(--text-muted)", lineHeight: 1, marginTop: "2px" }}>Paseo Triunfo 6080 • Catálogo Oficial</div>
                      </div>
                    </div>
                    <span className="apolo-font-mono" style={{ fontSize: "8px", color: "var(--accent-mopar-red)", background: "rgba(255,42,68,0.1)", padding: "2px 6px", border: "1px solid rgba(255,42,68,0.3)" }}>
                      OFICIAL STELLANTIS
                    </span>
                  </div>

                  <div className="apolo-feed-img-box">
                    <img
                      src={CAMPAIGN_SYSTEM_DATA[galleryTab].image}
                      alt={CAMPAIGN_SYSTEM_DATA[galleryTab].vehicleName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.8)", padding: "3px 8px", fontSize: "8.5px", color: "var(--accent-champagne)", border: "1px solid var(--border-subtle)" }} className="apolo-font-mono">
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].vehicleBadge}
                    </div>
                  </div>

                  <div className="apolo-feed-copy-box">
                    <p style={{ margin: "0 0 6px 0", fontSize: "11.5px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.35 }}>
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].feedHeadline}
                    </p>
                    <p style={{ margin: "0 0 6px 0", fontSize: "10.5px", color: "#B8B6AF", lineHeight: 1.45 }}>
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].feedCopy}
                    </p>
                    <div style={{ fontSize: "9.5px", color: "var(--accent-champagne)", marginTop: "4px" }} className="apolo-font-mono">
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].feedSpecs}
                    </div>
                  </div>

                  <div className="apolo-feed-cta-bar apolo-font-mono">
                    <span>SOLICITAR COTIZACIÓN EN SALA</span>
                    <span>➔</span>
                  </div>
                </div>

                {/* Explanation Block */}
                <div>
                  <h3 className="apolo-font-serif" style={{ fontSize: "19px", margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                    01. Banners de Presencia &amp; Posicionamiento
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "#A1A09A", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                    Artes con iluminación de estudio, tipografía oficial y jerarquía editorial limpia que reemplazan por completo las publicaciones improvisadas.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px", color: "var(--text-on-surface)" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Composición 1:1 y 4:5:</strong> Retiene la vista en el feed de Instagram y Facebook con el doble de área visual que una foto horizontal.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Enfoque en negocio:</strong> Copys redactados para empresarios y compradores que buscan deducir impuestos o confort de alto nivel.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 18px", background: "var(--bg-surface-low)", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>FORMATO: FEED 1:1 &amp; 4:5 // RETINA 1080x1350PX</span>
              </div>
            </div>

            {/* COLUMN 2: VERTICAL STORIES & REELS (9:16) */}
            <div className="apolo-step-card">
              <div className="apolo-step-header apolo-font-mono">
                <span style={{ color: "var(--accent-mopar-red)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="apolo-pulse-dot" style={{ background: "var(--accent-mopar-red)" }}></span>
                  FORMATO 02 // STORIES &amp; REELS
                </span>
                <span style={{ color: "var(--text-muted)" }}>9:16 VERTICAL MÓVIL</span>
              </div>

              <div className="apolo-step-body">
                {/* Visual Mockup: Story 9:16 Smartphone Frame */}
                <div className="apolo-mockup-story">
                  <img
                    src={CAMPAIGN_SYSTEM_DATA[galleryTab].image}
                    alt={CAMPAIGN_SYSTEM_DATA[galleryTab].vehicleName}
                    className="apolo-story-bg-img"
                  />
                  <div className="apolo-story-vignette"></div>

                  <div className="apolo-story-top">
                    <div className="apolo-story-progress-strip">
                      <div className="apolo-story-progress-bar active"></div>
                      <div className="apolo-story-progress-bar active"></div>
                      <div className="apolo-story-progress-bar"></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#000", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1px" }}>
                          <img src="/assets/touche-motors/logo-white.png" alt="Touché" style={{ width: "100%", height: "auto" }} />
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#FFF" }}>touchemotorsjuarez</span>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)" }}>2h</span>
                      </div>
                      <span className="apolo-font-mono" style={{ fontSize: "8px", background: "rgba(0,0,0,0.6)", color: "var(--accent-champagne)", padding: "2px 6px", border: "1px solid rgba(255,255,255,0.15)" }}>
                        HISTORIA VIP
                      </span>
                    </div>
                  </div>

                  <div className="apolo-story-bottom">
                    <div style={{ display: "inline-block", background: "rgba(0,0,0,0.75)", padding: "3px 8px", fontSize: "8.5px", color: "var(--accent-champagne)", border: "1px solid rgba(245,197,99,0.3)", marginBottom: "8px" }} className="apolo-font-mono">
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].storyTag}
                    </div>

                    <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#FFF", fontWeight: 800, lineHeight: 1.25, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                      {CAMPAIGN_SYSTEM_DATA[galleryTab].storyHook}
                    </h4>

                    <div className="apolo-story-sticker apolo-font-mono">
                      <span>📲</span>
                      <span>{CAMPAIGN_SYSTEM_DATA[galleryTab].storyCta}</span>
                    </div>

                    <div style={{ marginTop: "10px", fontSize: "8.5px", color: "rgba(255,255,255,0.7)", textAlign: "center" }} className="apolo-font-mono">
                      100% ARTE VISUAL // CERO COPY EXTERNO DESPERDICIADO
                    </div>
                  </div>
                </div>

                {/* Explanation Block */}
                <div>
                  <h3 className="apolo-font-serif" style={{ fontSize: "19px", margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                    02. Variantes Verticales Inmersivas
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "#A1A09A", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                    Más del 80% del tiempo en Instagram transcurre en Stories y Reels. Cada entrega incluye variantes 9:16 diseñadas para pantalla completa.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px", color: "var(--text-on-surface)" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Cero barras negras:</strong> Contenido vertical nativo adaptado a la relación de aspecto del teléfono inteligente.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Mensaje integrado al 100%:</strong> Toda la oferta, enganche y llamado a la acción se integran en el arte para que el usuario actúe en 1 toque.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 18px", background: "var(--bg-surface-low)", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>FORMATO: 9:16 VERTICAL // OPTIMIZADO PARA STORIES &amp; REELS</span>
              </div>
            </div>

            {/* COLUMN 3: META ADS DISTRIBUTION -> CALL CENTER */}
            <div className="apolo-step-card">
              <div className="apolo-step-header apolo-font-mono">
                <span style={{ color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="apolo-pulse-dot"></span>
                  DISTRIBUCIÓN // META ADS
                </span>
                <span style={{ color: "#4ADE80" }}>➔ 5 EJECUTIVOS CALL CENTER</span>
              </div>

              <div className="apolo-step-body">
                {/* Visual Mockup: Ad Ops Routing Panel */}
                <div className="apolo-mockup-adops">
                  <div className="apolo-adops-header apolo-font-mono">
                    <span style={{ color: "#FFF", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", display: "inline-block" }}></span>
                      CAMPAÑA ACTIVA: TRÁFICO A CALL CENTER
                    </span>
                    <span style={{ color: "var(--accent-champagne)" }}>PASEO TRIUNFO</span>
                  </div>

                  <div className="apolo-adops-body">
                    <div className="apolo-adops-row">
                      <span className="apolo-crm-lbl apolo-font-mono">SEGMENTACIÓN GEOGRÁFICA &amp; SOCIOECONÓMICA</span>
                      <span className="apolo-crm-val" style={{ color: "#FFF", fontSize: "11.5px" }}>
                        {CAMPAIGN_SYSTEM_DATA[galleryTab].adTargeting}
                      </span>
                      <span style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                        Geocercas activas: Paseo Triunfo, Campestre, Campos Elíseos &amp; El Paso
                      </span>
                    </div>

                    <div className="apolo-adops-row">
                      <span className="apolo-crm-lbl apolo-font-mono">ÁNGULO COMERCIAL DEL ANUNCIO</span>
                      <span className="apolo-crm-val" style={{ color: "var(--accent-champagne)", fontSize: "11.5px" }}>
                        {CAMPAIGN_SYSTEM_DATA[galleryTab].adAngle}
                      </span>
                    </div>

                    <div className="apolo-adops-row">
                      <span className="apolo-crm-lbl apolo-font-mono">DESTINO DE LOS PROSPECTOS</span>
                      <span className="apolo-crm-val" style={{ color: "#4ADE80", fontSize: "11.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📞</span>
                        <span>Call Center Touché (5 Ejecutivos de Ventas)</span>
                      </span>
                      <span style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                        {CAMPAIGN_SYSTEM_DATA[galleryTab].adObjective}
                      </span>
                    </div>

                    <div className="apolo-adops-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                      <span className="apolo-crm-lbl apolo-font-mono">RESULTADO ESPERADO POR UNIDAD</span>
                      <span className="apolo-crm-val" style={{ color: "#FFFFFF", fontSize: "11px" }}>
                        {CAMPAIGN_SYSTEM_DATA[galleryTab].adDailyLeads}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "8px 12px", background: "rgba(245,197,99,0.12)", borderTop: "1px solid rgba(245,197,99,0.25)", fontSize: "9.5px", color: "var(--accent-champagne)", textAlign: "center" }} className="apolo-font-mono">
                    ⚡ ALIMENTACIÓN CONTINUA AL CALL CENTER PARA AGENDAR CITAS EN PISO
                  </div>
                </div>

                {/* Explanation Block */}
                <div>
                  <h3 className="apolo-font-serif" style={{ fontSize: "19px", margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                    03. Pauta Quirúrgica para tus 5 Ejecutivos
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "#A1A09A", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                    Tu departamento de Call Center necesita contactos frescos de personas con capacidad de compra real. La pauta se configura para abastecerlos diariamente.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px", color: "var(--text-on-surface)" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Cero desperdicio de pauta:</strong> Excluimos perfiles curiosos sin dinero y concentramos la inversión en los corredores de mayor plusvalía.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "var(--accent-champagne)" }}>•</span>
                      <span><strong>Tus 5 asesores con trabajo real:</strong> En lugar de esperar a que alguien entre a la sala por casualidad, tienen prospectos calificados para llamar y agendar citas de manejo.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 18px", background: "var(--bg-surface-low)", borderTop: "1px solid var(--border-subtle)", fontSize: "9px", color: "var(--text-muted)" }} className="apolo-font-mono">
                <span>OBJETIVO: CITAS PRESENCIALES EN PASEO TRIUNFO 6080</span>
              </div>
            </div>
          </div>

          {/* Pillars Summary Strip for Dealership Executives */}
          <div className="apolo-funnel-summary-strip">
            <div className="apolo-pillar-item">
              <span className="apolo-font-mono apolo-pillar-num">01 // IDENTIDAD VISUAL HOMOLOGADA</span>
              <h4 className="apolo-font-serif apolo-pillar-title">RAM, Jeep y Dodge al Nivel Internacional</h4>
              <p className="apolo-pillar-desc">
                Diseño publicitario que respeta las normas de Stellantis con acabados limpios, tipografía autorizada y contraste cinematográfico que transmite prestigio de sala.
              </p>
            </div>

            <div className="apolo-pillar-item">
              <span className="apolo-font-mono apolo-pillar-num">02 // COBERTURA MULTIFORMATO 100% MÓVIL</span>
              <h4 className="apolo-font-serif apolo-pillar-title">Feed 1:1 y Stories 9:16 sin Distorsión</h4>
              <p className="apolo-pillar-desc">
                Aprovechamos al máximo el consumo en celulares con adaptaciones verticales completas. Tu marca se ve impecable tanto al scrollear el muro como al ver historias.
              </p>
            </div>

            <div className="apolo-pillar-item">
              <span className="apolo-font-mono apolo-pillar-num">03 // COMBUSTIBLE PARA TU CALL CENTER</span>
              <h4 className="apolo-font-serif apolo-pillar-title">5 Ejecutivos Comerciales Nutridos</h4>
              <p className="apolo-pillar-desc">
                Tu infraestructura comercial interna no se desperdicia. Cada peso de pauta publicitaria en Meta Ads tiene como único fin generar compradores reales para que tus 5 ejecutivos cierren ventas en piso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. THE INVESTMENT MANDATE // THE CAPITAL ALLOCATION ENGINE (INTERACTIVE PRICING CALCULATOR) */}
      <section className="apolo-section" style={{ background: "var(--bg-surface-low)" }}>
        <div className="apolo-container">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)" }}>
              03 / CAPITAL ALLOCATION &amp; SCHEDULE
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2 className="apolo-font-serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, fontWeight: 400, color: "var(--text-primary)" }}>
                  The Investment Mandate
                </h2>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Cotizador interactivo en tiempo real. Configura los módulos y conoce tu inversión neta exacta.
                </p>
              </div>

              <div className="apolo-font-mono" style={{ padding: "6px 14px", background: "var(--bg-surface-high)", border: "1px solid var(--border-subtle)", fontSize: "10px", color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="apolo-pulse-dot"></span>
                <span>COTIZADOR DINÁMICO // TARIFARIO TOUCHÉ PASEO TRIUNFO</span>
              </div>
            </div>
          </div>

          {/* Calculator Container */}
          <div className="apolo-calc-container">
            {/* Step 1: Base Package Selection */}
            <div className="apolo-calc-header">
              <span className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                PASO 1: SELECCIONA EL ALCANCE DE PRODUCCIÓN BASE
              </span>
              <div className="apolo-plan-selector-grid">
                {/* Plan B */}
                <div
                  className={`apolo-plan-card ${basePlan === "b" ? "active" : ""}`}
                  onClick={() => setBasePlan("b")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)" }}>
                      PAQUETE B // RECOMENDADO
                    </span>
                    <span className="apolo-font-mono apolo-tabular-num" style={{ fontSize: "18px", color: "#FFF", fontWeight: 700 }}>
                      $10,000 MXN <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>/ mes</span>
                    </span>
                  </div>
                  <h4 className="apolo-font-serif" style={{ fontSize: "18px", color: "#FFF", margin: "0 0 6px 0", fontWeight: 400 }}>
                    Producción Visual Ágil &amp; Contenido con IA
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A1A09A", lineHeight: 1.6 }}>
                    18 gráficos publicitarios multimarca (Jeep, RAM, Dodge) + 2 videoreels cinematográficos de producto real en sala Paseo Triunfo 6080 para Meta Ads.
                  </p>
                </div>

                {/* Plan A */}
                <div
                  className={`apolo-plan-card ${basePlan === "a" ? "active" : ""}`}
                  onClick={() => setBasePlan("a")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      PAQUETE A // DIRECCIÓN ARTESANAL
                    </span>
                    <span className="apolo-font-mono apolo-tabular-num" style={{ fontSize: "18px", color: "#FFF", fontWeight: 700 }}>
                      $20,000 MXN <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>/ mes</span>
                    </span>
                  </div>
                  <h4 className="apolo-font-serif" style={{ fontSize: "18px", color: "#FFF", margin: "0 0 6px 0", fontWeight: 400 }}>
                    Dirección de Arte Senior Tradicional (CERO IA)
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#A1A09A", lineHeight: 1.6 }}>
                    20 gráficos publicitarios de diseño editorial de alto detalle hechos a mano por Directores de Arte Senior + 2 videoreels cinematográficos RED 8K.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Fixed Transparent Ad Spend Row */}
            <div style={{ padding: "16px 24px", background: "#0F1014", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span className="apolo-font-mono" style={{ fontSize: "9px", color: "var(--accent-champagne)", display: "block", marginBottom: "2px" }}>
                  PASO 2: INVERSIÓN PUBLICITARIA EN MEDIOS (TRANSPARENTE)
                </span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#FFF" }}>
                  Presupuesto Publicitario Directo a Plataforma (Meta Ads)
                </span>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#8E8D88" }}>
                  Facturado directamente por Meta a la tarjeta de Touché Motors. Cero comisiones de intermediación de agencia.
                </p>
              </div>
              <div className="apolo-font-mono apolo-tabular-num" style={{ fontSize: "18px", color: "#FFF", fontWeight: 700, textAlign: "right" }}>
                $2,000.00 MXN <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>DIRECTO A META / MES</span>
              </div>
            </div>

            {/* Step 3: Optional Production & Reach Add-ons */}
            <div>
              <div style={{ padding: "16px 24px", background: "var(--bg-surface-low)", borderBottom: "1px solid var(--border-subtle)", fontSize: "10px", color: "var(--text-muted)" }} className="apolo-font-mono">
                PASO 3: SELECCIONA MÓDULOS ADICIONALES DE PRODUCCIÓN &amp; ALCANCE (OPCIONAL)
              </div>

              {ADDONS_CATALOG.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    className="apolo-addon-row"
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className={`apolo-checkbox-custom ${isSelected ? "checked" : ""}`}>
                      {isSelected ? "✓" : ""}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span className="apolo-font-mono" style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                          {addon.category}
                        </span>
                        {addon.badge && (
                          <span className="apolo-font-mono" style={{ fontSize: "8px", padding: "2px 6px", background: "rgba(245,197,99,0.15)", color: "var(--accent-champagne)", border: "1px solid rgba(245,197,99,0.3)" }}>
                            {addon.badge}
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: "4px 0 2px 0", fontSize: "15px", color: isSelected ? "#FFF" : "#CCC", fontWeight: 500 }}>
                        {addon.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#8E8D88", lineHeight: 1.5 }}>
                        {addon.description}
                      </p>
                    </div>

                    <div className="apolo-font-mono apolo-tabular-num" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div>
                        <span style={{ fontSize: "16px", color: isSelected ? "var(--accent-champagne)" : "var(--text-muted)", fontWeight: 700 }}>
                          +${addon.amount.toLocaleString("es-MX")} MXN
                        </span>
                        <span style={{ fontSize: "9px", color: "var(--text-muted)", display: "block" }}>
                          {addon.type === "monthly" ? "+ IVA / MES" : "PAGO ÚNICO (50% ANTICIPO)"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 4: Live Responsive Summary Bar (Ledger Protocol) */}
            <div className="apolo-calc-summary-bar">
              <div>
                <span className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  SETTLEMENT PROTOCOL // DESGLOSE MENSUAL Y ARRANQUE
                </span>
                <p className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)", margin: "0 0 10px 0" }}>
                  RÉGIMEN: RETAINER MENSUAL POR ADELANTADO (MES 1) + PAUTA DIRECTA META
                </p>
                
                {/* Ledger micro-table */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#CCC" }}>
                    <span>Retainer Producción Agencia (Mes 1):</span>
                    <span className="apolo-font-mono apolo-tabular-num" style={{ color: "#FFF", fontWeight: 600 }}>
                      ${basePrice.toLocaleString("es-MX")}.00 MXN
                    </span>
                  </div>

                  {monthlyAddonsCost > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#CCC" }}>
                      <span>Módulos de Alcance Mensuales:</span>
                      <span className="apolo-font-mono apolo-tabular-num" style={{ color: "#FFF", fontWeight: 600 }}>
                        +${monthlyAddonsCost.toLocaleString("es-MX")}.00 MXN
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>IVA Trasladado de Agencia (16%):</span>
                    <span className="apolo-font-mono apolo-tabular-num" style={{ color: "var(--accent-champagne)" }}>
                      +${ivaMonthly.toLocaleString("es-MX")}.00 MXN
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: "#AAA", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px" }}>
                    <span>Pauta Directa a Meta Ads (Touché Card):</span>
                    <span className="apolo-font-mono apolo-tabular-num" style={{ color: "#FFF", fontWeight: 600 }}>
                      ${platformAdSpend.toLocaleString("es-MX")}.00 MXN
                    </span>
                  </div>

                  {onetimeAddonsCost > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#E5E1E4", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px" }}>
                      <span>Anticipo 50% Desarrollo Web One-Time:</span>
                      <span className="apolo-font-mono apolo-tabular-num" style={{ color: "var(--accent-champagne)", fontWeight: 600 }}>
                        +${onetimeAnticipo.toLocaleString("es-MX")}.00 MXN
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ textAlign: "left" }}>
                <span className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--accent-champagne)", display: "block" }}>
                  TOTAL DE ARRANQUE (MES 1 SIN IVA)
                </span>
                <div className="apolo-font-serif apolo-tabular-num" style={{ fontSize: "clamp(34px, 4vw, 46px)", color: "var(--text-primary)", fontWeight: 400, margin: "4px 0" }}>
                  ${initialMonthSubtotal.toLocaleString("es-MX")}.00{" "}
                  <span style={{ fontSize: "16px", color: "var(--accent-champagne)", fontFamily: "'JetBrains Mono', monospace" }}>MXN</span>
                </div>
                <div className="apolo-font-mono" style={{ fontSize: "11px", color: "#FFF", marginTop: "4px" }}>
                  TOTAL NETO FACTURADO: <span style={{ color: "var(--accent-champagne)", fontWeight: 700 }}>${initialMonthTotalNeto.toLocaleString("es-MX")}.00 MXN</span>
                </div>
                <span className="apolo-font-mono" style={{ fontSize: "9px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  (INCLUYE RETAINER MES 1 AGENCIA CON IVA + $2,000 SALDO META ADS)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. FORMAL RATIFICATION & SPRINT INITIALIZATION */}
      <section className="apolo-section" style={{ textAlign: "center" }}>
        <div className="apolo-container" style={{ maxWidth: "800px" }}>
          {/* Atelier Emblem */}
          <div style={{ width: "48px", height: "48px", border: "1px solid var(--border-gold)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
            <span className="apolo-font-serif" style={{ fontSize: "24px", color: "var(--accent-champagne)" }}>A</span>
          </div>

          <span className="apolo-font-mono" style={{ fontSize: "11px", color: "var(--accent-champagne)", display: "block", marginBottom: "12px" }}>
            CALENDARIO DE ARRANQUE Y ACTIVACIÓN
          </span>

          <h2 className="apolo-font-serif" style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: "0 0 20px 0", fontWeight: 400, color: "var(--text-primary)" }}>
            Ratificar Propuesta. Inicio de Producción Touché.
          </h2>

          <p style={{ fontSize: "15px", color: "#B2B0A8", lineHeight: 1.8, marginBottom: "36px" }}>
            Esta propuesta tiene una validez de quince (15) días naturales. El primer sprint de captura fotográfica y rodaje en sala Paseo Triunfo 6080 inicia dentro de las cuarenta y ocho (48) horas posteriores a la ratificación.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center" }}>
            <button
              className="apolo-auth-btn apolo-font-mono"
              onClick={handleAuthorize}
              disabled={isAuthorizing || isAuthorized}
              style={{
                background: isAuthorized ? "#4BB543" : isAuthorizing ? "#B0A288" : "var(--accent-champagne)",
                color: isAuthorized ? "#FFFFFF" : "#121316",
              }}
            >
              {isAuthorized ? "PROPUESTA RATIFICADA ✓" : isAuthorizing ? "RATIFICANDO PROTOCOLO..." : "RATIFICAR PROPUESTA TOUCHÉ CON ESTA CONFIGURACIÓN"}
            </button>

            <a
              href={getDynamicWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="apolo-vip-link apolo-font-mono"
            >
              SOLICITAR SESIÓN PRIVADA DE INICIO VÍA WHATSAPP →
            </a>
          </div>

          <div style={{ marginTop: "56px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "8px", fontSize: "10px", color: "var(--text-muted)" }} className="apolo-font-mono">
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--accent-champagne)" }}>DOCUMENTO COMERCIAL OFICIAL</span>
              <span>//</span>
              <span>EXPEDIENTE: APO-2026-TOUCHE-084</span>
              <span>//</span>
              <span>DIRECCIÓN GENERAL APROBADA</span>
            </div>
            <div>
              ATELIER COORDINATES: 31.6904° N, 106.4245° W (PASEO TRIUNFO 6080 / EL PASO BORDERPLEX)
            </div>
          </div>
        </div>
      </section>

      {/* 06. ATELIER CO-BRANDED FOOTER */}
      <footer style={{ background: "var(--bg-main)", borderTop: "1px solid var(--border-subtle)", padding: "32px 0" }}>
        <div className="apolo-container" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/assets/apolograma-logo-v2.png"
              alt="Apolograma"
              style={{ height: "14px", width: "auto" }}
            />
            <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.2)" }}></div>
            <img
              src="/assets/touche-motors/logo-white.png"
              alt="Touché Motors"
              style={{ height: "13px", width: "auto" }}
            />
          </div>

          <div className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <span>APOLOGRAMA STUDIO © MMXXVI</span>
            <span>//</span>
            <span>PRODUCCIÓN AUDIOVISUAL &amp; DESARROLLO TECNOLÓGICO</span>
          </div>

          <div className="apolo-font-mono" style={{ fontSize: "10px", color: "var(--text-primary)", display: "flex", gap: "8px" }}>
            <span>CIUDAD JUÁREZ</span>
            <span style={{ color: "var(--accent-champagne)" }}>•</span>
            <span>EL PASO BORDERPLEX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
