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
  const [checklistTab, setChecklistTab] = useState<"sala" | "cierre">("sala");
  const [checklistItems, setChecklistItems] = useState<{ [key: string]: boolean }>({
    sala_musica: true,
    sala_pantallas: true,
    sala_mesas: true,
    sala_salsas: false,
    cierre_salsas: true,
    cierre_plancha: true,
    cierre_banos: false,
    cierre_pisos: false,
  });
  const [photoUploaded, setPhotoUploaded] = useState<{ [key: string]: boolean }>({
    sala_musica: true,
    sala_pantallas: true,
    sala_mesas: true,
    cierre_salsas: true,
    cierre_plancha: true,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklistItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePhotoUploaded = (key: string) => {
    setPhotoUploaded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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

  const baseMonthly = 6000;
  const iva = baseMonthly * 0.16;
  const agencyTotal = baseMonthly + iva;
  const grandTotal = agencyTotal;

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
        "Paquete Tecnológico de Comedor & Lealtad ($6,000 MXN + IVA / mes)",
        "Pilar 1: Menú Digital Vertical en Mesa (Código QR)",
        "Pilar 2: Minijuego Interactivo en Mesa para Captación de WhatsApp",
        "Pilar 3: Circuito Audiovisual para Pantallas de Comedor (16:9 Antojo + Cultura Lagunera)",
        "Pilar 4: Sistema Integrado de Lealtad & Pasaporte de Visitas (CRM para el dueño)",
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
    `Hola Emmanuel, revisé la propuesta de Apolograma para Tortería La Nueva Laguna. Me interesa el Ecosistema Tecnológico de Comedor y Lealtad ($6,000 MXN/mes). Me gustaría agendar la fecha de arranque para la instalación en sucursal.`
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Pinyon+Script&display=swap"
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
          --font-display: 'Playfair Display', 'DM Serif Display', Georgia, serif;
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
          overflow-x: hidden;
          line-height: 1.5;
        }

        .nl-wrapper {
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
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--nl-french-bread-border);
          padding: 0.9rem 0;
        }

        .nl-header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nl-logo-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nl-brand-agency {
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--nl-green-deep);
          letter-spacing: -0.3px;
        }

        .nl-badge-client {
          background: var(--nl-french-bread);
          color: var(--nl-green-deep);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--nl-french-bread-border);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* BUTTONS */
        .nl-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.65rem 1.3rem;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          min-height: 44px;
        }

        .nl-btn-green {
          background: var(--nl-green);
          color: #FFF;
        }
        .nl-btn-green:hover {
          background: var(--nl-green-deep);
          transform: translateY(-1px);
        }

        .nl-btn-yolk {
          background: var(--nl-yolk);
          color: #FFF;
        }
        .nl-btn-yolk:hover {
          background: var(--nl-yolk-dark);
          transform: translateY(-1px);
        }

        .nl-btn-outline {
          background: transparent;
          color: var(--nl-green-deep);
          border: 1.5px solid var(--nl-green-deep);
        }
        .nl-btn-outline:hover {
          background: var(--nl-french-bread);
        }

        /* HERO */
        .nl-hero {
          padding: 3rem 0 2rem 0;
        }

        .nl-hero-card {
          background: var(--nl-green);
          color: #FFF;
          border-radius: 28px;
          padding: 3.5rem 3rem;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          align-items: center;
          box-shadow: 0 20px 50px rgba(24, 61, 47, 0.25);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(217, 130, 43, 0.3);
        }

        .nl-hero-left {
          position: relative;
          z-index: 2;
        }

        .nl-hero-logo-box {
          background: #FFF;
          display: inline-flex;
          padding: 1rem 1.6rem;
          border-radius: 16px;
          border: 2px solid var(--nl-yolk);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          margin-bottom: 1.4rem;
        }

        .nl-hero-logo-img {
          height: 105px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .nl-script-accent {
          font-family: var(--font-script);
          font-size: 2.1rem;
          color: var(--nl-yolk);
          display: block;
          margin-bottom: 0.2rem;
        }

        .nl-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.8vw, 2.7rem);
          font-weight: 800;
          line-height: 1.22;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-wrap: balance;
        }

        .nl-hero h1 span.gold {
          color: var(--nl-yolk);
        }

        .nl-hero-manifesto {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--nl-french-bread);
          margin-bottom: 2rem;
          max-width: 600px;
        }

        .nl-hero-manifesto strong {
          color: #FFF;
          font-weight: 800;
        }

        .nl-hero-badges-row {
          display: flex;
          gap: 1.4rem;
          margin-top: 2rem;
          padding-top: 1.6rem;
          border-top: 1px solid rgba(243, 232, 204, 0.2);
          flex-wrap: wrap;
        }

        .nl-hero-badge-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          color: var(--nl-french-bread);
          font-weight: 700;
        }

        .nl-hero-badge-item i {
          color: var(--nl-yolk);
        }

        .nl-hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .nl-hero-img-frame {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
          border: 3px solid var(--nl-yolk);
          background: #000;
          max-width: 440px;
          width: 100%;
        }

        .nl-hero-food-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s ease;
        }

        .nl-hero-top-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(14, 52, 27, 0.88);
          backdrop-filter: blur(8px);
          color: #FFF;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--nl-yolk);
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nl-hero-stamp {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: var(--nl-tomato);
          color: #FFF;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 0.78rem;
          padding: 6px 14px;
          border-radius: 6px;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          letter-spacing: 0.5px;
        }

        /* 4 METRICS */
        .nl-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          margin-top: 1.8rem;
        }

        .nl-metric-card {
          background: #FFF;
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 18px;
          padding: 1.4rem;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
        }

        .nl-metric-val {
          font-family: var(--font-display);
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--nl-green);
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .nl-metric-val .unit {
          font-size: 1.1rem;
          color: var(--nl-tomato);
        }

        .nl-metric-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* SECTIONS */
        .nl-section {
          padding: 4.5rem 0;
        }

        .nl-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--nl-french-bread);
          color: var(--nl-green);
          font-size: 0.78rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 0.8rem;
          border: 1px solid var(--nl-french-bread-border);
        }

        .nl-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 900;
          color: var(--nl-green-deep);
          line-height: 1.2;
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: -0.4px;
          text-wrap: balance;
        }

        .nl-section-sub {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 780px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        /* PILLAR CARD HIGHLIGHT */
        .nl-pillar-badge {
          display: inline-block;
          background: var(--nl-green);
          color: #FFF;
          font-size: 0.8rem;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 6px;
          margin-bottom: 0.8rem;
          letter-spacing: 0.5px;
        }

        /* SMARTPHONE SIMULATOR */
        .nl-sim-box {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
        }

        .nl-sim-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 3rem;
          align-items: center;
        }

        .phone-mockup {
          width: 320px;
          max-width: 100%;
          margin: 0 auto;
          background: #111;
          border-radius: 42px;
          padding: 12px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          border: 4px solid #2A2A2A;
          position: relative;
        }

        .phone-island {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 22px;
          background: #000;
          border-radius: 14px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone-island-cam {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1A1A1A;
          margin-left: 45px;
        }

        .phone-screen {
          background: var(--nl-french-bread-bg);
          border-radius: 32px;
          overflow: hidden;
          padding: 1.8rem 1rem 1rem 1rem;
          position: relative;
        }

        .phone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--nl-french-bread-border);
        }

        .phone-header-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 900;
          color: var(--nl-green);
          text-transform: uppercase;
        }

        .phone-header-badge {
          background: var(--nl-tomato);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .phone-dish-card {
          background: #FFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--nl-french-bread-border);
        }

        .phone-dish-img-wrap {
          position: relative;
          height: 180px;
          background: #000;
          overflow: hidden;
        }

        .phone-dish-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .phone-dish-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(14, 52, 27, 0.9);
          color: var(--nl-french-bread);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .phone-dish-info {
          padding: 1rem;
        }

        .phone-dish-name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 900;
          color: var(--nl-green-deep);
          margin-bottom: 0.3rem;
          line-height: 1.2;
        }

        .phone-dish-desc {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 0.8rem;
        }

        .phone-dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.6rem;
          border-top: 1px dashed var(--nl-french-bread-border);
        }

        .phone-dish-price {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--nl-green);
        }

        .phone-dish-btn {
          background: var(--nl-tomato);
          color: #FFF;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 8px 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          min-width: 44px;
          gap: 5px;
          transition: transform 0.1s;
        }

        .phone-dish-btn:active {
          transform: scale(0.95);
        }

        .phone-nav-controls {
          display: flex;
          justify-content: space-between;
          margin-top: 0.8rem;
          gap: 0.5rem;
        }

        .phone-cat-pill {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
        }

        .phone-nav-btn {
          flex: 1;
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--nl-french-bread);
          border: 1px solid var(--nl-french-bread-border);
          color: var(--nl-green-deep);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
        }

        .phone-nav-btn:hover {
          background: #E8D8B5;
        }

        /* SIMULATOR RIGHT DETAILS */
        .nl-sim-detail h3 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--nl-green);
          margin-bottom: 0.8rem;
          text-transform: uppercase;
        }

        .nl-sim-detail p {
          font-size: 0.98rem;
          color: var(--text-dark);
          line-height: 1.6;
          margin-bottom: 1.4rem;
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

        /* PANTALLAS DE COMEDOR (16:9 PREVIEW) */
        .nl-screens-box {
          background: #111;
          border-radius: 24px;
          border: 3px solid var(--nl-yolk);
          padding: 2rem;
          color: #FFF;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          margin-top: 1.5rem;
        }

        .nl-screen-mockup {
          position: relative;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          border: 2px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nl-screen-mockup img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.92;
        }

        .nl-screen-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,52,27,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.8rem;
        }

        .nl-screen-badge-top {
          align-self: flex-start;
          background: var(--nl-tomato);
          color: #FFF;
          font-size: 0.8rem;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .nl-screen-caption {
          color: #FFF;
        }

        .nl-screen-caption h4 {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 900;
          color: var(--nl-french-bread);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .nl-screen-caption p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.9);
          max-width: 600px;
          line-height: 1.4;
        }

        .nl-screen-qr-corner {
          position: absolute;
          bottom: 1.8rem;
          right: 1.8rem;
          background: rgba(255,255,255,0.95);
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid var(--nl-yolk);
        }

        .nl-screen-qr-corner img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          opacity: 1;
        }

        .nl-screen-qr-corner span {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--nl-green-deep);
          text-transform: uppercase;
          line-height: 1.2;
        }

        .nl-screens-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .nl-loyalty-box {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .nl-whatsapp-link {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* CUSTOMER JOURNEY (RECORRIDO EN 4 MOMENTOS) */
        .nl-journey-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          margin-top: 2rem;
        }

        .nl-journey-card {
          background: #FFF;
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 20px;
          padding: 1.8rem 1.4rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s;
        }

        .nl-journey-card:hover {
          transform: translateY(-4px);
        }

        .nl-journey-step {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--nl-tomato);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .nl-journey-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--nl-french-bread-bg);
          color: var(--nl-green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          border: 1px solid var(--nl-french-bread-border);
        }

        .nl-journey-title {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--nl-green-deep);
          margin-bottom: 0.6rem;
          text-transform: uppercase;
        }

        .nl-journey-desc {
          font-size: 0.88rem;
          color: var(--text-dark);
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1;
        }

        .nl-journey-pill {
          background: var(--nl-french-bread);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--nl-green-deep);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* CHECKLIST OPERATIVO CON FOTOS */
        .nl-checklist-box {
          background: #FFF;
          border: 2px solid var(--nl-french-bread-border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 15px 40px rgba(0,0,0,0.04);
          margin-top: 2rem;
        }

        .nl-checklist-tabs {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1.8rem;
          flex-wrap: wrap;
        }

        .nl-checklist-tab-btn {
          min-height: 44px;
          padding: 0.6rem 1.4rem;
          border-radius: 30px;
          border: 1.5px solid var(--nl-french-bread-border);
          background: #FFF;
          color: var(--text-dark);
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .nl-checklist-tab-btn.active {
          background: var(--nl-green);
          color: #FFF;
          border-color: var(--nl-green);
        }

        .nl-checklist-items-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .nl-checklist-item-card {
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 16px;
          padding: 1.2rem;
          background: var(--nl-french-bread-bg);
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          transition: border-color 0.2s;
        }

        .nl-checklist-item-card.completed {
          border-color: var(--nl-green);
          background: rgba(24, 61, 47, 0.03);
        }

        .nl-check-checkbox {
          min-width: 24px;
          min-height: 24px;
          border-radius: 6px;
          border: 2px solid var(--nl-green);
          background: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-top: 2px;
        }

        .nl-check-checkbox.checked {
          background: var(--nl-green);
          color: #FFF;
        }

        .nl-evidence-photo-btn {
          min-height: 44px;
          min-width: 44px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 0.6rem;
          border: none;
        }

        /* TARJETA DE PLAN ÚNICO ($6,000) */
        .nl-single-plan-card {
          background: #FFF;
          border: 3px solid var(--nl-green);
          border-radius: 26px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(24, 61, 47, 0.14);
          position: relative;
          max-width: 880px;
          margin: 0 auto;
        }

        .nl-single-plan-badge {
          position: absolute;
          top: -14px;
          right: 28px;
          background: var(--nl-tomato);
          color: #FFF;
          font-size: 0.875rem;
          font-weight: 900;
          padding: 5px 18px;
          border-radius: 20px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .nl-single-plan-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          align-items: center;
        }

        .nl-single-price-box {
          background: var(--nl-green);
          color: #FFF;
          border-radius: 20px;
          padding: 2.2rem;
          text-align: center;
          border: 2px solid var(--nl-yolk);
        }

        .nl-single-price-amount {
          font-family: var(--font-display);
          font-size: 3.4rem;
          font-weight: 900;
          color: #FFF;
          line-height: 1;
        }

        .nl-single-price-iva {
          font-size: 0.88rem;
          color: var(--nl-french-bread);
          margin-top: 0.4rem;
          font-weight: 700;
        }

        .nl-single-daily-rate {
          display: inline-block;
          background: rgba(217, 130, 43, 0.25);
          color: var(--nl-french-bread);
          border: 1px solid var(--nl-yolk);
          font-size: 0.85rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          margin: 1rem 0;
        }

        /* ROADMAP */
        .nl-roadmap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        /* MODAL */
        .nl-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(14, 52, 27, 0.82);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .nl-modal-box {
          background: #FFF;
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 25px 70px rgba(0,0,0,0.35);
          border: 2px solid var(--nl-yolk);
          position: relative;
        }

        .nl-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          background: var(--nl-french-bread);
          border: none;
          color: var(--nl-green-deep);
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nl-modal-close:hover {
          background: #E8D8B5;
        }

        .nl-input {
          width: 100%;
          min-height: 44px;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--nl-french-bread-border);
          border-radius: 10px;
          font-size: 16px;
          font-family: var(--font-body);
          margin-top: 0.3rem;
          outline: none;
        }

        .nl-input:focus {
          border-color: var(--nl-green);
        }

        .nl-modal-datetime-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }

        /* FOOTER */
        .nl-footer {
          background: var(--nl-french-bread-bg);
          border-top: 1px solid var(--nl-french-bread-border);
          padding: 2.5rem 0;
          text-align: center;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .nl-hero-card {
            grid-template-columns: 1fr;
            padding: 2.5rem 1.8rem;
            text-align: center;
          }
          .nl-hero-left {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .nl-hero-manifesto {
            margin: 0 auto 2rem auto;
          }
          .nl-hero-badges-row {
            justify-content: center;
          }
          .nl-hero-right {
            margin-top: 1.5rem;
          }
          .nl-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .nl-sim-grid {
            grid-template-columns: 1fr;
          }
          .nl-flow-grid {
            grid-template-columns: 1fr;
          }
          .nl-single-plan-grid {
            grid-template-columns: 1fr;
          }
          .nl-roadmap-grid {
            grid-template-columns: 1fr;
          }
          .nl-journey-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .nl-checklist-items-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nl-screens-features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .nl-loyalty-box {
            grid-template-columns: 1fr;
            padding: 1.5rem 1.25rem;
            gap: 1.8rem;
          }
          .phone-mockup {
            max-width: 100%;
            width: 100%;
          }
        }

        @media (max-width: 580px) {
          .nl-journey-grid {
            grid-template-columns: 1fr;
          }
          .nl-checklist-box {
            padding: 1.4rem 1rem !important;
          }
          .nl-sim-box {
            padding: 1.25rem 0.75rem !important;
          }
          .nl-sim-qr-box {
            flex-direction: column;
            text-align: center;
          }
          .nl-modal-box .nl-modal-datetime-grid, .nl-modal-grid {
            grid-template-columns: 1fr !important;
          }
          .nl-modal-datetime-grid {
            grid-template-columns: 1fr !important;
          }
          .nl-plan-card, .nl-single-plan-card {
            padding: 1.5rem 1.25rem !important;
          }
        }
      `}} />

      {/* HEADER */}
      <header className="nl-header">
        <div className="nl-wrapper nl-header-inner">
          <div className="nl-logo-group">
            <span className="nl-brand-agency">APOLOGRAMA</span>
            <div className="nl-badge-client">
              <i className="fa fa-utensils" style={{ color: "var(--nl-green)" }}></i>
              <span>Tortería La Nueva Laguna</span>
            </div>
          </div>

          <div>
            <button onClick={() => setIsModalOpen(true)} className="nl-btn nl-btn-green" style={{ fontSize: "0.82rem", padding: "0.55rem 1rem" }}>
              <i className="fa fa-calendar-check"></i> Agendar Junta
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
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
                MÁS QUE UNA COMIDA: <br />
                <span className="gold">UNA GRAN EXPERIENCIA EN SALA DESDE QUE SE LLEGA HASTA QUE SE SALE.</span>
              </h1>

              <p className="nl-hero-manifesto">
                Usted ya tiene el producto, la receta y el sazón que respalda el prestigio de La Nueva Laguna.
                Nuestra propuesta armoniza la interacción entre sus comensales, sus productos, la infraestructura, la música ambiental, el orden visual y la tecnología en mesa:
                un <strong>menú digital vertical interactivo</strong> que agiliza los pedidos,
                un <strong>minijuego interactivo con código QR</strong> que convierte comensales en contactos de WhatsApp,
                <strong>videos de antojo y folclor lagunero</strong> para sus pantallas de comedor, y un <strong>sistema de lealtad</strong> para
                reactivar visitas de lunes a miércoles.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="#sec-recorrido" className="nl-btn nl-btn-yolk">
                  <i className="fa fa-route"></i> Recorrido del Comensal
                </a>
                <a href="#sec-pilares" className="nl-btn nl-btn-outline" style={{ color: "#FFF", borderColor: "#FFF" }}>
                  <i className="fa fa-layer-group"></i> Conocer los 4 Pilares
                </a>
                <a href="#sec-inversion" className="nl-btn nl-btn-outline" style={{ color: "var(--nl-yolk)", borderColor: "var(--nl-yolk)" }}>
                  <i className="fa fa-tag"></i> Ver Inversión ($6,000/mes)
                </a>
              </div>

              <div className="nl-hero-badges-row">
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>1. Menú QR en Mesa</span>
                </div>
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>2. Minijuego WhatsApp</span>
                </div>
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>3. Videos Pantallas Comedor</span>
                </div>
                <div className="nl-hero-badge-item">
                  <i className="fa fa-circle-check"></i>
                  <span>4. Sistema de Lealtad</span>
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
              <div className="nl-metric-val">16:9<span className="unit">HD</span></div>
              <div className="nl-metric-label">Antojo & Tradición en Pantallas</div>
            </div>
            <div className="nl-metric-card">
              <div className="nl-metric-val">$200<span className="unit">MXN</span></div>
              <div className="nl-metric-label">Inversión Diaria Equivalente</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN RECORRIDO DEL COMENSAL (CUSTOMER JOURNEY) */}
      <section id="sec-recorrido" className="nl-section" style={{ background: "rgba(243, 232, 204, 0.25)" }}>
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-route"></i>
            Experiencia 360° en Sucursal
          </div>
          <h2 className="nl-section-title">
            El Recorrido del Comensal: De la Entrada a la Salida.
          </h2>
          <p className="nl-section-sub">
            Diseñamos la interacción armónica entre el cliente, sus productos, la infraestructura, la música ambiental, el olor a pan crujiente y la tecnología en salón.
          </p>

          <div className="nl-journey-grid">
            {/* FASE 1 */}
            <div className="nl-journey-card">
              <div className="nl-journey-step">Fase 01 • La Llegada</div>
              <div className="nl-journey-icon">
                <i className="fa fa-music"></i>
              </div>
              <div className="nl-journey-title">Ambiente, Música & Orden</div>
              <p className="nl-journey-desc">
                El comensal entra y percibe un entorno limpio, acogedor y ordenado. Una playlist oficial curada para el comedor sin interrupciones y una guía de estándares visuales para mesa y barra.
              </p>
              <div className="nl-journey-pill">
                <i className="fa fa-headphones"></i> Playlist Spotify + Guía Mesa
              </div>
            </div>

            {/* FASE 2 */}
            <div className="nl-journey-card">
              <div className="nl-journey-step">Fase 02 • La Mesa</div>
              <div className="nl-journey-icon">
                <i className="fa fa-qrcode"></i>
              </div>
              <div className="nl-journey-title">Información Clara & Producto</div>
              <p className="nl-journey-desc">
                Sin cartas de papel maltratadas. Acrílicos con QR abren un menú digital vertical ágil (&lt;1s) con fotografía en alta definición de tortas en pan francés y precios en vivo.
              </p>
              <div className="nl-journey-pill">
                <i className="fa fa-mobile-screen"></i> Menú Digital Vertical QR
              </div>
            </div>

            {/* FASE 3 */}
            <div className="nl-journey-card">
              <div className="nl-journey-step">Fase 03 • La Espera</div>
              <div className="nl-journey-icon">
                <i className="fa fa-tv"></i>
              </div>
              <div className="nl-journey-title">Antojo Sensorial & Juego</div>
              <p className="nl-journey-desc">
                El aroma de la plancha se sincroniza con pantallas 16:9 HD de pan crujiente y folclor lagunero, mientras un minijuego interactivo QR en mesa entretiene y capta su WhatsApp.
              </p>
              <div className="nl-journey-pill">
                <i className="fa fa-gamepad"></i> Pantallas 16:9 + Minijuego QR
              </div>
            </div>

            {/* FASE 4 */}
            <div className="nl-journey-card">
              <div className="nl-journey-step">Fase 04 • La Despedida</div>
              <div className="nl-journey-icon">
                <i className="fa fa-award"></i>
              </div>
              <div className="nl-journey-title">Recuerdo Grato & Lealtad</div>
              <p className="nl-journey-desc">
                El comensal se retira satisfecho y con un sello digital acumulado en su Pasaporte Lagunero en WhatsApp. Al séptimo día, recibe una invitación personalizada para volver a comer entre semana.
              </p>
              <div className="nl-journey-pill">
                <i className="fa fa-clock-rotate-left"></i> Pasaporte Digital en WhatsApp
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANCLA PILARES */}
      <div id="sec-pilares"></div>

      {/* PILAR 1: MENÚ DIGITAL VERTICAL */}
      <section className="nl-section">
        <div className="nl-wrapper">
          <span className="nl-pillar-badge">PILAR 01</span>
          <div className="nl-section-tag">
            <i className="fa fa-mobile-screen"></i>
            Tecnología en Mesa
          </div>
          <h2 className="nl-section-title">
            Menú Digital Vertical: El Antojo Vende Antes de que Llegue el Mesero.
          </h2>
          <p className="nl-section-sub">
            Sustituya las cartas físicas maltratadas o PDFs lentos por una webapp ágil que abre al instante escaneando el QR en mesa.
            Al ver la pierna dorada, el pan francés crujiente y los ingredientes en alta definición,
            el comensal decide en segundos, acelerando la rotación de mesas y elevando el ticket promedio.
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

                  <div className="phone-dish-card">
                    <div className="phone-dish-img-wrap">
                      <img
                        src={currentDish.image}
                        alt={currentDish.name}
                        className="phone-dish-img"
                      />
                      <span className="phone-dish-tag">{currentDish.tag}</span>
                    </div>

                    <div className="phone-dish-info">
                      <h4 className="phone-dish-name">{currentDish.name}</h4>
                      <p className="phone-dish-desc">{currentDish.description}</p>

                      <div className="phone-dish-footer">
                        <div className="phone-dish-price">${currentDish.price} MXN</div>
                        <button
                          onClick={() => handleCravingClick(currentDish.id)}
                          className="phone-dish-btn"
                        >
                          <i className={`fa fa-heart ${heartAnim ? "fa-beat" : ""}`}></i>
                          <span>{cravings[currentDish.id] || currentDish.cravingCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="phone-nav-controls">
                    <button onClick={handlePrevDish} className="phone-nav-btn">
                      <i className="fa fa-chevron-left"></i> Anterior
                    </button>
                    <button onClick={handleNextDish} className="phone-nav-btn">
                      Siguiente <i className="fa fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* SIMULATOR RIGHT DETAILS */}
              <div className="nl-sim-detail">
                <h3>Experiencia Inmersiva para Comensales</h3>
                <p>
                  Diseñado para abrir el apetito desde el primer segundo. Los clientes exploran fotos reales de los platillos,
                  ven los ingredientes detallados y eligen sus bebidas o complementos sin esperar a que el mesero les entregue una carta física.
                </p>

                <div className="nl-sim-qr-box">
                  <img
                    src="/assets/nueva-laguna/qr-menu-demo.png"
                    alt="Código QR de Prueba"
                    className="nl-qr-img"
                  />
                  <div className="nl-qr-text">
                    <h4>Escanee con su Celular</h4>
                    <p>
                      Pruebe la experiencia real de un comensal en su mesa. Sin instalar aplicaciones ni registros obligatorios.
                    </p>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--nl-green)" }}>
                      <i className="fa fa-bolt"></i> Carga en menos de 1 segundo en 4G/5G
                    </span>
                  </div>
                </div>

                <div className="nl-feature-bullets">
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Actualización de Precios en Vivo:</strong> Cambie precios o agote platillos al instante sin reimprimir papel.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Fotografía de Alto Antojo:</strong> Cada platillo se muestra con su pan crujiente y porciones generosas.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Mayor Rotación de Mesas:</strong> Los comensales ordenan más rápido y la cocina recibe pedidos sin demoras.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILAR 2: MINIJUEGO INTERACTIVO QR Y WHATSAPP */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.35)" }}>
        <div className="nl-wrapper">
          <span className="nl-pillar-badge">PILAR 02</span>
          <div className="nl-section-tag">
            <i className="fa fa-gamepad"></i>
            Conversión en Mesa • Minijuego Interactivo
          </div>
          <h2 className="nl-section-title">
            El Minijuego que Convierte Comensales en Contactos de WhatsApp.
          </h2>
          <p className="nl-section-sub">
            El error común en los restaurantes es dejar que el cliente coma, pague y se vaya sin dejar su contacto.
            Con este minijuego oficial con código QR en mesa, el comensal se divierte mientras espera su comida,
            gana un beneficio de cortesía y registra su teléfono verificado de WhatsApp.
          </p>

          <div className="nl-flow-grid">
            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 01</span>
              <div className="nl-flow-icon"><i className="fa fa-qrcode"></i></div>
              <h4 className="nl-flow-title">QR en Mesa</h4>
              <p className="nl-flow-text">
                Acrílico elegante en mesa o mantel individual: <em>&ldquo;Escanee el código y supere el reto del minijuego para ganar una cortesía en su consumo de hoy.&rdquo;</em>
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 02</span>
              <div className="nl-flow-icon"><i className="fa fa-gamepad"></i></div>
              <h4 className="nl-flow-title">Minijuego en 1 Clic</h4>
              <p className="nl-flow-text">
                Webapp ultra ligera que abre al instante en el navegador del celular sin instalar apps. Dinámica visual de destreza con los ingredientes y el pan francés de La Nueva Laguna.
              </p>
            </div>

            <div className="nl-flow-card">
              <span className="nl-flow-step-num">PASO 03</span>
              <div className="nl-flow-icon"><i className="fa-brands fa-whatsapp"></i></div>
              <h4 className="nl-flow-title">Validación por WhatsApp</h4>
              <p className="nl-flow-text">
                Para desbloquear el beneficio de cortesía y mostrarlo en caja o con el mesero, el cliente ingresa su número verificado de WhatsApp.
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
              <h4 className="nl-flow-title">Llenar Mesas Lun-Mié</h4>
              <p className="nl-flow-text">
                Difusiones automatizadas por WhatsApp los días de menor afluencia con promociones especiales para activar mesas entre semana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILAR 3: VIDEOS PARA PANTALLAS DE COMEDOR */}
      <section className="nl-section">
        <div className="nl-wrapper">
          <span className="nl-pillar-badge">PILAR 03</span>
          <div className="nl-section-tag">
            <i className="fa fa-tv"></i>
            Circuito Audiovisual en Comedor (16:9 HD)
          </div>
          <h2 className="nl-section-title">
            Pantallas de Comedor: Antojo de Plancha y Orgullo Lagunero.
          </h2>
          <p className="nl-section-sub">
            Aproveche las pantallas de televisión de su comedor para algo mucho más rentable que canales de cable genéricos:
            un circuito continuo de video en alta definición que combina tomas irresistibles de comida con cápsulas entretenidas
            y educativas sobre la Comarca Lagunera y el auténtico pan francés.
          </p>

          <div className="nl-screens-box">
            <div className="nl-screen-mockup">
              <img
                src="/assets/nueva-laguna/hero-torta-lagunera.jpg"
                alt="Demostración Pantalla Comedor 16:9"
              />
              <div className="nl-screen-overlay">
                <div className="nl-screen-badge-top">
                  <i className="fa fa-play-circle"></i> LOOP DE ALTA DEFINICIÓN EN COMEDOR
                </div>

                <div className="nl-screen-caption">
                  <h4>¿Sabías por qué el Pan Francés solo sabe así en La Laguna?</h4>
                  <p>
                    Cápsulas culturales y folclor regional que entretienen a las familias mientras esperan su comida, intercaladas con tomas de carne dorándose al punto exacto.
                  </p>
                </div>

                <div className="nl-screen-qr-corner">
                  <img
                    src="/assets/nueva-laguna/qr-menu-demo.png"
                    alt="QR Pantalla"
                  />
                  <span>Escanea en mesa<br />y juega ahora</span>
                </div>
              </div>
            </div>

            <div className="nl-screens-features-grid">
              <div style={{ background: "#1C1C1C", padding: "1.3rem", borderRadius: "14px", border: "1px solid #333" }}>
                <div style={{ color: "var(--nl-yolk)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  <i className="fa fa-fire"></i>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", color: "#FFF", fontSize: "1.1rem", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                  Antojo Visual Continuo
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#BBB", lineHeight: "1.4" }}>
                  Tomas macro del pan recién horneado, queso asadero fundiéndose y pierna al adobo que incitan a pedir bebidas extras o tortas para llevar.
                </p>
              </div>

              <div style={{ background: "#1C1C1C", padding: "1.3rem", borderRadius: "14px", border: "1px solid #333" }}>
                <div style={{ color: "var(--nl-yolk)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  <i className="fa fa-book-open"></i>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", color: "#FFF", fontSize: "1.1rem", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                  Cápsulas de Tradición Lagunera
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#BBB", lineHeight: "1.4" }}>
                  Historias y datos curiosos de Torreón, Gómez Palacio y Lerdo que despiertan nostalgia y orgullo en los comensales locales.
                </p>
              </div>

              <div style={{ background: "#1C1C1C", padding: "1.3rem", borderRadius: "14px", border: "1px solid #333" }}>
                <div style={{ color: "var(--nl-yolk)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  <i className="fa fa-bullhorn"></i>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", color: "#FFF", fontSize: "1.1rem", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                  Llamados de Acción al QR
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#BBB", lineHeight: "1.4" }}>
                  Recordatorios visuales en pantalla invitando al comensal a escanear el QR de su mesa para participar en el minijuego oficial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILAR 4: SISTEMA INTEGRADO DE LEALTAD */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.35)" }}>
        <div className="nl-wrapper">
          <span className="nl-pillar-badge">PILAR 04</span>
          <div className="nl-section-tag">
            <i className="fa fa-award"></i>
            Retención & Re-compra
          </div>
          <h2 className="nl-section-title">
            Sistema Integrado de Lealtad: Pasaporte Digital de Visitas.
          </h2>
          <p className="nl-section-sub">
            Conectado de forma invisible al minijuego de mesa y a WhatsApp. Cada vez que el comensal juega y visita la sucursal,
            acumula sellos digitales en su teléfono. El sistema le envía recordatorios oportunos para volver a comer entre semana.
          </p>

          <div className="nl-loyalty-box">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--nl-green-deep)", marginBottom: "1rem", textTransform: "uppercase" }}>
                ¿Cómo Funciona el Pasaporte Digital?
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-dark)", lineHeight: "1.6", marginBottom: "1.2rem" }}>
                Sin tarjetas de cartón que se pierden ni aplicaciones pesadas que nadie descarga. Todo corre dentro de WhatsApp y el navegador móvil del cliente:
              </p>

              <div className="nl-feature-bullets">
                <div className="nl-bullet">
                  <i className="fa fa-stamp"></i>
                  <span><strong>Sellos Automáticos por Visita:</strong> Al validar su cortesía del minijuego, suma automáticamente una visita a su récord.</span>
                </div>
                <div className="nl-bullet">
                  <i className="fa fa-gift"></i>
                  <span><strong>Meta de Fidelización Clara:</strong> Por ejemplo: <em>&ldquo;En tu 5ta visita llévate una orden de papas o refresco gratis&rdquo;</em>.</span>
                </div>
                <div className="nl-bullet">
                  <i className="fa fa-clock-rotate-left"></i>
                  <span><strong>Alertas de Reactivación:</strong> Si un cliente regular no ha vuelto en 14 días, el sistema le envía una invitación con cortesía válida de lunes a miércoles.</span>
                </div>
                <div className="nl-bullet">
                  <i className="fa fa-user-shield"></i>
                  <span><strong>Panel de Control para el Dueño:</strong> Visualice en tiempo real cuántos clientes únicos han registrado su visita y la frecuencia de consumo.</span>
                </div>
              </div>
            </div>

            <div style={{
              background: "var(--nl-green)",
              color: "#FFF",
              borderRadius: "20px",
              padding: "2.2rem",
              border: "2px solid var(--nl-yolk)",
              boxShadow: "0 15px 35px rgba(24, 61, 47, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--nl-yolk)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                PASAPORTE DIGITAL LAGUNERO
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#FFF", marginBottom: "1.5rem", textTransform: "uppercase" }}>
                La Nueva Laguna • Comensal Frecuente
              </h4>

              <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "1.5rem 0", flexWrap: "wrap" }}>
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--nl-yolk)",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: 900,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                  }}>
                    <i className="fa fa-check"></i>
                  </div>
                ))}
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "2px dashed var(--nl-french-bread)",
                  color: "var(--nl-french-bread)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem"
                }}>
                  <i className="fa fa-gift"></i>
                </div>
              </div>

              <div style={{ fontSize: "0.9rem", color: "var(--nl-french-bread)", fontWeight: 700 }}>
                ¡Estás a 1 visita de tu cortesía especial!
              </div>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", marginTop: "0.5rem" }}>
                Mensaje automático enviado al WhatsApp del comensal 7 días después de su última comida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULO PILOTO OPERATIVO: CHECKLIST CON FOTOS */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.15)" }}>
        <div className="nl-wrapper">
          <span className="nl-pillar-badge" style={{ background: "var(--nl-green)", color: "#FFF" }}>
            BONUS DE INNOVACIÓN OPERATIVA
          </span>
          <div className="nl-section-tag">
            <i className="fa fa-clipboard-check"></i>
            Control Interno de Sucursal
          </div>
          <h2 className="nl-section-title">
            Módulo Piloto: Checklist de Empleados con Evidencia Fotográfica.
          </h2>
          <p className="nl-section-sub">
            Garantice que la limpieza, el orden, la música y el montaje de salón se cumplan en cada turno.
            Los colaboradores verifican sus tareas desde su celular y suben una fotografía obligatoria antes de liberar el turno.
          </p>

          <div className="nl-checklist-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--nl-tomato)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  SIMULADOR DEL SISTEMA INTERNO
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--nl-green)", textTransform: "uppercase", margin: "0.2rem 0" }}>
                  Turno Activo • Tortería La Nueva Laguna
                </h3>
              </div>

              {/* TABS DE INSPECCIÓN */}
              <div className="nl-checklist-tabs" style={{ marginBottom: 0 }}>
                <button
                  onClick={() => setChecklistTab("sala")}
                  className={`nl-checklist-tab-btn ${checklistTab === "sala" ? "active" : ""}`}
                >
                  <i className="fa fa-utensils"></i> Inspección de Sala & Ambiente
                </button>
                <button
                  onClick={() => setChecklistTab("cierre")}
                  className={`nl-checklist-tab-btn ${checklistTab === "cierre" ? "active" : ""}`}
                >
                  <i className="fa fa-broom"></i> Inspección de Cierre & Limpieza Profunda
                </button>
              </div>
            </div>

            {/* CONTENIDO SEGÚN TAB */}
            {checklistTab === "sala" ? (
              <div className="nl-checklist-items-grid">
                {/* ITEM 1 */}
                <div className={`nl-checklist-item-card ${checklistItems.sala_musica ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("sala_musica")}
                    className={`nl-check-checkbox ${checklistItems.sala_musica ? "checked" : ""}`}
                  >
                    {checklistItems.sala_musica && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      1. Música Ambiental & Pantallas 16:9
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Playlist oficial en Spotify sonando a volumen óptimo y loop de antojo en pantallas activo.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("sala_musica")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.sala_musica ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.sala_musica ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.sala_musica ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.sala_musica ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.sala_musica ? "Evidencia: Foto_Pantallas.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* ITEM 2 */}
                <div className={`nl-checklist-item-card ${checklistItems.sala_pantallas ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("sala_pantallas")}
                    className={`nl-check-checkbox ${checklistItems.sala_pantallas ? "checked" : ""}`}
                  >
                    {checklistItems.sala_pantallas && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      2. Mesas Desinfectadas & Acrílicos QR
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Mesas impecables, portamenús con código QR limpios y servilleteros reabastecidos.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("sala_pantallas")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.sala_pantallas ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.sala_pantallas ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.sala_pantallas ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.sala_pantallas ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.sala_pantallas ? "Evidencia: Foto_Mesas_Sala.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* ITEM 3 */}
                <div className={`nl-checklist-item-card ${checklistItems.sala_mesas ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("sala_mesas")}
                    className={`nl-check-checkbox ${checklistItems.sala_mesas ? "checked" : ""}`}
                  >
                    {checklistItems.sala_mesas && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      3. Estación de Salsas & Barra
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Salseros llenos, vitrina pulida y orden de cubiertos y condimentos listos para comensales.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("sala_mesas")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.sala_mesas ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.sala_mesas ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.sala_mesas ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.sala_mesas ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.sala_mesas ? "Evidencia: Foto_Barra_Salsas.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* ITEM 4 */}
                <div className={`nl-checklist-item-card ${checklistItems.sala_salsas ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("sala_salsas")}
                    className={`nl-check-checkbox ${checklistItems.sala_salsas ? "checked" : ""}`}
                  >
                    {checklistItems.sala_salsas && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      4. Sanitarios & Entorno Limpio
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Baños verificados con insumos completos (jabón, papel), piso seco y aromas neutros/frescos.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("sala_salsas")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.sala_salsas ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.sala_salsas ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.sala_salsas ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.sala_salsas ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.sala_salsas ? "Evidencia: Foto_Banos_Ok.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="nl-checklist-items-grid">
                {/* CIERRE ITEM 1 */}
                <div className={`nl-checklist-item-card ${checklistItems.cierre_salsas ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("cierre_salsas")}
                    className={`nl-check-checkbox ${checklistItems.cierre_salsas ? "checked" : ""}`}
                  >
                    {checklistItems.cierre_salsas && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      1. Resguardo de Insumos & Refrigeración
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Salsas y carnes resguardadas en refrigerador con temperatura adecuada y tapado hermético.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("cierre_salsas")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.cierre_salsas ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.cierre_salsas ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.cierre_salsas ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.cierre_salsas ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.cierre_salsas ? "Evidencia: Refrigerador_Cierre.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* CIERRE ITEM 2 */}
                <div className={`nl-checklist-item-card ${checklistItems.cierre_plancha ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("cierre_plancha")}
                    className={`nl-check-checkbox ${checklistItems.cierre_plancha ? "checked" : ""}`}
                  >
                    {checklistItems.cierre_plancha && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      2. Plancha y Campana Desengrasadas
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Plancha pulida, campana limpia sin residuos grasos y gas cerrado bajo protocolo de seguridad.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("cierre_plancha")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.cierre_plancha ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.cierre_plancha ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.cierre_plancha ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.cierre_plancha ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.cierre_plancha ? "Evidencia: Plancha_Limpia.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* CIERRE ITEM 3 */}
                <div className={`nl-checklist-item-card ${checklistItems.cierre_banos ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("cierre_banos")}
                    className={`nl-check-checkbox ${checklistItems.cierre_banos ? "checked" : ""}`}
                  >
                    {checklistItems.cierre_banos && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      3. Sanitización de Baños & Basura Vaciada
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Botes de basura vaciados con bolsa nueva, sanitarios desinfectados y piso trapeado con cloro.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("cierre_banos")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.cierre_banos ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.cierre_banos ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.cierre_banos ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.cierre_banos ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.cierre_banos ? "Evidencia: Banos_Cierre.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>

                {/* CIERRE ITEM 4 */}
                <div className={`nl-checklist-item-card ${checklistItems.cierre_pisos ? "completed" : ""}`}>
                  <div
                    onClick={() => toggleChecklistItem("cierre_pisos")}
                    className={`nl-check-checkbox ${checklistItems.cierre_pisos ? "checked" : ""}`}
                  >
                    {checklistItems.cierre_pisos && <i className="fa fa-check" style={{ fontSize: "0.75rem" }}></i>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--nl-green-deep)", fontSize: "0.95rem" }}>
                      4. Salón Trapeado & Sillas Arriba
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0" }}>
                      Piso de salón barrido y trapeado, pantallas y luces apagadas, y candados de acceso asegurados.
                    </p>
                    <button
                      onClick={() => togglePhotoUploaded("cierre_pisos")}
                      className="nl-evidence-photo-btn"
                      style={{
                        background: photoUploaded.cierre_pisos ? "rgba(24, 61, 47, 0.1)" : "var(--nl-green)",
                        color: photoUploaded.cierre_pisos ? "var(--nl-green)" : "#FFF",
                        border: photoUploaded.cierre_pisos ? "1px solid var(--nl-green)" : "none"
                      }}
                    >
                      <i className={`fa ${photoUploaded.cierre_pisos ? "fa-camera-rotate" : "fa-camera"}`}></i>
                      {photoUploaded.cierre_pisos ? "Evidencia: Salon_Cierre.jpg ✓" : "Subir Foto Obligatoria"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL DE CONTROL PARA EL DUEÑO */}
            <div style={{
              marginTop: "2rem",
              background: "var(--nl-green)",
              color: "#FFF",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.2rem"
            }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--nl-yolk)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                  TRANQUILIDAD PARA EL PROPIETARIO
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, marginTop: "0.2rem" }}>
                  Notificación Automática al WhatsApp del Dueño con Fotos y Hora de Cumplimiento
                </div>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", margin: "0.3rem 0 0 0" }}>
                  Usted sabe si su sucursal abrió a tiempo, con música, limpia y con las pantallas activas, sin necesidad de estar físicamente todo el día.
                </p>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.12)",
                padding: "0.8rem 1.4rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.75rem", color: "var(--nl-yolk)", fontWeight: 700 }}>ESTATUS DE TURNO</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#FFF" }}>REPORTADO AL 100%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PROPUESTA ECONÓMICA ($6,000 MXN / MES) */}
      <section id="sec-inversion" className="nl-section">
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-calculator"></i>
            Propuesta Económica Consolidada
          </div>
          <h2 className="nl-section-title">
            Inversión Mensual Todo-Incluido.
          </h2>
          <p className="nl-section-sub">
            Sin paquetes confusos ni letras chiquitas. Un solo paquete integral que equipa su comedor con tecnología de punta, experiencia sensorial y retención de clientes por una tarifa plana mensual.
          </p>

          <div className="nl-single-plan-card nl-plan-card">
            <span className="nl-single-plan-badge">PAQUETE COMPLETO</span>

            <div className="nl-single-plan-grid">
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--nl-green)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Ecosistema de Experiencia en Sala, Comedor & Lealtad
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                  Ambientación de salón, digitalización en mesa, entretenimiento en pantallas, control operativo para el personal y captación continua de comensales.
                </p>

                <div className="nl-feature-bullets">
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>1. Menú Digital Vertical en Mesa:</strong> Acceso por QR, fotos de alta definición en pan francés y actualización ilimitada de platillos/precios.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>2. Minijuego Interactivo QR:</strong> Dinámica ágil para mesa que capta y valida el número de WhatsApp de los comensales.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>3. Videos para Pantallas de Comedor:</strong> Circuito en loop 16:9 HD con antojo de carnes y cápsulas educativas/culturales de La Laguna.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>4. Sistema Integrado de Lealtad:</strong> Pasaporte de visitas en WhatsApp y panel privado para que el dueño consulte su base de clientes.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Curaduría Musical & Guía de Mesa:</strong> Playlist oficial en Spotify para el comedor + Guía de Estándares de Mesa y Barra para montaje visual.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Módulo Piloto de Checklist con Fotos:</strong> Webapp interna para que el personal registre tareas de sala y cierre con evidencia fotográfica.</span>
                  </div>
                  <div className="nl-bullet">
                    <i className="fa fa-check-circle"></i>
                    <span><strong>Soporte, Hosting y Servidores Incluidos:</strong> Mantenimiento técnico continuo sin costos sorpresa.</span>
                  </div>
                </div>
              </div>

              {/* COLUMNA PRECIO */}
              <div className="nl-single-price-box">
                <div style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--nl-french-bread)", fontWeight: 800 }}>
                  INVERSIÓN MENSUAL
                </div>

                <div className="nl-single-price-amount">
                  $6,000 <span style={{ fontSize: "1.2rem", color: "var(--nl-yolk)" }}>MXN</span>
                </div>

                <div className="nl-single-price-iva">
                  + IVA 16% ($960 MXN) = $6,960 MXN facturados de agencia
                </div>

                <div className="nl-single-daily-rate">
                  <i className="fa fa-calendar-day"></i> Equivale a solo $200 MXN al día
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--nl-french-bread)", lineHeight: "1.4", marginBottom: "1.5rem" }}>
                  Menos de lo que cuesta el consumo de una sola mesa familiar al día para tener su comedor 100% ambientado y digitalizado.
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="nl-btn nl-btn-yolk"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.95rem" }}
                >
                  <i className="fa fa-calendar-check"></i> Agendar Arranque
                </button>

                <div style={{ marginTop: "0.8rem" }}>
                  <a
                    href={`https://wa.me/526564614059?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nl-whatsapp-link"
                    style={{ color: "#FFF", fontSize: "0.88rem", textDecoration: "underline" }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Preguntar dudas por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: "2.2rem",
              paddingTop: "1.4rem",
              borderTop: "1.5px dashed var(--nl-french-bread-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                <strong>Valor de mercado por separado:</strong> Menú QR ($2,000) + Minijuego ($2,500) + Videos Pantallas ($3,500) + CRM Lealtad ($2,500) = <s>$10,500 MXN/mes</s>.
              </div>
              <div style={{ color: "var(--nl-green)", fontWeight: 800, fontSize: "0.95rem" }}>
                <i className="fa fa-shield-check"></i> Ahorro del 43% en Paquete Integrado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="nl-section" style={{ background: "rgba(243, 232, 204, 0.35)" }}>
        <div className="nl-wrapper">
          <div className="nl-section-tag">
            <i className="fa fa-calendar-days"></i>
            Plan de Trabajo
          </div>
          <h2 className="nl-section-title">
            Implementación en 2 Fases (14 Días Hábiles).
          </h2>
          <p className="nl-section-sub">
            Desplegamos la experiencia sensorial, operativa y digital en su sucursal de manera ordenada y sin interrumpir el servicio.
          </p>

          <div className="nl-roadmap-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div style={{
              background: "#FFF",
              border: "1.5px solid var(--nl-french-bread-border)",
              borderRadius: "18px",
              padding: "2rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: "0.78rem", color: "var(--nl-green)", fontWeight: 800 }}>
                FASE 01 • DÍAS 1 A 7
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--nl-green-deep)", margin: "0.5rem 0", textTransform: "uppercase" }}>
                Experiencia en Sala & Operación Base
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Levantamiento fotográfico en pan francés artesanal. Configuración del Menú Digital Vertical en mesa, entrega de la Playlist Oficial en Spotify para comedor, Guía de Estándares de Mesa y activación del Checklist Operativo para el personal.
              </p>
            </div>

            <div style={{
              background: "#FFF",
              border: "1.5px solid var(--nl-french-bread-border)",
              borderRadius: "18px",
              padding: "2rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            }}>
              <div style={{ fontSize: "0.78rem", color: "var(--nl-green)", fontWeight: 800 }}>
                FASE 02 • DÍAS 8 A 14
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--nl-green-deep)", margin: "0.5rem 0", textTransform: "uppercase" }}>
                Audiovisual, Interacción & Lealtad
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Producción del circuito de videos 16:9 HD para pantallas de comedor (antojo en plancha + cápsulas culturales laguneras). Lanzamiento del minijuego interactivo QR en mesa y activación del Pasaporte Digital de Lealtad en WhatsApp con panel para el dueño.
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
              Digitalicemos el Comedor de La Nueva Laguna.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--nl-french-bread)", maxWidth: "680px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
              Revisemos los detalles técnicos de sus pantallas y códigos QR en una breve llamada o reunión en sucursal.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="nl-btn nl-btn-yolk"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1.6rem" }}
              >
                <i className="fa fa-calendar-check"></i> Agendar Junta de Arranque
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
                  Paquete: <strong>Ecosistema Tecnológico de Comedor & Lealtad ($6,000 MXN + IVA / mes)</strong>.
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
