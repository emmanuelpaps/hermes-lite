"use client";

import React, { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  name: string;
  category: "tortas" | "especiales" | "tacos";
  price: number;
  tag: string;
  description: string;
  image: string;
  cravingCount: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "torta-pierna",
    name: "Torta Tradicional de Pierna",
    category: "tortas",
    price: 115,
    tag: "LA MÁS PEDIDA",
    description: "Pan francés artesanal crujiente, pierna horneada en adobo tradicional, aguacate Hass fresco, tomate y cebolla.",
    image: "/assets/nueva-laguna/dish_torta_pierna.jpg",
    cravingCount: 1420,
  },
  {
    id: "torta-pavo",
    name: "Torta de Colita de Pavo",
    category: "especiales",
    price: 125,
    tag: "RECETA DE TORREÓN",
    description: "Colita de pavo sazonada a la plancha, mayonesa de la casa y chiles toreados en pan francés caliente recién salido.",
    image: "/assets/nueva-laguna/dish_colita_pavo.jpg",
    cravingCount: 985,
  },
  {
    id: "torta-ternera",
    name: "Torta de Ternera en Pan Francés",
    category: "tortas",
    price: 120,
    tag: "TRADICIÓN",
    description: "Ternera deshebrada a mano, marinada en jugo de carne con cebolla asada y aguacate cremoso.",
    image: "/assets/nueva-laguna/menu-item-halves.jpg",
    cravingCount: 640,
  },
  {
    id: "torta-ahogada",
    name: "Torta Ahogada Lagunera",
    category: "especiales",
    price: 130,
    tag: "ESPECIALIDAD",
    description: "Bañada en salsa martajada de tomate con orégano y toque picante suave. Servida caliente con cebolla morada.",
    image: "/assets/nueva-laguna/clean_hero_tortas.jpg",
    cravingCount: 1120,
  },
  {
    id: "torre-lagunera",
    name: "Torre Lagunera (4 Pisos)",
    category: "especiales",
    price: 165,
    tag: "AL CENTRO",
    description: "Cuatro capas de carne artesanal, queso asadero fundido y aguacate generoso para compartir al centro.",
    image: "/assets/nueva-laguna/extracted_p2_2_Im1.png",
    cravingCount: 870,
  },
  {
    id: "tacos-pastor-bistec",
    name: "Tacos con Costra de Queso",
    category: "tacos",
    price: 95,
    tag: "PLANCHA",
    description: "Orden de 4 tacos con costra dorada de asadero, cebollitas asadas y salsas recién hechas.",
    image: "/assets/nueva-laguna/extracted_p6_2_Im1.png",
    cravingCount: 760,
  },
];

