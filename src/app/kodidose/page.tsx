'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sun,
  Moon,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sliders,
  X,
  Play,
  Pause,
  Volume2,
  Lock,
  Gift,
  ShoppingBag,
  Eye,
  FileText,
  ChevronDown,
  Check,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function KodiDoseLanding() {
  // --- STATES ---
  const [activePillar, setActivePillar] = useState<'rise' | 'focus' | 'balance' | 'unwind'>('rise');
  const [isSubscription, setIsSubscription] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [coaModalOpen, setCoaModalOpen] = useState(false);
  const [lotInput, setLotInput] = useState('#KD-2026-08');
  const [lotVerified, setLotVerified] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // --- SCROLL ANIMATIONS ---
  const { scrollY, scrollYProgress } = useScroll();

  // Background and Text color interpolation based on scroll
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.50, 0.78, 1.0],
    ['#FFFDF9', '#FAF5F0', '#F3F8F5', '#161327', '#0A0914']
  );

  const ambientGlow = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 0.85],
    [
      'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(255, 255, 255, 0) 65%)',
      'radial-gradient(circle at 60% 30%, rgba(225, 29, 72, 0.12) 0%, rgba(255, 255, 255, 0) 65%)',
      'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 65%)',
      'radial-gradient(circle at 50% 60%, rgba(139, 92, 246, 0.25) 0%, rgba(10, 9, 20, 0) 70%)',
    ]
  );

  // Sticky bottom bar trigger
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setShowStickyBar(latest > 500);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Audio simulator timer
  useEffect(() => {
    let interval: any;
    if (playingAudio !== null) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setPlayingAudio(null);
            return 0;
          }
          return prev + 10;
        });
      }, 500);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [playingAudio]);

  const toggleAudio = (id: number) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(id);
      setAudioProgress(0);
    }
  };

  // Pillars Data
  const pillarsData = {
    rise: {
      tag: '07:00 AM · ACTIVACIÓN CELULAR',
      name: 'Rise · Green Start',
      color: 'from-amber-500 to-orange-400',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      headline: 'Energía limpia sin picos ni taquicardia.',
      description: 'Pouch concentrado en polvo con clorofila pura, espirulina, 6.5B UFC de probióticos vivos y electrolitos biodisponibles para desinflamar el tracto digestivo y oxigenar tus células desde el ayuno.',
      packaging: '/kodidose/pouch_green_start.webp',
      molecules: ['6.5B UFC Cepa BLC1', 'Espirulina & Chlorella', 'Electrolitos Quelados', '0% Maltodextrina'],
      dose: '1 Scoop en 350ml de agua fresca'
    },
    focus: {
      tag: '11:30 AM · CLARIDAD & ATP',
      name: 'Focus · Neuro Drive',
      color: 'from-rose-500 to-pink-500',
      textColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      headline: 'Enfoque sostenido donde el cerebro lo exige.',
      description: 'Cápsulas de absorción rápida con L-Methylfolato activo (200mcg), fosfatidilserina y complejo B bioidéntico. Favorece la concentración ejecutiva y el rendimiento cognitivo sin alterar tu sistema nervioso.',
      packaging: '/kodidose/packaging_line_trio.webp',
      molecules: ['L-Methylfolato (Forma Activa)', 'Fosfatidilserina', 'Vitamina B6 & B12', 'Cero Cafeína Anhidra'],
      dose: '2 Cápsulas con snack ligero'
    },
    balance: {
      tag: '03:30 PM · REPARACIÓN TISULAR',
      name: 'Balance · Daily Core',
      color: 'from-emerald-500 to-teal-400',
      textColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      headline: 'Equilibrio metabólico y nutrición dérmica.',
      description: 'Frasco esmerilado con péptidos bioactivos de colágeno puro, ácido hialurónico molecular y resveratrol. Combate el estrés oxidativo de la media tarde y nutre tu barrera cutánea y articular.',
      packaging: '/kodidose/hero_jars_translucent.webp',
      molecules: ['Péptidos Bioactivos', 'Ácido Hialurónico Puro', 'Resveratrol Trans', 'Vitamina C Esterificada'],
      dose: '1 Porción disuelta o en cápsula'
    },
    unwind: {
      tag: '09:30 PM · SUEÑO REM PROFUNDO',
      name: 'Unwind · Night Calm',
      color: 'from-purple-600 to-indigo-500',
      textColor: 'text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      headline: 'Relajación neuromuscular y arquitectura del sueño.',
      description: 'Bisglicinato de Magnesio quelado al 80% combinado con L-Teanina y Vitamina D3. Permite la transición biológica al sueño profundo sin efecto resaca ni dependencia hormonal.',
      packaging: '/kodidose/hero_jars_translucent.webp',
      molecules: ['Bisglicinato de Magnesio 80%', 'L-Teanina Pura', 'Vitamina D3 5000 UI', 'Cero Sales Laxantes'],
      dose: '2 Cápsulas 45 minutos antes de dormir'
    }
  };

  return (
    <motion.div
      style={{ backgroundColor: bgColor }}
      className="min-h-screen text-slate-900 font-sans selection:bg-purple-500 selection:text-white transition-colors duration-700 relative overflow-x-hidden"
    >
      {/* Dynamic Ambient Glow overlay */}
      <motion.div
        style={{ background: ambientGlow }}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Symbol */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-900/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Kodi dose<span className="text-xs text-purple-600 font-normal align-top">™</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase tracking-wider hidden sm:inline-block">
                  Circadian System
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#pilares" className="hover:text-purple-600 transition">Los 4 Pilares</a>
            <a href="#dra-marisol" className="hover:text-purple-600 transition">Dra. Marisol</a>
            <a href="#stack-24h" className="hover:text-purple-600 transition">Stack 24H & Regalos</a>
            <a href="#laboratorio" className="hover:text-purple-600 transition">Certificados COA</a>
            <a href="#testimonios" className="hover:text-purple-600 transition">Resultados</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setQuizOpen(true)}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition hidden sm:flex items-center gap-1.5"
            >
              <span>Quiz IA</span>
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-black/20"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mi Stack 24H</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION CIRCADIANO */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          
          {/* Circadian Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>FASE 01 · RITMO MATUTINO SINCRONIZADO</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]">
            Donde el <span className="font-serif italic font-normal text-purple-700 underline decoration-purple-300 decoration-wavy decoration-2">Ritmo</span> Entiende el Bienestar Verdadero.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <strong className="text-slate-900 font-semibold">Ciencia Clara, Bienestar Real.</strong> El primer sistema de suplementación biológica formulado por médicos para acompañar el reloj natural de tu cuerpo en 4 momentos exactos del día.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <span>Configurar mi Stack 24H ($2,299/m)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setQuizOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:border-purple-300 transition flex items-center justify-center gap-2"
            >
              <span>Hacer Quiz de Cronotipo Biológico</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>6.5B UFC Cepa BLC1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% L-Methylfolato Activo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Aviso DIGIPRiS COFEPRIS-05-018</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Jars Render */}
        <div className="mt-12 relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-3 sm:p-6 bg-gradient-to-b from-white/80 via-white/50 to-transparent border border-white/90 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100/50">
              <Image
                src="/kodidose/hero_jars_translucent.webp"
                alt="Kodi Dose Frascos Esmerilados con Cápsulas Moradas y Tapas Cromadas"
                fill
                priority
                className="object-cover object-center transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Float Floating Badges */}
            <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Welcome Kit de 1er Mes de Regalo</h4>
                  <p className="text-[11px] text-slate-500">Incluye Vaso Mezclador Magnético USB-C ($450) + Lentes Blue-Blockers ($350)</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition"
              >
                Reclamar Regalos ➔
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOS 4 PILARES CIRCADIANOS */}
      {/* ========================================================================= */}
      <section id="pilares" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            SISTEMA BIOLÓGICO 24 HORAS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Tu biología no necesita más vitaminas. Necesita orden.
          </h2>
          <p className="text-sm text-slate-600">
            Tomar suplementos al azar causa interferencia molecular. KODI DOSE divide tus requerimientos en 4 fases exactas para máxima biodisponibilidad.
          </p>
        </div>

        {/* 4 Pillars Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-200/60 max-w-3xl mx-auto mb-10">
          {(['rise', 'focus', 'balance', 'unwind'] as const).map((key) => {
            const item = pillarsData[key];
            const isSelected = activePillar === key;
            return (
              <button
                key={key}
                onClick={() => setActivePillar(key)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className="uppercase tracking-wider text-[10px] opacity-75 font-mono">{key}</span>
                <span className="text-sm capitalize">{key}</span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-xl max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Left Content */}
            <div className="space-y-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${pillarsData[activePillar].badgeBg}`}>
                {pillarsData[activePillar].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {pillarsData[activePillar].headline}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pillarsData[activePillar].description}
              </p>

              {/* Molecules pills */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Moléculas Activas Verificadas:</span>
                <div className="grid grid-cols-2 gap-2">
                  {pillarsData[activePillar].molecules.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dose instruction */}
              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-900 font-semibold">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Dosis Recomendada:</span>
                </div>
                <span className="font-bold text-purple-700">{pillarsData[activePillar].dose}</span>
              </div>
            </div>

            {/* Right Packaging Display */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-100 flex items-center justify-center overflow-hidden">
              <Image
                src={pillarsData[activePillar].packaging}
                alt={pillarsData[activePillar].name}
                fill
                className="object-contain p-4"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                DOSE SPEC V2
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 4. AUTORIDAD MÉDICA · DRA. MARISOL KORTBRIGHT */}
      {/* ========================================================================= */}
      <section id="dra-marisol" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-12 bg-white border border-slate-200/90 shadow-2xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Portrait Column */}
          <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            <Image
              src="/kodidose/dra_marisol_kortbright.webp"
              alt="Dra. Marisol Kortbright · Co-fundadora & Directora de Sistema KODI DOSE"
              fill
              className="object-cover object-top"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold block">DIRECCIÓN MÉDICA CLÍNICA</span>
              <h4 className="text-xl font-black">Dra. Marisol Kortbright</h4>
              <p className="text-xs text-slate-300">Co-Fundadora & CEO / System Director</p>
            </div>
          </div>

          {/* Narrative & 5 No Negociables Column */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                FORMULACIÓN CON RIGOR MÉDICO
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                "El verdadero bienestar no es un lujo. Es una necesidad biológica diaria."
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kodi Dose nació de años de consulta médica enfrentando pacientes frustrados por tomar 8 pastilleros distintos con malestares estomacales y cero absorción. Eliminamos los rellenos comerciales y diseñamos una arquitectura circadiana que respeta la fisiología humana.
              </p>
            </div>

            {/* The 5 No-Negotiables */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Los 5 No Negociables de Kodi Dose:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-rose-600 block">❌ 0% Maltodextrina</span>
                  <span className="text-slate-500 text-[11px]">Cero almidones ocultos que inflamen el intestino o alteren la glucosa.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-emerald-600 block">✅ 100% L-Methylfolato</span>
                  <span className="text-slate-500 text-[11px]">Forma activa que tu cuerpo asimila al instante (cero ácido fólico sintético).</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-emerald-600 block">✅ Bisglicinato al 80%</span>
                  <span className="text-slate-500 text-[11px]">Magnesio quelado de máxima absorción que no causa diarrea ni irritación.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-emerald-600 block">🌿 100% Monk Fruit</span>
                  <span className="text-slate-500 text-[11px]">Endulzante botánico puro sin calorías, sin picos de insulina y sin sucralosa.</span>
                </div>
                <div className="sm:col-span-2 p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Cada lote fabricado en Europharma cuenta con análisis químico y firma de químico farmacéutico.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-mono text-slate-500">Ciudad Juárez, Chih. MX© 2026</span>
              <button
                onClick={() => setCoaModalOpen(true)}
                className="text-xs font-bold text-purple-700 hover:text-purple-800 underline flex items-center gap-1"
              >
                <span>Inspeccionar Certificado de Laboratorio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CONFIGURADOR DEL STACK 24H & UNBOXING (WELCOME KIT) */}
      {/* ========================================================================= */}
      <section id="stack-24h" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-12 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Unboxing Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                WELCOME KIT INCLUIDO · MES 01
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                El Stack Circadiano 24H Completo.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Recibe los 4 botes del mes con dosificación sincronizada, más los <strong className="text-white">dos regalos exclusivos en tu primer pedido</strong> para transformar tu rutina diaria desde el día uno.
              </p>

              {/* The 2 Gifts Callout */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">⚡ REGALO #1</span>
                    <span className="font-mono text-emerald-400 font-bold">$450 GRATIS</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Vaso Mezclador Magnético USB-C</h4>
                  <p className="text-xs text-slate-400">Mezcla tu Green Start con motor vortex recargable en 15 segundos sin grumos.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-400">👓 REGALO #2</span>
                    <span className="font-mono text-emerald-400 font-bold">$350 GRATIS</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Lentes Bloqueadores de Luz Azul</h4>
                  <p className="text-xs text-slate-400">Protege tu melatonina natural en la fase Unwind de la noche frente a pantallas.</p>
                </div>
              </div>

              {/* Pricing Selector (Subscription vs One-time) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-bold">MODALIDAD DE ENTREGA:</span>
                  <span className="text-xs font-mono text-purple-300">Envío Express FedEx Gratis</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSubscription
                        ? 'border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-900/40'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-white">Suscripción Inteligente</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black">18% OFF</span>
                    </div>
                    <div className="text-2xl font-black text-white">$2,299 <span className="text-xs text-slate-400 font-normal">/mes</span></div>
                    <span className="text-[11px] text-purple-300 block mt-1">Pausa o cancela en 1-clic. Incluye los 2 regalos.</span>
                  </button>

                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      !isSubscription
                        ? 'border-purple-500 bg-purple-950/50 shadow-lg shadow-purple-900/40'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-300">Compra Individual</span>
                    </div>
                    <div className="text-2xl font-black text-slate-300">$2,796 <span className="text-xs text-slate-400 font-normal">única vez</span></div>
                    <span className="text-[11px] text-slate-500 block mt-1">1 mes de suministro. No incluye regalos premium.</span>
                  </button>
                </div>

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Proceder a la Orden ({isSubscription ? '$2,299 MXN' : '$2,796 MXN'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Unboxing Box Render */}
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10 shadow-2xl">
              <Image
                src="/kodidose/welcome_kit_box.webp"
                alt="Welcome Kit Kodi Dose Unboxing con Shaker Magnético y Lentes"
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                📦 UNBOXING OFICIAL MES 01
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENCIA & PORTAL COA (/laboratorio) */}
      {/* ========================================================================= */}
      <section id="laboratorio" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              TRANSPARENCIA RADICAL EN CADA TOMA
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Audita el Certificado de Laboratorio de tu Bote
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Cada lote producido en planta cuenta con análisis químico y microbiológico emitido por químico farmacéutico. Cero mezclas propietarias opacas.
            </p>
          </div>

          {/* Lot Input Simulator */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto pt-2">
            <input
              type="text"
              value={lotInput}
              onChange={(e) => setLotInput(e.target.value)}
              placeholder="Ingresa tu Lote (ej. #KD-2026-08)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-purple-600 shadow-sm"
            />
            <button
              onClick={() => {
                setLotVerified(true);
                setCoaModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap shadow-md transition"
            >
              Auditar Lote 🔬
            </button>
          </div>

          {/* Quick link button */}
          <div className="text-center">
            <button
              onClick={() => {
                setLotInput('#KD-2026-08');
                setLotVerified(true);
                setCoaModalOpen(true);
              }}
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 underline"
            >
              👉 Ver el Lote Activo en Producción (#KD-2026-08)
            </button>
          </div>

          {/* Laboratory Micro-card */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 block">Lote #KD-2026-08 Certificado</span>
                <span className="text-emerald-700">Microbiología: Negativo E. Coli & Salmonella | Metales: &lt;0.01 ppm</span>
              </div>
            </div>
            <button
              onClick={() => setCoaModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition text-xs"
            >
              Descargar COA (PDF) 📄
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SOCIAL PROOF DUAL (WHATSAPP + AUDIO-NOTES) */}
      {/* ========================================================================= */}
      <section id="testimonios" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            RESULTADOS REALES EN 21 DÍAS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Lo que dicen quienes ya sincronizaron su reloj biológico
          </h2>
          <p className="text-sm text-slate-600">Pacientes reales compartiendo sus notas de voz y capturas tras sus primeras semanas.</p>
        </div>

        {/* 3 Testimonials Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-900">Dra. Claudia V. (42 años)</span>
                <span>Juárez, Chih.</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Como médico era escéptica con los polvos comerciales. El Green Start me quitó la distensión abdominal en 5 días y no me da temblor en las mañanas. El sabor tamarindo es impecable."
              </p>
            </div>

            {/* Audio note player */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <button
                onClick={() => toggleAudio(1)}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center flex-shrink-0 transition"
              >
                {playingAudio === 1 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Nota de Voz</span>
                  <span>0:14s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: playingAudio === 1 ? `${audioProgress}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-900">Mauricio R. (38 años)</span>
                <span>Runner & Abogado</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "El magnesio de farmacia siempre me soltaba el estómago. Con Unwind duermo 7 horas seguidas sin despertarme a las 3 AM y mis piernas se recuperan del entrenamiento al 100%."
              </p>
            </div>

            {/* Audio note player */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <button
                onClick={() => toggleAudio(2)}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center flex-shrink-0 transition"
              >
                {playingAudio === 2 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Nota de Voz</span>
                  <span>0:18s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: playingAudio === 2 ? `${audioProgress}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-900">Sofía M. (31 años)</span>
                <span>Instructora de Barre</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Tener los lentes de luz azul en el welcome kit fue un detallazo que demuestra que entienden la biología. Mi piel se ve mucho más luminosa con el Balance."
              </p>
            </div>

            {/* Audio note player */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <button
                onClick={() => toggleAudio(3)}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center flex-shrink-0 transition"
              >
                {playingAudio === 3 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Nota de Voz</span>
                  <span>0:11s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: playingAudio === 3 ? `${audioProgress}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ & GARANTÍA DE 21 DÍAS */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Preguntas Frecuentes</h2>
            <p className="text-xs text-slate-600">Todo lo que necesitas saber sobre el protocolo biológico 24H.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Por qué no puedo tomar todas las vitaminas juntas por la mañana?',
                a: 'El cuerpo humano opera bajo ritmos circadianos. Tomar magnesio por la mañana compite por receptores con el calcio y produce letargo, mientras que los probióticos requieren el pH del estómago vacío para colonizar el intestino antes de las comidas pesadas.'
              },
              {
                q: '¿Qué pasa si olvido una de las 4 tomas?',
                a: 'No te preocupes. Continúa con la fase correspondiente a la hora actual. El sistema está diseñado para que cada dosis actúe de forma autónoma sin necesidad de duplicar porciones.'
              },
              {
                q: '¿Cómo funciona la Garantía Clínica de 21 Días?',
                a: 'Si tras 21 días de consumo continuo no sientes una mejora tangible en tu digestión, energía matutina y calidad de sueño, te devolvemos el 100% de tu dinero sin preguntas ni complicaciones.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4.5 text-left font-bold text-sm text-slate-900 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4.5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER NOCTURNO (UNWIND) */}
      {/* ========================================================================= */}
      <footer className="relative z-10 bg-slate-950 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-black text-white text-xs">
                  KD
                </div>
                <span className="font-extrabold text-xl text-white">Kodi dose™</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Sistema de suplementación circadiana formulado por médicos especialistas. Diseñado en Ciudad Juárez, Chihuahua, México para acompañar el ritmo biológico humano.
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">KODIDOSE.COM · CIUDAD JUÁREZ, CHIH. MX© 2026</span>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400">
              <div className="space-y-2.5">
                <span className="font-mono font-bold text-white uppercase text-[10px] tracking-wider block">Sistema 24H</span>
                <p>Rise · Green Start</p>
                <p>Focus · Neuro Drive</p>
                <p>Balance · Daily Core</p>
                <p>Unwind · Night Calm</p>
              </div>

              <div className="space-y-2.5">
                <span className="font-mono font-bold text-white uppercase text-[10px] tracking-wider block">Transparencia</span>
                <p>Portal COA Lotes</p>
                <p>Dra. Marisol Kortbright</p>
                <p>Planta Europharma</p>
                <p>Garantía de 21 Días</p>
              </div>

              <div className="space-y-2.5">
                <span className="font-mono font-bold text-white uppercase text-[10px] tracking-wider block">Contacto Clínico</span>
                <p>T. (656) 550 7477</p>
                <p>M. hola@kodidose.com</p>
                <p>WhatsApp Concierge VIP</p>
              </div>
            </div>
          </div>

          {/* Legal COFEPRIS Banner */}
          <div className="pt-6 border-t border-white/10 space-y-2">
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed uppercase text-center sm:text-left">
              "ESTE PRODUCTO NO ES UN MEDICAMENTO. EL CONSUMO DE ESTE PRODUCTO ES RESPONSABILIDAD DE QUIEN LO RECOMIENDA Y DE QUIEN LO USA. AVISO DE FUNCIONAMIENTO DIGIPRIS COFEPRIS-05-018."
            </p>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-mono pt-2">
              <span>Desarrollado con arquitectura digital por Apolograma Studio</span>
              <span>Propiedad Intelectual KODI DOSE™ 2026</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. STICKY BOTTOM FLOATING BAR (MOBILE & DESKTOP) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    WELCOME KIT INCLUIDO
                  </span>
                  <div className="text-base font-black text-slate-900">$2,299 <span className="text-xs font-normal text-slate-500">MXN / mes</span></div>
                </div>
                <div className="text-xs text-slate-600 sm:hidden">
                  <span className="font-bold text-slate-900">$2,299/m</span> · Shaker USB-C Gratis
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuizOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-bold transition hidden sm:inline-block"
                >
                  Quiz IA
                </button>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
                >
                  <span>Pedir mi Stack 24H</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 11. CHECKOUT DRAWER INTERACTIVO */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    <h3 className="font-black text-lg text-slate-900">Tu Stack 24H</h3>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Items Summary */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                      <span>Stack Circadiano 4 SKUs (1 Mes)</span>
                      <span>$2,299 MXN</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Rise + Focus + Balance + Unwind con dosificación sincronizada.</p>
                  </div>

                  {/* Free Gifts badges */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      2 Regalos de Bienvenida Desbloqueados:
                    </span>
                    <div className="space-y-1 text-[11px] text-emerald-800">
                      <div className="flex justify-between"><span>• Vaso Mezclador Magnético USB-C ($450)</span><span className="font-bold">GRATIS</span></div>
                      <div className="flex justify-between"><span>• Lentes Blue-Blockers ($350)</span><span className="font-bold">GRATIS</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 px-1">
                    <span>Envío Nacional Express (FedEx)</span>
                    <span className="text-emerald-600 font-bold">GRATIS</span>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Checkout Action */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-sm">Total del Pedido:</span>
                  <span className="font-black text-2xl text-slate-950">$2,299 MXN</span>
                </div>

                <a
                  href="https://wa.me/526565507477?text=Hola,%20quiero%20ordenar%20mi%20Stack%20KODI%20DOSE%20de%20$2,299%20con%20el%20Vaso%20USB-C%20y%20los%20Lentes%20de%20regalo."
                  target="_blank"
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>Confirmar Orden por WhatsApp Directo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => alert("Simulador Stripe / Apple Pay activo. Redirigiendo a pasarela segura...")}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pagar con Apple Pay / Tarjeta</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 12. COA CERTIFICATE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {coaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCoaModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-slate-900 text-lg">Certificado Oficial COA</h3>
                </div>
                <button onClick={() => setCoaModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* COA Details */}
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500">LOTE ANALIZADO:</span><span className="font-bold text-purple-700">#KD-2026-08</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">PLANTA:</span><span className="font-bold text-slate-800">Europharma Irapuato Gto.</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">FECHA DE EMISIÓN:</span><span className="font-bold text-slate-800">Agosto 2026</span></div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">1. Análisis Microbiológico:</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg flex justify-between">
                    <span>E. Coli, Salmonella & Hongos:</span>
                    <span className="font-bold">NEGATIVO (Ausente / 10g)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">2. Metales Pesados (ICP-MS):</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg flex justify-between">
                    <span>Plomo (Pb) & Mercurio (Hg):</span>
                    <span className="font-bold">&lt; 0.01 ppm (Conforme a FHEUM)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">3. Concentración de Activos:</span>
                  <div className="p-2.5 bg-purple-50 text-purple-900 rounded-lg flex justify-between">
                    <span>Lactobacillus & L-Methylfolato:</span>
                    <span className="font-bold">6.5B UFC & 200mcg Confirmados</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert("Descargando informe oficial COA_KD_2026_08.pdf firmado...");
                  setCoaModalOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Descargar PDF Oficial Firmado</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 13. QUIZ MODAL SIMULATOR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quizOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuizOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-black text-slate-900 text-lg">Quiz de Cronotipo Biológico</h3>
                </div>
                <button onClick={() => setQuizOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Responde 3 preguntas breves para que el algoritmo de la <strong className="text-slate-900">Dra. Marisol</strong> calcule tu ritmo celular ideal:
                </p>

                <div className="space-y-2">
                  <label className="font-bold text-slate-900 block">¿A qué hora experimentas tu mayor bajón de energía?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-600 text-left font-medium">🌅 En ayunas (07:00 - 09:00 AM)</button>
                    <button className="p-2.5 rounded-xl border border-purple-500 bg-purple-50 text-left font-bold text-purple-900">⚡ Media tarde (02:00 - 04:00 PM)</button>
                    <button className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-600 text-left font-medium">🌙 Antes de dormir (09:00 PM)</button>
                    <button className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-600 text-left font-medium">🔄 Energía irregular todo el día</button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">Prescripción Preliminar:</span>
                  <p className="text-slate-500 text-[11px]">Tu perfil indica necesidad prioritaria de <strong className="text-purple-700">Rise (Green Start)</strong> y <strong className="text-purple-700">Unwind (Magnesio Quelado)</strong> para regular el cortisol.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setQuizOpen(false);
                  setDrawerOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Desbloquear mi Stack 24H Personalizado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
