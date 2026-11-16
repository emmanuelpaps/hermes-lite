'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Award,
  Building2,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Mic,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Centro+de+Eventos+Cibeles+Blvd+Tomas+Fernandez+8450+Ciudad+Juarez';

export default function InvitacionEspecialClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Jueves 19 de noviembre de 2026 · 8:30 a.m. a 12:00 p.m. Ciudad Juárez (MST UTC-7 = 15:30Z a 19:00Z)
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(
      'Galardones Empresariales 2026 y Conferencia Carlos Loret de Mola · CCE Juárez'
    );
    const details = encodeURIComponent(
      'Invitación Especial a la Entrega de Galardones Empresariales 2026 (Estrella Ascendente y De Altos Vuelos) y Conferencia Magistral de Carlos Loret de Mola: México y Estados Unidos: Poder, política y economía en tiempos de cambio.\n\nHorario: 8:30 a.m. Registro | 9:00 a.m. Inicio del Desayuno.\nSede: Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450, Cd. Juárez, Chih.).\nCódigo de Vestimenta: Formal.'
    );
    const location = encodeURIComponent(
      'Centro de Eventos Cibeles, Blvd. Tomás Fernández 8450, Cd. Juárez, Chih.'
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261119T153000Z/20261119T190000Z&details=${details}&location=${location}`;
  };

  const handleDownloadIcs = () => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CCE Ciudad Juarez//Invitacion Especial Galardones 2026//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:invitacion-especial-galardones-2026@ccejuarez.org',
      'DTSTAMP:20261116T210000Z',
      'DTSTART:20261119T153000Z',
      'DTEND:20261119T190000Z',
      'SUMMARY:Galardones Empresariales 2026 y Conferencia Carlos Loret de Mola',
      'DESCRIPTION:Invitación Especial · Entrega de Galardones Empresariales 2026 y Conferencia Magistral de Carlos Loret de Mola.\\nRegistro: 8:30 a.m. | Inicio del Desayuno: 9:00 a.m.\\nCódigo de Vestimenta: Formal.',
      'LOCATION:Centro de Eventos Cibeles\\, Blvd. Tomás Fernández 8450\\, Cd. Juárez\\, Chih.',
      'BEGIN:VALARM',
      'TRIGGER:-PT60M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio Galardones Empresariales 2026 en Centro de Eventos Cibeles',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Invitacion_Galardones_CCE_2026.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cce-gala-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

            :root {
              --cce-emerald: #064E3B;
              --cce-emerald-dark: #042E23;
              --cce-emerald-deep: #021B14;
              --cce-emerald-vibrant: #0F766E;
              --cce-emerald-glow: rgba(16, 185, 129, 0.35);
              --cce-gold: #D4AF37;
              --cce-gold-light: #F3E5AB;
              --cce-gold-dark: #B8860B;
              --cce-obsidian: #03120E;
              --cce-white: #FFFFFF;
              --cce-text-light: #F1F5F9;
              --cce-text-muted: #94A3B8;
              --cce-card-border: rgba(212, 175, 55, 0.3);
            }

            *, *::before, *::after {
              box-sizing: border-box;
            }

            html, body {
              margin: 0;
              padding: 0;
              background-color: var(--cce-obsidian);
              color: var(--cce-text-light);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              width: 100%;
              max-width: 100vw;
              overflow-x: hidden;
              scroll-behavior: smooth;
            }

            .cce-gala-root {
              width: 100%;
              max-width: 100vw;
              min-height: 100vh;
              background:
                /* 75% Dominant Emerald Atmosphere */
                radial-gradient(1300px 900px at 50% -80px, rgba(16, 185, 129, 0.42) 0%, rgba(6, 78, 59, 0.72) 35%, rgba(4, 38, 28, 0.88) 60%, transparent 78%),
                radial-gradient(1100px 800px at 10% 45%, rgba(5, 150, 105, 0.38) 0%, rgba(6, 78, 59, 0.32) 42%, transparent 70%),
                radial-gradient(1000px 750px at 85% 80%, rgba(6, 78, 59, 0.52) 0%, rgba(4, 46, 35, 0.68) 45%, rgba(2, 24, 18, 0.95) 75%, transparent 85%),
                /* 25% Refined Golden Glow Accent */
                radial-gradient(800px 600px at 85% 26%, rgba(245, 222, 152, 0.16) 0%, rgba(212, 175, 55, 0.1) 32%, rgba(184, 134, 11, 0.04) 55%, transparent 70%),
                #02120C;
              position: relative;
              overflow-x: hidden;
            }

            /* Ambient Living Canvas (Aurora Mesh) with contain: paint */
            .cce-living-canvas {
              position: fixed;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
              z-index: 0;
              contain: paint;
              clip-path: inset(0);
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
              top: 25vh;
              left: -10vw;
              width: 45vw;
              max-width: 450px;
              height: 45vw;
              max-height: 450px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(212, 175, 55, 0.14) 0%, transparent 65%);
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

            /* Golden Shimmer Animation */
            @keyframes cceGoldShimmer {
              0% {
                background-position: -200% center;
              }
              100% {
                background-position: 200% center;
              }
            }

            .cce-gold-shimmer-text {
              background: linear-gradient(
                90deg,
                #F5DE98 0%,
                #FFF8DC 20%,
                #FFFFFF 35%,
                #F5DE98 50%,
                #D4AF37 70%,
                #F5DE98 85%,
                #FFF8DC 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: cceGoldShimmer 8s linear infinite;
            }

            /* Floating Navigation Pill */
            .cce-nav-header {
              position: fixed;
              top: 12px;
              left: 50%;
              transform: translateX(-50%);
              width: calc(100% - 24px);
              max-width: 1180px;
              z-index: 50;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-nav-inner {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 8px 14px;
              background: rgba(3, 18, 14, 0.88);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 9999px;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.12);
              gap: 8px;
            }

            @media (min-width: 640px) {
              .cce-nav-header {
                top: 16px;
                width: calc(100% - 32px);
              }
              .cce-nav-inner {
                padding: 10px 18px;
                gap: 16px;
              }
            }

            .cce-nav-brand {
              display: flex;
              align-items: center;
              gap: 8px;
              text-decoration: none;
              min-width: 0;
              flex-shrink: 1;
            }

            @media (min-width: 640px) {
              .cce-nav-brand {
                gap: 12px;
                flex-shrink: 0;
              }
            }

            .cce-nav-brand-title {
              display: flex;
              flex-direction: column;
              min-width: 0;
            }

            .cce-nav-brand-main {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #F8FAFC;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            @media (min-width: 640px) {
              .cce-nav-brand-main {
                font-size: 13px;
                letter-spacing: 0.08em;
              }
            }

            .cce-nav-brand-sub {
              display: none;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-family: monospace;
            }

            @media (min-width: 480px) {
              .cce-nav-brand-sub {
                display: block;
              }
            }

            .cce-nav-links {
              display: none;
              align-items: center;
              gap: 6px;
            }

            @media (min-width: 960px) {
              .cce-nav-links {
                display: flex;
              }
            }

            .cce-nav-link {
              padding: 6px 14px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #CBD5E1;
              text-decoration: none;
              transition: all 0.2s ease;
            }

            .cce-nav-link:hover {
              color: #FFFFFF;
              background: rgba(212, 175, 55, 0.12);
            }

            .cce-nav-actions {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-shrink: 0;
            }

            .cce-nav-status-pill {
              display: none;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              background: rgba(6, 78, 59, 0.45);
              border: 1px solid rgba(16, 185, 129, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-family: monospace;
              font-weight: 700;
              color: #A7F3D0;
            }

            @media (min-width: 1140px) {
              .cce-nav-status-pill {
                display: flex;
              }
            }

            .cce-pulse-dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: #10B981;
              box-shadow: 0 0 10px #10B981;
              animation: ccePulseGlow 2s infinite;
            }

            @keyframes ccePulseGlow {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.4;
                transform: scale(0.85);
              }
            }

            .cce-btn-cta {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 7px 14px;
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              border-radius: 9999px;
              border: 1px solid #F3E5AB;
              text-decoration: none;
              box-shadow: 0 4px 16px rgba(212, 175, 55, 0.35);
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              cursor: pointer;
              white-space: nowrap;
            }

            @media (min-width: 640px) {
              .cce-btn-cta {
                padding: 9px 18px;
                font-size: 12px;
                gap: 8px;
                letter-spacing: 0.08em;
              }
            }

            .cce-btn-cta:hover {
              transform: translateY(-1px) scale(1.02);
              box-shadow: 0 8px 24px rgba(212, 175, 55, 0.5);
              background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%);
            }

            /* Main Content Container */
            .cce-content-wrap {
              position: relative;
              z-index: 10;
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px 80px 20px;
            }

            @media (max-width: 640px) {
              .cce-content-wrap {
                padding: 24px 16px 60px 16px;
              }
            }

            /* Hero Section */
            .cce-hero {
              position: relative;
              text-align: center;
              max-width: 1040px;
              margin: 0 auto;
              padding: 20px 20px 60px 20px;
            }

            /* Full-Bleed Cintillos Layer ("Cintillos Cruzados en X" - 100vw Edge-to-Edge) */
            .cce-hero-cintillos-fullbleed {
              position: absolute;
              top: -40px;
              left: 50%;
              transform: translateX(-50%);
              width: 100vw;
              height: calc(100% + 500px);
              min-height: 1200px;
              pointer-events: none;
              overflow: hidden;
              z-index: 1;
            }

            /* ULTRA-LARGE 3D Chamfered Gold Band ("Cintillos que ocupan todo el logo del CCE") */
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

            /* Dedicated Lower Sash Band Across Badges */
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

            /* True X Crossing Behind CCE Logo (Spanning 140vw Full-Bleed) */
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

            /* Lower Diagonal Sash Across Badges (Continues unbroken across the entire screen and down into transition) */
            .cce-sash-bottom-full {
              position: absolute;
              top: 780px;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(9.5deg);
              display: flex;
              flex-direction: column;
              gap: 16px;
              filter: drop-shadow(0 28px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.95;
            }

            /* Reusable Section Cintillos Layer (Edge-to-Edge with strict overflow protection) */
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

            /* Section 01: Galardones Sash (Sweeping down-left across trophy cards) */
            .cce-sash-galardones {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(-8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 02: Carlos Loret Lambrín Sash (Sweeping down-right matching official poster) */
            .cce-sash-loret {
              position: absolute;
              top: 48%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(10deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 28px 50px rgba(0, 0, 0, 0.96));
              opacity: 0.95;
            }

            /* Section 03: Tickets / Pase 3D Sash (Sweeping down-left across ticket pass & SPEI) */
            .cce-sash-tickets {
              position: absolute;
              top: 52%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(-8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 04: Puntos de Venta Sash (Sweeping down-right across store cards) */
            .cce-sash-pos {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) rotate(8.5deg);
              display: flex;
              flex-direction: column;
              gap: 14px;
              filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Section 05: Registro Oficial Sash (Sweeping down-left across registration form) */
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

            /* Section 06: Footer Transition Sash (Sweeping behind footer cards) */
            .cce-sash-footer {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 145vw;
              transform: translateX(-50%) translateY(-50%) rotate(5deg);
              display: flex;
              flex-direction: column;
              gap: 12px;
              filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.95));
              opacity: 0.92;
            }

            /* Staggered Light Sweep Sheen Delays */
            .cce-sheen-delay-1 { animation-delay: 2.5s; }
            .cce-sheen-delay-2 { animation-delay: 5s; }
            .cce-sheen-delay-3 { animation-delay: 1.5s; }
            .cce-sheen-delay-4 { animation-delay: 4s; }
            .cce-sheen-delay-5 { animation-delay: 6.5s; }
            .cce-sheen-delay-6 { animation-delay: 3.5s; }

            /* Content Z-Index Elevation above Background Sashes */
            .cce-hero-logo-box,
            .cce-hero-pill,
            .cce-hero-title,
            .cce-hero-subtitle,
            .cce-hero-motto,
            .cce-hero-lead,
            .cce-badges-grid,
            .cce-section-header,
            .cce-galardones-grid,
            .cce-institutional-contact-bar,
            .cce-lambrin-frame,
            .cce-tickets-grid,
            .cce-pos-grid,
            .cce-contact-closing,
            .cce-reg-header,
            .cce-reg-ticket-summary,
            .cce-form-card,
            .cce-confirm-card,
            .cce-footer-container,
            .cce-footer-col {
              position: relative;
              z-index: 5;
            }

            .cce-galardones-section,
            .cce-loret-section,
            .cce-tickets-section,
            .cce-pos-section,
            .cce-reg-section,
            .cce-footer {
              position: relative;
              overflow: hidden;
              contain: paint;
            }

            @media (max-width: 768px) {
              .cce-hero {
                padding: 10px 10px 50px 10px;
              }

              .cce-hero-cintillos-fullbleed {
                top: -15px;
                height: calc(100% + 200px);
                min-height: 800px;
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
                top: 25px;
                width: 160vw;
                transform: translateX(-50%) rotate(-9deg);
                gap: 10px;
              }

              .cce-x-arm-2 {
                top: 25px;
                width: 160vw;
                transform: translateX(-50%) rotate(9deg);
                gap: 10px;
              }

              .cce-sash-bottom-full {
                top: auto;
                bottom: 60px;
                width: 160vw;
                transform: translateX(-50%) rotate(16deg);
                gap: 10px;
              }

              .cce-sash-galardones,
              .cce-sash-loret,
              .cce-sash-tickets,
              .cce-sash-pos,
              .cce-sash-reg,
              .cce-sash-footer {
                width: 160vw;
                gap: 10px;
              }

              .cce-sash-galardones {
                top: 54%;
                transform: translateX(-50%) rotate(-13deg);
              }

              .cce-sash-loret {
                top: 50%;
                transform: translateX(-50%) rotate(14deg);
              }

              .cce-sash-tickets {
                top: 52%;
                transform: translateX(-50%) rotate(-13deg);
              }

              .cce-sash-pos {
                top: 48%;
                transform: translateX(-50%) rotate(13deg);
              }

              .cce-sash-reg {
                top: 45%;
                transform: translateX(-50%) rotate(-12deg);
              }

              .cce-sash-footer {
                top: 20px;
                transform: translateX(-50%) rotate(9deg);
              }

              /* =========================================================
                 ESCALADO DE TIPOGRAFÍA MÓVIL (LEGIBILIDAD ÓPTIMA <= 768PX)
                 ========================================================= */

              /* Hero & Badges de Contexto */
              .cce-hero-pill {
                font-size: 12.5px !important;
                letter-spacing: 0.1em !important;
                padding: 7px 16px !important;
                line-height: 1.35 !important;
              }
              .cce-hero-title {
                font-size: clamp(36px, 9.5vw, 46px) !important;
                line-height: 1.12 !important;
                letter-spacing: 0.025em !important;
              }
              .cce-hero-motto {
                font-size: 15.5px !important;
                letter-spacing: 0.08em !important;
                line-height: 1.45 !important;
                margin-bottom: 20px !important;
              }
              .cce-hero-lead {
                font-size: 16.5px !important;
                line-height: 1.65 !important;
                margin-bottom: 30px !important;
              }
              .cce-hero-cta {
                font-size: 15px !important;
                padding: 16px 28px !important;
                width: 100% !important;
                max-width: 380px !important;
              }
              .cce-badge-card {
                padding: 22px 18px !important;
              }
              .cce-badge-label {
                font-size: 12.5px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-badge-val {
                font-size: 19.5px !important;
              }
              .cce-badge-sub {
                font-size: 14.5px !important;
                line-height: 1.4 !important;
              }

              /* Encabezados Comunes de Sección */
              .cce-section-pill {
                font-size: 12.5px !important;
                padding: 7px 18px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-section-title {
                font-size: clamp(26px, 6.8vw, 32px) !important;
                line-height: 1.25 !important;
              }
              .cce-section-subtitle {
                font-size: 15.5px !important;
                line-height: 1.6 !important;
              }

              /* Sección 01: Galardones 2026 */
              .cce-galardones-motto {
                font-size: 16.5px !important;
                line-height: 1.45 !important;
              }
              .cce-galardon-badge {
                font-size: 12px !important;
                padding: 6px 14px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-galardon-tagline {
                font-size: 13px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-galardon-name {
                font-size: 22px !important;
                line-height: 1.25 !important;
              }
              .cce-galardon-desc {
                font-size: 15.5px !important;
                line-height: 1.65 !important;
                max-width: 100% !important;
              }
              .cce-galardon-criteria {
                font-size: 14px !important;
                padding: 10px 16px !important;
                line-height: 1.45 !important;
              }
              .cce-institutional-contact-bar {
                font-size: 14.5px !important;
                line-height: 1.55 !important;
                padding: 16px 18px !important;
              }

              /* Sección 02: Carlos Loret de Mola & Conferencia Magistral */
              .cce-loret-pill {
                font-size: 12.5px !important;
                padding: 7px 16px !important;
                letter-spacing: 0.1em !important;
              }
              .cce-loret-name {
                font-size: clamp(28px, 7vw, 34px) !important;
                line-height: 1.18 !important;
              }
              .cce-loret-role {
                font-size: 13.5px !important;
                letter-spacing: 0.14em !important;
              }
              .cce-keynote-tag {
                font-size: 12px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-keynote-title {
                font-size: 17px !important;
                line-height: 1.45 !important;
              }
              .cce-semblanza-lead {
                font-size: 16.5px !important;
                line-height: 1.55 !important;
                padding-left: 14px !important;
              }
              .cce-semblanza-p {
                font-size: 15.5px !important;
                line-height: 1.7 !important;
              }
              .cce-pillar-title {
                font-size: 16px !important;
              }
              .cce-pillar-desc {
                font-size: 14.5px !important;
                line-height: 1.55 !important;
              }
              .cce-audio-btn-preview {
                font-size: 15px !important;
                padding: 14px 20px !important;
              }
              .cce-loret-cta {
                font-size: 15px !important;
                padding: 15px 22px !important;
                letter-spacing: 0.05em !important;
              }

              /* Sección 03: Boletos & SPEI */
              .cce-ticket-folio {
                font-size: 13px !important;
                letter-spacing: 0.1em !important;
              }
              .cce-ticket-badge {
                font-size: 12px !important;
                padding: 5px 12px !important;
              }
              .cce-modality-tab {
                font-size: 13.5px !important;
                padding: 11px 10px !important;
              }
              .cce-tab-sub {
                font-size: 12px !important;
              }
              .cce-stepper-label {
                font-size: 15px !important;
              }
              .cce-stepper-value {
                font-size: 21px !important;
              }
              .cce-quick-btn {
                font-size: 13px !important;
                padding: 10px 8px !important;
              }
              .cce-ticket-price-tag {
                font-size: 12.5px !important;
                letter-spacing: 0.12em !important;
              }
              .cce-ticket-price-val {
                font-size: 34px !important;
              }
              .cce-ticket-price-note {
                font-size: 14px !important;
              }
              .cce-scarcity-info {
                font-size: 13.5px !important;
              }
              .cce-benefit-item {
                font-size: 15px !important;
                line-height: 1.55 !important;
              }
              .cce-ticket-footnote {
                font-size: 13px !important;
                line-height: 1.45 !important;
              }
              .cce-ticket-submit-btn {
                font-size: 15px !important;
                padding: 16px 24px !important;
              }
              .cce-spei-steps-title {
                font-size: 20px !important;
              }
              .cce-spei-steps-sub {
                font-size: 14.5px !important;
              }
              .cce-step-body-title {
                font-size: 15.5px !important;
              }
              .cce-step-body-desc {
                font-size: 14px !important;
                line-height: 1.55 !important;
              }
              .cce-bank-title {
                font-size: 16.5px !important;
              }
              .cce-bank-field-label {
                font-size: 12px !important;
              }
              .cce-bank-field-val {
                font-size: 15.5px !important;
              }
              .cce-clabe-num {
                font-size: 18px !important;
              }
              .cce-btn-copy-clabe {
                font-size: 13.5px !important;
                padding: 11px 16px !important;
              }

              /* Sección 04: Puntos de Venta */
              .cce-pos-badge {
                font-size: 12px !important;
              }
              .cce-pos-name {
                font-size: 18.5px !important;
              }
              .cce-pos-address {
                font-size: 14.5px !important;
                line-height: 1.6 !important;
              }
              .cce-pos-btn {
                font-size: 14px !important;
                padding: 12px 18px !important;
              }
              .cce-contact-title {
                font-size: 22px !important;
              }
              .cce-contact-intro {
                font-size: 15.5px !important;
                line-height: 1.6 !important;
              }
              .cce-contact-pill {
                font-size: 14.5px !important;
                padding: 12px 22px !important;
              }
              .cce-contact-closing {
                font-size: 15px !important;
              }

              /* Sección 05: Formulario de Registro Oficial */
              .cce-reg-pill {
                font-size: 13px !important;
              }
              .cce-reg-title {
                font-size: clamp(25px, 6vw, 30px) !important;
                line-height: 1.25 !important;
              }
              .cce-reg-subtitle {
                font-size: 15.5px !important;
                line-height: 1.55 !important;
              }
              .cce-reg-ticket-label {
                font-size: 13px !important;
              }
              .cce-reg-ticket-val {
                font-size: 18px !important;
              }
              .cce-reg-ticket-total-label {
                font-size: 13px !important;
              }
              .cce-reg-ticket-total-val {
                font-size: 25px !important;
              }
              .cce-label {
                font-size: 15px !important;
              }
              .cce-input,
              .cce-select {
                font-size: 16px !important;
                min-height: 50px !important;
              }
              .cce-attendees-title {
                font-size: 15.5px !important;
              }
              .cce-opt-btn {
                font-size: 14px !important;
                padding: 9px 16px !important;
              }
              .cce-attendees-note {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }
              .cce-upload-title {
                font-size: 16.5px !important;
              }
              .cce-upload-desc {
                font-size: 14px !important;
                line-height: 1.5 !important;
              }
              .cce-upload-file-info {
                font-size: 14.5px !important;
              }
              .cce-factura-title {
                font-size: 16px !important;
              }
              .cce-factura-sub {
                font-size: 14px !important;
              }
              .cce-btn-submit {
                font-size: 17px !important;
                padding: 16px 24px !important;
                min-height: 54px !important;
              }
              .cce-form-disclaimer {
                font-size: 13.5px !important;
                line-height: 1.55 !important;
              }
              .cce-confirm-seal {
                font-size: 13.5px !important;
                padding: 8px 18px !important;
              }
              .cce-confirm-title {
                font-size: 28px !important;
              }
              .cce-confirm-msg {
                font-size: 16px !important;
                line-height: 1.6 !important;
              }
              .cce-confirm-field-label {
                font-size: 12.5px !important;
              }
              .cce-confirm-field-val {
                font-size: 15.5px !important;
              }
              .cce-btn-cal {
                font-size: 14.5px !important;
                padding: 14px 22px !important;
              }
              .cce-confirm-note {
                font-size: 14px !important;
                line-height: 1.55 !important;
              }

              /* Footer */
              .cce-footer-motto {
                font-size: 15.5px !important;
              }
              .cce-footer-text {
                font-size: 14.5px !important;
                line-height: 1.65 !important;
              }
              .cce-footer-contact-inline {
                font-size: 14.5px !important;
              }
              .cce-footer-col-title {
                font-size: 15px !important;
              }
              .cce-org-name {
                font-size: 14.5px !important;
              }
              .cce-org-desc {
                font-size: 12.5px !important;
                line-height: 1.35 !important;
              }
              .cce-footer-info-label {
                font-size: 12px !important;
              }
              .cce-footer-info-val {
                font-size: 14.5px !important;
                line-height: 1.45 !important;
              }
              .cce-footer-nav-link {
                font-size: 14.5px !important;
              }
              .cce-footer-privacy-btn {
                font-size: 14px !important;
              }
              .cce-footer-copy {
                font-size: 13px !important;
                line-height: 1.55 !important;
              }
            }

            /* Large Hero Institutional Logo */
            .cce-hero-logo-box {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 10px auto 24px auto;
              position: relative;
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

            @media (max-width: 640px) {
              .cce-hero-logo-box {
                margin: 8px auto 16px auto;
              }
              .cce-hero-logo-img {
                max-width: 235px;
              }
            }

            .cce-hero-pill {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 6px 16px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin-bottom: 24px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
              max-width: 100%;
            }

            @media (max-width: 640px) {
              .cce-hero-pill {
                font-size: 12.5px;
                letter-spacing: 0.1em;
                padding: 7px 16px;
                line-height: 1.35;
              }
            }

            .cce-hero-title {
              font-family: 'Cinzel', Georgia, 'Times New Roman', serif;
              font-size: clamp(34px, 6.5vw, 76px);
              font-weight: 800;
              letter-spacing: 0.04em;
              line-height: 1.1;
              text-transform: uppercase;
              margin: 0 0 14px 0;
              word-break: break-word;
              filter: drop-shadow(0 4px 25px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.25));
            }

            @media (max-width: 640px) {
              .cce-hero-title {
                font-size: clamp(36px, 9.5vw, 46px);
                line-height: 1.12;
                letter-spacing: 0.025em;
              }
            }

            .cce-hero-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(13px, 1.8vw, 19px);
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin: 0 0 24px 0;
              line-height: 1.4;
              text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
            }

            @media (max-width: 640px) {
              .cce-hero-motto {
                font-size: 15.5px;
                letter-spacing: 0.08em;
                line-height: 1.45;
              }
            }

            .cce-cta-short {
              display: inline;
            }
            .cce-cta-full {
              display: none;
            }

            @media (min-width: 640px) {
              .cce-cta-short {
                display: none;
              }
              .cce-cta-full {
                display: inline;
              }
            }

            .cce-hero-lead {
              font-size: clamp(15px, 2vw, 18px);
              line-height: 1.65;
              color: #E2E8F0;
              max-width: 820px;
              margin: 0 auto 36px auto;
              font-weight: 400;
            }

            /* Context Badges Grid (4 Badges) */
            .cce-badges-grid {
              display: grid;
              grid-template-columns: repeat(1, 1fr);
              gap: 16px;
              max-width: 1200px;
              margin: 0 auto;
            }

            @media (min-width: 600px) {
              .cce-badges-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
              }
            }

            @media (min-width: 1040px) {
              .cce-badges-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 18px;
              }
            }

            .cce-badge-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              text-align: center;
              padding: 28px 20px 24px 20px;
              background: linear-gradient(145deg, rgba(6, 78, 59, 0.55) 0%, rgba(2, 18, 14, 0.92) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.45);
              border-radius: 22px;
              box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5), inset 0 0 24px rgba(16, 185, 129, 0.12);
              transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
            }

            .cce-badge-card:hover {
              transform: translateY(-3px);
              border-color: rgba(212, 175, 55, 0.85);
              box-shadow: 0 18px 44px rgba(0, 0, 0, 0.65), 0 0 24px rgba(212, 175, 55, 0.22), inset 0 0 28px rgba(16, 185, 129, 0.2);
            }

            .cce-badge-icon {
              width: 58px;
              height: 58px;
              border-radius: 16px;
              background: linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(6, 78, 59, 0.55) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FDF6B2;
              flex-shrink: 0;
              margin-bottom: 16px;
              box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
            }

            .cce-badge-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: 100%;
            }

            .cce-badge-label {
              font-size: 11px;
              font-family: monospace;
              font-weight: 800;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: var(--cce-gold);
              margin-bottom: 6px;
              text-align: center;
            }

            .cce-badge-val {
              font-size: 17.5px;
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.25;
              letter-spacing: -0.01em;
              text-align: center;
            }

            .cce-badge-sub {
              font-size: 12.5px;
              color: #CBD5E1;
              margin-top: 6px;
              line-height: 1.35;
              text-align: center;
            }

            /* =========================================================
               SPRINT 2: MÓDULO PROTAGÓNICO CARLOS LORET & NICHO LAMBRÍN
               ========================================================= */
            .cce-loret-section {
              margin: 70px auto 90px auto;
              max-width: 1120px;
              position: relative;
              z-index: 10;
            }

            @media (max-width: 640px) {
              .cce-loret-section {
                margin: 50px auto 70px auto;
              }
            }

            /* Authentic Photorealistic Teak Lambrín Frame */
            .cce-lambrin-frame {
              position: relative;
              border-radius: 28px;
              border: 2px solid rgba(212, 175, 55, 0.65);
              box-shadow:
                0 35px 95px rgba(0, 0, 0, 0.95),
                0 0 55px rgba(212, 175, 55, 0.35),
                0 0 85px rgba(6, 78, 59, 0.55),
                inset 0 0 60px rgba(0, 0, 0, 0.6);
              overflow: hidden;
              background-color: #2b1a0e;
              padding: 44px 40px;
            }

            @media (max-width: 768px) {
              .cce-lambrin-frame {
                border-radius: 22px;
                padding: 24px 16px;
              }
            }

            /* Photographic Teak Slats */
            .cce-lambrin-slats {
              position: absolute;
              inset: 0;
              background-image: url('/assets/cce-juarez/lambrin_wood_texture.webp');
              background-repeat: repeat-x;
              background-position: center top;
              background-size: 136px 100%;
              opacity: 1;
            }

            /* Warm Architectural Ceiling Spotlight Wash */
            .cce-lambrin-overlay {
              position: absolute;
              inset: 0;
              background: radial-gradient(ellipse 95% 65% at 50% 10%, rgba(255, 245, 210, 0.14) 0%, transparent 70%);
              pointer-events: none;
            }

            /* 2-Column Responsive Layout (Cinematográfico en Desktop) */
            .cce-lambrin-grid {
              position: relative;
              z-index: 10;
              display: grid;
              grid-template-columns: 460px 1fr;
              gap: 48px;
              align-items: center;
            }

            @media (max-width: 1120px) {
              .cce-lambrin-grid {
                grid-template-columns: 400px 1fr;
                gap: 36px;
              }
            }

            @media (max-width: 960px) {
              .cce-lambrin-grid {
                grid-template-columns: 1fr;
                gap: 32px;
              }
            }

            /* Col 1: Video Vertical 9:16 */
            .cce-video-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }

            .cce-video-card {
              position: relative;
              width: 100%;
              max-width: 460px;
              aspect-ratio: 9 / 16;
              border-radius: 22px;
              overflow: hidden;
              border: 1.5px solid rgba(212, 175, 55, 0.55);
              box-shadow:
                0 30px 75px rgba(0, 0, 0, 0.9),
                0 0 45px rgba(212, 175, 55, 0.25);
              background: #000000;
              cursor: pointer;
            }

            @media (max-width: 960px) {
              .cce-video-card {
                max-width: 360px;
              }
            }

            .cce-video-element {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            /* Píldora de Sonido Externa (Debajo del Video) */
            .cce-video-audio-btn-external {
              position: relative;
              margin-top: 18px;
              width: 100%;
              max-width: 460px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 13px 22px;
              border-radius: 9999px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              cursor: pointer;
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
              user-select: none;
              text-align: center;
            }

            @media (max-width: 960px) {
              .cce-video-audio-btn-external {
                max-width: 360px;
              }
            }

            .cce-video-audio-btn-external:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(212, 175, 55, 0.75);
            }

            .cce-audio-btn-muted {
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-weight: 800;
              font-size: 12px;
              letter-spacing: 0.03em;
              border: 1.5px solid #FFF8DC;
              box-shadow: 0 6px 24px rgba(212, 175, 55, 0.65), 0 0 18px rgba(255, 248, 220, 0.35);
              animation: cceAudioPulse 2.2s infinite ease-in-out;
            }

            .cce-audio-btn-active {
              background: rgba(18, 12, 7, 0.88);
              color: #F3E5AB;
              font-weight: 700;
              font-size: 12px;
              border: 1.5px solid rgba(212, 175, 55, 0.6);
              backdrop-filter: blur(14px);
              box-shadow: 0 4px 18px rgba(0, 0, 0, 0.7);
            }

            @keyframes cceAudioPulse {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.65);
              }
              50% {
                transform: scale(1.025);
                box-shadow: 0 6px 28px rgba(212, 175, 55, 0.9), 0 0 25px rgba(243, 229, 171, 0.6);
              }
            }

            /* Video Overlay Play Indicator (Subtle Top-Right) */
            .cce-video-play-badge {
              position: absolute;
              top: 14px;
              right: 14px;
              z-index: 20;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background: rgba(3, 18, 14, 0.75);
              border: 1px solid rgba(212, 175, 55, 0.4);
              backdrop-filter: blur(8px);
              color: #F3E5AB;
              transition: all 0.2s ease;
              cursor: pointer;
            }

            .cce-video-play-badge:hover {
              transform: scale(1.1);
              background: rgba(6, 78, 59, 0.85);
            }

            /* Col 2: Editorial Column */
            .cce-editorial-col {
              background: rgba(3, 18, 14, 0.82);
              border: 1px solid rgba(212, 175, 55, 0.32);
              border-radius: 22px;
              padding: 34px 36px;
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
            }

            @media (max-width: 640px) {
              .cce-editorial-col {
                padding: 22px 18px;
                border-radius: 18px;
              }
            }

            .cce-loret-pill {
              display: inline-flex;
              align-items: center;
              gap: 7px;
              padding: 5px 14px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 10.5px;
              font-weight: 800;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: #F3E5AB;
              margin-bottom: 12px;
            }

            .cce-loret-name {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(26px, 3.8vw, 42px);
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.15;
              margin: 0 0 6px 0;
              letter-spacing: 0.025em;
            }

            .cce-loret-role {
              font-size: 12px;
              font-family: monospace;
              font-weight: 700;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold);
              margin-bottom: 14px;
            }

            .cce-loret-keynote-box {
              background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%);
              border: 1px solid rgba(212, 175, 55, 0.35);
              border-radius: 14px;
              padding: 14px 18px;
              margin-bottom: 20px;
              text-align: left;
            }

            .cce-keynote-tag {
              display: block;
              font-size: 10px;
              font-family: monospace;
              text-transform: uppercase;
              letter-spacing: 0.14em;
              color: var(--cce-gold);
              font-weight: 700;
              margin-bottom: 5px;
            }

            .cce-keynote-title {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(14px, 1.8vw, 16.5px);
              font-weight: 700;
              line-height: 1.4;
              color: #FFFFFF;
              margin: 0;
            }

            .cce-loret-semblanza-box {
              display: flex;
              flex-direction: column;
              gap: 13px;
              background: rgba(18, 11, 6, 0.72);
              border: 1px solid rgba(212, 175, 55, 0.28);
              border-radius: 16px;
              padding: 22px 24px;
              margin-bottom: 24px;
              backdrop-filter: blur(12px);
              box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5);
            }

            .cce-semblanza-lead {
              font-size: clamp(14px, 1.8vw, 15.5px);
              font-weight: 700;
              color: #FFFDF9;
              line-height: 1.55;
              border-left: 3px solid #D4AF37;
              padding-left: 12px;
            }

            .cce-semblanza-p {
              font-size: clamp(12.5px, 1.5vw, 13.5px);
              line-height: 1.65;
              color: #E2E8F0;
              margin: 0;
              font-weight: 400;
            }

            .cce-semblanza-p em {
              color: #F3E5AB;
              font-style: italic;
            }

            /* 3 Thematic Pillars */
            .cce-pillars-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 30px;
            }

            .cce-pillar-item {
              display: flex;
              align-items: flex-start;
              gap: 14px;
              padding: 14px 16px;
              background: rgba(2, 20, 15, 0.65);
              border: 1px solid rgba(212, 175, 55, 0.22);
              border-radius: 14px;
              transition: all 0.2s ease;
            }

            .cce-pillar-item:hover {
              border-color: rgba(212, 175, 55, 0.45);
              background: rgba(6, 78, 59, 0.35);
              transform: translateX(3px);
            }

            .cce-pillar-icon {
              width: 38px;
              height: 38px;
              border-radius: 10px;
              background: rgba(6, 78, 59, 0.65);
              border: 1px solid rgba(16, 185, 129, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #F3E5AB;
              flex-shrink: 0;
            }

            .cce-pillar-text {
              display: flex;
              flex-direction: column;
              min-width: 0;
            }

            .cce-pillar-title {
              font-size: 13.5px;
              font-weight: 800;
              color: #FFFFFF;
              line-height: 1.3;
              margin-bottom: 3px;
            }

            .cce-pillar-desc {
              font-size: 12px;
              color: #94A3B8;
              line-height: 1.5;
            }

            .cce-loret-cta {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 13px 26px;
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #03120E;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              border-radius: 9999px;
              border: 1px solid #FFF8DC;
              box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cce-loret-cta:hover {
              transform: translateY(-2px) scale(1.02);
              box-shadow: 0 10px 28px rgba(212, 175, 55, 0.55);
              background: linear-gradient(135deg, #FFF8DC 0%, #D4AF37 100%);
            }

            @media (max-width: 640px) {
              .cce-loret-cta {
                width: 100%;
                font-size: 15px;
                padding: 15px 22px;
                letter-spacing: 0.05em;
              }
            }

            /* =========================================================
               SECCIÓN 02: ENTREGA DE GALARDONES 2026 STYLES
               ========================================================= */
            .cce-galardones-section {
              max-width: 1200px;
              margin: 0 auto;
              padding: 70px 20px;
            }

            .cce-galardones-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(15px, 2.2vw, 19px);
              font-style: italic;
              color: var(--cce-gold-light);
              margin: -6px auto 16px auto;
              letter-spacing: 0.04em;
            }

            .cce-galardones-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              max-width: 960px;
              margin: 0 auto 32px auto;
            }

            @media (min-width: 768px) {
              .cce-galardones-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            .cce-galardon-card {
              position: relative;
              background: linear-gradient(180deg, rgba(6, 78, 59, 0.3) 0%, rgba(3, 18, 14, 0.85) 100%);
              border: 1px solid rgba(212, 175, 55, 0.3);
              border-radius: 20px;
              padding: 28px 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
              transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
            }

            .cce-galardon-card:hover {
              transform: translateY(-4px);
              border-color: rgba(212, 175, 55, 0.65);
              box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(212, 175, 55, 0.15);
            }

            .cce-galardon-card-featured {
              border-color: rgba(212, 175, 55, 0.5);
              background: linear-gradient(180deg, rgba(6, 78, 59, 0.45) 0%, rgba(3, 18, 14, 0.9) 100%);
            }

            .cce-galardon-badge {
              font-size: 10px;
              font-family: monospace;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              font-weight: 700;
              color: var(--cce-gold);
              background: rgba(212, 175, 55, 0.12);
              border: 1px solid rgba(212, 175, 55, 0.35);
              padding: 4px 12px;
              border-radius: 9999px;
              margin-bottom: 20px;
            }

            .cce-badge-gold {
              background: rgba(212, 175, 55, 0.22);
              color: #FFF8DC;
              border-color: rgba(212, 175, 55, 0.6);
            }

            .cce-galardon-img-wrap {
              width: 100%;
              max-width: 220px;
              height: 260px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
              border-radius: 16px;
            }

            .cce-galardon-trophy-img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.7));
            }

            .cce-galardon-body {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }

            .cce-galardon-tagline {
              font-size: 11px;
              font-family: monospace;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-weight: 700;
              margin-bottom: 4px;
            }

            .cce-galardon-name {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: clamp(18px, 2.4vw, 22px);
              font-weight: 700;
              color: #FFFFFF;
              margin-bottom: 12px;
              letter-spacing: 0.04em;
            }

            .cce-galardon-desc {
              font-size: 13px;
              line-height: 1.6;
              color: #CBD5E1;
              margin-bottom: 18px;
              max-width: 380px;
            }

            .cce-galardon-criteria {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 11.5px;
              color: var(--cce-gold-light);
              background: rgba(6, 78, 59, 0.4);
              padding: 8px 14px;
              border-radius: 10px;
              border: 1px solid rgba(16, 185, 129, 0.25);
              text-align: left;
            }

            .cce-institutional-contact-bar {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              max-width: 680px;
              margin: 0 auto;
              padding: 14px 20px;
              background: rgba(3, 18, 14, 0.7);
              border: 1px solid rgba(212, 175, 55, 0.25);
              border-radius: 12px;
              font-size: 12.5px;
              color: #E2E8F0;
              text-align: center;
            }

            .cce-contact-link {
              color: var(--cce-gold);
              font-weight: 700;
              text-decoration: underline;
              margin-left: 4px;
            }

            .cce-contact-link:hover {
              color: #FFF8DC;
            }

            /* =========================================================
               SPRINT 3: PASE 3D BOLETOS, GUÍA SPEI & PUNTOS DE VENTA
               ========================================================= */

            /* Section Common Headers */
            .cce-section-header {
              text-align: center;
              max-width: 820px;
              margin: 0 auto 40px auto;
            }

            .cce-section-pill {
              display: inline-flex;
              align-items: center;
              gap: 7px;
              padding: 6px 16px;
              background: rgba(6, 78, 59, 0.55);
              border: 1px solid rgba(212, 175, 55, 0.4);
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin-bottom: 16px;
            }

            .cce-section-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: clamp(24px, 4vw, 38px);
              font-weight: 800;
              line-height: 1.25;
              letter-spacing: 0.025em;
              color: #FFFFFF;
              margin: 0 0 12px 0;
            }

            .cce-section-subtitle {
              font-size: clamp(13px, 1.8vw, 15px);
              color: #94A3B8;
              line-height: 1.6;
              margin: 0;
            }


            /* =========================================================
               PROPUESTA 1: FOOTER MODULAR CÚPULA EMPRESARIAL
               ========================================================= */
            .cce-footer {
              position: relative;
              z-index: 10;
              border-top: 1.5px solid rgba(212, 175, 55, 0.4);
              background: linear-gradient(180deg, rgba(2, 20, 15, 0.98) 0%, rgba(1, 10, 8, 1) 100%);
              padding: 70px 20px 36px 20px;
              margin-top: 80px;
              overflow: hidden;
            }

            .cce-footer-container {
              max-width: 1200px;
              margin: 0 auto;
              position: relative;
              z-index: 5;
            }

            .cce-footer-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
            }

            @media (min-width: 640px) {
              .cce-footer-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
              }
            }

            @media (min-width: 1024px) {
              .cce-footer-grid {
                grid-template-columns: 1.35fr 1.05fr 1.15fr 1fr;
                gap: 24px;
                align-items: stretch;
              }
            }

            .cce-footer-col {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
              background: linear-gradient(180deg, rgba(3, 24, 18, 0.95) 0%, rgba(1, 14, 10, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.35);
              border-radius: 20px;
              padding: 28px 24px;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              position: relative;
              z-index: 5;
              width: 100%;
            }

            .cce-footer-brand {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              width: 100%;
              filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.7));
            }

            .cce-footer-brand img {
              height: 160px !important;
              width: auto !important;
              max-width: 100%;
            }

            @media (max-width: 640px) {
              .cce-footer-brand img {
                height: 130px !important;
              }
            }

            .cce-footer-motto {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: 14.5px;
              font-style: italic;
              color: var(--cce-gold-light);
              margin-bottom: 12px;
              letter-spacing: 0.03em;
            }

            .cce-footer-text {
              font-size: 13.5px;
              color: #CBD5E1;
              line-height: 1.6;
              margin: 0 0 18px 0;
            }

            .cce-footer-contact-inline {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 13.5px;
              color: #E2E8F0;
              background: rgba(6, 78, 59, 0.35);
              border: 1px solid rgba(212, 175, 55, 0.3);
              padding: 8px 16px;
              border-radius: 9999px;
            }

            .cce-footer-link-highlight {
              color: var(--cce-gold);
              font-weight: 700;
              text-decoration: underline;
              transition: color 0.2s ease;
            }

            .cce-footer-link-highlight:hover {
              color: #FFF8DC;
            }

            .cce-footer-col-title {
              font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
              font-size: 14.5px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--cce-gold-light);
              margin: 0 0 18px 0;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(212, 175, 55, 0.25);
              width: 100%;
              display: flex;
              align-items: center;
              gap: 9px;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95);
            }

            .cce-footer-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;
            }

            .cce-footer-org-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 12px;
              padding: 8px 10px;
              border-radius: 12px;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              background: rgba(2, 20, 15, 0.75);
              border: 1px solid rgba(212, 175, 55, 0.2);
              width: 100%;
            }

            .cce-footer-org-item:hover {
              background: rgba(6, 78, 59, 0.4);
              border-color: rgba(212, 175, 55, 0.4);
              transform: translateX(3px);
            }

            .cce-org-logo-wrap {
              width: 58px;
              height: 42px;
              min-width: 58px;
              border-radius: 8px;
              background: rgba(2, 20, 15, 0.92);
              border: 1px solid rgba(212, 175, 55, 0.38);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 3px 4px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
              overflow: hidden;
            }

            .cce-org-logo-wrap img {
              width: 100%;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .cce-org-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .cce-org-name {
              font-size: 13.5px;
              font-weight: 800;
              color: #F8FAFC;
              letter-spacing: 0.02em;
            }

            .cce-org-desc {
              font-size: 11.5px;
              color: #94A3B8;
              line-height: 1.3;
            }

            .cce-footer-info-item {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              padding: 10px 12px;
              background: rgba(6, 78, 59, 0.25);
              border: 1px solid rgba(212, 175, 55, 0.2);
              border-radius: 12px;
              width: 100%;
              transition: all 0.2s ease;
            }

            .cce-footer-info-item:hover {
              background: rgba(6, 78, 59, 0.45);
              border-color: rgba(212, 175, 55, 0.45);
            }

            .cce-footer-info-icon {
              width: 30px;
              height: 30px;
              border-radius: 8px;
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid rgba(212, 175, 55, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--cce-gold-light);
              flex-shrink: 0;
              margin-top: 2px;
            }

            .cce-footer-info-label {
              display: block;
              font-size: 11px;
              font-family: monospace;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--cce-gold);
              font-weight: 800;
              margin-bottom: 2px;
            }

            .cce-footer-info-val {
              font-size: 13.5px;
              font-weight: 600;
              color: #FFFFFF;
              line-height: 1.4;
            }

            .cce-footer-nav-link {
              font-size: 14px;
              font-weight: 600;
              color: #E2E8F0;
              text-decoration: none;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              border-radius: 10px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              width: 100%;
            }

            .cce-footer-nav-link:hover {
              color: var(--cce-gold-light);
              background: rgba(6, 78, 59, 0.4);
              border-color: rgba(212, 175, 55, 0.4);
              transform: translateX(4px);
            }

            .cce-footer-privacy-btn {
              background: rgba(212, 175, 55, 0.12);
              border: 1px solid rgba(212, 175, 55, 0.35);
              padding: 10px 14px;
              border-radius: 10px;
              color: var(--cce-gold-light);
              font-size: 13px;
              font-weight: 700;
              cursor: pointer;
              text-align: left;
              transition: all 0.2s ease;
              width: 100%;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .cce-footer-privacy-btn:hover {
              background: rgba(212, 175, 55, 0.25);
              color: #FFFFFF;
              border-color: var(--cce-gold);
            }

            .cce-footer-privacy-btn:hover {
              color: #FFF8DC;
            }

            .cce-footer-bottom {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 1px solid rgba(212, 175, 55, 0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }

            .cce-footer-copy {
              font-size: 11.5px;
              font-family: monospace;
              color: #64748B;
              letter-spacing: 0.06em;
              text-align: center;
            }



            /* =========================================================
               HERO QUICK ACTION BAR & INVITACIÓN ESPECIAL VENUE SECTION
               ========================================================= */
            .cce-inv-hero-actions {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 14px;
              margin: 28px auto 0 auto;
              position: relative;
              z-index: 6;
            }

            .cce-inv-btn-primary {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 15px 26px;
              border-radius: 14px;
              background: linear-gradient(135deg, #FFF8DB 0%, #F5DE98 25%, #D4AF37 68%, #AA8022 100%);
              color: #03120E;
              font-weight: 800;
              font-size: 14.5px;
              letter-spacing: 0.02em;
              text-decoration: none;
              border: 1px solid #FFE8A3;
              box-shadow: 0 12px 32px rgba(212, 175, 55, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.8);
              cursor: pointer;
              transition: transform 0.22s ease, box-shadow 0.22s ease;
            }

            .cce-inv-btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 16px 38px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.9);
            }

            .cce-inv-btn-secondary {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 15px 24px;
              border-radius: 14px;
              background: rgba(6, 78, 59, 0.62);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              color: #F3E5AB;
              font-weight: 700;
              font-size: 14.5px;
              letter-spacing: 0.02em;
              text-decoration: none;
              border: 1px solid rgba(212, 175, 55, 0.48);
              box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
              cursor: pointer;
              transition: all 0.22s ease;
            }

            .cce-inv-btn-secondary:hover {
              background: rgba(6, 95, 70, 0.82);
              border-color: #F5DE98;
              color: #FFFFFF;
              transform: translateY(-2px);
            }

            .cce-venue-section {
              position: relative;
              max-width: 1180px;
              margin: 80px auto 100px auto;
              padding: 0 20px;
              z-index: 5;
            }

            .cce-venue-card {
              position: relative;
              z-index: 5;
              background: linear-gradient(155deg, rgba(4, 34, 25, 0.95) 0%, rgba(2, 18, 13, 0.98) 100%);
              border: 1.5px solid rgba(212, 175, 55, 0.48);
              border-radius: 28px;
              padding: 40px 38px;
              box-shadow: 0 32px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(16, 185, 129, 0.16);
              display: grid;
              grid-template-columns: 1.05fr 0.95fr;
              gap: 36px;
              align-items: stretch;
            }

            .cce-venue-info-col {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 22px;
            }

            .cce-venue-detail-list {
              display: grid;
              grid-template-columns: 1fr;
              gap: 14px;
            }

            .cce-venue-detail-item {
              display: flex;
              align-items: flex-start;
              gap: 14px;
              padding: 15px 18px;
              border-radius: 16px;
              background: rgba(6, 78, 59, 0.28);
              border: 1px solid rgba(212, 175, 55, 0.24);
            }

            .cce-venue-detail-icon {
              width: 42px;
              height: 42px;
              border-radius: 12px;
              background: rgba(212, 175, 55, 0.14);
              border: 1px solid rgba(212, 175, 55, 0.38);
              color: #F3E5AB;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .cce-venue-detail-label {
              display: block;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #F3E5AB;
              margin-bottom: 3px;
            }

            .cce-venue-detail-val {
              display: block;
              font-size: 16.5px;
              font-weight: 700;
              color: #FFFFFF;
              line-height: 1.35;
            }

            .cce-venue-detail-sub {
              display: block;
              font-size: 13.5px;
              color: #CBD5E1;
              margin-top: 2px;
            }

            .cce-venue-actions-stack {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-top: 4px;
            }

            .cce-venue-cal-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .cce-venue-map-wrap {
              position: relative;
              border-radius: 20px;
              overflow: hidden;
              border: 1.5px solid rgba(212, 175, 55, 0.42);
              min-height: 360px;
              background: #02150F;
              box-shadow: 0 18px 45px rgba(0, 0, 0, 0.65);
            }

            .cce-venue-map-iframe {
              width: 100%;
              height: 100%;
              min-height: 360px;
              border: 0;
              display: block;
              filter: contrast(1.03) saturate(0.95);
            }

            @media (max-width: 920px) {
              .cce-venue-card {
                grid-template-columns: 1fr;
                padding: 26px 20px;
                gap: 26px;
              }

              .cce-venue-map-wrap,
              .cce-venue-map-iframe {
                min-height: 290px;
              }
            }

            @media (max-width: 640px) {
              .cce-inv-hero-actions {
                flex-direction: column;
                padding: 0 14px;
                width: 100%;
                max-width: 420px;
              }

              .cce-inv-btn-primary,
              .cce-inv-btn-secondary {
                width: 100%;
              }

              .cce-venue-section {
                margin: 56px auto 72px auto;
                padding: 0 14px;
              }

              .cce-venue-cal-row {
                grid-template-columns: 1fr;
              }
            }

          `,
        }}
      />

      {/* Ambient Living Canvas */}
      <div className="cce-living-canvas" aria-hidden="true">
        <div className="cce-aurora-orb-1" />
        <div className="cce-aurora-orb-2" />
        <div className="cce-aurora-orb-3" />
      </div>

      <main className="cce-content-wrap">
        {/* HERO DE INVITACIÓN ESPECIAL */}
        <section className="cce-hero" aria-labelledby="hero-main-title">
          <div className="cce-hero-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-x-arm-1">
              <div className="cce-band-sub" />
              <div className="cce-band-main">
                <div className="cce-band-sheen" />
              </div>
            </div>
            <div className="cce-x-arm-2">
              <div className="cce-band-main">
                <div className="cce-band-sheen" />
              </div>
              <div className="cce-band-sub" />
            </div>
            <div className="cce-sash-bottom-full">
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen" />
              </div>
              <div className="cce-band-sub" />
            </div>
          </div>

          <div className="cce-hero-logo-box">
            <Image
              src="/assets/cce-juarez/cce_logo_verde_transparente.png"
              alt="Consejo Coordinador Empresarial Ciudad Juárez"
              width={340}
              height={217}
              priority
              unoptimized
              className="cce-hero-logo-img"
            />
          </div>

          <div className="cce-hero-pill">
            <Sparkles size={14} color="#F3E5AB" />
            <span>Invitación Especial · Invitado de Honor</span>
          </div>

          <h1 id="hero-main-title" className="cce-hero-title cce-gold-shimmer-text">
            Galardones 2026
          </h1>

          <div className="cce-hero-motto">
            Liderazgo que impulsa el futuro en Ciudad Juárez
          </div>

          <p className="cce-hero-lead">
            Será un honor contar con su distinguida presencia en la ceremonia de Entrega de
            Galardones Empresariales 2026 y en la Conferencia Magistral impartida por{' '}
            <strong>Carlos Loret de Mola</strong>:{' '}
            <em>México y Estados Unidos: Poder, política y economía en tiempos de cambio</em>.
          </p>

          {/* 4 Tarjetas de Datos Clave */}
          <div className="cce-badges-grid">
            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Calendar size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Fecha Oficial</span>
                <span className="cce-badge-val">Jueves 19 Noviembre</span>
                <span className="cce-badge-sub">Año 2026</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Clock size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Horario Oficial</span>
                <span className="cce-badge-val">8:30 A.M. Registro</span>
                <span className="cce-badge-sub">9:00 A.M. Inicio Desayuno</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <MapPin size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Sede Oficial</span>
                <span className="cce-badge-val">Centro de Eventos Cibeles</span>
                <span className="cce-badge-sub">Blvd. Tomás Fernández 8450</span>
              </div>
            </div>

            <div className="cce-badge-card">
              <div className="cce-badge-icon">
                <Award size={28} />
              </div>
              <div className="cce-badge-content">
                <span className="cce-badge-label">Código de Vestimenta</span>
                <span className="cce-badge-val">Vestimenta Formal</span>
                <span className="cce-badge-sub">Gala Empresarial CCE</span>
              </div>
            </div>
          </div>

          {/* Botones Rápidos de Ubicación y Video */}
          <div className="cce-inv-hero-actions">
            <a
              href="#ubicacion"
              onClick={(e) => scrollToSection(e, 'ubicacion')}
              className="cce-inv-btn-primary"
            >
              <MapPin size={17} />
              <span>Ver Ubicación y Agendar Evento</span>
            </a>
            <a
              href="#video-loret"
              onClick={(e) => scrollToSection(e, 'video-loret')}
              className="cce-inv-btn-secondary"
            >
              <Play size={16} />
              <span>Ver Mensaje de Carlos Loret de Mola</span>
            </a>
          </div>
        </section>

        {/* SECCIÓN 01: ENTREGA DE GALARDONES 2026 */}
        <section
          id="galardones"
          className="cce-galardones-section"
          aria-labelledby="galardones-main-title"
          style={{ scrollMarginTop: '90px' }}
        >
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-galardones">
              <div className="cce-band-sub" />
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-1" />
              </div>
            </div>
          </div>

          <div className="cce-section-header">
            <div className="cce-section-pill">
              <Award size={13} color="#F3E5AB" />
              <span>Mérito y Liderazgo Empresarial</span>
            </div>
            <h2 id="galardones-main-title" className="cce-section-title">
              Entrega de Galardones 2026
            </h2>
            <div className="cce-galardones-motto">
              Liderazgo que impulsa el futuro en Juárez
            </div>
            <p className="cce-section-subtitle">
              Un encuentro especial para reconocer la trayectoria, el esfuerzo y la visión de
              quienes impulsan el desarrollo económico y social de Ciudad Juárez.
            </p>
          </div>

          <div className="cce-galardones-grid">
            <div className="cce-galardon-card">
              <div className="cce-galardon-badge">
                <span>Categoría Corporativa</span>
              </div>
              <div className="cce-galardon-img-wrap">
                <Image
                  src="/assets/cce-juarez/trofeo_empresa_ano.png"
                  alt="Trofeo Estrella Ascendente - Empresa del Año 2026"
                  width={200}
                  height={260}
                  unoptimized
                  className="cce-galardon-trophy-img"
                />
              </div>
              <div className="cce-galardon-body">
                <span className="cce-galardon-tagline">Estrella Ascendente</span>
                <h3 className="cce-galardon-name cce-gold-shimmer-text">Empresa del Año 2026</h3>
                <p className="cce-galardon-desc">
                  Distinción a la organización productiva que sobresale por su dinamismo, innovación
                  en procesos, generación de empleo formal de alto valor y sólida visión de futuro en
                  la región fronteriza.
                </p>
                <div className="cce-galardon-criteria">
                  <CheckCircle2 size={15} color="#D4AF37" />
                  <span>Innovación, crecimiento y aporte socioeconómico a Ciudad Juárez</span>
                </div>
              </div>
            </div>

            <div className="cce-galardon-card cce-galardon-card-featured">
              <div className="cce-galardon-badge cce-badge-gold">
                <span>Máximo Galardón Institucional</span>
              </div>
              <div className="cce-galardon-img-wrap">
                <Image
                  src="/assets/cce-juarez/trofeo_empresario_ano.png"
                  alt="Trofeo De Altos Vuelos - Empresario del Año 2026"
                  width={200}
                  height={260}
                  unoptimized
                  className="cce-galardon-trophy-img"
                />
              </div>
              <div className="cce-galardon-body">
                <span className="cce-galardon-tagline">De Altos Vuelos</span>
                <h3 className="cce-galardon-name cce-gold-shimmer-text">Empresario del Año 2026</h3>
                <p className="cce-galardon-desc">
                  El más alto reconocimiento otorgado por el Consejo Coordinador Empresarial a la
                  trayectoria directiva, integridad ética, resiliencia y liderazgo trascendental que
                  engrandece a nuestra comunidad.
                </p>
                <div className="cce-galardon-criteria">
                  <CheckCircle2 size={15} color="#D4AF37" />
                  <span>Trayectoria directiva consolidada y compromiso social ejemplar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 02: CONFERENCIA MAGISTRAL CARLOS LORET DE MOLA */}
        <section
          id="video-loret"
          className="cce-loret-section"
          aria-labelledby="loret-section-title"
          style={{ scrollMarginTop: '90px' }}
        >
          <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
            <div className="cce-sash-loret">
              <div className="cce-band-main-sash">
                <div className="cce-band-sheen cce-sheen-delay-2" />
              </div>
              <div className="cce-band-sub" />
            </div>
          </div>

          <div className="cce-lambrin-frame">
            <div className="cce-lambrin-slats" aria-hidden="true" />
            <div className="cce-lambrin-overlay" aria-hidden="true" />

            <div className="cce-lambrin-grid">
              <div className="cce-video-col">
                <div
                  className="cce-video-card"
                  onClick={toggleMute}
                  role="region"
                  aria-label="Mensaje de invitación de Carlos Loret de Mola"
                >
                  <video
                    ref={videoRef}
                    className="cce-video-element"
                    src="/assets/cce-juarez/video_loret_916.mp4"
                    poster="/assets/cce-juarez/poster_loret_916.jpg"
                    playsInline
                    autoPlay
                    muted
                    loop
                  />

                  <button
                    type="button"
                    className="cce-video-play-badge"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                  >
                    {isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} style={{ marginLeft: '2px' }} />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  className={`cce-video-audio-btn-external ${
                    isMuted ? 'cce-audio-btn-muted' : 'cce-audio-btn-active'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={15} />
                      <span>🔊 Toca para escuchar a Carlos Loret de Mola</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} />
                      <span>🔈 Audio activo · Toca para silenciar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="cce-editorial-col">
                <div className="cce-loret-pill">
                  <Mic size={13} color="#F3E5AB" />
                  <span>CONFERENCIA MAGISTRAL EXCLUSIVA</span>
                </div>

                <h2 id="loret-section-title" className="cce-loret-name">
                  Carlos Loret de Mola Álvarez
                </h2>

                <div className="cce-loret-role">
                  Periodista, Conductor y Analista · Semblanza Oficial
                </div>

                <div className="cce-loret-keynote-box">
                  <span className="cce-keynote-tag">Conferencia Magistral</span>
                  <h3 className="cce-keynote-title cce-gold-shimmer-text">
                    México y Estados Unidos: Poder, política y economía en tiempos de cambio
                  </h3>
                </div>

                <div className="cce-loret-semblanza-box">
                  <div className="cce-semblanza-lead">
                    Carlos Loret de Mola es uno de los periodistas más influyentes de México.
                  </div>
                  <p className="cce-semblanza-p">
                    Es fundador de la plataforma Latinus que rápidamente se volvió uno de los medios
                    de comunicación más importantes del país. Ahí conduce todas las noches el
                    programa <em>Loret en Latinus</em>. También tiene un noticiario diario en W Radio
                    y escribe tres veces a la semana la columna <em>Historias de Reportero</em> en el
                    periódico El Universal.
                  </p>
                  <p className="cce-semblanza-p">
                    Loret nunca ha dejado de ser reportero y se le conoce por sus coberturas de
                    guerra y de algunos de los acontecimientos políticos y desastres naturales más
                    graves en la historia reciente.
                  </p>
                  <p className="cce-semblanza-p">
                    Ha escrito libros sobre el narcotráfico y las guerras que ha cubierto, a la vez
                    que ha participado en varios documentales cinematográficos de talla
                    internacional.
                  </p>
                </div>

                <a
                  href="#ubicacion"
                  onClick={(e) => scrollToSection(e, 'ubicacion')}
                  className="cce-loret-cta"
                >
                  <span>Ver Sede, Horario y Ubicación</span>
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 03: SEDE, UBICACIÓN Y AGENDA EN 1 TOQUE */}
        <section
          id="ubicacion"
          className="cce-venue-section"
          aria-labelledby="ubicacion-main-title"
          style={{ scrollMarginTop: '90px' }}
        >
          <div className="cce-section-header">
            <div className="cce-section-pill">
              <MapPin size={13} color="#F3E5AB" />
              <span>Recepción de Invitados Especiales</span>
            </div>
            <h2 id="ubicacion-main-title" className="cce-section-title">
              Sede, Horario y Ubicación
            </h2>
            <p className="cce-section-subtitle">
              Consulta los detalles para tu llegada al recinto, abre la ruta directa en Google Maps
              o guarda el recordatorio en el calendario de tu celular.
            </p>
          </div>

          <div className="cce-venue-card">
            <div className="cce-venue-info-col">
              <div className="cce-venue-detail-list">
                <div className="cce-venue-detail-item">
                  <div className="cce-venue-detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="cce-venue-detail-label">Fecha del Evento</span>
                    <span className="cce-venue-detail-val">Jueves 19 de noviembre de 2026</span>
                    <span className="cce-venue-detail-sub">
                      Entrega de Galardones y Conferencia Magistral
                    </span>
                  </div>
                </div>

                <div className="cce-venue-detail-item">
                  <div className="cce-venue-detail-icon">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="cce-venue-detail-label">Horario</span>
                    <span className="cce-venue-detail-val">8:30 a.m. Registro de Asistentes</span>
                    <span className="cce-venue-detail-sub">9:00 a.m. Inicio puntual del desayuno</span>
                  </div>
                </div>

                <div className="cce-venue-detail-item">
                  <div className="cce-venue-detail-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="cce-venue-detail-label">Recinto Sede</span>
                    <span className="cce-venue-detail-val">Centro de Eventos Cibeles</span>
                    <span className="cce-venue-detail-sub">
                      Blvd. Tomás Fernández 8450, Cd. Juárez, Chih.
                    </span>
                  </div>
                </div>

                <div className="cce-venue-detail-item">
                  <div className="cce-venue-detail-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="cce-venue-detail-label">Código de Vestimenta</span>
                    <span className="cce-venue-detail-val">Vestimenta Formal</span>
                    <span className="cce-venue-detail-sub">Ceremonia de Gala Empresarial CCE</span>
                  </div>
                </div>
              </div>

              <div className="cce-venue-actions-stack">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cce-inv-btn-primary"
                >
                  <MapPin size={18} />
                  <span>Cómo llegar en Google Maps</span>
                  <ExternalLink size={15} />
                </a>

                <div className="cce-venue-cal-row">
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="cce-inv-btn-secondary"
                  >
                    <Download size={16} />
                    <span>Calendario iPhone / Apple</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cce-inv-btn-secondary"
                  >
                    <CalendarPlus size={16} />
                    <span>Google Calendar</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="cce-venue-map-wrap">
              <iframe
                title="Ubicación Centro de Eventos Cibeles"
                className="cce-venue-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Centro+de+Eventos+Cibeles+Blvd+Tomas+Fernandez+8450+Ciudad+Juarez&output=embed"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="cce-footer">
        <div className="cce-section-cintillos-fullbleed" aria-hidden="true">
          <div className="cce-sash-footer">
            <div className="cce-band-main-sash">
              <div className="cce-band-sheen" />
            </div>
            <div className="cce-band-sub" />
          </div>
        </div>

        <div className="cce-footer-container">
          <div className="cce-footer-grid">
            <div className="cce-footer-col cce-footer-col-main">
              <div className="cce-footer-brand">
                <Image
                  src="/assets/cce-juarez/cce_logo_hero_white.svg"
                  alt="Consejo Coordinador Empresarial Ciudad Juárez"
                  width={400}
                  height={220}
                  unoptimized
                  style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              <div className="cce-footer-motto">
                Liderazgo que impulsa el futuro en Juárez
              </div>

              <p className="cce-footer-text">
                Órgano de concertación y representación del sector productivo privado de Ciudad
                Juárez. Articula el liderazgo empresarial para impulsar la competitividad, la
                atracción de inversión y el desarrollo socioeconómico sostenible en nuestra frontera.
              </p>
            </div>

            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <Building2 size={15} color="#D4AF37" />
                <span>Organismos Coordinados</span>
              </h4>
              <ul className="cce-footer-list">
                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/index_juarez.png"
                      alt="INDEX Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">INDEX Juárez</span>
                    <span className="cce-org-desc">Industria Manufacturera y de Exportación</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/cmic_juarez_clean.png"
                      alt="CMIC Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">CMIC Juárez</span>
                    <span className="cce-org-desc">Cámara Mexicana de la Industria de la Construcción</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/canacar_transportistas.svg"
                      alt="Asociación de Transportistas de Cd. Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">Asociación de Transportistas de Cd. Juárez</span>
                    <span className="cce-org-desc">Sector Autotransporte y Logística de Carga</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/central_abastos_juarez.svg"
                      alt="Central de Abastos de Cd. Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">Central de Abastos de Cd. Juárez</span>
                    <span className="cce-org-desc">Comercio Mayorista, Abasto y Distribución</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/amexme_juarez.svg"
                      alt="AMEXME Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">AMEXME Juárez</span>
                    <span className="cce-org-desc">Asociación Mexicana de Mujeres Empresarias</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/ampi_juarez_clean.png"
                      alt="AMPI Juárez"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">AMPI Juárez</span>
                    <span className="cce-org-desc">Asociación Mexicana de Profesionales Inmobiliarios</span>
                  </div>
                </li>

                <li className="cce-footer-org-item">
                  <div className="cce-org-logo-wrap">
                    <Image
                      src="/assets/cce-juarez/organismos/evm_juarez.png"
                      alt="EVM"
                      width={38}
                      height={30}
                      unoptimized
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cce-org-info">
                    <span className="cce-org-name">EVM</span>
                    <span className="cce-org-desc">Ejecutivos de Ventas y Mercadotecnia</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <Calendar size={15} color="#D4AF37" />
                <span>Resumen del Evento</span>
              </h4>
              <ul className="cce-footer-list">
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Calendar size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Fecha</span>
                    <span className="cce-footer-info-val">Jueves 19 de noviembre 2026</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Clock size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Horario</span>
                    <span className="cce-footer-info-val">8:30 A.M. Registro · 9:00 A.M. Desayuno</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><MapPin size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Sede Oficial</span>
                    <span className="cce-footer-info-val">Centro de Eventos Cibeles (Blvd. Tomás Fernández 8450)</span>
                  </div>
                </li>
                <li className="cce-footer-info-item">
                  <div className="cce-footer-info-icon"><Award size={13} /></div>
                  <div>
                    <span className="cce-footer-info-label">Código de Vestimenta</span>
                    <span className="cce-footer-info-val">Vestimenta Formal</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="cce-footer-col">
              <h4 className="cce-footer-col-title">
                <ShieldCheck size={15} color="#D4AF37" />
                <span>Secciones de la Invitación</span>
              </h4>
              <ul className="cce-footer-list">
                <li>
                  <a href="#galardones" onClick={(e) => scrollToSection(e, 'galardones')} className="cce-footer-nav-link">
                    → Entrega de Galardones 2026
                  </a>
                </li>
                <li>
                  <a href="#video-loret" onClick={(e) => scrollToSection(e, 'video-loret')} className="cce-footer-nav-link">
                    → Conferencia Carlos Loret de Mola
                  </a>
                </li>
                <li>
                  <a href="#ubicacion" onClick={(e) => scrollToSection(e, 'ubicacion')} className="cce-footer-nav-link">
                    → Sede, Ubicación y Calendario
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="cce-footer-bottom">
            <div className="cce-footer-copy">
              © 2026 Consejo Coordinador Empresarial de Ciudad Juárez · Invitación Especial Galardones 2026.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