export default function NuevaLagunaClient() {
  const [selectedPlan, setSelectedPlan] = useState<"integral" | "esencial">("integral");
  const [includePauta, setIncludePauta] = useState<boolean>(true);
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>("todos");
  const [activeDishIndex, setActiveDishIndex] = useState<number>(0);
  const [cravings, setCravings] = useState<{ [key: string]: number }>({
    "torta-pierna": 1420,
    "torta-pavo": 985,
    "torta-ahogada": 1120,
    "torre-lagunera": 870,
    "tacos-pastor-bistec": 760,
    "torta-ternera": 640,
  });
  const [heartAnim, setHeartAnim] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [meetingSubmitted, setMeetingSubmitted] = useState<boolean>(false);
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("10:00 AM");
  const [meetingName, setMeetingName] = useState<string>("");
  const [meetingPhone, setMeetingPhone] = useState<string>("");
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState<boolean>(false);

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

      const isAdminDevice = typeof localStorage !== "undefined" && localStorage.getItem("apolo_admin_device") === "true";

      if (!isLocalhost && !isAdminDevice) {
        const slug = "nueva-laguna";
        const sessionKey = "apolo_opened_" + slug;
        const lastNotified = sessionStorage.getItem(sessionKey);
        
        if (!lastNotified || Date.now() - parseInt(lastNotified, 10) >= 300000) {
          sessionStorage.setItem(sessionKey, Date.now().toString());

          fetch("/api/notify-open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientName: "Tortería La Nueva Laguna",
              clientSlug: "nueva-laguna",
              url: window.location.href,
              referrer: document.referrer || "Directo",
              screenResolution: window.screen.width + "x" + window.screen.height,
            }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    } catch (e) {}
  }, []);

  const handleCravingClick = (dishId: string) => {
    setCravings((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }));
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 700);
  };

  const filteredDishes = activeMenuCategory === "todos"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeMenuCategory);

  const currentDish = filteredDishes[activeDishIndex] || filteredDishes[0] || MENU_ITEMS[0];

  const handleNextDish = () => {
    setActiveDishIndex((prev) => (prev + 1) % filteredDishes.length);
  };

  const handlePrevDish = () => {
    setActiveDishIndex((prev) => (prev - 1 + filteredDishes.length) % filteredDishes.length);
  };

  const baseMonthly = selectedPlan === "integral" ? 20000 : 10000;
  const iva = baseMonthly * 0.16;
  const agencyTotal = baseMonthly + iva;
  const adSpend = includePauta ? 2000 : 0;
  const grandTotal = agencyTotal + adSpend;

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMeeting(true);

    const payload = {
      clientName: "Tortería La Nueva Laguna",
      clientSlug: "nueva-laguna",
      attendeeName: meetingName,
      phone: meetingPhone,
      date: meetingDate,
      time: meetingTime,
      selectedModules: [
        selectedPlan === "integral"
          ? "Plan Integral ($20,000 MXN + IVA / mes)"
          : "Plan Esencial ($10,000 MXN + IVA / mes)",
        includePauta
          ? "Inversión de Pauta en Meta Ads ($2,000 MXN/mes aportados directamente por el cliente)"
          : "Sin Pauta en Meta Ads",
        "Módulo Bonificado 1: Menú Digital Vertical Interactivo ($0 MXN meses 1 al 5 — Luego $1,000 MXN/mes)",
        "Módulo Bonificado 2: Dinámica de Lealtad en Mesa con WhatsApp y QR ($0 MXN meses 1 al 5 — Luego $1,000 MXN/mes)",
      ],
      url: window.location.href,
    };

    try {
      await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {}

    setIsSubmittingMeeting(false);
    setMeetingSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Emmanuel, revisé la propuesta de Apolograma para Tortería La Nueva Laguna. Me interesa el ${
      selectedPlan === "integral" ? "Plan Integral ($20,000 MXN/mes)" : "Plan Esencial ($10,000 MXN/mes)"
    }${includePauta ? " con los $2,000 MXN de pauta local" : ""}. Me gustaría agendar la fecha de arranque para la producción.`
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400&family=Pinyon+Script&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --nl-green: #183D2F;
          --nl-green-deep: #0E341B;
          --nl-french-bread: #F3E8CC;
          --nl-french-bread-bg: #FFFDF9;
          --nl-french-bread-card: #FFFFFF;
          --nl-french-bread-border: #E5D7B7;
          --nl-yolk: #D9822B;
          --nl-yolk-dark: #B86C20;
          --nl-tomato: #B33927;
          --nl-tomato-dark: #B31B10;
          --font-display: 'Bodoni Moda', 'Playfair Display', Georgia, serif;
          --font-script: 'Pinyon Script', cursive;
          --font-body: 'Almarai', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --text-dark: #122116;
          --text-muted: #5A6A5E;
          --text-light: #FFFDF9;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
        }

        body {
          background-color: var(--nl-french-bread-bg);
          color: var(--text-dark);
          font-family: var(--font-body);
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        /* TEXTURA SUTIL DE FONDO DE PAN FRANCÉS */
        .nl-bg-texture {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(rgba(24, 61, 47, 0.035) 1px, transparent 0),
            radial-gradient(rgba(179, 57, 39, 0.02) 1px, transparent 0);
          background-size: 28px 28px, 56px 56px;
          background-position: 0 0, 14px 14px;
          pointer-events: none;
          z-index: 0;
        }

        .nl-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* HEADER */
        .nl-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 253, 249, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 2px solid var(--nl-french-bread-border);
          padding: 0.8rem 0;
        }

        .nl-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nl-brand-cluster {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nl-apolo-logo {
          height: 20px;
          width: auto;
          object-fit: contain;
          filter: brightness(0.15);
        }

        .nl-divider {
          width: 1px;
          height: 18px;
          background: rgba(25, 83, 43, 0.25);
        }

        .nl-client-tag {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: var(--nl-green);
          background: var(--nl-french-bread);
          border: 1px solid var(--nl-french-bread-border);
          padding: 3px 10px;
          border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nl-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          min-width: 44px;
          padding: 0.65rem 1.4rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
          font-family: var(--font-body);
        }

        .nl-btn-green {
          background: var(--nl-green);
          color: #FFF;
          box-shadow: 0 4px 14px rgba(24, 61, 47, 0.25);
        }

        .nl-btn-green:hover {
          background: var(--nl-green-deep);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(24, 61, 47, 0.35);
        }

        .nl-btn-yolk {
          background: var(--nl-yolk);
          color: #122116;
          box-shadow: 0 4px 14px rgba(217, 130, 43, 0.35);
          font-weight: 800;
        }

        .nl-btn-yolk:hover {
          background: var(--nl-yolk-dark);
          transform: translateY(-2px);
        }

        .nl-btn-outline {
          background: transparent;
          color: var(--nl-green);
          border: 1.5px solid var(--nl-green);
        }

        .nl-btn-outline:hover {
          background: rgba(24, 61, 47, 0.08);
          transform: translateY(-2px);
        }

        /* HERO EDITORIAL */
        .nl-hero {
          padding: 2.8rem 0 2rem 0;
          position: relative;
        }

        .nl-hero-card {
          background: var(--nl-green);
          color: #FFF;
          border-radius: 28px;
          padding: 3.8rem 3.2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(24, 61, 47, 0.28);
          border: 2px solid rgba(217, 130, 43, 0.35);
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        .nl-hero-left {
          position: relative;
          z-index: 2;
        }

        .nl-hero-logo-box {
          background: #FFFDF9;
          padding: 16px 28px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
          border: 2px solid var(--nl-yolk);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nl-hero-logo-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
        }

        .nl-hero-logo-img {
          height: 105px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          display: block;
        }

        .nl-script-accent {
          font-family: var(--font-script);
          font-size: 2.35rem;
          color: var(--nl-yolk);
          line-height: 1.1;
          display: block;
          margin-bottom: 0.5rem;
        }

        .nl-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.6vw, 3.1rem);
          font-weight: 900;
          color: #FFF;
          line-height: 1.15;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.3rem;
          text-wrap: balance;
        }

        .nl-hero h1 span.gold {
          color: var(--nl-yolk);
        }

        .nl-hero-manifesto {
          font-size: 1.02rem;
          color: var(--nl-french-bread);
          line-height: 1.65;
          margin-bottom: 1.8rem;
          max-width: 620px;
        }

        .nl-hero-badges-row {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin-top: 1.6rem;
          padding-top: 1.4rem;
          border-top: 1px solid rgba(243, 232, 204, 0.22);
        }

        .nl-hero-badge-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.875rem;
          color: var(--nl-french-bread);
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .nl-hero-badge-item i {
          color: var(--nl-yolk);
          font-size: 0.9rem;
        }

        .nl-hero-right {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nl-hero-img-frame {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 4px solid var(--nl-french-bread);
          box-shadow: 0 25px 55px rgba(0, 0, 0, 0.38);
          width: 100%;
          max-width: 480px;
          background: #FFF;
        }

        .nl-hero-top-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(25, 83, 43, 0.92);
          backdrop-filter: blur(8px);
          color: #FFF;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.76rem;
          font-family: var(--font-body);
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border: 1px solid rgba(255, 202, 38, 0.6);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
          z-index: 3;
        }

        .nl-hero-food-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          display: block;
        }

        .nl-hero-stamp {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: var(--nl-tomato);
          color: #FFF;
          padding: 7px 16px;
          border-radius: 30px;
          font-size: 0.78rem;
          font-family: var(--font-body);
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(213, 37, 24, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.3);
          z-index: 3;
        }

        .nl-minigame-alert {
          background: #FFF;
          border: 2px dashed var(--nl-green);
          border-radius: 16px;
          padding: 1.2rem 1.6rem;
          margin-bottom: 2.2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          box-shadow: 0 6px 20px rgba(25, 83, 43, 0.05);
        }

        .nl-minigame-alert-badge {
          background: var(--nl-green);
          color: var(--nl-yolk);
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          white-space: nowrap;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .nl-minigame-alert-text {
          font-size: 0.88rem;
          color: var(--text-dark);
          line-height: 1.5;
        }

        /* 4 METRICS BAR */
        .nl-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          margin-top: 2rem;
        }

        .nl-metric-card {
          background: #FFF;
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 16px;
          padding: 1.4rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          position: relative;
          transition: transform 0.2s;
        }

        .nl-metric-card:hover {
          transform: translateY(-3px);
          border-color: var(--nl-green);
        }

        .nl-metric-val {
          font-family: var(--font-display);
          font-size: 2.3rem;
          font-weight: 900;
          color: var(--nl-green);
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .nl-metric-val .unit {
          color: var(--nl-tomato);
          font-size: 1.4rem;
        }

        .nl-metric-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        /* SECCIONES GENERALES */
        .nl-section {
          padding: 4.5rem 0;
          position: relative;
        }

        .nl-section-tag {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: var(--nl-green);
          background: var(--nl-french-bread);
          border: 1px solid var(--nl-french-bread-border);
          padding: 4px 12px;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0.8rem;
        }

        .nl-section-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.2vw, 2.7rem);
          font-weight: 900;
          color: var(--nl-green-deep);
          line-height: 1.18;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          letter-spacing: 0.3px;
          text-wrap: balance;
        }

        .nl-section-sub {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 800px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        /* SIMULADOR MENÚ DIGITAL */
        .nl-sim-box {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 24px;
          padding: 2.8rem;
          box-shadow: 0 15px 40px rgba(0,0,0,0.04);
        }

        .nl-sim-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        /* SMARTPHONE EN VERDE BOTELLA & TOQUES DORADOS */
        .phone-mockup {
          width: 340px;
          height: 620px;
          background: #0C1E12;
          border-radius: 40px;
          border: 10px solid var(--nl-green);
          box-shadow: 0 25px 60px rgba(24, 61, 47, 0.25), 0 0 0 2px rgba(217, 130, 43, 0.4);
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .phone-island {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 85px;
          height: 18px;
          background: #08140C;
          border-radius: 20px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .phone-island-cam {
          width: 7px;
          height: 7px;
          background: #000;
          border-radius: 50%;
          border: 1px solid var(--nl-green);
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: var(--nl-french-bread-bg);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .phone-header {
          padding: 2.2rem 1rem 0.6rem 1rem;
          background: #FFF;
          border-bottom: 1.5px solid var(--nl-french-bread-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .phone-header-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--nl-green);
          text-transform: uppercase;
        }

        .phone-header-badge {
          font-size: 0.68rem;
          background: var(--nl-tomato);
          color: #FFF;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 700;
        }

        .phone-media-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .phone-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .phone-media-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1.8rem 1rem 0.9rem 1rem;
          background: linear-gradient(0deg, rgba(14, 33, 20, 0.96) 0%, rgba(14, 33, 20, 0.6) 65%, transparent 100%);
          z-index: 10;
          color: #FFF;
        }

        .phone-dish-tag {
          font-size: 0.65rem;
          color: var(--nl-yolk);
          background: rgba(255, 202, 38, 0.18);
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 800;
          display: inline-block;
          margin-bottom: 0.25rem;
          border: 1px solid rgba(255, 202, 38, 0.35);
        }

        .phone-dish-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFF;
          line-height: 1.2;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
        }

        .phone-dish-desc {
          font-size: 0.875rem;
          color: var(--nl-french-bread);
          line-height: 1.35;
          margin-bottom: 0.6rem;
        }

        .phone-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .phone-price-val {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--nl-yolk);
        }

        .phone-action-btn {
          background: var(--nl-tomato);
          color: #FFF;
          border: none;
          min-height: 44px;
          padding: 6px 14px;
          border-radius: 22px;
          font-size: 0.76rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(179, 57, 39, 0.4);
          font-family: var(--font-body);
        }

        .phone-nav-controls {
          position: absolute;
          right: 10px;
          bottom: 110px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 20;
        }

        .phone-nav-btn {
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          background: rgba(255, 253, 249, 0.95);
          border: 1.5px solid var(--nl-green);
          color: var(--nl-green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .phone-categories-bar {
          background: #FFF;
          border-top: 1.5px solid var(--nl-french-bread-border);
          padding: 0.5rem 0.8rem;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          z-index: 10;
        }

        .phone-cat-pill {
          min-height: 44px;
          padding: 6px 14px;
          border-radius: 22px;
          font-size: 0.78rem;
          font-weight: 700;
          background: var(--nl-french-bread);
          color: var(--text-dark);
          border: 1px solid var(--nl-french-bread-border);
          cursor: pointer;
          white-space: nowrap;
          font-family: var(--font-body);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .phone-cat-pill.active {
          background: var(--nl-green);
          color: #FFF;
          border-color: var(--nl-green);
        }

        /* SIMULATOR DETAILS & LIVE QR */
        .nl-sim-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--nl-french-bread);
          border: 1.5px solid var(--nl-green);
          color: var(--nl-green);
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.76rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          width: fit-content;
        }

        .nl-sim-title {
          font-family: var(--font-display);
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--nl-green-deep);
          line-height: 1.25;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .nl-sim-desc {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 1.6rem;
        }

        .nl-sim-qr-box {
          background: var(--nl-french-bread-bg);
          border: 2px dashed var(--nl-french-bread-border);
          border-radius: 16px;
          padding: 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.4rem;
          margin-bottom: 1.6rem;
        }

        .nl-qr-img {
          width: 105px;
          height: 105px;
          border-radius: 10px;
          border: 2px solid var(--nl-green);
          padding: 5px;
          background: #FFF;
          flex-shrink: 0;
        }

        .nl-qr-text h4 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--nl-green);
          margin-bottom: 0.3rem;
          text-transform: uppercase;
        }

        .nl-qr-text p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 0.6rem;
        }

        .nl-feature-bullets {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .nl-bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.92rem;
          color: var(--text-dark);
        }

        .nl-bullet i {
          color: var(--nl-green);
          font-size: 1rem;
          margin-top: 3px;
        }

        /* FLUJO DE CAPTACIÓN QR */
        .nl-flow-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.2rem;
          margin-top: 2rem;
        }

        .nl-flow-card {
          background: #FFF;
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 18px;
          padding: 1.6rem 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          box-shadow: 0 6px 18px rgba(0,0,0,0.03);
          transition: transform 0.2s, border-color 0.2s;
        }

        .nl-flow-card:hover {
          transform: translateY(-4px);
          border-color: var(--nl-green);
        }

        .nl-flow-step-num {
          position: absolute;
          top: -11px;
          background: var(--nl-green);
          color: #FFF;
          font-size: 0.875rem;
          font-weight: 900;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .nl-flow-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: var(--nl-french-bread);
          border: 1px solid var(--nl-french-bread-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: var(--nl-green);
          margin: 0.7rem 0 0.8rem 0;
        }

        .nl-flow-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--nl-green-deep);
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .nl-flow-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        /* PLANES COMERCIALES */
        .nl-pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .nl-plan-card {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 22px;
          padding: 2.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .nl-plan-card.featured {
          border-color: var(--nl-green);
          box-shadow: 0 15px 45px rgba(25, 83, 43, 0.12);
          background: #FFF;
        }

        .nl-plan-badge {
          position: absolute;
          top: -12px;
          right: 22px;
          background: var(--nl-tomato);
          color: #FFF;
          font-size: 0.74rem;
          font-weight: 900;
          padding: 4px 14px;
          border-radius: 20px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .nl-plan-name {
          font-family: var(--font-display);
          font-size: 1.9rem;
          font-weight: 900;
          color: var(--nl-green);
          margin-bottom: 0.3rem;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .nl-plan-sub {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .nl-plan-price-block {
          margin: 1.4rem 0;
          padding: 1.2rem 0;
          border-top: 1.5px solid var(--nl-french-bread-border);
          border-bottom: 1.5px solid var(--nl-french-bread-border);
        }

        .nl-plan-amount {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--text-dark);
          line-height: 1;
        }

        .nl-plan-currency {
          font-size: 1.2rem;
          color: var(--nl-green);
        }

        .nl-plan-period {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .nl-plan-iva {
          font-size: 0.85rem;
          color: var(--nl-green);
          margin-top: 0.35rem;
          font-weight: 700;
        }

        .nl-plan-features {
          list-style: none;
          margin: 1.4rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .nl-plan-features li {
          font-size: 0.92rem;
          color: var(--text-dark);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.45;
        }

        .nl-plan-features li i {
          color: var(--nl-green);
          font-size: 1rem;
          margin-top: 3px;
          flex-shrink: 0;
        }

        /* BONOS DE REGALO */
        .nl-bonuses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.6rem;
          margin-top: 2rem;
        }

        .nl-bonus-card {
          background: var(--nl-french-bread);
          border: 2px solid var(--nl-green);
          border-radius: 18px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .nl-bonus-badge {
          position: absolute;
          top: -11px;
          left: 18px;
          background: var(--nl-green);
          color: #FFF;
          font-size: 0.875rem;
          font-weight: 900;
          padding: 3px 12px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .nl-bonus-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--nl-green-deep);
          margin: 0.4rem 0;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .nl-bonus-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 0.6rem;
        }

        .nl-bonus-real-val {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-muted);
          text-decoration: line-through;
          font-weight: 700;
        }

        .nl-bonus-free-val {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--nl-tomato-dark);
        }

        /* COTIZADOR CON INTERRUPTOR */
        .nl-calc-box {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 24px;
          padding: 2.5rem;
          margin-top: 2.5rem;
          box-shadow: 0 15px 40px rgba(0,0,0,0.04);
        }

        .nl-calc-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 2.5rem;
        }

        .nl-calc-selector {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nl-calc-item {
          background: var(--nl-french-bread-bg);
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 14px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nl-calc-item:hover {
          border-color: var(--nl-green);
        }

        .nl-calc-item.active {
          border-color: var(--nl-green);
          background: var(--nl-french-bread);
        }

        .nl-calc-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nl-radio {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid var(--nl-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          font-size: 0.7rem;
          font-weight: 900;
          flex-shrink: 0;
          background: #FFF;
        }

        .nl-calc-item.active .nl-radio {
          background: var(--nl-green);
        }

        /* PAUTA SWITCH BOX */
        .nl-pauta-switch-box {
          background: var(--nl-french-bread-bg);
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 14px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .nl-pauta-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .nl-toggle-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: var(--nl-green-deep);
          font-size: 0.95rem;
        }

        .nl-custom-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid var(--nl-green);
          background: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .nl-custom-checkbox.checked {
          background: var(--nl-green);
        }

        .nl-calc-summary-card {
          background: var(--nl-green);
          color: #FFF;
          border-radius: 18px;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(25, 83, 43, 0.2);
        }

        .nl-sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--nl-french-bread);
          margin-bottom: 0.5rem;
        }

        .nl-sum-row.highlight {
          color: #FFF;
          font-weight: 800;
        }

        .nl-sum-total-row {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1.5px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .nl-sum-total-val {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--nl-yolk);
        }

        /* MODAL */
        .nl-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(18, 33, 22, 0.7);
          backdrop-filter: blur(10px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .nl-modal-box {
          background: #FFF;
          border: 3px solid var(--nl-green);
          border-radius: 20px;
          width: 100%;
          max-width: 560px;
          padding: 2.4rem;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0,0,0,0.25);
        }

        .nl-modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: var(--nl-french-bread);
          border: 1px solid var(--nl-french-bread-border);
          color: var(--text-dark);
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .nl-input {
          background: var(--nl-french-bread-bg);
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 8px;
          min-height: 44px;
          padding: 0.75rem 0.9rem;
          color: var(--text-dark);
          font-size: 16px;
          outline: none;
          width: 100%;
          margin-top: 0.3rem;
          font-family: var(--font-body);
        }

        .nl-input::placeholder {
          color: #5A6A5E;
          opacity: 1;
        }

        .nl-input:focus {
          border-color: var(--nl-green);
          background: #FFF;
        }

        .nl-modal-datetime-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }

        .nl-footer {
          border-top: 2px solid var(--nl-french-bread-border);
          padding: 3rem 0;
          background: #FFF;
          text-align: center;
          margin-top: 4rem;
        }

        .nl-roadmap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .nl-hero-card { grid-template-columns: 1fr; padding: 2.5rem 1.8rem; }
          .nl-sim-grid { grid-template-columns: 1fr; gap: 2rem; }
          .nl-flow-grid { grid-template-columns: 1fr; gap: 1.2rem; }
          .nl-pricing-grid { grid-template-columns: 1fr; }
          .nl-bonuses-grid { grid-template-columns: 1fr; }
          .nl-calc-grid { grid-template-columns: 1fr; }
          .nl-roadmap-grid { grid-template-columns: 1fr; }
        }

        html, body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .nl-wrapper { padding: 0 0.85rem; width: 100%; max-width: 100%; box-sizing: border-box; }
          .nl-header { padding: 0.5rem 0; width: 100%; }
          .nl-nav { width: 100%; }
          .nl-brand-cluster { gap: 0.4rem; }
          .nl-apolo-logo { height: 16px; }
          .nl-divider { display: none; }
          .nl-client-tag { display: none; }
          .nl-nav .nl-btn { min-height: 44px; min-width: 44px; padding: 0.5rem 0.85rem; font-size: 0.875rem; flex-shrink: 0; }
          .nl-hero { padding: 1.2rem 0 0.8rem 0; }
          .nl-hero-card { padding: 1.5rem 1rem; border-radius: 18px; width: 100%; box-sizing: border-box; overflow: hidden; }
          .nl-hero h1 { font-size: 1.28rem !important; line-height: 1.25; letter-spacing: 0; word-break: break-word; overflow-wrap: break-word; max-width: 100%; }
          .nl-script-accent { font-size: 1.35rem; }
          .nl-hero-manifesto { font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.3rem; }
          .nl-hero-logo-box { padding: 12px 20px; margin-bottom: 1.4rem; border-radius: 16px; }
          .nl-hero-logo-img { height: 78px; max-width: 155px; }
          .nl-hero-food-img { height: 260px; }
          .nl-hero-badges-row { gap: 0.8rem; margin-top: 1.2rem; padding-top: 1rem; }
          .nl-hero-badge-item { font-size: 0.875rem; }
          .nl-minigame-alert { flex-direction: column; align-items: flex-start; gap: 0.8rem; padding: 1.1rem; }
          .nl-metrics-grid { grid-template-columns: 1fr 1fr; gap: 0.65rem; }
          .nl-metric-card { padding: 0.9rem 0.5rem; }
          .nl-metric-val { font-size: 1.7rem; }
          .phone-mockup { width: 290px; height: 520px; }
          .nl-sim-box { padding: 1.3rem 0.8rem; border-radius: 18px; }
          .nl-calc-box { padding: 1.3rem 0.8rem; border-radius: 18px; }
          .nl-section-title { font-size: 1.65rem !important; line-height: 1.2; }
          .nl-calc-item { padding: 0.9rem; }
          .nl-roadmap-grid { grid-template-columns: 1fr; gap: 1rem; }
          .nl-plan-card { padding: 1.5rem 1.25rem !important; }
          .nl-calc-summary-card { padding: 1.5rem 1.25rem !important; }
          .nl-modal-box { padding: 1.5rem 1.25rem !important; }
        }

        @media (max-width: 580px) {
          .nl-sim-qr-box {
            flex-direction: column;
            text-align: center;
            gap: 1.2rem;
            padding: 1.2rem;
          }
          .nl-qr-text {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .nl-qr-text .nl-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .nl-modal-box .nl-modal-datetime-grid,
          .nl-modal-datetime-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}} />

      <div className="nl-bg-texture"></div>

      {/* HEADER */}
      <header className="nl-header">
        <div className="nl-wrapper">
          <div className="nl-nav">
            <div className="nl-brand-cluster">
              <img
                src="/assets/apolograma-logo-v2.png"
                alt="Apolograma Software & Design Studio"
                className="nl-apolo-logo"
              />
              <div className="nl-divider"></div>
              <span className="nl-client-tag">
                <i className="fa fa-utensils" style={{ marginRight: "6px" }}></i>
                Tortería La Nueva Laguna
              </span>
            </div>

            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="nl-btn nl-btn-green"
              >
                <i className="fa fa-calendar-check"></i>
                <span>Agendar Junta</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO EDITORIAL */}
      <section className="nl-hero">
        <div className="nl-wrapper">
          <div className="nl-hero-card">
            <div className="nl-hero-left">
              <div className="nl-hero-logo-box">
                <img
                  src="/assets/nueva-laguna/logo_nueva_laguna_clean_trans.png"
                  alt="La Nueva Laguna - Lonchería & Panadería Tradicional"
                  className="nl-hero-logo-img"
                />
              </div>

              <span className="nl-script-accent">El auténtico sabor lagunero</span>

              <h1>
                TRADICIÓN EN LA COCINA. <br />
                <span className="gold">CONTROL Y MESAS LLENAS TODO EL MES.</span>
              </h1>

              <p className="nl-hero-manifesto">
                Usted ya tiene el producto, la receta y el sazón que respalda el prestigio de La Nueva Laguna.
                Nuestra propuesta implementa la maquinaria comercial para mantener la afluencia constante:
                <strong> producción audiovisual semanal</strong> para antojar en toda la ciudad,
                un <strong>menú digital interactivo en cada mesa</strong> que agiliza los pedidos de sus meseros,
                y un <strong>minijuego interactivo con código QR</strong> para crear una base de datos propia de WhatsApp y
                activar mesas de lunes a miércoles.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="#sec-menu-interactivo" className="nl-btn nl-btn-yolk">
                  <i className="fa fa-mobile-screen"></i> Probar Menú en Mesa
                </a>
                <a href="#sec-planes" className="nl-btn nl-btn-outline" style={{ color: "#FFF", borderColor: "#FFF" }}>
                  <i className="fa fa-tags"></i> Ver Propuesta Económica
                </a>
              </div>

              <div className="nl-hero-badges-row">
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>Menú Interactivo en Mesa</span>
                </div>
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>Minijuego Oficial QR</span>
                </div>
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>Producción Gastronómica Continua</span>
                </div>
              </div>
            </div>

            <div className="nl-hero-right">
              <div className="nl-hero-img-frame">
                <div className="nl-hero-top-badge">
                  <i className="fa fa-star" style={{ color: "var(--nl-yolk)" }}></i>
                  <span>Especialidad Lagunera</span>
                </div>
                <img
                  src="/assets/nueva-laguna/clean_hero_tortas.jpg"
                  alt="Torta Tradicional de La Nueva Laguna"
                  className="nl-hero-food-img"
                />
                <span className="nl-hero-stamp">Pan Francés Artesanal</span>
              </div>
            </div>
          </div>

          {/* 4 TARJETAS DE MÉTRICAS */}
          <div className="nl-metrics-grid">
            <div className="nl-metric-card">
              <div className="nl-metric-val">&lt; 1<span className="unit">s</span></div>
              <div className="nl-metric-label">Carga Inmediata en Mesa</div>
            </div>
            <div className="nl-metric-card">
              <div className="nl-metric-val">100<span className="unit">%</span></div>
              <div className="nl-metric-label">Base de Clientes Propia</div>
            </div>
            <div className="nl-metric-card">
              <div className="nl-metric-val">$0<span className="unit">MXN</span></div>
              <div className="nl-metric-label">Menú Digital QR (Bonificado)</div>
            </div>
            <div className="nl-metric-card">
              <div className="nl-metric-val">3-5<span className="unit">km</span></div>
              <div className="nl-metric-label">Radio Hiperlocal Meta Ads</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 1: MENÚ DIGITAL VERTICAL */}
      <section id="sec-menu-interactivo" className="nl-section">
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-mobile-screen"></i>
            Tecnología en Mesa
          </div>
          <h2 className="nl-section-title">
            Menú Digital Vertical: El Antojo Vende Antes de que Llegue el Mesero.
          </h2>
          <p className="nl-section-sub">
            Sustituya las cartas físicas maltratadas o PDFs lentos por una interfaz rápida en el celular del comensal.
            Al ver la carne recién dorada, el pan francés crujiente y los ingredientes en alta definición,
            el comensal decide más rápido y eleva el ticket promedio de su mesa.
          </p>

          <div className="nl-sim-box">
            <div className="nl-sim-grid">
              {/* SMARTPHONE MOCKUP */}
              <div className="phone-mockup">
                <div className="phone-island">
                  <div className="phone-island-cam"></div>
                </div>

                <div className="phone-screen">
                  <div className="phone-header">
                    <div>
                      <div className="phone-header-title">La Nueva Laguna</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Pan Francés Tradicional</div>
                    </div>
                    <span className="phone-header-badge">Mesa 04</span>
                  </div>

                  <div className="phone-media-area">
                    <img
                      src={currentDish.image}
                      alt={currentDish.name}
                      className="phone-media-img"
                    />

                    <div className="phone-nav-controls">
                      <button onClick={handlePrevDish} className="phone-nav-btn" title="Anterior">
                        <i className="fa fa-chevron-up"></i>
                      </button>
                      <button onClick={handleNextDish} className="phone-nav-btn" title="Siguiente">
                        <i className="fa fa-chevron-down"></i>
                      </button>
                    </div>

                    <div className="phone-media-overlay">
                      <span className="phone-dish-tag">{currentDish.tag}</span>
                      <h3 className="phone-dish-title">{currentDish.name}</h3>
                      <p className="phone-dish-desc">{currentDish.description}</p>
                      
                      <div className="phone-price-row">
                        <div className="phone-price-val">${currentDish.price} MXN</div>
                        <button
                          onClick={() => handleCravingClick(currentDish.id)}
                          className="phone-action-btn"
                        >
                          <i className={`fa fa-heart ${heartAnim ? "fa-beat" : ""}`}></i>
                          <span>Se me antoja ({cravings[currentDish.id] || currentDish.cravingCount})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="phone-categories-bar">
                    <button
                      onClick={() => { setActiveMenuCategory("todos"); setActiveDishIndex(0); }}
                      className={`phone-cat-pill ${activeMenuCategory === "todos" ? "active" : ""}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => { setActiveMenuCategory("tortas"); setActiveDishIndex(0); }}
                      className={`phone-cat-pill ${activeMenuCategory === "tortas" ? "active" : ""}`}
                    >
                      Tortas
                    </button>
                    <button
                      onClick={() => { setActiveMenuCategory("especiales"); setActiveDishIndex(0); }}
                      className={`phone-cat-pill ${activeMenuCategory === "especiales" ? "active" : ""}`}
                    >
                      Especiales
                    </button>
                    <button
                      onClick={() => { setActiveMenuCategory("tacos"); setActiveDishIndex(0); }}
                      className={`phone-cat-pill ${activeMenuCategory === "tacos" ? "active" : ""}`}
                    >
                      Tacos
                    </button>
                  </div>
                </div>
              </div>

              {/* SIMULATOR DETAILS & LIVE QR */}
              <div>
                <div className="nl-sim-badge">
                  <i className="fa fa-circle-check"></i> 2 MÓDULOS EN MESA — BONIFICADOS POR 5 MESES ($0 MXN)
                </div>

                <h3 className="nl-sim-title">
                  Pruébelo Ahora en su Propio Teléfono.
                </h3>
                
                <p className="nl-sim-desc">
                  El menú funciona directamente en el navegador del cliente (Safari o Chrome) sin pedirle que descargue ninguna aplicación.
                  Carga en menos de 1 segundo y le permite cambiar precios o platillos agotados en tiempo real.
                </p>

                <div className="nl-sim-qr-box">
                  <img
                    src="/assets/nueva-laguna/qr-menu-demo.png"
                    alt="Escanea el código QR"
                    className="nl-qr-img"
                  />
                  <div className="nl-qr-text">
                    <h4>Escanee con la cámara de su celular</h4>
                    <p>
                      Compruebe la fluidez de navegación y cómo se experimenta el menú directamente en la mesa.
                    </p>
                    <a
                      href="https://smash-menu-demo.vercel.app/menu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nl-btn nl-btn-green"
                      style={{ fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                    >
                      <i className="fa fa-arrow-up-right-from-square"></i> Ver Demo en Pantalla Completa
                    </a>
                  </div>
                </div>

                <div className="nl-feature-bullets">
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Operación ágil:</strong> El comensal explora mientras el mesero atiende otras mesas, reduciendo tiempos muertos en sala.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Control total:</strong> Si un ingrediente se termina, se apaga del menú en 1 clic sin reimprimir cartas.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Píxel de seguimiento:</strong> Cada persona que abre el menú en su mesa queda registrada para recibir anuncios de sus promociones en redes sociales.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: MINIJUEGO INTERACTIVO QR Y WHATSAPP */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.35)" }}>
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-gamepad"></i>
            Ecosistema de Captación en Mesa • Minijuego Interactivo
          </div>
          <h2 className="nl-section-title">
            Captación Directa de Clientes en Mesa.
          </h2>
          <p className="nl-section-sub">
            El error común en restaurantes es dejar que el comensal pague y se retire sin registrar su contacto.
            Desarrollamos un minijuego oficial interactivo exclusivo para Tortería La Nueva Laguna: el cliente escanea el código QR
            en su mesa desde su teléfono (sin descargar aplicaciones), resuelve una dinámica ágil de destreza con la identidad
            de la marca, y desbloquea un beneficio de cortesía validado con su WhatsApp. Usted construye una base de clientes
            propia para activar ventas de lunes a miércoles.
          </p>

          <div className="nl-minigame-alert">
            <div className="nl-minigame-alert-badge">
              <i className="fa fa-code"></i> DESARROLLO EN CURSO POR APOLOGRAMA
            </div>
            <div className="nl-minigame-alert-text">
              <strong>Demo Interactiva en Preparación:</strong> Estamos programando el minijuego oficial con mecánicas de puzzles de lógica y sabor lagunero. El demo jugable se integrará directamente en este bloque para que pueda experimentarlo en su celular.
            </div>
          </div>

          <div className="nl-flow-grid">
            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 01</span>
              <div className="nl-flow-icon"><i className="fa fa-qrcode"></i></div>
              <h4 className="nl-flow-title">QR en Mesa</h4>
              <p className="nl-flow-text">
                Acrílico elegante en mesa o mantel individual: <em>&ldquo;Escanee el código y supere el reto del minijuego oficial para ganar una cortesía en su consumo de hoy.&rdquo;</em>
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 02</span>
              <div className="nl-flow-icon"><i className="fa fa-gamepad"></i></div>
              <h4 className="nl-flow-title">Minijuego en 1 Clic</h4>
              <p className="nl-flow-text">
                Webapp ultra ligera que abre al instante en el navegador del celular sin instalar apps. Dinámica visual de destreza y humor con los ingredientes y sabor de La Nueva Laguna.
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 03</span>
              <div className="nl-flow-icon"><i className="fa-brands fa-whatsapp"></i></div>
              <h4 className="nl-flow-title">Validación por WhatsApp</h4>
              <p className="nl-flow-text">
                Para hacer válido el beneficio en caja o con el mesero, el cliente ingresa su número verificado de WhatsApp.
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 04</span>
              <div className="nl-flow-icon"><i className="fa fa-database"></i></div>
              <h4 className="nl-flow-title">Base de Datos Propia</h4>
              <p className="nl-flow-text">
                Semana tras semana acumula cientos de contactos directos de comensales locales que aman su sazón y ya consumieron en la sucursal.
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 05</span>
              <div className="nl-flow-icon"><i className="fa fa-bullhorn"></i></div>
              <h4 className="nl-flow-title">Aumentar Frecuencia entre Semana</h4>
              <p className="nl-flow-text">
                Difusiones por WhatsApp los lunes y martes con promociones exclusivas o lanzamientos para reactivar la afluencia entre semana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: PLANES */}
      <section id="sec-planes" className="nl-section">
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-briefcase"></i>
            Propuesta Comercial 2026
          </div>
          <h2 className="nl-section-title">
            Estructura de Inversión y Alcance.
          </h2>
          <p className="nl-section-sub">
            Dos esquemas claros diseñados para resolver la presencia digital y la generación continua de afluencia local en sucursal.
          </p>

          <div className="nl-pricing-grid">
            {/* PLAN INTEGRAL */}
            <div className={`nl-plan-card featured ${selectedPlan === "integral" ? "selected" : ""}`}>
              <div className="nl-plan-badge">RECOMENDADO</div>

              <div>
                <h3 className="nl-plan-name">Plan Integral</h3>
                <p className="nl-plan-sub">Para delegar por completo la producción audiovisual y la pauta publicitaria local.</p>

                <div className="nl-plan-price-block">
                  <div className="nl-plan-amount">
                    $20,000 <span className="nl-plan-currency">MXN</span>
                    <span className="nl-plan-period"> / mes</span>
                  </div>
                  <div className="nl-plan-iva">+ IVA 16% ($3,200 MXN) = $23,200 MXN facturados de agencia</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--nl-green)", marginTop: "6px", fontWeight: 700 }}>
                    + $2,000 MXN de pauta adicional (inversión directa del cliente a Meta Ads)
                  </div>
                </div>

                <ul className="nl-plan-features">
                  <li>
                    <i className="fa fa-video"></i>
                    <span><strong>Producción Audiovisual Gourmet:</strong> Videos semanales en alta definición mostrando la plancha, el pan recién partido y la preparación.</span>
                  </li>
                  <li>
                    <i className="fa fa-camera"></i>
                    <span><strong>Sesiones de Foto Profesional:</strong> Levantamiento fotográfico periódico en sucursal para renovar el archivo visual de platillos.</span>
                  </li>
                  <li>
                    <i className="fa fa-clock"></i>
                    <span><strong>Historias Diarias:</strong> Cobertura en horarios de comida (12:00 PM a 4:00 PM) para antojar y orientar comensales a la sucursal.</span>
                  </li>
                  <li>
                    <i className="fa fa-bullseye"></i>
                    <span><strong>Pauta Hiperlocal Administrada:</strong> Anuncios segmentados a comensales en un radio de 3 a 5 km de su ubicación.</span>
                  </li>
                  <li>
                    <i className="fa fa-comments"></i>
                    <span><strong>Atención de Comentarios y Mensajes:</strong> Respuestas rápidas a clientes sobre horarios, ubicación y promociones.</span>
                  </li>
                  <li style={{ color: "var(--nl-green)", fontWeight: 700 }}>
                    <i className="fa fa-gift" style={{ color: "var(--nl-tomato)" }}></i>
                    <span><strong>MÓDULO BONIFICADO 1: Menú Digital Vertical con QR</strong> ($0 MXN primeros 5 meses — Después $1,000 MXN/mes).</span>
                  </li>
                  <li style={{ color: "var(--nl-green)", fontWeight: 700 }}>
                    <i className="fa fa-gift" style={{ color: "var(--nl-tomato)" }}></i>
                    <span><strong>MÓDULO BONIFICADO 2: Dinámica de Lealtad en Mesa con WhatsApp y QR</strong> ($0 MXN primeros 5 meses — Después $1,000 MXN/mes).</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => { setSelectedPlan("integral"); setIsModalOpen(true); }}
                  className="nl-btn nl-btn-green"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Seleccionar Plan Integral
                </button>
              </div>
            </div>

            {/* PLAN ESENCIAL */}
            <div className={`nl-plan-card ${selectedPlan === "esencial" ? "selected" : ""}`}>
              <div>
                <h3 className="nl-plan-name">Plan Esencial</h3>
                <p className="nl-plan-sub">Para mantener una presencia digital constante, limpia y profesional.</p>

                <div className="nl-plan-price-block">
                  <div className="nl-plan-amount">
                    $10,000 <span className="nl-plan-currency">MXN</span>
                    <span className="nl-plan-period"> / mes</span>
                  </div>
                  <div className="nl-plan-iva">+ IVA 16% ($1,600 MXN) = $11,600 MXN facturados de agencia</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--nl-green)", marginTop: "6px", fontWeight: 700 }}>
                    + $2,000 MXN de pauta adicional (inversión directa del cliente a Meta Ads)
                  </div>
                </div>

                <ul className="nl-plan-features">
                  <li>
                    <i className="fa fa-image"></i>
                    <span><strong>3 Publicaciones Semanales:</strong> Gráficos pulidos de promociones, platillos estelares y paquetes familiares.</span>
                  </li>
                  <li>
                    <i className="fa fa-clock"></i>
                    <span><strong>Historias Semanales de Mantenimiento:</strong> Presencia fija de menús y horarios de apertura.</span>
                  </li>
                  <li>
                    <i className="fa fa-pen-nib"></i>
                    <span><strong>Redacción y Copywriting Profesional:</strong> Textos directos, respetando la tradición de la marca.</span>
                  </li>
                  <li>
                    <i className="fa fa-sliders"></i>
                    <span><strong>Pauta Base en Meta Ads:</strong> Mantenimiento y optimización de anuncios de reconocimiento.</span>
                  </li>
                  <li style={{ color: "var(--nl-green)", fontWeight: 700 }}>
                    <i className="fa fa-gift" style={{ color: "var(--nl-tomato)" }}></i>
                    <span><strong>MÓDULO BONIFICADO 1: Menú Digital Vertical con QR</strong> ($0 MXN primeros 5 meses — Después $1,000 MXN/mes).</span>
                  </li>
                  <li style={{ color: "var(--nl-green)", fontWeight: 700 }}>
                    <i className="fa fa-gift" style={{ color: "var(--nl-tomato)" }}></i>
                    <span><strong>MÓDULO BONIFICADO 2: Dinámica de Lealtad en Mesa con WhatsApp y QR</strong> ($0 MXN primeros 5 meses — Después $1,000 MXN/mes).</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => { setSelectedPlan("esencial"); setIsModalOpen(true); }}
                  className="nl-btn nl-btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Seleccionar Plan Esencial
                </button>
              </div>
            </div>
          </div>

          {/* SOFTWARE BONIFICADO */}
          <div className="nl-bonuses-grid">
            <div className="nl-bonus-card">
              <span className="nl-bonus-badge">GRATIS PRIMEROS 5 MESES</span>
              <div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  MÓDULO EN MESA
                </div>
                <h4 className="nl-bonus-title">Menú Digital Vertical con QR</h4>
                <div className="nl-bonus-price-row">
                  <span className="nl-bonus-real-val">$1,000 MXN/mes</span>
                  <span className="nl-bonus-free-val">$0 MXN durante los primeros 5 meses</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-dark)", lineHeight: "1.45" }}>
                  Webapp interactiva para que el comensal explore el menú con fotos y videos en su celular,
                  agilizando pedidos y acelerando la rotación de mesas. <strong>Sin costo de desarrollo ni mensualidad por 5 meses</strong>.
                  A partir del mes 6, solo $1,000 MXN/mes de mantenimiento.
                </p>
              </div>
            </div>

            <div className="nl-bonus-card">
              <span className="nl-bonus-badge">GRATIS PRIMEROS 5 MESES</span>
              <div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  MÓDULO DE LEALTAD
                </div>
                <h4 className="nl-bonus-title">Dinámica de Lealtad en Mesa con WhatsApp y QR</h4>
                <div className="nl-bonus-price-row">
                  <span className="nl-bonus-real-val">$1,000 MXN/mes</span>
                  <span className="nl-bonus-free-val">$0 MXN durante los primeros 5 meses</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-dark)", lineHeight: "1.45" }}>
                  Dinámica web interactiva en mesa para captar comensales y convertirlos en contactos verificados de WhatsApp,
                  creando su base propia para difusiones los lunes y martes. <strong>Sin costo por 5 meses</strong>.
                  A partir del mes 6, solo $1,000 MXN/mes de servidor y mantenimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: COTIZADOR CON INTERRUPTOR INTERACTIVO */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.4)" }}>
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-calculator"></i>
            Presupuesto Transparente
          </div>
          <h2 className="nl-section-title">
            Cotizador de Inversión Mensual.
          </h2>
          <p className="nl-section-sub">
            Números claros sin letras chiquitas. Seleccione el plan y active o desactive el presupuesto de pauta según su conveniencia.
          </p>

          <div className="nl-calc-box">
            <div className="nl-calc-grid">
              <div className="nl-calc-selector">
                {/* SELECTOR PLAN INTEGRAL */}
                <div
                  onClick={() => setSelectedPlan("integral")}
                  className={`nl-calc-item ${selectedPlan === "integral" ? "active" : ""}`}
                >
                  <div className="nl-calc-item-left">
                    <div className="nl-radio">
                      {selectedPlan === "integral" && <i className="fa fa-check"></i>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "1rem" }}>Plan Integral ($20,000 MXN)</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Producción gourmet de video, fotos, historias diarias y pauta hiperlocal
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--nl-green-deep)", fontSize: "1.2rem" }}>
                    $20,000 MXN
                  </div>
                </div>

                {/* SELECTOR PLAN ESENCIAL */}
                <div
                  onClick={() => setSelectedPlan("esencial")}
                  className={`nl-calc-item ${selectedPlan === "esencial" ? "active" : ""}`}
                >
                  <div className="nl-calc-item-left">
                    <div className="nl-radio">
                      {selectedPlan === "esencial" && <i className="fa fa-check"></i>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "1rem" }}>Plan Esencial ($10,000 MXN)</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        3 publicaciones por semana, diseño de promociones y mantenimiento de redes
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--nl-green-deep)", fontSize: "1.2rem" }}>
                    $10,000 MXN
                  </div>
                </div>

                {/* INTERRUPTOR INTERACTIVO DE PAUTA */}
                <div className="nl-pauta-switch-box">
                  <div
                    className="nl-pauta-toggle-row"
                    onClick={() => setIncludePauta(!includePauta)}
                  >
                    <div className="nl-toggle-label">
                      <div className={`nl-custom-checkbox ${includePauta ? "checked" : ""}`}>
                        {includePauta && <i className="fa fa-check"></i>}
                      </div>
                      <span>Incluir Inversión en Medios Meta Ads (+$2,000 MXN/mes)</span>
                    </div>
                    <span style={{
                      fontWeight: 800,
                      color: includePauta ? "var(--nl-green)" : "var(--text-muted)",
                      fontSize: "0.85rem"
                    }}>
                      {includePauta ? "ACTIVADO" : "SIN PAUTA"}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.45" }}>
                    Los <strong>$2,000 MXN/mes de pauta</strong> se pagan directamente a la plataforma publicitaria de Meta (Facebook e Instagram).
                    Apolograma realiza la segmentación hiperlocal, diseño de anuncios y optimización técnica sin cobrarle comisión por manejo de presupuesto.
                  </div>
                </div>
              </div>

              {/* TARJETA DE RESUMEN */}
              <div className="nl-calc-summary-card">
                <div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#FFF", marginBottom: "1.1rem", textTransform: "uppercase" }}>
                    Resumen Financiero
                  </h4>

                  <div className="nl-sum-row highlight">
                    <span>Plan Seleccionado:</span>
                    <span>{selectedPlan === "integral" ? "Plan Integral ($20,000 MXN)" : "Plan Esencial ($10,000 MXN)"}</span>
                  </div>

                  <div className="nl-sum-row">
                    <span>Subtotal Agencia:</span>
                    <span>${baseMonthly.toLocaleString("es-MX")} MXN</span>
                  </div>

                  <div className="nl-sum-row">
                    <span>IVA (16%):</span>
                    <span>${iva.toLocaleString("es-MX")} MXN</span>
                  </div>

                  <div className="nl-sum-row highlight">
                    <span>Total Factura Agencia:</span>
                    <span>${agencyTotal.toLocaleString("es-MX")} MXN</span>
                  </div>

                  <div className="nl-sum-row" style={{ color: "var(--nl-yolk)" }}>
                    <span>Presupuesto Pauta Meta Ads:</span>
                    <span>{includePauta ? "+$2,000 MXN" : "$0 MXN (Desactivada)"}</span>
                  </div>

                  <div className="nl-sum-row" style={{ color: "var(--nl-french-bread)" }}>
                    <span>Módulos de Mesa (Meses 1 al 5):</span>
                    <span>$0 MXN (100% Bonificado)</span>
                  </div>

                  <div className="nl-sum-total-row">
                    <span style={{ fontSize: "0.875rem", textTransform: "uppercase", color: "var(--nl-french-bread)" }}>
                      Total Mensual Estimado:
                    </span>
                    <span className="nl-sum-total-val">
                      ${grandTotal.toLocaleString("es-MX")}{" "}
                      <span style={{ fontSize: "0.95rem", color: "var(--nl-french-bread)" }}>MXN/mes</span>
                    </span>
                  </div>

                  <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.92)", marginTop: "0.6rem", lineHeight: "1.45" }}>
                    * Los $2,000 MXN de pauta son adicionales a la iguala y se pagan directamente a Meta Ads con tarjeta del cliente. Los 2 módulos de software están 100% bonificados durante los primeros 5 meses ($0 MXN); a partir del mes 6 se añade el mantenimiento opcional ($1,000 MXN/mes cada uno).
                  </div>
                </div>

                <div style={{ marginTop: "1.4rem" }}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="nl-btn nl-btn-yolk"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <i className="fa fa-calendar-check"></i> Agendar Junta de Arranque
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="nl-section">
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-calendar-days"></i>
            Plan de Trabajo
          </div>
          <h2 className="nl-section-title">
            Implementación en 3 Semanas.
          </h2>
          <p className="nl-section-sub">
            Activamos la estrategia sin entorpecer el servicio diario ni la operación de la cocina.
          </p>

          <div className="nl-roadmap-grid">
            <div style={{
              background: "#FFF",
              border: "1.5px solid var(--nl-french-bread-border)",
              borderRadius: "18px",
              padding: "1.8rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--nl-green)", fontWeight: 800 }}>
                SEMANA 01
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--nl-green-deep)", margin: "0.4rem 0", textTransform: "uppercase" }}>
                Levantamiento & Menú Digital
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Sesión de foto y video de platillos en sucursal. Carga de precios y configuración de la webapp del menú.
              </p>
            </div>

            <div style={{
              background: "#FFF",
              border: "1.5px solid var(--nl-french-bread-border)",
              borderRadius: "18px",
              padding: "1.8rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--nl-green)", fontWeight: 800 }}>
                SEMANA 02
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--nl-green-deep)", margin: "0.4rem 0", textTransform: "uppercase" }}>
                Puesta en Mesa & Pauta Local
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Colocación de códigos QR en mesas. Activación de campañas hiperlocales en Facebook e Instagram (3 a 5 km a la redonda).
              </p>
            </div>

            <div style={{
              background: "#FFF",
              border: "1.5px solid var(--nl-french-bread-border)",
              borderRadius: "18px",
              padding: "1.8rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--nl-green)", fontWeight: 800 }}>
                SEMANA 03 EN ADELANTE
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--nl-green-deep)", margin: "0.4rem 0", textTransform: "uppercase" }}>
                Operación Continua & Lealtad
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Publicación regular de contenido gastronómico. Primeras difusiones directas por WhatsApp para acelerar la afluencia entre semana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA DIRECTO */}
      <section className="nl-section" style={{ textAlign: "center", paddingBottom: "2rem" }}>
        <div className="nl-wrapper">
          <div style={{
            background: "var(--nl-green)",
            color: "#FFF",
            borderRadius: "24px",
            padding: "3.5rem 2rem",
            maxWidth: "900px",
            margin: "0 auto",
            boxShadow: "0 20px 50px rgba(24, 61, 47, 0.25)",
            border: "2px solid rgba(217, 130, 43, 0.4)",
          }}>
            <span className="nl-script-accent">Por un 2026 de mesas llenas</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2.3rem)", textWrap: "balance", color: "#FFF", marginBottom: "0.8rem", textTransform: "uppercase" }}>
              Coordinemos la Fecha de Arranque para la Producción.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--nl-french-bread)", maxWidth: "680px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
              Revisemos detalles técnicos de su menú y agendemos la primera sesión fotográfica en sucursal.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="nl-btn nl-btn-yolk"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1.6rem" }}
              >
                <i className="fa fa-calendar-check"></i> Agendar Junta
              </button>
              <a
                href={`https://wa.me/526564614059?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nl-btn nl-btn-outline"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1.6rem", color: "#FFF", borderColor: "#FFF" }}
              >
                <i className="fa-brands fa-whatsapp"></i> Conversar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="nl-modal-backdrop" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains("nl-modal-backdrop")) {
            setIsModalOpen(false);
          }
        }}>
          <div className="nl-modal-box">
            <button onClick={() => setIsModalOpen(false)} className="nl-modal-close">
              <i className="fa fa-times"></i>
            </button>

            {!meetingSubmitted ? (
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--nl-green)", fontWeight: 800, marginBottom: "0.3rem" }}>
                  COORDINACIÓN DE ARRANQUE
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--nl-green-deep)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  Tortería La Nueva Laguna
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.4rem" }}>
                  Plan: <strong>{selectedPlan === "integral" ? "Plan Integral ($20,000 MXN + IVA / mes)" : "Plan Esencial ($10,000 MXN + IVA / mes)"}</strong> con menú digital y dinámica de lealtad QR incluidos.
                </p>

                <form onSubmit={handleScheduleSubmit}>
                  <div style={{ marginBottom: "0.9rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 700 }}>Nombre:</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre del titular o encargado"
                      value={meetingName}
                      onChange={(e) => setMeetingName(e.target.value)}
                      className="nl-input"
                    />
                  </div>

                  <div style={{ marginBottom: "0.9rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 700 }}>Teléfono WhatsApp:</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 656 123 4567"
                      value={meetingPhone}
                      onChange={(e) => setMeetingPhone(e.target.value)}
                      className="nl-input"
                    />
                  </div>

                  <div className="nl-modal-datetime-grid">
                    <div>
                      <label style={{ fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 700 }}>Fecha Tentativa:</label>
                      <input
                        type="date"
                        required
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="nl-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 700 }}>Horario:</label>
                      <select
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="nl-input"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingMeeting}
                    className="nl-btn nl-btn-green"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {isSubmittingMeeting ? (
                      <span><i className="fa fa-spinner fa-spin"></i> Registrando...</span>
                    ) : (
                      <span><i className="fa fa-calendar-check"></i> Confirmar Fecha de Junta</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1.4rem 0" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--nl-green)",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  margin: "0 auto 1rem auto",
                }}>
                  <i className="fa fa-check"></i>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--nl-green-deep)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  Junta Registrada
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "1.4rem" }}>
                  Hemos recibido su solicitud para el <strong>{meetingDate} a las {meetingTime}</strong>.
                  Emmanuel Padilla se comunicará al <strong>{meetingPhone}</strong> para coordinar la sesión.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="nl-btn nl-btn-green"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="nl-footer">
        <div className="nl-wrapper">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
            <img
              src="/assets/apolograma-logo-v2.png"
              alt="Apolograma"
              style={{ height: "18px", width: "auto", filter: "brightness(0.2)" }}
            />
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Propuesta Comercial elaborada exclusivamente para <strong>Tortería La Nueva Laguna</strong>.
            <br />
            © {new Date().getFullYear()} Apolograma Software & Design Studio. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
