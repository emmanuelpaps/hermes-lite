"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronRight, Video, Target, Globe, ArrowRight, Download, Bot, Glasses, MonitorSmartphone, Tv } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Paleta industrial para MYSI
const theme = {
  mysiNavy: "#0F172A",
  mysiSteel: "#64748B",
  mysiSilver: "#E2E8F0",
  mysiBlue: "#2563EB",
  mysiAccent: "#38BDF8",
  bgGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
  textMain: "#F8FAFC",
  textMuted: "#94A3B8"
};

const glassCardAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.15 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const tableRowAnim = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const GlassCard = ({ children, style = {}, borderTopColor = theme.mysiAccent }: any) => (
  <motion.div variants={glassCardAnim} style={{
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "clamp(1.5rem, 5vw, 3rem)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
    borderTop: `4px solid ${borderTopColor}`,
    position: "relative",
    overflow: "hidden",
    ...style
  }}>
    <div style={{
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 50%)",
      pointerEvents: "none"
    }} />
    <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
  </motion.div>
);

// Componente para cargar videos solo cuando entran en pantalla
const LazyVideo = ({ src, style, ...props }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "1200px" });

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {isInView && (
        <video autoPlay loop muted playsInline style={style} {...props}>
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default function MysiClient() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de carga realista
  useEffect(() => {
    const duration = 2800; // 2.8 segundos
    const intervalTime = 30;
    const steps = duration / intervalTime;

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const baseAdvance = 100 / steps;
        // Pausas aleatorias para que no se vea tan lineal, simulando descarga de videos
        const randomSlowdown = Math.random() > 0.6 ? 0 : baseAdvance * 1.8;
        const next = Math.min(100, prev + randomSlowdown);
        
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 600); // Pausa en 100% para leer
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Bloquear scroll mientras carga
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isLoading]);

  return (
    <>
      {/* LOADING SCREEN OVELAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: theme.bgGradient,
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF"
            }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mobile-logos-stack"
              style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <Image src="/assets/fn1-logo-white.png" alt="FN1" width={415} height={43} sizes="(max-width: 768px) 150px, 415px" style={{ height: "clamp(24px, 6vw, 45px)", width: "auto", opacity: 0.9 }} />
              <div className="mobile-divider-hide" style={{ width: "1px", height: "35px", background: "rgba(255,255,255,0.2)" }} />
              <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={300} height={50} sizes="(max-width: 768px) 100px, 200px" style={{ height: "clamp(12px, 3vw, 22px)", width: "auto", opacity: 0.9, filter: "brightness(0) invert(1)" }} />
            </motion.div>
            
            <div style={{ fontSize: "5rem", fontWeight: 700, fontFamily: "system-ui", color: theme.mysiAccent, letterSpacing: "-2px" }}>
              {Math.floor(loadingProgress)}%
            </div>
            
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.1)", marginTop: "1.5rem", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
              <motion.div 
                style={{ 
                  position: "absolute", top: 0, left: 0, bottom: 0,
                  background: `linear-gradient(90deg, ${theme.mysiBlue}, ${theme.mysiAccent})`,
                  boxShadow: `0 0 12px ${theme.mysiAccent}`
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
            
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginTop: "2rem", color: theme.textMuted, fontSize: "0.85rem", letterSpacing: "3px", textTransform: "uppercase" }}
            >
              Cargando Entorno VR...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: theme.mysiNavy, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", color: theme.textMain, overflowX: "hidden" }}>
      
      {/* BACKGROUND VIDEO */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 0, overflow: "hidden" }}>
        <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}>
          <source src="/assets/mysi-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay para fundir el video con el color de fondo y permitir legibilidad */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%)" }} />
      </div>

      {/* Decorative Blur Orbs */}
      <div style={{ position: "fixed", top: "10%", left: "-10%", width: "40vw", height: "40vw", background: theme.mysiBlue, filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-10%", width: "40vw", height: "40vw", background: theme.mysiAccent, filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />

      {/* HEADER IOS GLASSMORPHISM */}
      <header className="mobile-header-stack" style={{ 
        position: "fixed", 
        top: 0, left: 0, right: 0, 
        padding: "clamp(1rem, 2vw, 1.5rem) clamp(1rem, 5vw, 4rem)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap",
        gap: "1rem",
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
      }}>
        <div className="mobile-logos-stack" style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1.5rem)", flexWrap: "nowrap" }}>
          <Image src="/assets/fn1-logo-white.png" alt="FN1" width={415} height={43} sizes="(max-width: 768px) 150px, 300px" style={{ height: "clamp(20px, 4vw, 24px)", width: "auto", opacity: 0.95 }} />
          <div className="mobile-divider-hide" style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.15)" }} />
          <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={300} height={50} sizes="(max-width: 768px) 100px, 200px" style={{ height: "clamp(12px, 2.5vw, 16px)", width: "auto", opacity: 0.9, filter: "brightness(0) invert(1)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: theme.mysiAccent, boxShadow: `0 0 10px ${theme.mysiAccent}` }}></span>
          <span>CONFIDENCIAL</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 5vw, 2rem)", position: "relative", zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
          <motion.div variants={glassCardAnim} style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(56, 189, 248, 0.1)", padding: "8px 16px", borderRadius: "100px", color: theme.mysiAccent, fontWeight: 600, fontSize: "0.9rem", marginBottom: "2rem", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
            <Video size={16} /> Gemelo Digital para Meta Quest
          </motion.div>
          <motion.h1 variants={glassCardAnim} style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", lineHeight: 1.1, margin: "0 0 1.5rem", letterSpacing: "-1.5px", color: "#FFF" }}>
            Experiencia Inmersiva VR:<br />
            <span style={{ color: theme.mysiAccent }}>MYSI Costa Rica</span>
          </motion.h1>
          <motion.p variants={glassCardAnim} style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: theme.textMuted, maxWidth: "700px", lineHeight: 1.5, margin: 0 }}>
            Lleva toda tu planta industrial a Costa Rica dentro de un visor. Una experiencia interactiva de 10 minutos diseñada para que cualquier prospecto entienda exactamente por qué MYSI es líder en precisión y manufactura.
          </motion.p>
        </motion.section>

        {/* 1. ESPECIFICACIONES TÉCNICAS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <GlassCard style={{ marginBottom: "3rem" }}>
            <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(255, 255, 255, 0.02)", pointerEvents: "none", lineHeight: 1 }}>1</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
              <motion.div variants={itemAnim}>
                <h2 style={{ color: theme.mysiAccent, fontSize: "2.5rem", marginTop: 0, marginBottom: "1.5rem", position: "relative" }}>
                  Arquitectura del Entorno VR
                </h2>
                <p style={{ color: theme.textMuted, fontSize: "1.2rem", lineHeight: 1.7 }}>
                  Desarrollado con la misma tecnología usada en videojuegos de última generación (Unity 3D). Contará con dos modalidades de visualización para adaptarse al flujo de gente en el stand:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", borderLeft: `4px solid ${theme.mysiAccent}` }}>
                    <strong style={{ color: "#FFF", display: "block", marginBottom: "0.5rem" }}>Modo Full-Interact (10 minutos)</strong>
                    <span style={{ color: theme.textMuted, fontSize: "1rem", lineHeight: 1.5 }}>Recorrido completo con interacciones y mecánicas de simuladores de la maquinaria.</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", borderLeft: `4px solid ${theme.mysiBlue}` }}>
                    <strong style={{ color: "#FFF", display: "block", marginBottom: "0.5rem" }}>Modo Express Tour (2 minutos)</strong>
                    <span style={{ color: theme.textMuted, fontSize: "1rem", lineHeight: 1.5 }}>Recorrido visual guiado y rápido por las instalaciones sin interacciones, ideal para momentos de alto tráfico.</span>
                  </div>
                </div>
                <div style={{ marginTop: "2rem", borderRadius: "16px", overflow: "hidden", position: "relative", aspectRatio: "4/5", width: "100%", border: `1px solid rgba(255,255,255,0.2)`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                  <LazyVideo src="/assets/leads-video.mp4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.6) 0%, transparent 40%)" }} />
                  <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", color: "#FFF", fontWeight: 600, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: theme.mysiAccent, boxShadow: `0 0 10px ${theme.mysiAccent}` }}></span>
                    Simulación Activa
                  </div>
                </div>
              </motion.div>
              <motion.div variants={itemAnim} style={{ display: "grid", gap: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px" }}>
                  <div style={{ background: "rgba(56, 189, 248, 0.1)", padding: "12px", borderRadius: "12px", color: theme.mysiAccent }}><Target size={24} /></div>
                  <div>
                    <strong style={{ display: "block", fontSize: "1.2rem", marginBottom: "0.5rem" }}>4 Estaciones de Exhibición (Serie HAAS)</strong>
                    <span style={{ color: theme.textMuted, lineHeight: 1.5 }}>Recreamos tu piso de producción en 3D. El recorrido incluye el <strong>HAAS VF-3 SXT</strong> (Maquinado pesado), <strong>HAAS ST-15Y</strong> (Torneado), <strong>Haas Mini Mill</strong> y <strong>VF-2 SXT</strong>. Una voz narrará el valor y las ventajas operativas de cada equipo.</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px" }}>
                  <div style={{ background: "rgba(37, 99, 235, 0.2)", padding: "12px", borderRadius: "12px", color: theme.mysiBlue }}><Bot size={24} /></div>
                  <div>
                    <strong style={{ display: "block", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Simulador Interactivo: HAAS VF-2SSYT</strong>
                    <span style={{ color: theme.textMuted, lineHeight: 1.5 }}>La joya de la corona. El prospecto usa sus manos virtuales para presionar el botón de inicio de esta máquina de supervelocidad, detonando una animación realista del maquinado de alta precisión.</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 2. EMBUDO DE FERIA (LANDING PAGE) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <GlassCard>
            <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(255, 255, 255, 0.02)", pointerEvents: "none", lineHeight: 1 }}>2</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
              <motion.div variants={itemAnim}>
              <h2 style={{ color: theme.mysiAccent, fontSize: "2.5rem", marginTop: 0, marginBottom: "1.5rem" }}>
                Embudo Automático de Ventas
              </h2>
              <p style={{ color: theme.textMuted, fontSize: "1.2rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                La Realidad Virtual es el "gancho" para atraerlos a tu stand. Una vez ahí, usamos la tecnología para asegurar que no se vayan sin dejarte sus datos de contacto (Leads).
              </p>
              <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem", margin: 0 }}>
                <li><strong style={{ color: theme.textMain }}>Paso 1:</strong> El prospecto termina de jugar y se quita los lentes VR.</li>
                <li><strong style={{ color: theme.textMain }}>Paso 2:</strong> Le pedimos que escanee un código QR en el stand o le pasamos un iPad.</li>
                <li><strong style={{ color: theme.textMain }}>Paso 3:</strong> Ingresa su nombre y teléfono. Esos datos se guardan en tu base de datos de inmediato.</li>
                <li><strong style={{ color: theme.textMain }}>Paso 4:</strong> En ese mismo segundo, el sistema le envía un mensaje automático de WhatsApp a su celular con el catálogo oficial de MYSI.</li>
                <li><strong style={{ color: theme.mysiAccent }}>Reporte Post-Expo:</strong> Te entregamos un análisis de conversión y material gráfico (plantillas) para dar un seguimiento altamente profesional a los leads capturados.</li>
              </ul>
              </motion.div>
              <motion.div variants={itemAnim} style={{ position: "relative", aspectRatio: "4/5", width: "100%", borderRadius: "16px", overflow: "hidden", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(255,255,255,0.2)`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                <LazyVideo src="/assets/tablet-leads-video.mp4" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.6) 0%, transparent 40%)" }} />
                <div style={{ textAlign: "center", zIndex: 1, position: "absolute", bottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, color: "#FFF" }}>Captura Segura de Leads</h3>
                </div>
              </motion.div>
          </div>
        </GlassCard>
        </motion.div>

        {/* 3. CRONOGRAMA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <h2 style={{ color: "#FFF", fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>Cronograma (Hacia Atrás)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <GlassCard borderTopColor={theme.mysiSteel} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.mysiAccent, margin: "0 0 1rem" }}>Todo Mayo</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Desarrollo intensivo de la Arquitectura 3D y Programación Lógica de VR.</p>
            </GlassCard>
            <GlassCard borderTopColor={theme.mysiBlue} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.mysiAccent, margin: "0 0 1rem" }}>12 de Junio</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Demo Beta V.1 (Pruebas de recorrido en las oficinas del cliente).</p>
            </GlassCard>
            <GlassCard borderTopColor={theme.textMain} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.textMain, margin: "0 0 1rem" }}>17 de Junio</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Freeze de código, entrega final de Oculus y capacitación al equipo de ventas.</p>
            </GlassCard>
          </div>
        </motion.div>

        {/* 4. REQUISITOS (NECESITAMOS) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <GlassCard borderTopColor={theme.mysiBlue}>
            <motion.h3 variants={itemAnim} style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem" }}>Requerimientos Técnicos (A proveer por MYSI)</motion.h3>
            <motion.ul variants={itemAnim} style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem", margin: "1.5rem 0 0" }}>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Referencias Visuales 3D:</strong> Fotos y videos de las 4 máquinas estáticas (VF-3 SXT, ST-15Y, Mini Mill, VF-2 SXT).</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Máquina Interactiva:</strong> Referencias del panel de control de la HAAS VF-2SSYT y del Bar Feeder.</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Arquitectura:</strong> Fotos y metros cuadrados exactos de la superficie de la planta en Costa Rica.</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Voiceover:</strong> Aprobación final del guion comercial de 8 diálogos antes de enviar a grabar la locución profesional.</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Equipamiento de Casting:</strong> El cliente proveerá los visores Meta Quest, además de la laptop, pantalla y router (ver recomendaciones de hardware en la siguiente sección).</li>
            </motion.ul>
          </GlassCard>
        </motion.div>

        {/* 5. EQUIPO RECOMENDADO PARA CASTING */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <GlassCard borderTopColor={theme.mysiAccent}>
            <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(255, 255, 255, 0.02)", pointerEvents: "none", lineHeight: 1 }}>5</div>
            
            <motion.h3 variants={itemAnim} style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem", marginBottom: "2rem" }}>
              Hardware Recomendado para Casting
            </motion.h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
              <motion.div variants={itemAnim} style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", color: theme.mysiAccent }}>
                  <Glasses size={24} /> <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#FFF" }}>Visor y Accesorios</h4>
                </div>
                <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
                  <li style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.textMain }}>Visor:</strong> Meta Quest 3 o 3S.</li>
                  <li style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.textMain }}>Soporte (Altamente Recomendado):</strong> <a href="https://www.amazon.com.mx/MNJKJHL-Ajustable-Recargables-Extendido-Comodidad/dp/B0DY3LHTML" target="_blank" rel="noreferrer" style={{ color: theme.mysiAccent, textDecoration: "underline", fontWeight: "bold" }}>Pila tipo headband</a> para extender la duración de la batería todo el día.</li>
                  <li><strong style={{ color: theme.textMain }}>Cable (Opcional):</strong> <a href="https://www.amazon.com.mx/JSAUX-Compatible-Accesorios-Velocidad-Auriculares/dp/B0DK6KSWY3" target="_blank" rel="noreferrer" style={{ color: theme.mysiAccent, textDecoration: "underline", fontWeight: "bold" }}>Cable carga y juega 5m</a> (si prefieren conexión alámbrica a la laptop).</li>
                </ul>
              </motion.div>

              <motion.div variants={itemAnim} style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", color: theme.mysiBlue }}>
                  <MonitorSmartphone size={24} /> <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#FFF" }}>Laptop y Red</h4>
                </div>
                <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
                  <li style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.textMain }}>Laptop:</strong> Capaz de correr <em>Meta Quest Developers Hub</em>. Requisitos: RTX 3060+, 16GB RAM, i5/i7 o Ryzen 5/7. <br/><a href="https://www.amazon.com.mx/MSI-Laptop-i5-13420H-GeForce-4060-16GB/dp/B0F538NQPH" target="_blank" rel="noreferrer" style={{ color: theme.mysiAccent, textDecoration: "underline", fontWeight: "bold" }}>Ver ejemplo (MSI Cyborg 15)</a></li>
                  <li><strong style={{ color: theme.textMain }}>Router Local:</strong> Banda Dual 2.4 / 5.0 GHz dedicado para el stand. <br/><a href="https://www.amazon.com.mx/TP-Link-WiFi-AX3000-Router-802-11ax/dp/B09V3JG7JL" target="_blank" rel="noreferrer" style={{ color: theme.mysiAccent, textDecoration: "underline", fontWeight: "bold" }}>Ver ejemplo (TP-Link AX3000)</a></li>
                </ul>
              </motion.div>

              <motion.div variants={itemAnim} style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", color: theme.mysiSteel }}>
                  <Tv size={24} /> <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#FFF" }}>Pantalla Externa</h4>
                </div>
                <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
                  <li style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.textMain }}>Display:</strong> Cualquier TV o monitor con entrada HDMI.</li>
                  <li><strong style={{ color: theme.textMain }}>Cableado:</strong> Cable HDMI suficientemente largo para conectar la pantalla a la laptop. <br/><a href="https://www.amazon.com.mx/UGREEN-Velocidad-Aluminio-Compatible-Blu-ray/dp/B0DT9KJX65" target="_blank" rel="noreferrer" style={{ color: theme.mysiAccent, textDecoration: "underline", fontWeight: "bold" }}>Ver ejemplo (UGREEN 10m)</a></li>
                </ul>
              </motion.div>
            </div>

            <motion.div variants={itemAnim} style={{ background: "rgba(56, 189, 248, 0.05)", padding: "1.5rem", borderRadius: "16px", borderLeft: `4px solid ${theme.mysiAccent}` }}>
              <h4 style={{ color: "#FFF", fontSize: "1.1rem", margin: "0 0 1rem" }}>Notas Operativas sobre el Casteo (Streaming a la Pantalla)</h4>
              <p style={{ color: theme.textMuted, lineHeight: 1.6, fontSize: "0.95rem", margin: "0 0 1rem" }}>
                El visor y la laptop deben estar conectados a la misma red (idealmente la banda <strong>5 GHz</strong> del router). 
              </p>
              <p style={{ color: theme.textMuted, lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>
                <strong>Proceso de Inicialización ("Jumpstart"):</strong> Para evitar pagar costosos servicios de internet dedicado en la expo, se utiliza el router de forma local (sin internet). Para que Meta permita iniciar el casteo, es necesario compartir temporalmente datos móviles (Hotspot) para que los equipos se comuniquen con los servidores. Una vez iniciada la transmisión de video, ambos dispositivos se regresan a la red local del router y se apagan los datos celulares. <em>Nota: Si se pierde la conexión por alguna razón, este "Jumpstart" debe repetirse.</em>
              </p>
            </motion.div>

          </GlassCard>
        </motion.div>

        {/* 6. TABLA DE INVERSIÓN */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <motion.h2 variants={itemAnim} style={{ color: "#FFF", fontSize: "2.5rem", marginBottom: "3rem", textAlign: "center" }}>Desglose de Ingeniería</motion.h2>
          
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            <div className="grid-header">
              <div style={{ color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, letterSpacing: "1px" }}>FASE OPERATIVA</div>
              <div style={{ color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, letterSpacing: "1px" }}>VOLUMEN Y ENTREGABLES</div>
              <div style={{ textAlign: "right", color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, letterSpacing: "1px" }}>HORAS</div>
            </div>

            <motion.div variants={tableRowAnim} className="responsive-grid-table">
              <div>
                <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>1. Arquitectura 3D</strong>
              </div>
              <div>
                <strong style={{ color: theme.mysiAccent }}>Modelado Físico y Estructura:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Modelado en 3D de 4 máquinas estáticas (VF-3 SXT, ST-15Y, Mini Mill, VF-2 SXT).</li>
                  <li>Modelado ultra-detallado de la Máquina Interactiva (VF-2SSYT y Bar Feeder).</li>
                  <li>Diseño del entorno virtual de la planta de Costa Rica a escala.</li>
                </ul>
              </div>
              <div className="mobile-left" style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>80 hrs</strong>
              </div>
            </motion.div>

            <motion.div variants={tableRowAnim} className="responsive-grid-table">
              <div>
                <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>2. Lógica VR</strong>
              </div>
              <div>
                <strong style={{ color: theme.mysiAccent }}>Interactividad y Sincronización:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Programación de las 8 locuciones del guion y sincronización de eventos.</li>
                  <li>Programación de la animación interactiva de la HAAS VF-2SSYT.</li>
                  <li>Configuración del Teleport para avanzar fluidamente entre las 5 estaciones.</li>
                </ul>
              </div>
              <div className="mobile-left" style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>50 hrs</strong>
              </div>
            </motion.div>

            <motion.div variants={tableRowAnim} className="responsive-grid-table">
              <div>
                <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>3. Ecosistema de Leads</strong>
              </div>
              <div>
                <strong style={{ color: theme.mysiAccent }}>Base de Datos y WhatsApp:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Diseño de página web (Landing Page) atractiva para registro en iPads/Celulares.</li>
                  <li>Creación de Base de Datos en la Nube (CRM) para almacenar prospectos seguros.</li>
                  <li>Automatización robotizada para que WhatsApp envíe mensajes y brochures al instante 24/7.</li>
                </ul>
              </div>
              <div className="mobile-left" style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>35 hrs</strong>
              </div>
            </motion.div>

            <motion.div variants={tableRowAnim} className="totals-row" style={{ background: "rgba(56, 189, 248, 0.05)", border: `1px solid ${theme.mysiAccent}`, borderRadius: "16px", marginTop: "1rem" }}>
              <div style={{ textAlign: "right" }} className="mobile-left">
                <strong style={{ color: theme.textMuted, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px" }}>Inversión Total (165 Horas)</strong>
              </div>
              <div style={{ textAlign: "right" }} className="mobile-left">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  style={{ display: "inline-block" }}
                >
                  <strong style={{ fontSize: "2rem", letterSpacing: "-1px", color: theme.mysiAccent }}>$107,250 MXN</strong>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 7. CONDICIONES Y DATOS BANCARIOS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <GlassCard borderTopColor={theme.mysiSteel}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "3rem" }}>
              <motion.div variants={itemAnim}>
                <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem", marginBottom: "1.5rem" }}>Condiciones de Pago</h3>
                <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem", margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: theme.textMain }}>50%</strong> Anticipo para arrancar el proyecto.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: theme.textMain }}>25%</strong> A la presentación de avances.</li>
                  <li><strong style={{ color: theme.textMain }}>25%</strong> Contra entrega final del software VR.</li>
                </ul>
              </motion.div>
              <motion.div variants={itemAnim}>
                <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem", marginBottom: "1.5rem" }}>Datos Bancarios</h3>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.mysiAccent }}>Razón Social:</strong> <span style={{ color: theme.textMuted }}>TECNOLOGIES TECZA, S. DE R.L. DE C.V.</span></div>
                  <div style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.mysiAccent }}>Banco:</strong> <span style={{ color: theme.textMuted }}>Banregio</span></div>
                  <div style={{ marginBottom: "0.8rem" }}><strong style={{ color: theme.mysiAccent }}>Cuenta:</strong> <span style={{ color: theme.textMuted }}>065-74924-002-9</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <strong style={{ color: theme.mysiAccent }}>CLABE:</strong> 
                    <div 
                      onClick={() => {
                        navigator.clipboard.writeText("058164657492400290");
                        alert("¡CLABE copiada al portapapeles!");
                      }}
                      style={{ color: theme.textMain, cursor: "pointer", background: "rgba(56, 189, 248, 0.1)", padding: "4px 10px", borderRadius: "6px", border: `1px solid ${theme.mysiAccent}`, fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
                      onMouseOver={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.25)"}
                      onMouseOut={(e) => e.currentTarget.style.background = "rgba(56, 189, 248, 0.1)"}
                      title="Copiar CLABE"
                    >
                      058164657492400290 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* FOOTER IOS */}
        <footer style={{ 
          marginTop: "4rem",
          padding: "3rem 0", 
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem"
        }}>
          <p style={{ color: theme.textMuted, fontSize: "1.1rem", margin: 0 }}>
            Construyendo el futuro de la manufactura inteligente en Realidad Virtual.
          </p>
          <div className="mobile-logos-stack" style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1.5rem)", justifyContent: "center" }}>
            <Image src="/assets/fn1-logo-white.png" alt="FN1" width={415} height={43} sizes="(max-width: 768px) 100px, 200px" style={{ height: "clamp(16px, 3.5vw, 20px)", width: "auto", opacity: 0.5 }} />
            <div className="mobile-divider-hide" style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />
            <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={300} height={50} sizes="(max-width: 768px) 80px, 150px" style={{ height: "clamp(10px, 2vw, 14px)", width: "auto", opacity: 0.5, filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", margin: 0, letterSpacing: "1px" }}>
            © {new Date().getFullYear()} Frontera Número Uno & Apolograma. Todos los derechos reservados.
          </p>
        </footer>

      </div>

    </div>
    </>
  );
}
