"use client";

import React, { useEffect } from "react";

export default function ToucheMotorsClient() {
  useEffect(() => {
    // 1. Real-time Telegram Open Alert with 3-Layer Device Exclusion
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
          toast.style.cssText = "position:fixed;top:20px;right:20px;z-index:99999;background:rgba(8,11,17,0.95);border:1px solid rgba(255,184,0,0.6);color:#fff;padding:10px 18px;border-radius:12px;font-family:sans-serif;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,0.8);backdrop-filter:blur(10px);transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;display:flex;align-items:center;gap:8px;";
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
          showToast("🛡️ <strong>Modo Administrador Activo:</strong> Alertas en Telegram silenciadas");
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
              clientName: "Touché Motors Cd. Juárez",
              path: window.location.pathname,
              userAgent: navigator.userAgent
            })
          }).catch(() => {});
        }
      }
    } catch (err) {}

    // 2. Chat Simulator Logic
    const chatResponses: Record<string, string> = {
      opt1: "Excelente elección. Para la RAM 1500 contamos con planes desde 20% de enganche ($180,000 MXN aprox.) y plazos hasta 60 meses. ¿Tienes algún vehículo para toma a cuenta o deseas agendar tu prueba de manejo hoy mismo?",
      opt2: "¡Con gusto! Tenemos unidades Grand Cherokee y Wrangler listas en Paseo Triunfo 6080. Tenemos espacio disponible hoy a las 4:30 PM o mañana sábado a las 11:00 AM. ¿Cuál te acomoda mejor?",
      opt3: "¡Tomamos tu vehículo a cuenta con avalúo certificado! Por favor compártenos Marca, Modelo, Año y Kilometraje aproximado para que nuestro valuador te prepare una propuesta preliminar antes de que llegues."
    };

    (window as any).sendChatOption = function(optId: string, userText: string) {
      const stream = document.getElementById('chat-stream');
      if (!stream) return;
      
      const userBubble = document.createElement('div');
      userBubble.className = 'c-bubble c-user';
      userBubble.innerText = userText;
      stream.appendChild(userBubble);
      stream.scrollTop = stream.scrollHeight;

      setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'c-bubble c-bot';
        botBubble.innerText = chatResponses[optId] || "En un momento un asesor de Touché Motors se pondrá en contacto.";
        stream.appendChild(botBubble);
        stream.scrollTop = stream.scrollHeight;
      }, 600);
    };

    // 3. Before/After Slider Touch & Mouse Logic
    const baContainer = document.getElementById('ba-container');
    if (baContainer) {
      const handleSlide = (clientX: number) => {
        const rect = baContainer.getBoundingClientRect();
        let relX = clientX - rect.left;
        if (relX < 0) relX = 0;
        if (relX > rect.width) relX = rect.width;
        const percent = (relX / rect.width) * 100;
        const afterWrap = document.getElementById('ba-after-wrap');
        if (afterWrap) afterWrap.style.width = percent + '%';
      };

      baContainer.addEventListener('mousemove', (e) => handleSlide(e.clientX));
      baContainer.addEventListener('touchmove', (e) => {
        handleSlide(e.touches[0].clientX);
      }, { passive: true });
      baContainer.addEventListener('touchstart', (e) => {
        handleSlide(e.touches[0].clientX);
      }, { passive: true });
    }

    // 4. Scope Calculator Logic
    let selectedPkg = 'b';
    let selectedAddons = {
      bot_wa: false,
      bot_call: false,
      suite_crm: false,
      landing: false
    };

    function recalculate() {
      const basePrice = selectedPkg === 'a' ? 20000 : 10000;
      const pkgName = selectedPkg === 'a' ? 'Paquete A ($20,000)' : 'Paquete B ($10,000)';
      
      const elPkgName = document.getElementById('sum-pkg-name');
      if (elPkgName) elPkgName.innerText = pkgName;

      let addonsMonthly = 0;
      if (selectedAddons.bot_wa && selectedAddons.bot_call && selectedAddons.suite_crm) {
        addonsMonthly = 8500;
      } else {
        if (selectedAddons.bot_wa) addonsMonthly += 4000;
        if (selectedAddons.bot_call) addonsMonthly += 4500;
        if (selectedAddons.suite_crm) addonsMonthly += 3500;
      }

      const totalMonthly = basePrice + addonsMonthly;
      const totalMonthlyWithIva = Math.round(totalMonthly * 1.16);

      const elAddonsM = document.getElementById('sum-addons-monthly');
      if (elAddonsM) elAddonsM.innerText = '$' + addonsMonthly.toLocaleString('es-MX') + ' MXN';

      const elSubM = document.getElementById('sum-subtotal-monthly');
      if (elSubM) elSubM.innerText = '$' + totalMonthly.toLocaleString('es-MX') + ' MXN';

      const elTotM = document.getElementById('sum-total-monthly');
      if (elTotM) elTotM.innerHTML = '$' + totalMonthly.toLocaleString('es-MX') + ' <span style="font-size: 0.9rem; color: var(--amber-racing);">MXN / mes</span>';

      const elIvaM = document.getElementById('sum-iva-monthly');
      if (elIvaM) elIvaM.innerText = '+ IVA ($' + totalMonthlyWithIva.toLocaleString('es-MX') + ' Total)';

      const onetimeBlock = document.getElementById('block-onetime-summary');
      if (onetimeBlock) {
        onetimeBlock.style.display = selectedAddons.landing ? 'block' : 'none';
      }

      const ctaBtn = document.getElementById('btn-cta-dynamic');
      if (ctaBtn) {
        const pkgTag = selectedPkg === 'a' ? 'Paquete A' : 'Paquete B';
        ctaBtn.innerHTML = '<i class="fa fa-calendar-check"></i> Agendar Junta para ' + pkgTag + ' ($' + totalMonthly.toLocaleString('es-MX') + ' + IVA)';
      }
    }

    (window as any).selectPackageInView = function(pkgId: string) {
      (window as any).togglePackage(pkgId);
      const calcSec = document.getElementById('sec-calculator');
      if (calcSec) calcSec.scrollIntoView({ behavior: 'smooth' });
    };

    (window as any).togglePackage = function(pkgId: string) {
      selectedPkg = pkgId;
      const optB = document.getElementById('opt-pkg-b');
      const optA = document.getElementById('opt-pkg-a');
      if (optB) optB.classList.toggle('selected', pkgId === 'b');
      if (optA) optA.classList.toggle('selected', pkgId === 'a');

      const cardB = document.getElementById('card-pkg-b');
      const cardA = document.getElementById('card-pkg-a');
      if (cardB) cardB.classList.toggle('featured', pkgId === 'b');
      if (cardA) cardA.classList.toggle('featured', pkgId === 'a');

      recalculate();
    };

    (window as any).toggleAddon = function(addonId: 'bot_wa' | 'bot_call' | 'suite_crm' | 'landing') {
      selectedAddons[addonId] = !selectedAddons[addonId];

      const comboSelected = Boolean(selectedAddons.bot_wa && selectedAddons.bot_call && selectedAddons.suite_crm);
      const checkCombo = document.getElementById('check-combo');
      const optCombo = document.getElementById('opt-addon-combo');
      if (checkCombo && checkCombo.firstElementChild) {
        (checkCombo.firstElementChild as HTMLElement).style.display = comboSelected ? 'block' : 'none';
      }
      if (optCombo) optCombo.classList.toggle('selected', comboSelected);

      const checkEl = document.getElementById('check-' + addonId);
      if (checkEl && checkEl.firstElementChild) {
        (checkEl.firstElementChild as HTMLElement).style.display = selectedAddons[addonId] ? 'block' : 'none';
      }

      const optCardId = 'opt-addon-' + (addonId === 'landing' ? 'landing' : (addonId === 'suite_crm' ? 'suite-crm' : (addonId === 'bot_call' ? 'bot-call' : 'bot-wa')));
      const optCard = document.getElementById(optCardId);
      if (optCard) optCard.classList.toggle('selected', selectedAddons[addonId]);

      recalculate();
    };

    (window as any).toggleComboSuite = function() {
      const willSelect = !(selectedAddons.bot_wa && selectedAddons.bot_call && selectedAddons.suite_crm);
      selectedAddons.bot_wa = willSelect;
      selectedAddons.bot_call = willSelect;
      selectedAddons.suite_crm = willSelect;

      ['bot_wa', 'bot_call', 'suite_crm'].forEach(id => {
        const ch = document.getElementById('check-' + id);
        if (ch && ch.firstElementChild) (ch.firstElementChild as HTMLElement).style.display = willSelect ? 'block' : 'none';
        const cardId = 'opt-addon-' + (id === 'suite_crm' ? 'suite-crm' : (id === 'bot_call' ? 'bot-call' : 'bot-wa'));
        const el = document.getElementById(cardId);
        if (el) el.classList.toggle('selected', willSelect);
      });

      const checkCombo = document.getElementById('check-combo');
      if (checkCombo && checkCombo.firstElementChild) {
        (checkCombo.firstElementChild as HTMLElement).style.display = willSelect ? 'block' : 'none';
      }
      const optCombo = document.getElementById('opt-addon-combo');
      if (optCombo) optCombo.classList.toggle('selected', willSelect);

      recalculate();
    };

    // 5. Meeting Modal Logic
    (window as any).openMeetingModal = function() {
      const modal = document.getElementById('meeting-modal');
      if (modal) modal.style.display = 'flex';
      
      const dateInput = document.getElementById('m-date') as HTMLInputElement | null;
      if (dateInput && !dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
        if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
    };

    (window as any).closeMeetingModal = function() {
      const modal = document.getElementById('meeting-modal');
      if (modal) modal.style.display = 'none';
    };

    (window as any).selectTimeSlot = function(btn: HTMLElement, time: string) {
      document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const timeInput = document.getElementById('m-time') as HTMLInputElement | null;
      if (timeInput) timeInput.value = time;
    };

    (window as any).handleMeetingSubmit = async function(e: React.FormEvent) {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-meeting') as HTMLButtonElement | null;
      if (!btn) return;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Registrando...';
      btn.disabled = true;

      const dateVal = (document.getElementById('m-date') as HTMLInputElement)?.value || '';
      const timeVal = (document.getElementById('m-time') as HTMLInputElement)?.value || '';
      const nameVal = (document.getElementById('m-name') as HTMLInputElement)?.value || '';
      const phoneVal = (document.getElementById('m-phone') as HTMLInputElement)?.value || '';

      const selectedModules = [];
      selectedModules.push(selectedPkg === 'a' ? 'Paquete A ($20,000 + IVA / mes)' : 'Paquete B ($10,000 + IVA / mes)');
      if (selectedAddons.bot_wa) selectedModules.push('Bot Cotizador por WhatsApp ($4,000 + IVA / mes)');
      if (selectedAddons.bot_call) selectedModules.push('Bot para Llamadas con IA ($4,500 + IVA / mes)');
      if (selectedAddons.suite_crm) selectedModules.push('CRM Automotriz ($3,500 + IVA / mes)');
      if (selectedAddons.landing) selectedModules.push('Plataforma Web Touché ($40,000 + IVA pago único)');

      const payload = {
        clientName: 'Touché Motors Cd. Juárez',
        clientSlug: 'touche-motors',
        attendeeName: nameVal,
        phone: phoneVal,
        date: dateVal,
        time: timeVal,
        selectedModules: selectedModules,
        url: window.location.href,
      };

      try {
        await fetch('/api/schedule-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {}

      btn.innerHTML = originalText;
      btn.disabled = false;

      const sDate = document.getElementById('succ-date');
      const sTime = document.getElementById('succ-time');
      const sPhone = document.getElementById('succ-phone');
      if (sDate) sDate.innerText = dateVal;
      if (sTime) sTime.innerText = timeVal;
      if (sPhone) sPhone.innerText = phoneVal;

      const fState = document.getElementById('meeting-form-state');
      const sState = document.getElementById('meeting-success-state');
      if (fState) fState.style.display = 'none';
      if (sState) sState.style.display = 'block';
    };

  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
            --bg-carbon: #080B11;
            --bg-card: rgba(14, 19, 28, 0.92);
            --bg-card-hover: rgba(20, 28, 42, 0.98);
            --border-carbon: rgba(255, 184, 0, 0.22);
            --border-glow: rgba(255, 184, 0, 0.5);
            
            --amber-racing: #FFB800;
            --amber-glow: rgba(255, 184, 0, 0.28);
            --orange-flame: #FF5500;
            --cyan-velocity: #00E5FF;
            --cyan-glow: rgba(0, 229, 255, 0.25);
            --emerald-online: #10B981;
            
            --text-white: #FFFFFF;
            --text-body: #94A3B8;
            --text-muted: #64748B;
            --text-steel: #CBD5E1;
            
            --font-display: 'Space Grotesk', sans-serif;
            --font-body: 'Plus Jakarta Sans', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
        }

        html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100%;
        }

        body {
            background-color: var(--bg-carbon);
            color: var(--text-body);
            font-family: var(--font-body);
            line-height: 1.65;
            position: relative;
            min-height: 100vh;
        }

        #ambient-glow {
            position: fixed;
            top: 0;
            left: 0;
            width: 700px;
            height: 700px;
            background: radial-gradient(circle, rgba(255, 184, 0, 0.08) 0%, rgba(0, 229, 255, 0.03) 40%, rgba(8, 11, 17, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 0;
        }

        .bg-carbon-mesh {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0),
                linear-gradient(to right, rgba(255,184,0,0.012) 1px, transparent 1px);
            background-size: 32px 32px, 64px 64px;
            pointer-events: none;
            z-index: 0;
        }

        .wrapper {
            position: relative;
            z-index: 1;
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 2rem;
            width: 100%;
            box-sizing: border-box;
        }

        /* Header Navigation */
        header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(8, 11, 17, 0.94);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 184, 0, 0.18);
            padding: 1.1rem 0;
            width: 100%;
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .brand-cluster {
            display: flex;
            align-items: center;
            gap: 1.25rem;
        }

        .brand-logo-img {
            height: 24px;
            width: auto;
            object-fit: contain;
        }

        .brand-divider {
            width: 1px;
            height: 18px;
            background: rgba(255,255,255,0.18);
        }

        .client-header-logo {
            height: 20px;
            width: auto;
            object-fit: contain;
        }

        .target-badge {
            font-size: 0.72rem;
            font-family: var(--font-mono);
            background: rgba(255, 184, 0, 0.12);
            color: var(--amber-racing);
            padding: 4px 12px;
            border-radius: 6px;
            border: 1px solid rgba(255, 184, 0, 0.35);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.3rem;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 700;
            font-family: var(--font-display);
            text-decoration: none;
            cursor: pointer;
            transition: all 0.25s ease;
            border: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--amber-racing), #E69D00);
            color: #080B11;
            box-shadow: 0 4px 18px rgba(255, 184, 0, 0.35);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(255, 184, 0, 0.55);
            background: #FFC42B;
        }

        .btn-outline {
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-white);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--amber-racing);
            color: #fff;
        }

        /* Section Global */
        section {
            padding: 4.5rem 0;
            position: relative;
        }

        .section-tag {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--amber-racing);
            text-transform: uppercase;
            letter-spacing: 2.5px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.8rem;
            font-weight: 700;
        }

        .section-title {
            font-family: var(--font-display);
            font-size: 2.6rem;
            font-weight: 900;
            color: var(--text-white);
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin-bottom: 1rem;
        }

        .section-subtitle {
            font-size: 1.05rem;
            color: var(--text-body);
            max-width: 820px;
            line-height: 1.65;
        }

        /* HERO SECTION */
        .hero {
            padding: 2.5rem 0 2.5rem 0;
            text-align: center;
            position: relative;
        }

        .hero-banner-container {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid var(--border-carbon);
            padding: 4.5rem 2.2rem 3.5rem 2.2rem;
            background: #0D111A;
            box-shadow: 0 25px 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(255, 184, 0, 0.06);
        }

        .hero-bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.78;
            filter: contrast(1.15) brightness(0.9);
            pointer-events: none;
            z-index: 0;
        }

        .hero-gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(8,11,17,0.3) 0%, rgba(8,11,17,0.75) 100%), linear-gradient(180deg, rgba(8,11,17,0.2) 0%, rgba(8,11,17,0.88) 100%);
            z-index: 1;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(255, 184, 0, 0.18);
            border: 1px solid rgba(255, 184, 0, 0.45);
            backdrop-filter: blur(12px);
            padding: 0.45rem 1.4rem;
            border-radius: 50px;
            margin-bottom: 1.8rem;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--amber-racing);
            font-family: var(--font-mono);
            letter-spacing: 0.5px;
        }

        .hero-pill .dot {
            width: 8px;
            height: 8px;
            background: var(--emerald-online);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--emerald-online);
        }

        .hero h1 {
            font-family: var(--font-display);
            font-size: 3.4rem;
            font-weight: 900;
            color: var(--text-white);
            line-height: 1.12;
            letter-spacing: -1px;
            max-width: 1150px;
            margin: 0 auto 1.6rem auto;
            text-transform: uppercase;
            text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }

        .hero h1 span.gradient-text {
            background: linear-gradient(135deg, #FFFFFF 20%, var(--amber-racing) 70%, var(--orange-flame) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-manifesto {
            font-size: 1.15rem;
            color: var(--text-steel);
            max-width: 920px;
            margin: 0 auto 2.4rem auto;
            line-height: 1.8;
            text-shadow: 0 2px 10px rgba(0,0,0,0.7);
        }

        .hero-manifesto strong { color: #fff; }

        /* DOMINANT STATS BAR (APOLOGRAMA EFFICIENCY) */
        .hero-stats-container {
            background: rgba(14, 19, 28, 0.94);
            backdrop-filter: blur(25px);
            border: 1px solid var(--border-carbon);
            border-radius: 18px;
            margin-top: 2rem;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,0.7);
        }

        .stats-box-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1.8rem;
            background: rgba(255, 184, 0, 0.08);
            border-bottom: 1px solid rgba(255, 184, 0, 0.18);
            font-family: var(--font-mono);
            font-size: 0.76rem;
            color: var(--amber-racing);
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .stats-box-source strong {
            color: #fff;
            letter-spacing: 0.8px;
        }

        .hero-stats-intro {
            padding: 1rem 1.8rem 0 1.8rem;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .hero-stats-intro p {
            font-size: 0.92rem;
            color: #CBD5E1;
            line-height: 1.55;
            padding-bottom: 0.9rem;
        }

        .hero-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.2rem;
            padding: 1.6rem 1.5rem;
        }

        .stat-card {
            text-align: center;
            position: relative;
        }

        .stat-card:not(:last-child)::after {
            content: '';
            position: absolute;
            right: -0.75rem;
            top: 15%;
            height: 70%;
            width: 1px;
            background: rgba(255,255,255,0.08);
        }

        .stat-number {
            font-family: var(--font-mono);
            font-size: 3rem;
            font-weight: 800;
            color: #fff;
            line-height: 1;
            margin-bottom: 0.4rem;
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 2px;
        }

        .stat-number .unit {
            font-size: 1.6rem;
            color: var(--amber-racing);
        }

        .stat-label {
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text-steel);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 0.25rem;
            font-family: var(--font-display);
        }

        .stat-sub {
            font-size: 0.72rem;
            color: var(--text-muted);
        }

        /* 3 PROOF-OF-CAPABILITY INTERACTIVE WIDGETS */
        .widgets-showcase-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-top: 3rem;
        }

        .showcase-card {
            background: var(--bg-card);
            border: 1px solid var(--border-carbon);
            border-radius: 18px;
            padding: 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;
        }

        .showcase-card:hover {
            border-color: var(--amber-racing);
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 184, 0, 0.12);
        }

        .showcase-header {
            margin-bottom: 1.2rem;
        }

        .showcase-badge {
            font-size: 0.7rem;
            font-family: var(--font-mono);
            color: var(--amber-racing);
            background: rgba(255, 184, 0, 0.1);
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 0.4rem;
            font-weight: 700;
        }

        .showcase-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 800;
            color: #fff;
        }

        /* Chat Widget Demo */
        .chat-stream-box {
            background: #05070B;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 1rem;
            min-height: 220px;
            max-height: 220px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 1rem;
            font-size: 0.82rem;
        }

        .c-bubble {
            padding: 8px 12px;
            border-radius: 10px;
            max-width: 88%;
            line-height: 1.4;
        }

        .c-bot {
            background: rgba(255, 184, 0, 0.12);
            border: 1px solid rgba(255, 184, 0, 0.3);
            color: #FFF;
            align-self: flex-start;
        }

        .c-user {
            background: rgba(0, 229, 255, 0.15);
            border: 1px solid rgba(0, 229, 255, 0.4);
            color: #00E5FF;
            align-self: flex-end;
        }

        .chat-action-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: var(--text-steel);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.78rem;
            font-family: var(--font-mono);
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
            width: 100%;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .chat-action-btn:hover {
            background: rgba(255, 184, 0, 0.15);
            border-color: var(--amber-racing);
            color: #fff;
        }

        /* Real Map Radar Box */
        .radar-box {
            background: #05070B;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            height: 220px;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .radar-map-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(1.1) brightness(0.85);
            z-index: 0;
        }

        .radar-ring {
            position: absolute;
            width: 110px;
            height: 110px;
            border: 2px dashed rgba(255, 184, 0, 0.7);
            border-radius: 50%;
            animation: radarPulse 2.8s infinite linear;
            z-index: 2;
            pointer-events: none;
        }

        @keyframes radarPulse {
            0% { transform: scale(0.4); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
        }

        .radar-center-pin {
            width: 16px;
            height: 16px;
            background: var(--amber-racing);
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 20px var(--amber-racing);
            z-index: 3;
        }

        .radar-hud-tag {
            position: absolute;
            bottom: 8px;
            left: 8px;
            font-size: 0.68rem;
            font-family: var(--font-mono);
            color: var(--cyan-velocity);
            background: rgba(0,0,0,0.85);
            padding: 4px 8px;
            border-radius: 4px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0, 229, 255, 0.3);
            z-index: 4;
        }

        /* Real Before After Image Slider */
        .ba-container {
            position: relative;
            height: 220px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.12);
            cursor: ew-resize;
            background: #000;
        }

        .ba-slide-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
        }

        .ba-before-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .ba-after-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            overflow: hidden;
            border-right: 2px solid var(--amber-racing);
            z-index: 2;
            box-shadow: 0 0 15px var(--amber-glow);
        }

        .ba-after-wrap .ba-slide-img {
            width: 100%;
            min-width: 320px;
        }

        .ba-tag-badge {
            position: absolute;
            top: 10px;
            font-size: 0.68rem;
            font-family: var(--font-mono);
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 800;
            z-index: 4;
            backdrop-filter: blur(8px);
        }

        .ba-tag-before {
            right: 10px;
            background: rgba(239, 68, 68, 0.85);
            color: #fff;
        }

        .ba-tag-after {
            left: 10px;
            background: rgba(255, 184, 0, 0.9);
            color: #080B11;
        }

        .ba-affordance-hint {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.75);
            color: var(--amber-racing);
            font-family: var(--font-mono);
            font-size: 0.68rem;
            padding: 3px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255, 184, 0, 0.3);
            pointer-events: none;
            z-index: 5;
            animation: pulseHint 2s infinite ease-in-out;
        }

        @keyframes pulseHint {
            0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(0.98); }
            50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
        }

        /* PRICING TIERS SECTION */
        .pricing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 3rem;
        }

        .pricing-card {
            background: var(--bg-card);
            border: 1px solid var(--border-carbon);
            border-radius: 20px;
            padding: 2.6rem;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;
        }

        .pricing-card.featured {
            border-color: var(--amber-racing);
            box-shadow: 0 15px 45px rgba(255, 184, 0, 0.15), inset 0 0 30px rgba(255, 184, 0, 0.04);
            background: linear-gradient(145deg, rgba(20, 28, 42, 0.95), rgba(14, 19, 28, 0.98));
        }

        .pricing-card:hover {
            transform: translateY(-4px);
        }

        .pricing-badge {
            position: absolute;
            top: -13px;
            right: 24px;
            background: linear-gradient(135deg, var(--amber-racing), #E69D00);
            color: #080B11;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            font-weight: 900;
            padding: 4px 14px;
            border-radius: 20px;
            letter-spacing: 0.8px;
        }

        .p-title {
            font-family: var(--font-display);
            font-size: 1.8rem;
            font-weight: 900;
            color: #fff;
            margin-bottom: 0.4rem;
            text-transform: uppercase;
        }

        .p-price-block {
            margin: 1.6rem 0;
            padding: 1.25rem 0;
            border-top: 1px solid rgba(255,255,255,0.08);
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .p-amount {
            font-family: var(--font-mono);
            font-size: 2.8rem;
            font-weight: 900;
            color: #fff;
            line-height: 1;
        }

        .p-currency { font-size: 1.2rem; color: var(--amber-racing); }
        .p-period { font-size: 0.9rem; color: var(--text-muted); }

        .p-iva-tag {
            font-size: 0.86rem;
            color: #FCD34D;
            font-family: var(--font-mono);
            margin-top: 0.4rem;
            font-weight: 600;
        }

        .p-features {
            list-style: none;
            margin: 1.6rem 0;
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }

        .p-features li {
            font-size: 0.92rem;
            color: var(--text-steel);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            line-height: 1.45;
        }

        .p-features li i {
            color: var(--amber-racing);
            font-size: 1rem;
            margin-top: 3px;
            flex-shrink: 0;
        }

        /* TECH ADDONS (FASE 2 DE MADURACIÓN) */
        .addons-section-header {
            margin-top: 4.5rem;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 3rem;
            text-align: center;
        }

        .addons-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-top: 2.5rem;
        }

        .addon-card {
            background: var(--bg-card);
            border: 1px solid var(--border-carbon);
            border-radius: 16px;
            padding: 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;
        }

        .addon-card:hover {
            border-color: var(--amber-racing);
            transform: translateY(-3px);
        }

        .addon-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.8rem;
        }

        .addon-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 800;
            color: #fff;
        }

        .addon-price {
            font-family: var(--font-mono);
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--amber-racing);
            text-align: right;
            line-height: 1.1;
        }

        .addon-price-sub {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        /* CALCULATOR & SCOPE BUILDER */
        .calc-container {
            background: var(--bg-card);
            border: 1px solid var(--border-carbon);
            border-radius: 22px;
            padding: 3rem;
            margin-top: 3.5rem;
        }

        .calc-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 2.5rem;
        }

        .calc-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .calc-opt-group-title {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-steel);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
            margin-bottom: 0.2rem;
        }

        .calc-item {
            background: rgba(255,255,255,0.025);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .calc-item:hover {
            border-color: rgba(255, 184, 0, 0.4);
            background: rgba(255, 184, 0, 0.04);
        }

        .calc-item.selected {
            border-color: var(--amber-racing);
            background: rgba(255, 184, 0, 0.09);
            box-shadow: 0 4px 20px rgba(255, 184, 0, 0.12);
        }

        .calc-item-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .calc-check {
            width: 22px;
            height: 22px;
            border-radius: 6px;
            border: 2px solid var(--amber-racing);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #080B11;
            background: transparent;
            font-size: 0.75rem;
            flex-shrink: 0;
            font-weight: 900;
        }

        .calc-item.selected .calc-check {
            background: var(--amber-racing);
        }

        .calc-item-title {
            font-family: var(--font-display);
            font-size: 1.05rem;
            font-weight: 800;
            color: #fff;
        }

        .calc-item-sub {
            font-size: 0.78rem;
            color: var(--text-muted);
        }

        .calc-item-price {
            font-family: var(--font-mono);
            font-size: 1.05rem;
            font-weight: 800;
            color: #F8FAFC;
            text-align: right;
        }

        .calc-summary-card {
            background: linear-gradient(145deg, #101622, #0A0E17);
            border: 1px solid var(--border-carbon);
            border-radius: 18px;
            padding: 2.2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .summary-title {
            font-family: var(--font-display);
            font-size: 1.4rem;
            font-weight: 900;
            color: #fff;
            margin-bottom: 1.2rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            text-transform: uppercase;
        }

        .summary-block {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 1.1rem;
            margin-bottom: 1rem;
        }

        .summary-block-title {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--amber-racing);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            font-size: 0.86rem;
            color: var(--text-body);
            margin-bottom: 0.35rem;
        }

        .summary-amt-big {
            font-family: var(--font-mono);
            font-size: 1.6rem;
            font-weight: 900;
            color: #fff;
            margin-top: 0.4rem;
        }

        /* MODAL */
        .meeting-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(4, 6, 10, 0.9);
            backdrop-filter: blur(20px);
            z-index: 3000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }

        .meeting-modal-card {
            background: linear-gradient(145deg, #121824, #0A0E17);
            border: 1px solid rgba(255, 184, 0, 0.4);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 184, 0, 0.15);
            border-radius: 20px;
            width: 100%;
            max-width: 640px;
            padding: 2.4rem;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }

        .meeting-modal-close {
            position: absolute;
            top: 18px;
            right: 22px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .meeting-modal-close:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .form-group label {
            font-size: 0.78rem;
            font-weight: 700;
            color: #CBD5E1;
            font-family: var(--font-display);
        }

        .m-input {
            background: rgba(6, 9, 14, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 0.7rem 0.9rem;
            color: #fff;
            font-family: var(--font-body);
            font-size: 0.88rem;
            outline: none;
            width: 100%;
        }

        .m-input:focus {
            border-color: var(--amber-racing);
        }

        .time-slots-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.4rem;
        }

        .time-slot-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 6px;
            color: #CBD5E1;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.5rem 0.2rem;
            cursor: pointer;
            text-align: center;
        }

        .time-slot-btn.active {
            background: var(--amber-racing);
            color: #080B11;
            font-weight: 800;
        }

        /* Footer (100% Apolograma) */
        footer {
            border-top: 1px solid var(--border-carbon);
            padding: 3.5rem 0 2.5rem 0;
            background: #05070B;
            text-align: center;
            width: 100%;
        }

        .footer-brand {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1rem;
        }

        .footer-logo-img {
            height: 20px;
            width: auto;
        }

        .footer-divider {
            color: rgba(255,255,255,0.2);
        }

        .footer-client {
            color: var(--amber-racing);
            font-family: var(--font-display);
            font-weight: 800;
            font-size: 1.05rem;
        }

        .footer-copy {
            font-size: 0.82rem;
            color: var(--text-muted);
            line-height: 1.6;
        }

        /* =========================================================
           RESPONSIVE BREAKPOINTS (TABLET & MOBILE)
           ========================================================= */
        @media (max-width: 992px) {
            .wrapper { padding: 0 1.5rem; }
            .widgets-showcase-grid { grid-template-columns: 1fr; gap: 1.5rem; }
            .pricing-grid { grid-template-columns: 1fr; gap: 1.8rem; }
            .addons-grid { grid-template-columns: 1fr; gap: 1.2rem; }
            .calc-grid { grid-template-columns: 1fr; gap: 2rem; }
        }

        @media (max-width: 768px) {
            body { font-size: 15px; }
            .wrapper { padding: 0 1rem; width: 100%; }
            section { padding: 2.8rem 0; }
            
            .section-tag { font-size: 0.72rem; letter-spacing: 1.8px; margin-bottom: 0.5rem; }
            .section-title { font-size: 1.85rem; line-height: 1.18; margin-bottom: 0.6rem; }
            .section-subtitle { font-size: 0.88rem; line-height: 1.55; }

            /* 1. Header Mobile */
            header { padding: 0.65rem 0; }
            .brand-cluster { gap: 0; }
            .brand-logo-img { height: 18px; }
            .brand-divider { display: none !important; }
            .client-header-logo { display: none !important; }
            .target-badge { display: none !important; }
            .nav-actions { flex-shrink: 0; }
            .nav-actions .btn-action {
                padding: 0.42rem 0.75rem;
                font-size: 0.75rem;
                border-radius: 6px;
                white-space: nowrap;
            }

            /* 2. Hero Mobile */
            .hero { padding: 1.2rem 0 2rem 0; }
            .hero-banner-container { padding: 2.4rem 1.1rem 1.8rem 1.1rem; border-radius: 18px; }
            .hero-pill { padding: 0.35rem 0.9rem; font-size: 0.72rem; margin-bottom: 1.2rem; }
            .hero h1 { font-size: 1.95rem; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 1.1rem; }
            .hero-manifesto { font-size: 0.92rem; line-height: 1.65; margin-bottom: 1.6rem; }

            /* Stats 2x2 Grid */
            .hero-stats-container { border-radius: 14px; margin-top: 1.4rem; width: 100%; }
            .stats-box-header { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 4px; 
                padding: 0.65rem 1rem; 
                font-size: 0.68rem; 
            }
            .hero-stats-intro { padding: 0.8rem 1rem 0 1rem; }
            .hero-stats-intro p { font-size: 0.82rem; line-height: 1.45; padding-bottom: 0.6rem; }
            .hero-stats-grid {
                grid-template-columns: 1fr 1fr !important;
                gap: 0.8rem !important;
                padding: 1rem 0.8rem !important;
                width: 100%;
            }
            .stat-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 0.8rem 0.4rem;
            }
            .stat-card:not(:last-child)::after { display: none !important; }
            .stat-number { font-size: 1.7rem !important; margin-bottom: 0.2rem; gap: 1px; }
            .stat-number .unit { font-size: 1.05rem !important; }
            .stat-label { font-size: 0.68rem !important; line-height: 1.2; margin-bottom: 0.2rem; letter-spacing: 0.3px; }
            .stat-sub { font-size: 0.62rem !important; }

            /* Widgets Showcase */
            .showcase-card { padding: 1.3rem 1.1rem; border-radius: 15px; }
            .showcase-title { font-size: 1.15rem; }
            .chat-stream-box { min-height: 180px; max-height: 180px; padding: 0.8rem; font-size: 0.78rem; }
            .chat-action-btn { padding: 8px 10px; font-size: 0.72rem; }
            .radar-box { height: 185px; }
            .ba-container { height: 185px; }

            /* Pricing Cards */
            .pricing-card { padding: 1.8rem 1.2rem; border-radius: 16px; }
            .p-title { font-size: 1.5rem; }
            .p-price-block { margin: 1.1rem 0; padding: 0.9rem 0; }
            .p-amount { font-size: 2.3rem; }
            .p-currency { font-size: 1rem; }
            .p-period { font-size: 0.8rem; }
            .p-iva-tag { font-size: 0.78rem; }
            .p-features { gap: 0.75rem; margin: 1.2rem 0; }
            .p-features li { font-size: 0.85rem; }

            /* Addons */
            .addon-card { padding: 1.3rem 1.1rem; border-radius: 14px; }
            .addon-title { font-size: 1.1rem; }
            .addon-price { font-size: 1.2rem; }

            /* Calculator */
            .calc-container { padding: 1.6rem 1rem; border-radius: 16px; margin-top: 2rem; width: 100%; }
            .calc-item { padding: 0.85rem; border-radius: 10px; }
            .calc-item-title { font-size: 0.92rem; }
            .calc-item-sub { font-size: 0.72rem; }
            .calc-item-price { font-size: 0.88rem; }
            .calc-summary-card { padding: 1.4rem 1.1rem; border-radius: 14px; }
            .summary-title { font-size: 1.2rem; }
            .summary-amt-big { font-size: 1.4rem; }

            /* Modal */
            .meeting-modal-backdrop { padding: 0.8rem; }
            .meeting-modal-card { padding: 1.6rem 1.1rem; border-radius: 16px; max-height: 94vh; }
            .meeting-modal-close { top: 12px; right: 14px; width: 30px; height: 30px; font-size: 1.1rem; }
            .form-grid { grid-template-columns: 1fr; gap: 0.75rem; }
            .time-slots-grid { grid-template-columns: repeat(3, 1fr); gap: 0.35rem; }
            .time-slot-btn { font-size: 0.68rem; padding: 0.45rem 0.1rem; }
            
            /* Footer Mobile Stack */
            footer { padding: 2rem 0; width: 100%; }
            .footer-brand {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 0.5rem !important;
                margin-bottom: 1.2rem !important;
                text-align: center !important;
                width: 100% !important;
            }
            .footer-divider { display: none !important; }
            .footer-client {
                color: var(--amber-racing) !important;
                font-family: var(--font-display) !important;
                font-weight: 800 !important;
                font-size: 0.95rem !important;
                letter-spacing: 0.3px !important;
            }
            .footer-copy {
                font-size: 0.75rem !important;
                line-height: 1.5 !important;
                padding: 0 0.5rem !important;
            }
        }

        @media (max-width: 380px) {
            .hero h1 { font-size: 1.75rem; }
            .stat-number { font-size: 1.55rem; }
            .p-amount { font-size: 2rem; }
        }
    ` }} />
      <div dangerouslySetInnerHTML={{ __html: `

    <div id="ambient-glow"></div>
    <div class="bg-carbon-mesh"></div>

    <!-- Header Navigation -->
    <header>
        <div class="wrapper nav-container">
            <div class="brand-cluster">
                <a href="https://apolograma.com" target="_blank" style="display: flex; align-items: center; text-decoration: none;">
                    <img src="/assets/apolograma-logo-v2.png" alt="Apolograma Studio" class="brand-logo-img">
                </a>
                <div class="brand-divider"></div>
                <img src="/assets/touche-motors/logo-white.png" alt="Touché Motors" class="client-header-logo">
                <div class="brand-divider"></div>
                <span class="target-badge"><i class="fa fa-car"></i> CONCESIONARIA STELLANTIS</span>
            </div>

            <div class="nav-actions">
                <button class="btn-action btn-primary" onclick="openMeetingModal()">
                    <i class="fa fa-calendar-check"></i> Agendar Junta
                </button>
            </div>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section class="hero" id="sec-hero">
        <div class="wrapper">
            <div class="hero-banner-container">
                <img src="/assets/touche-motors/hero_backdrop.jpg" alt="" class="hero-bg-img">
                <div class="hero-gradient-overlay"></div>
                
                <div class="hero-content">
                    <div class="hero-pill">
                        <span class="dot"></span>
                        <span>ESTRATEGIA DE CRECIMIENTO | DISTRIBUIDOR STELLANTIS</span>
                    </div>

                    <h1>
                        MÁS PRUEBAS DE MANEJO. <br>
                        <span class="gradient-text">VENTAS CERRADAS.</span>
                    </h1>

                    <p class="hero-manifesto">
                        Cada minuto que un prospecto de <strong>Jeep o RAM</strong> espera una respuesta en redes, es un cliente que se acerca a otra agencia sobre la Paseo Triunfo. Nuestra iguala mensual transforma el scroll de Facebook e Instagram en <strong>visitas físicas a su sala de ventas con compradores pre-calificados</strong> con enganche y presupuesto real.
                    </p>

                    <!-- APOLOGRAMA EFFICIENCY STATS BOX -->
                    <div class="hero-stats-container">
                        <div class="stats-box-header">
                            <div class="stats-box-tag"><i class="fa fa-tachometer-alt"></i> INFRAESTRUCTURA DE CONVERSIÓN APOLOGRAMA</div>
                            <div class="stats-box-source">MÉTRICAS AUDITADAS: <strong>SALA DE VENTAS TOUCHÉ MOTORS</strong></div>
                        </div>

                        <div class="hero-stats-intro">
                            <p>
                                Diseñada específicamente para la Dirección de Ventas de Touché Motors en <strong>Av. Paseo Triunfo de la República 6080</strong>, eliminando la fuga de prospectos nocturnos y de fin de semana para saturar la agenda de <em>Test Drives</em>:
                            </p>
                        </div>

                        <div class="hero-stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">&lt; 60<span class="unit">s</span></div>
                                <div class="stat-label">TIEMPO DE RESPUESTA</div>
                                <div class="stat-sub">Speed-to-Lead Inmediato</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">24<span class="unit">/7</span></div>
                                <div class="stat-label">COBERTURA TOTAL</div>
                                <div class="stat-sub">Guardia Nocturna y Fines de Semana</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">100<span class="unit">%</span></div>
                                <div class="stat-label">PRE-CALIFICACIÓN</div>
                                <div class="stat-sub">Filtro de Enganche y Buró</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">0<span class="unit">%</span></div>
                                <div class="stat-label">FUGA DE PROSPECTOS</div>
                                <div class="stat-sub">Seguimiento Centralizado</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- 3 CAPACIDADES INTERACTIVAS EN VIVO -->
    <section id="sec-widgets" style="padding-top: 1rem;">
        <div class="wrapper">
            <div style="text-align: center; max-width: 780px; margin: 0 auto 1rem auto;">
                <div class="section-tag"><i class="fa fa-microchip"></i> DEMOSTRACIÓN EN VIVO</div>
                <h2 class="section-title">3 CAPACIDADES QUE TRANSFORMAN SU SALA DE VENTAS</h2>
                <p class="section-subtitle" style="margin: 0 auto;">
                    Pruebe directamente en esta pantalla las herramientas que aceleran la toma de decisión del comprador automotriz en Ciudad Juárez:
                </p>
            </div>

            <div class="widgets-showcase-grid">
                <!-- Widget 1: WhatsApp Bot Demo -->
                <div class="showcase-card">
                    <div class="showcase-header">
                        <span class="showcase-badge"><i class="fa fa-bolt"></i> PRUEBA INTERACTIVA</span>
                        <h3 class="showcase-title">Recepción & Cotizador 24/7</h3>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                            Simule cómo un comprador califica su propio enganche en menos de 30 segundos.
                        </p>
                    </div>

                    <div>
                        <div class="chat-stream-box" id="chat-stream">
                            <div class="c-bubble c-bot">
                                ¡Hola! 👋 Bienvenido a <strong>Touché Motors Paseo Triunfo</strong> (Jeep, RAM, Seminuevos y Mopar). ¿En qué podemos apoyarte hoy?
                            </div>
                        </div>

                        <div id="chat-action-buttons">
                            <button class="chat-action-btn" onclick="sendChatOption('opt1', '🚙 Cotizar Enganche RAM 1500')">
                                <i class="fa fa-truck-pickup" style="color: var(--amber-racing);"></i> Cotizar Enganche RAM 1500
                            </button>
                            <button class="chat-action-btn" onclick="sendChatOption('opt2', '📅 Agendar Prueba de Manejo Jeep')">
                                <i class="fa fa-calendar-check" style="color: var(--cyan-velocity);"></i> Agendar Test Drive Jeep
                            </button>
                            <button class="chat-action-btn" onclick="sendChatOption('opt3', '🔄 Valuar Mi Auto a Cuenta')">
                                <i class="fa fa-sync-alt" style="color: var(--emerald-online);"></i> Valuar Mi Auto a Cuenta
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Widget 2: Radar de Geocercas -->
                <div class="showcase-card">
                    <div class="showcase-header">
                        <span class="showcase-badge"><i class="fa fa-crosshairs"></i> SEGMENTACIÓN QUIRÚRGICA</span>
                        <h3 class="showcase-title">Radar de Geocercas Vial</h3>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                            Pauta publicitaria concentrada en zonas de alto poder adquisitivo en Cd. Juárez.
                        </p>
                    </div>

                    <div class="radar-box">
                        <img src="/assets/touche-motors/map_satellite.jpg" alt="Mapa Satelital Radar" class="radar-map-bg">
                        <div class="radar-ring"></div>
                        <div class="radar-center-pin"></div>
                        <div class="radar-hud-tag">
                            <i class="fa fa-satellite-dish"></i> GEO-RADAR ACTIVO // PASEO TRIUNFO & CAMPESTRE // STELLANTIS
                        </div>
                    </div>
                </div>

                <!-- Widget 3: Before / After Slider -->
                <div class="showcase-card">
                    <div class="showcase-header">
                        <span class="showcase-badge"><i class="fa fa-eye"></i> CALIDAD PALPABLE</span>
                        <h3 class="showcase-title">Dirección Visual con IA (Paquete B)</h3>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                            Deslice el divisor para contrastar la foto típica de patio vs el arte editorial con IA.
                        </p>
                    </div>

                    <div class="ba-container" id="ba-container">
                        <div class="ba-before-wrap">
                            <img src="/assets/touche-motors/ba_before.jpg" alt="Antes: Foto Celular en Patio" class="ba-slide-img">
                            <span class="ba-tag-badge ba-tag-before">Antes: Celular en Patio</span>
                        </div>
                        <div class="ba-after-wrap" id="ba-after-wrap">
                            <img src="/assets/touche-motors/ba_after.jpg" alt="Después: Arte Editorial con IA" class="ba-slide-img">
                            <span class="ba-tag-badge ba-tag-after">Después: IA Apolograma</span>
                        </div>
                        <div class="ba-affordance-hint">⟵ Desliza para comparar ⟶</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PROPUESTA ECONÓMICA: PAQUETE B HERO VS PAQUETE A -->
    <section id="sec-pricing">
        <div class="wrapper">
            <div style="text-align: center; max-width: 820px; margin: 0 auto 1.5rem auto;">
                <div class="section-tag"><i class="fa fa-tags"></i> INVERSIÓN MENSUAL ESTRATÉGICA</div>
                <h2 class="section-title">SU IGUALA MENSUAL DE CONTENIDO Y PERFORMANCE</h2>
                <p class="section-subtitle" style="margin: 0 auto;">
                    Diseñada para rotar inventario continuamente, generar volumen de citas y blindar la presencia de Touché Motors con la máxima eficiencia de costos:
                </p>
            </div>

            <div class="pricing-grid">
                <!-- PAQUETE B: HERO / MÁS ELEGIDO -->
                <div class="pricing-card featured" id="card-pkg-b">
                    <div class="pricing-badge">🌟 MÁS ELEGIDO POR CONCESIONARIAS</div>
                    <div>
                        <div class="p-title" style="color: var(--amber-racing);">Paquete B (Diseño con IA & Contenido Ágil)</div>
                        <p style="font-size: 0.88rem; color: var(--text-steel);">
                            La mejor relación valor-inversión para rotación acelerada de unidades nuevas y seminuevos garantizados.
                        </p>

                        <div class="p-price-block">
                            <div class="p-amount">$10,000 <span class="p-currency">MXN</span> <span class="p-period">/ mes</span></div>
                            <div class="p-iva-tag">+ IVA ($11,600 Total Facturado)</div>
                        </div>

                        <ul class="p-features">
                            <li><i class="fa fa-check-circle"></i> <strong>18 gráficos publicitarios</strong> generados con IA bajo lineamientos y supervisión del equipo Senior.</li>
                            <li><i class="fa fa-check-circle"></i> <strong>2 videoreels cinematográficos</strong> de producto real en sala y locación para Meta Ads.</li>
                            <li><i class="fa fa-check-circle"></i> Rotación multimarca completa: <em>Jeep, RAM, Dodge, Fiat, Peugeot y Seminuevos</em>.</li>
                            <li><i class="fa fa-check-circle"></i> Segmentación y calibración de audiencias locales en Ciudad Juárez.</li>
                            <li><i class="fa fa-check-circle"></i> Entrega quincenal auditada y tablero de métricas de rendimiento.</li>
                        </ul>
                    </div>

                    <button class="btn-action btn-primary" style="width: 100%; justify-content: center; margin-top: 1.5rem;" onclick="selectPackageInView('b')">
                        <i class="fa fa-check"></i> Seleccionar Paquete B (Recomendado)
                    </button>
                </div>

                <!-- PAQUETE A: ARTESANAL SENIOR -->
                <div class="pricing-card" id="card-pkg-a">
                    <div>
                        <div class="p-title">Paquete A (Dirección de Arte Senior Tradicional)</div>
                        <p style="font-size: 0.88rem; color: var(--text-muted);">
                            Para campañas institucionales de alta exigencia artesanal sin uso de Inteligencia Artificial.
                        </p>

                        <div class="p-price-block">
                            <div class="p-amount">$20,000 <span class="p-currency">MXN</span> <span class="p-period">/ mes</span></div>
                            <div class="p-iva-tag">+ IVA ($23,200 Total Facturado)</div>
                        </div>

                        <ul class="p-features">
                            <li><i class="fa fa-check-circle"></i> <strong>20 gráficos publicitarios</strong> elaborados a mano por el equipo Senior (<strong>CERO IA</strong>).</li>
                            <li><i class="fa fa-check-circle"></i> <strong>2 videoreels cinematográficos</strong> de producto real para Meta Ads.</li>
                            <li><i class="fa fa-check-circle"></i> Tratamiento tipográfico y retoque digital milimétrico para campañas insignia.</li>
                            <li><i class="fa fa-check-circle"></i> Optimización publicitaria avanzada de conversión.</li>
                            <li><i class="fa fa-check-circle"></i> Auditoría quincenal ejecutiva con la Gerencia de Ventas.</li>
                        </ul>
                    </div>

                    <button class="btn-action btn-outline" style="width: 100%; justify-content: center; margin-top: 1.5rem;" onclick="selectPackageInView('a')">
                        Seleccionar Paquete A
                    </button>
                </div>
            </div>

            <!-- Inversión de Pauta Clarificada -->
            <div style="background: rgba(255, 184, 0, 0.05); border: 1px solid rgba(255, 184, 0, 0.25); border-radius: 14px; padding: 1.2rem 1.6rem; margin-top: 1.8rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fa fa-bullhorn" style="color: var(--amber-racing); font-size: 1.5rem;"></i>
                    <div>
                        <div style="font-family: var(--font-display); font-weight: 800; color: #fff; font-size: 1rem;">Presupuesto de Pauta Publicitaria (Meta Ads)</div>
                        <div style="font-size: 0.82rem; color: var(--text-steel);">Inversión directa a plataforma de Facebook e Instagram para amplificar las unidades clave.</div>
                    </div>
                </div>
                <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.15rem; color: var(--amber-racing); white-space: nowrap;">
                    $2,000 MXN / mes
                </div>
            </div>

            <!-- MÓDULOS TECNOLÓGICOS OPCIONALES (FASE 2 DE MADURACIÓN) -->
            <div class="addons-section-header">
                <div class="section-tag"><i class="fa fa-cogs"></i> FASE 2 DE MADURACIÓN</div>
                <h3 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #fff;">
                    INFRAESTRUCTURA TECNOLÓGICA OPCIONAL
                </h3>
                <p style="font-size: 0.95rem; color: var(--text-body); max-width: 750px; margin: 0.5rem auto 0 auto;">
                    Módulos activables cuando su sala de ventas decida automatizar la atención y blindar el seguimiento de cada prospecto:
                </p>
            </div>

            <div class="addons-grid">
                <!-- Addon 1 -->
                <div class="addon-card">
                    <div>
                        <div class="addon-header">
                            <div class="addon-title"><i class="fab fa-whatsapp" style="color: #25D366;"></i> Bot WhatsApp Calificador 24/7</div>
                            <div>
                                <div class="addon-price">+$4,000</div>
                                <div class="addon-price-sub">+ IVA / mes</div>
                            </div>
                        </div>
                        <p style="font-size: 0.86rem; color: var(--text-steel); line-height: 1.55;">
                            Menú multimarca (Ventas, Seminuevos y Mopar), simulador interactivo de enganches y agendado directo de Test Drives con transferencia caliente de la ficha al asesor en turno.
                        </p>
                    </div>
                </div>

                <!-- Addon 2 -->
                <div class="addon-card">
                    <div>
                        <div class="addon-header">
                            <div class="addon-title"><i class="fa fa-phone-volume" style="color: var(--cyan-velocity);"></i> Agente Telefónico de Voz con IA</div>
                            <div>
                                <div class="addon-price">+$4,500</div>
                                <div class="addon-price-sub">+ IVA / mes</div>
                            </div>
                        </div>
                        <p style="font-size: 0.86rem; color: var(--text-steel); line-height: 1.55;">
                            Recepción telefónica 24/7 y llamadas Speed-to-Lead automáticas (&lt; 60s) en cuanto un prospecto deja sus datos en Meta Ads para apartar su prueba de manejo antes de que se enfríe.
                        </p>
                    </div>
                </div>

                <!-- Addon 3 -->
                <div class="addon-card">
                    <div>
                        <div class="addon-header">
                            <div class="addon-title"><i class="fa fa-chart-line" style="color: var(--amber-racing);"></i> CRM Automotriz & Anti-Ghosting</div>
                            <div>
                                <div class="addon-price">+$3,500</div>
                                <div class="addon-price-sub">+ IVA / mes</div>
                            </div>
                        </div>
                        <p style="font-size: 0.86rem; color: var(--text-steel); line-height: 1.55;">
                            Pipeline visual en Kanban para sala de ventas con secuencias automatizadas de seguimiento por WhatsApp (Día 1, 3, 7 y 15) y alertas al gerente si un asesor deja un lead sin tocar.
                        </p>
                    </div>
                </div>

                <!-- Addon 4: Combo Suite -->
                <div class="addon-card" style="border-color: rgba(255, 184, 0, 0.45); background: linear-gradient(145deg, rgba(255,184,0,0.06), rgba(14, 19, 28, 0.95));">
                    <div>
                        <div class="addon-header">
                            <div class="addon-title" style="color: var(--amber-racing);">🔥 Combo Suite Comercial Completa</div>
                            <div>
                                <div class="addon-price" style="color: #34D399;">+$8,500</div>
                                <div class="addon-price-sub">+ IVA / mes (Ahorras $3,500)</div>
                            </div>
                        </div>
                        <p style="font-size: 0.86rem; color: var(--text-steel); line-height: 1.55;">
                            Integración unificada: WhatsApp Calificador + Bot Telefónico de Voz + CRM Automotriz. La solución integral para blindar la conversión de su sala de ventas.
                        </p>
                    </div>
                </div>

                <!-- Addon 5: Landing Web -->
                <div class="addon-card" style="grid-column: 1 / -1; border-color: rgba(0, 229, 255, 0.35);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div style="max-width: 680px;">
                            <div class="addon-title" style="color: var(--cyan-velocity);"><i class="fa fa-laptop-code"></i> Plataforma Web de Alta Conversión Touché</div>
                            <p style="font-size: 0.86rem; color: var(--text-steel); margin-top: 6px; line-height: 1.55;">
                                Arquitectura web independiente de ultra-alta conversión para catálogo de inventario nuevo y seminuevos, cotizador de financiamiento y captación directa de pruebas de manejo.
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div class="addon-price" style="font-size: 1.8rem; color: #fff;">$40,000 <span style="font-size: 1rem; color: var(--cyan-velocity);">MXN</span></div>
                            <div class="addon-price-sub">+ IVA (Inversión de Pago Único)</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CALCULADORA INTERACTIVA DE ALCANCE -->
            <div class="calc-container" id="sec-calculator">
                <div style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem;">
                    <span class="section-tag"><i class="fa fa-calculator"></i> CONFIGURADOR EN VIVO</span>
                    <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: #fff;">
                        CONFIGURE SU ALCANCE PERSONALIZADO
                    </h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">
                        El <strong>Paquete B ($10,000/mes)</strong> se encuentra seleccionado por default. Puede activar o desactivar módulos tecnológicos adicionales según sus requerimientos:
                    </p>
                </div>

                <div class="calc-grid">
                    <!-- Opciones Seleccionables -->
                    <div class="calc-options">
                        <div class="calc-opt-group-title">1. Seleccione su Paquete Mensual de Marketing</div>
                        
                        <div class="calc-item selected" id="opt-pkg-b" onclick="togglePackage('b')">
                            <div class="calc-item-left">
                                <div class="calc-check"><i class="fa fa-check"></i></div>
                                <div>
                                    <div class="calc-item-title">Paquete B (Diseño con IA & Contenido Ágil) ⭐</div>
                                    <div class="calc-item-sub">18 gráficos con IA + 2 reels + rotación ágil de inventario</div>
                                </div>
                            </div>
                            <div class="calc-item-price">$10,000 <span style="font-size: 0.75rem; color: var(--amber-racing);">/ mes</span></div>
                        </div>

                        <div class="calc-item" id="opt-pkg-a" onclick="togglePackage('a')">
                            <div class="calc-item-left">
                                <div class="calc-check"><i class="fa fa-check"></i></div>
                                <div>
                                    <div class="calc-item-title">Paquete A (Dirección de Arte Senior Tradicional)</div>
                                    <div class="calc-item-sub">20 gráficos hechos a mano (CERO IA) + 2 reels cinematográficos</div>
                                </div>
                            </div>
                            <div class="calc-item-price">$20,000 <span style="font-size: 0.75rem; color: var(--amber-racing);">/ mes</span></div>
                        </div>

                        <div class="calc-opt-group-title" style="margin-top: 1rem;">2. Infraestructura Tecnológica Opcional (Fase 2)</div>

                        <div class="calc-item" id="opt-addon-bot-wa" onclick="toggleAddon('bot_wa', 4000, 'monthly')">
                            <div class="calc-item-left">
                                <div class="calc-check" id="check-bot_wa"><i class="fa fa-check" style="display: none;"></i></div>
                                <div>
                                    <div class="calc-item-title">Bot WhatsApp Calificador & Cotizador 24/7</div>
                                    <div class="calc-item-sub">Simulador de enganche + agendado de Test Drives en Paseo Triunfo</div>
                                </div>
                            </div>
                            <div class="calc-item-price">+$4,000 <span style="font-size: 0.75rem; color: var(--text-muted);">/ mes</span></div>
                        </div>

                        <div class="calc-item" id="opt-addon-bot-call" onclick="toggleAddon('bot_call', 4500, 'monthly')">
                            <div class="calc-item-left">
                                <div class="calc-check" id="check-bot_call"><i class="fa fa-check" style="display: none;"></i></div>
                                <div>
                                    <div class="calc-item-title">Agente Telefónico de Voz con IA</div>
                                    <div class="calc-item-sub">Recepción 24/7 y contacto Speed-to-Lead (&lt; 60s) en Meta Ads</div>
                                </div>
                            </div>
                            <div class="calc-item-price">+$4,500 <span style="font-size: 0.75rem; color: var(--text-muted);">/ mes</span></div>
                        </div>

                        <div class="calc-item" id="opt-addon-suite-crm" onclick="toggleAddon('suite_crm', 3500, 'monthly')">
                            <div class="calc-item-left">
                                <div class="calc-check" id="check-suite_crm"><i class="fa fa-check" style="display: none;"></i></div>
                                <div>
                                    <div class="calc-item-title">CRM Automotriz Ligero & Secuencias Anti-Ghosting</div>
                                    <div class="calc-item-sub">Pipeline Kanban para sala de ventas + nurturing automático</div>
                                </div>
                            </div>
                            <div class="calc-item-price">+$3,500 <span style="font-size: 0.75rem; color: var(--text-muted);">/ mes</span></div>
                        </div>

                        <div class="calc-item" id="opt-addon-combo" onclick="toggleComboSuite()">
                            <div class="calc-item-left">
                                <div class="calc-check" id="check-combo"><i class="fa fa-check" style="display: none;"></i></div>
                                <div>
                                    <div class="calc-item-title" style="color: var(--amber-racing);">🔥 Combo Suite Comercial (WhatsApp + Voz + CRM)</div>
                                    <div class="calc-item-sub">Las 3 herramientas unificadas con $3,500 de descuento</div>
                                </div>
                            </div>
                            <div class="calc-item-price">+$8,500 <span style="font-size: 0.75rem; color: #34D399;">/ mes</span></div>
                        </div>

                        <div class="calc-item" id="opt-addon-landing" onclick="toggleAddon('landing', 40000, 'onetime')">
                            <div class="calc-item-left">
                                <div class="calc-check" id="check-landing"><i class="fa fa-check" style="display: none;"></i></div>
                                <div>
                                    <div class="calc-item-title">Plataforma Web de Alta Conversión Touché</div>
                                    <div class="calc-item-sub">Sitio web independiente de captación de pruebas de manejo</div>
                                </div>
                            </div>
                            <div class="calc-item-price">+$40,000 <span style="font-size: 0.75rem; color: var(--cyan-velocity);">único</span></div>
                        </div>
                    </div>

                    <!-- Resumen en Vivo -->
                    <div class="calc-summary-card">
                        <div>
                            <div class="summary-title">RESUMEN DE SU PROPUESTA</div>
                            
                            <!-- Bloque Mensual -->
                            <div class="summary-block">
                                <div class="summary-block-title"><i class="fa fa-calendar-alt"></i> INVERSIÓN MENSUAL RECURRENTE</div>
                                <div class="summary-line">
                                    <span>Plan Base Seleccionado:</span>
                                    <span id="sum-pkg-name" style="color: #fff; font-weight: 700;">Paquete B ($10,000)</span>
                                </div>
                                <div class="summary-line">
                                    <span>Add-ons Mensuales:</span>
                                    <span id="sum-addons-monthly" style="color: var(--text-steel);">$0 MXN</span>
                                </div>
                                <div class="summary-line" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.4rem; margin-top: 0.4rem;">
                                    <span>Subtotal Mensual:</span>
                                    <span id="sum-subtotal-monthly" style="color: #fff; font-weight: 800;">$10,000 MXN</span>
                                </div>
                                <div class="summary-amt-big" id="sum-total-monthly">$10,000 <span style="font-size: 0.9rem; color: var(--amber-racing);">MXN / mes</span></div>
                                <div style="font-size: 0.75rem; color: #FCD34D;" id="sum-iva-monthly">+ IVA ($11,600 Total)</div>
                            </div>

                            <!-- Bloque Pago Único -->
                            <div class="summary-block" id="block-onetime-summary" style="display: none;">
                                <div class="summary-block-title" style="color: var(--cyan-velocity);"><i class="fa fa-laptop-code"></i> IMPLEMENTACIÓN PAGO ÚNICO</div>
                                <div class="summary-line">
                                    <span>Plataforma Web Touché:</span>
                                    <span style="color: #fff; font-weight: 700;">$40,000 MXN</span>
                                </div>
                                <div class="summary-amt-big" id="sum-total-onetime">$40,000 <span style="font-size: 0.9rem; color: var(--cyan-velocity);">MXN (Pago único)</span></div>
                                <div style="font-size: 0.75rem; color: #FCD34D;">+ IVA ($46,400 Total)</div>
                            </div>
                        </div>

                        <div>
                            <button class="btn-action btn-primary" id="btn-cta-dynamic" style="width: 100%; justify-content: center; padding: 0.9rem 1.2rem; font-size: 0.95rem;" onclick="openMeetingModal()">
                                <i class="fa fa-calendar-check"></i> Agendar Junta para Paquete B ($10,000 + IVA)
                            </button>
                            <div style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 0.6rem;">
                                Sin plazos forzosos. Cancelación con 30 días de anticipación.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- MODAL DE AGENDADO EJECUTIVO (L-V 10:00 AM - 2:00 PM) -->
    <div class="meeting-modal-backdrop" id="meeting-modal">
        <div class="meeting-modal-card">
            <button class="meeting-modal-close" onclick="closeMeetingModal()">&times;</button>
            
            <div id="meeting-form-state">
                <div style="margin-bottom: 1.5rem;">
                    <span class="target-badge" style="margin-bottom: 0.5rem; display: inline-flex;"><i class="fa fa-calendar-check"></i> AGENDAR JUNTA EJECUTIVA</span>
                    <h3 style="font-family: var(--font-display); font-size: 1.7rem; font-weight: 900; color: #fff;">
                        SESIÓN DE ALINEACIÓN COMERCIAL (20 MIN)
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                        Revisaremos el plan de contenido para Touché Motors y la coordinación de fechas para la primera entrega quincenal.
                    </p>
                </div>

                <form id="meeting-form" onsubmit="handleMeetingSubmit(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nombre y Cargo del Asistente</label>
                            <input type="text" class="m-input" id="m-name" placeholder="Ej. Lic. Roberto Garza (Gerente de Ventas)" required>
                        </div>
                        <div class="form-group">
                            <label>WhatsApp de Contacto Directo</label>
                            <input type="tel" class="m-input" id="m-phone" placeholder="Ej. 656 123 4567" required>
                        </div>
                    </div>

                    <div class="form-grid" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label>Fecha Deseada (Lunes a Viernes)</label>
                            <input type="date" class="m-input" id="m-date" required>
                        </div>
                        <div class="form-group">
                            <label>Horario Disponible (Zona Juárez)</label>
                            <div class="time-slots-grid">
                                <button type="button" class="time-slot-btn active" onclick="selectTimeSlot(this, '10:00 AM')">10:00 AM</button>
                                <button type="button" class="time-slot-btn" onclick="selectTimeSlot(this, '11:00 AM')">11:00 AM</button>
                                <button type="button" class="time-slot-btn" onclick="selectTimeSlot(this, '12:00 PM')">12:00 PM</button>
                                <button type="button" class="time-slot-btn" onclick="selectTimeSlot(this, '01:00 PM')">01:00 PM</button>
                                <button type="button" class="time-slot-btn" onclick="selectTimeSlot(this, '02:00 PM')">02:00 PM</button>
                            </div>
                            <input type="hidden" id="m-time" value="10:00 AM">
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 0.9rem; margin-top: 1.2rem; font-size: 0.8rem; color: var(--text-steel);">
                        <i class="fa fa-info-circle" style="color: var(--amber-racing);"></i> <strong>Modalidad:</strong> Presencial en sucursal Paseo Triunfo 6080 o por videollamada de Google Meet (le contactaremos previamente para confirmar).
                    </div>

                    <div style="margin-top: 1.6rem; display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn-action btn-outline" onclick="closeMeetingModal()">Cancelar</button>
                        <button type="submit" class="btn-action btn-primary" id="btn-submit-meeting">Confirmar Solicitud de Junta</button>
                    </div>
                </form>
            </div>

            <div id="meeting-success-state" style="display: none; text-align: center; padding: 2rem 1rem;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid var(--emerald-online); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem auto; color: var(--emerald-online); font-size: 1.8rem;">
                    <i class="fa fa-check"></i>
                </div>
                <h3 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 0.5rem;">
                    ¡SOLICITUD REGISTRADA CON ÉXITO!
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-steel); max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
                    Hemos registrado su solicitud de junta para el <strong id="succ-date" style="color: #fff;"></strong> a las <strong id="succ-time" style="color: var(--amber-racing);"></strong>.
                    <br><br>
                    Nos pondremos en contacto al <strong id="succ-phone" style="color: #fff;"></strong> vía WhatsApp para coordinar los detalles.
                </p>
                <button type="button" class="btn-action btn-outline" onclick="closeMeetingModal()">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- FOOTER (100% APOLOGRAMA) -->
    <footer>
        <div class="wrapper">
            <div class="footer-brand">
                <a href="https://apolograma.com" target="_blank" style="display: inline-flex; align-items: center; text-decoration: none;">
                    <img src="/assets/apolograma-logo-v2.png" alt="Apolograma" class="footer-logo-img">
                </a>
                <span class="footer-divider">|</span>
                <span class="footer-client">TOUCHÉ MOTORS CD. JUÁREZ</span>
            </div>
            <p class="footer-copy">
                Propuesta Comercial & Estrategia de Marketing preparada exclusivamente para la Dirección de Ventas de Touché Motors.
                <br>
                © 2026 Apolograma Interactive Studio. Todos los derechos reservados.
            </p>
        </div>
    </footer>

    <!-- INTERACTIVITY JAVASCRIPT -->
    
` }} />
    </>
  );
}
