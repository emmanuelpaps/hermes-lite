"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

function AnimatedCounter({ from, to, format, delay = 0 }: { from: number, to: number, format: (val: number) => string, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);
  const display = useTransform(count, (latest) => format(latest));
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2.5, ease: "easeOut", delay });
      return controls.stop;
    }
  }, [count, to, delay, isInView]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
import { ShieldCheck, Zap, Layers, Eye, Magnet, ShoppingCart, ArrowDown, Radar, TrendingDown, Play, Cuboid, MonitorSmartphone, Camera, Megaphone, Target, Tv, Glasses, Bot, TrendingUp, Cpu } from "lucide-react";
import { Outfit } from "next/font/google";
import Image from "next/image";

const titleFont = Outfit({ subsets: ["latin"], weight: ["700", "800", "900"], display: "swap" });

const theme = {
  superetteGreen: "#0a8244",
  superetteRed: "#da291c",
  superetteYellow: "#facc15",
  surface: "rgba(255, 255, 255, 0.8)",
  surfaceDarker: "rgba(255, 255, 255, 0.95)",
  bg: "#f0fdf4",
  textMain: "#0f172a",
  textMuted: "#475569",
  border: "rgba(255, 255, 255, 0.5)",
  borderSolid: "#e2e8f0",
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleUp: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const glassCardAnim: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};



// Premium Glass Card Component
const GlassCard = ({ children, style = {}, borderTopColor = theme.superetteGreen }: { children: React.ReactNode, style?: React.CSSProperties, borderTopColor?: string }) => (
  <motion.div variants={glassCardAnim} style={{
    background: theme.surface,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "clamp(1.5rem, 5vw, 3rem)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
    borderTop: `4px solid ${borderTopColor}`,
    position: "relative",
    overflow: "hidden",
    ...style
  }}>
    {children}
  </motion.div>
);

export default function SuperetteClient() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: "'Inter', sans-serif", minHeight: "100vh", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
      
      {/* Volumetric Lights */}
      <div style={{ position: "fixed", top: "10%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(10, 130, 68, 0.15) 0%, rgba(255,255,255,0) 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-10%", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(218, 41, 28, 0.08) 0%, rgba(255,255,255,0) 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "50%", left: "30%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, rgba(255,255,255,0) 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }} />

      {/* Sticky Header */}
      <style>{`
        .superette-header { justify-content: flex-start; }
        @media (max-width: 768px) {
          .superette-header { justify-content: center !important; }
        }
      `}</style>
      <header className="superette-header" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: isScrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        padding: isScrolled ? "1rem clamp(1rem, 4vw, 2rem)" : "1.5rem clamp(1rem, 4vw, 2rem)",
        display: "flex", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.5rem, 2vw, 1rem)", flexWrap: "nowrap" }}>
          <Image src="/assets/fn1-logo-white.png" alt="Frontera Número Uno" width={960} height={100} priority style={{ height: isScrolled ? "clamp(12px, 2.5vw, 25px)" : "clamp(15px, 3.5vw, 30px)", width: "auto", transition: "height 0.3s ease", filter: "brightness(0)" }} />
          <div style={{ height: isScrolled ? "16px" : "20px", width: "1px", background: "rgba(0,0,0,0.2)", margin: "0 clamp(2px, 1vw, 5px)", transition: "height 0.3s ease", flexShrink: 0 }} />
          <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={605} height={50} priority style={{ height: isScrolled ? "clamp(7px, 1.5vw, 14px)" : "clamp(9px, 2vw, 18px)", width: "auto", transition: "height 0.3s ease", filter: "brightness(0)" }} />
        </div>
      </header>

      {/* Floating CTA */}
      <motion.a 
        href="https://wa.me/526566575959?text=Hola%20Jes%C3%BAs%2C%20revis%C3%A9%20la%20propuesta%20operativa%20de%20Superette%20y%20estoy%20listo%20para%20avanzar."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: "clamp(15px, 4vw, 30px)", right: "clamp(15px, 4vw, 30px)", zIndex: 100,
          background: theme.textMain, color: "#fff",
          padding: "clamp(0.8rem, 3vw, 1rem) clamp(1.2rem, 5vw, 2rem)", borderRadius: "50px", fontWeight: "bold",
          textDecoration: "none", boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", gap: "10px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <span>Aprobar Propuesta</span>
      </motion.a>

      {/* Hero Section */}
      <div style={{ position: "relative", padding: "clamp(8rem, 20vh, 12rem) clamp(1rem, 5vw, 2rem) clamp(4rem, 10vh, 8rem)", textAlign: "center", zIndex: 1, overflow: "hidden", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/assets/superette-hero-poster.jpg"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, opacity: 0.8 }}
        >
          <source src="/assets/superette-hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay Overlay para fusionar el video con la página */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(240,253,244,1) 100%)", zIndex: -1 }} />

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <motion.img 
            variants={fadeInUp}
            src="/assets/superette/Superette_Logo_White.png" 
            alt="Superette Logo" 
            style={{ height: "90px", marginBottom: "2rem", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1)) invert(1)" }}
          />
          <motion.h1 variants={fadeInUp} className={titleFont.className} style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 800, margin: "0 0 1.5rem", letterSpacing: "-2px", lineHeight: 1.1, color: theme.superetteGreen }}>
            Ingeniería Gráfica y Comercial
          </motion.h1>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.4rem", color: theme.textMuted, maxWidth: "750px", margin: "0 auto", lineHeight: 1.6, fontWeight: 400 }}>
            Su exigencia comercial requiere un ecosistema que soporte la escala sin fallar. Heredamos, optimizamos y blindamos toda su operación gráfica.
          </motion.p>
        </motion.div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 10 }}>
        
        {/* 1. El Desafío + Gráfica Animada */}
        <GlassCard style={{ marginBottom: "3rem" }}>
          <div className={titleFont.className} style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>1</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
            <div>
              <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", marginTop: 0, marginBottom: "1.5rem", position: "relative" }}>
                El Desafío Operativo
              </h2>
              <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8 }}>
                Al auditar su operación, identificamos un desafío matemático: procesar más de <strong>190 artes mensuales</strong> hace que la creatividad pase a segundo plano frente a la precisión. Sabemos que un <strong>error tipográfico</strong> en una lona masiva <strong>cuesta dinero</strong> y genera <strong>fricción en piso de venta</strong>.
              </p>
              <div style={{ background: "#ffffff", borderLeft: `5px solid ${theme.superetteGreen}`, padding: "1.5rem", borderRadius: "16px", marginTop: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                <h4 style={{ color: theme.superetteGreen, margin: "0 0 0.5rem", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={20} />
                  La Solución: Célula Operativa
                </h4>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: "1.05rem", lineHeight: 1.6 }}>Proponemos instalar una célula de soporte que funcionará como su brazo externo. Nosotros asumimos la carga de trabajo y los costos de licencias, otorgándoles absoluta paz mental.</p>
              </div>
            </div>

            {/* GRÁFICA DE BARRAS ANIMADA */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
              
              <div style={{ color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", textAlign: "center" }}>Volumen de Producción (Artes / Mes)</div>
              
              {/* Contenedor de Barras */}
              <div style={{ height: "280px", display: "flex", alignItems: "flex-end", gap: "1rem", borderBottom: `2px solid ${theme.textMuted}` }}>
                {/* Barra 1 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1 } } }} style={{ fontWeight: 800, color: theme.textMain, fontSize: "1.1rem" }}>15</motion.div>
                  <motion.div variants={{ hidden: { height: 0 }, visible: { height: "30px", transition: { duration: 1, ease: "easeOut" } } }} style={{ width: "100%", background: "rgba(10, 130, 68, 0.2)", borderRadius: "8px 8px 0 0" }} />
                </div>
                {/* Barra 2 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1 } } }} style={{ fontWeight: 800, color: theme.textMain, fontSize: "1.1rem" }}>45</motion.div>
                  <motion.div variants={{ hidden: { height: 0 }, visible: { height: "90px", transition: { duration: 1, delay: 0.2, ease: "easeOut" } } }} style={{ width: "100%", background: "rgba(250, 204, 21, 0.4)", borderRadius: "8px 8px 0 0" }} />
                </div>
                {/* Barra 3 (Superette) */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2, type: "spring" } } }} style={{ background: theme.superetteGreen, color: "#fff", padding: "4px 12px", borderRadius: "20px", fontWeight: 900, fontSize: "1.2rem", boxShadow: "0 4px 12px rgba(10,130,68,0.3)", position: "relative", zIndex: 10 }}>197+</motion.div>
                  <motion.div variants={{ hidden: { height: 0 }, visible: { height: "250px", transition: { duration: 1.2, delay: 0.4, type: "spring" } } }} style={{ width: "100%", background: theme.superetteGreen, borderRadius: "8px 8px 0 0", position: "relative", boxShadow: "0 0 20px rgba(10,130,68,0.4)" }}>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)", borderRadius: "8px 8px 0 0" }} />
                  </motion.div>
                </div>
              </div>

              {/* Contenedor de Etiquetas Perfectamente Alineadas */}
              <div style={{ display: "flex", gap: "clamp(0.2rem, 2vw, 1rem)", marginTop: "0.5rem" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)", color: theme.textMuted, textAlign: "center", fontWeight: 600 }}>Marca<br/>Promedio</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)", color: theme.textMuted, textAlign: "center", fontWeight: 600 }}>Campaña<br/>Normal</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)", color: theme.superetteGreen, textAlign: "center", fontWeight: 800 }}>Ritmo<br/>Superette</span>
                </div>
              </div>

            </motion.div>
          </div>
        </GlassCard>

        {/* Las Garantías */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "5rem" }}>
          <GlassCard borderTopColor={theme.superetteGreen}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
              <div style={{ background: "rgba(10, 130, 68, 0.1)", padding: "16px", borderRadius: "50%", color: theme.superetteGreen, marginBottom: "1.5rem" }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem", marginBottom: "1rem" }}>Filtro Técnico Estricto</h3>
              <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Dirección de arte y control de pre-prensa enfocados en ejecutar un riguroso control de calidad antes de mandar a producción.</p>
            </div>
          </GlassCard>
          <GlassCard borderTopColor={theme.superetteRed}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
              <div style={{ background: "rgba(218, 41, 28, 0.1)", padding: "16px", borderRadius: "50%", color: theme.superetteRed, marginBottom: "1.5rem" }}>
                <Zap size={32} />
              </div>
              <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem", marginBottom: "1rem" }}>Velocidad Operativa</h3>
              <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Optimizamos la línea de producción para ir a la velocidad del retail. Garantizamos entregas ágiles de alto volumen para que tus ofertas nunca lleguen tarde a tienda.</p>
            </div>
          </GlassCard>
          <GlassCard borderTopColor={theme.superetteYellow}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%" }}>
              <div style={{ background: "rgba(250, 204, 21, 0.15)", padding: "16px", borderRadius: "50%", color: "#b45309", marginBottom: "1.5rem" }}>
                <Layers size={32} />
              </div>
              <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem", marginBottom: "1rem" }}>Flujo Anti-Burocracia</h3>
              <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Un Solo Canal (Asana/Chat) y Un Solo Filtro (una persona autorizando) para erradicar cuellos de botella.</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* 2. El Embudo Digital + Gráfica Animada */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>2</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
            <div>
              <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", marginTop: 0, marginBottom: "1.5rem" }}>
                Traffic Management (Embudo)
              </h2>
              <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8 }}>
                Una vez que la línea de producción gráfica está cubierta y la tienda vestida, el siguiente paso es inyectar tráfico físico. Para ello, no nos limitamos a oprimir &quot;promocionar&quot;, sino que implementamos un embudo industrial...
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
                <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "12px", borderLeft: `6px solid ${theme.superetteGreen}`, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ background: "rgba(10,130,68,0.1)", padding: "10px", borderRadius: "50%", color: theme.superetteGreen }}><Eye size={24} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain, fontSize: "1.1rem" }}>Top Funnel (Awareness)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "1rem" }}>Reproducciones de Reels In-Situ mostrando frescura.</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "12px", borderLeft: `6px solid ${theme.superetteYellow}`, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ background: "rgba(250,204,21,0.15)", padding: "10px", borderRadius: "50%", color: "#b45309" }}><Magnet size={24} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain, fontSize: "1.1rem" }}>Mid Funnel (Retargeting)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "1rem" }}>Impacto a espectadores con Ofertas Flash.</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "12px", borderLeft: `6px solid ${theme.superetteRed}`, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ background: "rgba(218,41,28,0.1)", padding: "10px", borderRadius: "50%", color: theme.superetteRed }}><ShoppingCart size={24} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain, fontSize: "1.2rem", fontWeight: 700 }}>Bottom Funnel (Conversión)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "1rem" }}>Distribución digital masiva del catálogo de ofertas en toda la ciudad.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICA DE EMBUDO ANIMADA (TRAPECIOS + FLECHAS) */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring" } } }} style={{ width: "100%", height: "100px", background: theme.superetteGreen, clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "1.2rem", boxShadow: "0 15px 30px rgba(10,130,68,0.3)" }}>
                TODO JUÁREZ
              </motion.div>
              
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ color: theme.superetteGreen }}>
                <ArrowDown size={32} strokeWidth={3} />
              </motion.div>
              
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3, type: "spring" } } }} style={{ width: "70%", height: "90px", background: theme.superetteYellow, clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#b45309", fontWeight: 800, fontSize: "1.1rem", boxShadow: "0 15px 30px rgba(250,204,21,0.3)" }}>
                RETARGETING
              </motion.div>
              
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} style={{ color: theme.superetteYellow }}>
                <ArrowDown size={32} strokeWidth={3} />
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.6, type: "spring" } } }} style={{ width: "45%", height: "80px", background: theme.superetteRed, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "1.1rem", boxShadow: "0 15px 30px rgba(218,41,28,0.3)", padding: "0 1rem", lineHeight: 1.2 }}>
                VISITA A SUCURSAL
              </motion.div>
            </motion.div>
          </div>
        </GlassCard>

        {/* 3. Frontera Numero Uno */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>3</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
            <div>
              <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", marginTop: 0, marginBottom: "1.5rem" }}>
                Frontera Número Uno:<br/>Tu Ecosistema de Tráfico
              </h2>
              <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8 }}>
                Las agencias tradicionales te rentan tráfico pagando a Facebook o Google. Nosotros <strong>somos dueños de la plataforma de noticias digitales más leída en Juárez</strong>.
              </p>
              <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8, marginTop: "1rem" }}>
                Tienes una <strong>doble ventaja competitiva:</strong> no solo optimizamos tu presupuesto de pauta con estrategias avanzadas, sino que tu catálogo de ofertas se inyecta directamente en el flujo de noticias de <strong>Frontera Número Uno</strong>. Usaremos nuestro canal de difusión orgánico masivo para asegurar tu alcance. El resultado es un costo de adquisición que nadie más puede igualar.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
                <div style={{ background: "rgba(10,130,68,0.1)", padding: "1.5rem", borderRadius: "12px", border: `1px solid ${theme.superetteGreen}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: theme.superetteGreen, fontSize: "1.2rem", lineHeight: 1.2 }}>Doble Ventaja</h4>
                  <p style={{ margin: 0, color: theme.textMain, fontSize: "0.95rem", lineHeight: 1.4 }}>Optimización de Pauta + Difusión Orgánica</p>
                </div>
                <div style={{ background: "rgba(10,130,68,0.1)", padding: "1.5rem", borderRadius: "12px", border: `1px solid ${theme.superetteGreen}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: theme.superetteGreen, fontSize: "1.2rem", lineHeight: 1.2 }}>Tráfico Cautivo</h4>
                  <p style={{ margin: 0, color: theme.textMain, fontSize: "0.95rem", lineHeight: 1.4 }}>Tus ofertas frente a millones de juarenses</p>
                </div>
              </div>
            </div>

            {/* Dashboard de Stats Reales (PREMIUM DARK MODE - PURPLE THEME) */}
            <motion.div 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} 
              transition={{ duration: 15, ease: "linear", repeat: Infinity }}
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "1.5rem", 
                background: "linear-gradient(-45deg, #4c1d95, #2e1065, #7e22ce, #3b0764)", 
                backgroundSize: "400% 400%", 
                padding: "2rem", 
                borderRadius: "24px", 
                boxShadow: "0 20px 50px rgba(76, 29, 149, 0.4)" 
              }}>
              
              <div style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(20px)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <Image src="/assets/fn1-logo-purple.png" alt="Frontera Numero Uno" width={960} height={100} style={{ width: "150px", height: "auto", filter: "brightness(0) invert(1)" }} />
                <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: "20px", whiteSpace: "nowrap" }}>Últimos 28 días</span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
                {/* Tarjeta 1: Views */}
                <div style={{ background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(20px)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
                  <h4 style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", fontWeight: 600 }}>Visualizaciones</h4>
                  
                  <div style={{ width: "100%", height: "60px", marginBottom: "1rem", position: "relative" }}>
                    <svg viewBox="0 0 200 60" style={{ width: "100%", height: "100%", overflow: "visible", filter: "drop-shadow(0 0 8px rgba(192, 132, 252, 0.6))" }}>
                      <defs>
                        <linearGradient id="gradViews" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        fill="url(#gradViews)"
                        d="M0 40 L20 50 L40 35 L60 45 L80 30 L100 35 L120 45 L140 30 L160 40 L180 50 L200 20 L200 60 L0 60 Z"
                      />
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                        viewport={{ once: true, margin: "-50px" }}
                        fill="none" 
                        stroke="#c084fc" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        d="M0 40 L20 50 L40 35 L60 45 L80 30 L100 35 L120 45 L140 30 L160 40 L180 50 L200 20"
                      />
                    </svg>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", position: "relative", zIndex: 2 }}>
                    <span style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>
                      <AnimatedCounter from={0} to={70.0} format={(v) => v.toFixed(1) + "M"} delay={0.5} />
                    </span>
                    <span style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 700, color: "#4ade80" }}>
                      ↑ <AnimatedCounter from={0} to={50.1} format={(v) => v.toFixed(1) + "%"} delay={0.7} />
                    </span>
                  </div>
                </div>

                {/* Tarjeta 2: Interacciones */}
                <div style={{ background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(20px)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
                  <h4 style={{ margin: "0 0 1rem", color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", fontWeight: 600 }}>Interacciones</h4>
                  
                  <div style={{ width: "100%", height: "60px", marginBottom: "1rem", position: "relative" }}>
                    <svg viewBox="0 0 200 60" style={{ width: "100%", height: "100%", overflow: "visible", filter: "drop-shadow(0 0 8px rgba(244, 114, 182, 0.6))" }}>
                      <defs>
                        <linearGradient id="gradInt" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        fill="url(#gradInt)"
                        d="M0 30 L20 45 L40 40 L60 50 L80 35 L100 40 L120 55 L140 45 L160 30 L180 35 L200 25 L200 60 L0 60 Z"
                      />
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                        viewport={{ once: true, margin: "-50px" }}
                        fill="none" 
                        stroke="#f472b6" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        d="M0 30 L20 45 L40 40 L60 50 L80 35 L100 40 L120 55 L140 45 L160 30 L180 35 L200 25"
                      />
                    </svg>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", position: "relative", zIndex: 2 }}>
                    <span style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>
                      <AnimatedCounter from={0} to={650.4} format={(v) => v.toFixed(1) + "K"} delay={0.5} />
                    </span>
                    <span style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 700, color: "#4ade80" }}>
                      ↑ <AnimatedCounter from={0} to={41} format={(v) => Math.round(v) + "%"} delay={0.7} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </GlassCard>

        {/* 4. Transición y Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "20rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", zIndex: -1 }}>4</div>
          <GlassCard borderTopColor={theme.superetteGreen}>
            <video autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, zIndex: 0 }} src="/assets/superette/transicion.mp4" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(12px)", padding: "1.5rem", borderRadius: "16px", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.6)", display: "inline-block" }}>
                <h3 className={titleFont.className} style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem", fontWeight: 700 }}>Plan de Transición Exprés</h3>
                <p style={{ color: theme.textMuted, margin: 0, fontSize: "1.1rem" }}>Empalme en 10 días sin detener su ritmo comercial.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
                {/* Línea vertical conectora */}
                <div style={{ position: "absolute", left: "32px", top: "20px", bottom: "20px", width: "2px", background: theme.borderSolid, zIndex: 0 }} />
                
                <div style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1, background: "rgba(248, 250, 252, 0.85)", padding: "1rem", borderRadius: "12px", border: `1px solid ${theme.borderSolid}`, backdropFilter: "blur(8px)" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: theme.superetteGreen, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1rem", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Fase 1 (Días 1-5)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Auditoría, extracción de credenciales, y descarga de plantillas.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1, background: "rgba(248, 250, 252, 0.85)", padding: "1rem", borderRadius: "12px", border: `1px solid ${theme.borderSolid}`, backdropFilter: "blur(8px)" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: theme.superetteYellow, color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1rem", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Fase 2 (Días 6-9)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Inmersión presencial (2 jornadas) y <em>Shadowing</em> en paralelo.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1, background: "rgba(248, 250, 252, 0.85)", padding: "1rem", borderRadius: "12px", border: `1px solid ${theme.borderSolid}`, backdropFilter: "blur(8px)" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: theme.textMain, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1rem", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Día 10 (Takeover)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Toma de control total de la producción.</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard borderTopColor={theme.superetteRed}>
            <video autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, zIndex: 0 }} src="/assets/superette/medicion.mp4" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(12px)", padding: "1.5rem", borderRadius: "16px", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.6)", display: "inline-block" }}>
                <h3 className={titleFont.className} style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem", fontWeight: 700 }}>Filosofía de Medición</h3>
                <p style={{ color: theme.textMuted, margin: 0, fontSize: "1.1rem" }}>Monitoreo de indicadores clave (Métricas Guía) para la toma de decisiones:</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(248, 250, 252, 0.85)", border: `1px solid ${theme.borderSolid}`, borderRadius: "12px", padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "flex-start", backdropFilter: "blur(8px)" }}>
                  <div style={{ background: "rgba(10,130,68,0.1)", color: theme.superetteGreen, padding: "10px", borderRadius: "8px" }}><Radar size={22} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Alcance (Reach)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Priorización de pauta masiva para maximizar cobertura y frecuencia en toda la ciudad.</p>
                  </div>
                </div>

                <div style={{ background: "rgba(248, 250, 252, 0.85)", border: `1px solid ${theme.borderSolid}`, borderRadius: "12px", padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "flex-start", backdropFilter: "blur(8px)" }}>
                  <div style={{ background: "rgba(218,41,28,0.1)", color: theme.superetteRed, padding: "10px", borderRadius: "8px" }}><TrendingDown size={22} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Costo Por Clic (CPC)</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Monitoreo continuo del costo de tráfico para iterar y mejorar las campañas activas.</p>
                  </div>
                </div>

                <div style={{ background: "rgba(248, 250, 252, 0.85)", border: `1px solid ${theme.borderSolid}`, borderRadius: "12px", padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "flex-start", backdropFilter: "blur(8px)" }}>
                  <div style={{ background: "rgba(250,204,21,0.15)", color: "#b45309", padding: "10px", borderRadius: "8px" }}><Play size={22} /></div>
                  <div>
                    <h4 style={{ margin: "0 0 0.2rem", color: theme.textMain, fontSize: "1.1rem" }}>Engagement Video</h4>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>Análisis de retención en Reels para entender qué contenido conecta mejor con la audiencia local.</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 4. Arquitectura de Distribución (Paid Media) */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>4</div>
          <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", marginTop: 0, marginBottom: "1rem", fontWeight: 800 }}>
            Arquitectura de Distribución
          </h2>
          <p style={{ color: theme.textMuted, fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "3rem", maxWidth: "800px" }}>
            El mejor diseño gráfico no sirve si no lo ve la persona correcta. La <strong>Gestión de Pauta</strong> es el puente estratégico que conecta el volumen de la Maquila Gráfica directamente con el consumidor final, garantizando que el presupuesto se traduzca en tráfico peatonal y conversiones medibles.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", position: "relative", zIndex: 2 }}>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }} transition={{ duration: 0.3 }} style={{ background: "#ffffff", border: `1px solid ${theme.borderSolid}`, borderTop: `4px solid ${theme.superetteGreen}`, borderRadius: "16px", padding: "2.5rem 2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <div style={{ background: "rgba(10, 130, 68, 0.08)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: theme.superetteGreen }}>
                <TrendingUp size={28} />
              </div>
              <h3 style={{ color: theme.textMain, fontSize: "1.3rem", margin: "0 0 1rem", fontWeight: 800 }}>Omnicanalidad</h3>
              <p style={{ color: theme.textMuted, margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
                Desplegamos los gráficos simultáneamente en <strong>Meta (Facebook e Instagram), Google y TikTok</strong>. No dependemos de una sola red; perseguimos la atención del usuario en todas las plataformas que frecuenta diariamente.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }} transition={{ duration: 0.3 }} style={{ background: "#ffffff", border: `1px solid ${theme.borderSolid}`, borderTop: `4px solid #eab308`, borderRadius: "16px", padding: "2.5rem 2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <div style={{ background: "rgba(250, 204, 21, 0.15)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#b45309" }}>
                <Cpu size={28} />
              </div>
              <h3 style={{ color: theme.textMain, fontSize: "1.3rem", margin: "0 0 1rem", fontWeight: 800 }}>Fase Beta: OpenAI</h3>
              <p style={{ color: theme.textMuted, margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
                Integramos experimentación temprana con IA para predecir qué diseños generarán mayor impacto, optimizando el <em>Ad Spend</em> con decisiones basadas en datos antes de lanzar una campaña al mercado.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }} transition={{ duration: 0.3 }} style={{ background: "#ffffff", border: `1px solid ${theme.borderSolid}`, borderTop: `4px solid ${theme.superetteRed}`, borderRadius: "16px", padding: "2.5rem 2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <div style={{ background: "rgba(218, 41, 28, 0.08)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: theme.superetteRed }}>
                <Target size={28} />
              </div>
              <h3 style={{ color: theme.textMain, fontSize: "1.3rem", margin: "0 0 1rem", fontWeight: 800 }}>Conversión y Tráfico</h3>
              <p style={{ color: theme.textMuted, margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
                Nuestra meta no son los "likes". Optimizamos el presupuesto de pauta ($20,000 MXN) exclusivamente para incentivar el <strong>Foot Traffic</strong> (visitas físicas a tienda) y la venta directa de las ofertas publicadas.
              </p>
            </motion.div>
          </div>
        </GlassCard>

        {/* 5. Desglose Operativo */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>5</div>
          <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", marginTop: 0, marginBottom: "2.5rem", fontWeight: 800 }}>
            Desglose Operativo Mensual
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", position: "relative", zIndex: 2 }}>
            
            {/* Phase 1 */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ background: "rgba(255, 255, 255, 0.8)", border: `1px solid ${theme.borderSolid}`, borderRadius: "20px", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ flex: "1 1 200px" }}>
                <h3 style={{ margin: 0, color: theme.textMain, fontSize: "1.3rem", fontWeight: 700 }}>1. Maquila Gráfica In-House</h3>
              </div>
              <div style={{ flex: "2 1 300px", background: "rgba(10, 130, 68, 0.04)", padding: "1.2rem 1.5rem", borderRadius: "12px" }}>
                <strong style={{ color: theme.superetteGreen, fontSize: "1rem" }}>~118 Artes Impresos (Volumen Mensual):</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", marginBottom: 0, color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Lonas, Banners y Carteleras (54)</li>
                  <li>Material POP y Cenefas (36)</li>
                  <li>Planas de Periódico (16)</li>
                  <li>Adaptaciones de formato (12)</li>
                </ul>
              </div>
              <div style={{ flex: "1 1 150px", textAlign: "right" }}>
                <strong style={{ fontSize: "1.6rem", color: theme.textMain, fontWeight: 900 }}>$116,400 <span style={{fontSize: "1rem", color: theme.textMuted, fontWeight: 500}}>MXN</span></strong>
              </div>
            </motion.div>

            {/* Phase 2 */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ background: "rgba(255, 255, 255, 0.8)", border: `1px solid ${theme.borderSolid}`, borderRadius: "20px", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ flex: "1 1 200px" }}>
                <h3 style={{ margin: 0, color: theme.textMain, fontSize: "1.3rem", fontWeight: 700 }}>2. Ecosistema Digital</h3>
              </div>
              <div style={{ flex: "2 1 300px", background: "rgba(10, 130, 68, 0.04)", padding: "1.2rem 1.5rem", borderRadius: "12px" }}>
                <strong style={{ color: theme.superetteGreen, fontSize: "1rem" }}>~71 Entregables Digitales:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", marginBottom: 0, color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Volantes Digitales y Ofertas Flash (48)</li>
                  <li>Parrilla de Redes Sociales (15)</li>
                  <li>Banners Web y Medios Locales (8)</li>
                </ul>
              </div>
              <div style={{ flex: "1 1 150px", textAlign: "right" }}>
                <strong style={{ fontSize: "1.6rem", color: theme.textMain, fontWeight: 900 }}>$49,000 <span style={{fontSize: "1rem", color: theme.textMuted, fontWeight: 500}}>MXN</span></strong>
              </div>
            </motion.div>

            {/* Phase 3 */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ background: "rgba(255, 255, 255, 0.8)", border: `1px solid ${theme.borderSolid}`, borderRadius: "20px", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ flex: "1 1 200px" }}>
                <h3 style={{ margin: 0, color: theme.textMain, fontSize: "1.3rem", fontWeight: 700 }}>3. Dirección Estratégica</h3>
              </div>
              <div style={{ flex: "2 1 300px", background: "rgba(10, 130, 68, 0.04)", padding: "1.2rem 1.5rem", borderRadius: "12px" }}>
                <strong style={{ color: theme.superetteGreen, fontSize: "1rem" }}>8 Entregables Core:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", marginBottom: 0, color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Redacción de Notas Corporativas PR (4)</li>
                  <li>Producción de Reels In-Situ (2)</li>
                  <li>Transmisiones En Vivo (2)</li>
                </ul>
              </div>
              <div style={{ flex: "1 1 150px", textAlign: "right" }}>
                <strong style={{ fontSize: "1.6rem", color: theme.textMain, fontWeight: 900 }}>$50,000 <span style={{fontSize: "1rem", color: theme.textMuted, fontWeight: 500}}>MXN</span></strong>
              </div>
            </motion.div>

            {/* Phase 4 */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ background: "rgba(255, 255, 255, 0.8)", border: `1px solid ${theme.borderSolid}`, borderRadius: "20px", padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ flex: "1 1 200px" }}>
                <h3 style={{ margin: 0, color: theme.textMain, fontSize: "1.3rem", fontWeight: 700 }}>4. Gestión de Pauta</h3>
              </div>
              <div style={{ flex: "2 1 300px", background: "rgba(10, 130, 68, 0.04)", padding: "1.2rem 1.5rem", borderRadius: "12px" }}>
                <strong style={{ color: theme.superetteGreen, fontSize: "1rem" }}>Campañas Digitales:</strong>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", marginBottom: 0, color: theme.textMuted, lineHeight: 1.6 }}>
                  <li>Meta (Facebook e Instagram)</li>
                  <li>Google Ads</li>
                  <li>TikTok Ads</li>
                  <li>OpenAI [Fase Beta]</li>
                </ul>
                <div style={{ display: "inline-block", background: "rgba(218, 41, 28, 0.1)", color: theme.superetteRed, padding: "6px 12px", borderRadius: "6px", fontSize: "0.85rem", marginTop: "1rem", fontWeight: "bold" }}>
                  El Ad Spend corre por cuenta de Superette.
                </div>
              </div>
              <div style={{ flex: "1 1 150px", textAlign: "right" }}>
                <strong style={{ fontSize: "1.6rem", color: theme.textMain, fontWeight: 900 }}>$20,000 <span style={{fontSize: "1rem", color: theme.textMuted, fontWeight: 500}}>MXN</span></strong>
              </div>
            </motion.div>

            {/* Total Row */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#fff", padding: "1.5rem 2.5rem", borderRadius: "100px", display: "flex", alignItems: "center", gap: "2rem", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)", flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8, fontWeight: 600 }}>Inversión Mensual Total</span>
                <span style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: 900, letterSpacing: "-1px" }}>$235,400 MXN</span>
              </div>
            </motion.div>

          </div>
        </GlassCard>

        {/* 5. Menú de Expansión */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h3 className={titleFont.className} style={{ color: theme.textMain, fontSize: "2rem", marginBottom: "1rem", letterSpacing: "-1px", fontWeight: 700 }}>Proyectos Out of Scope</h3>
          <p style={{ color: theme.textMuted, fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 3rem", lineHeight: 1.6 }}>Como agencia integral, escalamos su marca cuando estén listos. Cotizados de forma independiente.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem", textAlign: "left" }}>
            {[
              { icon: <Cuboid size={20} />, title: "Renders Arquitectónicos 3D", desc: "Visualización fotorrealista para planeación, pre-venta o remodelación de nuevas sucursales." },
              { icon: <MonitorSmartphone size={20} />, title: "Desarrollo de WebApps", desc: "Plataformas a medida para gestión de capital humano, encuestas operativas o intranet corporativa." },
              { icon: <Camera size={20} />, title: "Shooting Fotográfico In-Situ", desc: "Producción industrial fotográfica de alto volumen para perecederos y panadería con dirección de arte." },
              { icon: <Megaphone size={20} />, title: "Activaciones BTL", desc: "Experiencias físicas en estacionamientos para traccionar volumen masivo durante aperturas o aniversarios." },
              { icon: <Target size={20} />, title: "Campañas Maestras Anuales", desc: "Diseño del concepto rector 'Paraguas' que dictará el tono publicitario de la marca por los próximos 12 meses." },
              { icon: <Tv size={20} />, title: "Sistemas Digital Signage", desc: "Control y administración remota de la red de pantallas en piso de venta y línea de cajas." },
              { icon: <Glasses size={20} />, title: "Recorridos Virtuales 3D", desc: "Experiencias interactivas e inmersivas para recorrer digitalmente las sucursales en fase de planeación." },
              { icon: <Bot size={20} />, title: "Integración de Agentes IA", desc: "Automatización de flujos operativos internos y bases de datos usando inteligencia artificial a medida." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(10, 130, 68, 0.15)", borderColor: theme.superetteGreen }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", padding: "1.8rem", borderRadius: "16px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10, 130, 68, 0.1)", color: theme.superetteGreen, width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ color: theme.textMain, fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>{item.title}</span>
                </div>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cierre Comercial Final */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "5rem", padding: "4rem 2rem", background: "rgba(10, 130, 68, 0.05)", borderRadius: "24px", border: `1px solid rgba(10, 130, 68, 0.2)` }}>
          <h2 className={titleFont.className} style={{ color: theme.superetteGreen, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", margin: "0 0 1rem", letterSpacing: "-1px", fontWeight: 800 }}>El equipo está perfilado.</h2>
          <p style={{ color: theme.textMuted, fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>La infraestructura gráfica y digital está lista para heredar la operación sin interrupciones ni distracciones.</p>
          <motion.a 
            href="https://wa.me/526566575959?text=Hola%20Jes%C3%BAs%2C%20revis%C3%A9%20la%20propuesta%20operativa%20de%20Superette.%20%C2%BFIniciamos%20el%20empalme%3F"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: theme.superetteGreen, color: "#fff",
              padding: "1.2rem 3rem", borderRadius: "50px", fontWeight: 800, fontSize: "1.1rem",
              textDecoration: "none", boxShadow: "0 10px 25px rgba(10,130,68,0.3)"
            }}
          >
            ¿Iniciamos el Empalme de 10 Días?
          </motion.a>
        </motion.div>

      </div>

      <footer style={{ background: theme.textMain, color: "rgba(255,255,255,0.6)", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(0.5rem, 2vw, 1.5rem)", opacity: 0.5, flexWrap: "nowrap" }}>
            <Image src="/assets/fn1-logo-white.png" alt="Frontera Número Uno" width={960} height={100} style={{ height: "clamp(15px, 3.5vw, 30px)", width: "auto", filter: "brightness(0) invert(1)" }} />
            <div style={{ height: "20px", width: "1px", background: "rgba(255,255,255,0.3)", margin: "0 5px", flexShrink: 0 }} />
            <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={605} height={50} style={{ height: "clamp(8px, 2vw, 15px)", width: "auto", filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", maxWidth: "500px", lineHeight: 1.6 }}>
            Este documento contiene información confidencial y propietaria. Prohibida su reproducción o distribución sin autorización expresa.
          </p>
          <div style={{ fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase", marginTop: "1rem" }}>
            &copy; 2026 Frontera Número Uno / Apolograma
          </div>
        </div>
      </footer>

    </div>
  );
}
