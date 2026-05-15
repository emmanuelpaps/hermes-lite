"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const theme = {
  superetteGreen: "#0a8244",
  superetteRed: "#da291c",
  superetteYellow: "#facc15",
  surface: "rgba(255, 255, 255, 0.8)",
  surfaceDarker: "rgba(255, 255, 255, 0.95)",
  bg: "#f0fdf4", // Very subtle green tint for the base
  textMain: "#0f172a",
  textMuted: "#475569",
  border: "rgba(255, 255, 255, 0.5)",
  borderSolid: "#e2e8f0",
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const glassCardAnim: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const tableRowAnim: any = {
  hidden: { opacity: 0, x: -20, backgroundColor: "rgba(255,255,255,0)" },
  visible: { opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0.7)", transition: { duration: 0.5 } }
};

// Premium Glass Card Component
const GlassCard = ({ children, style = {}, borderTopColor = theme.superetteGreen }: any) => (
  <motion.div variants={glassCardAnim} style={{
    background: theme.surface,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "3rem",
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
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: "'Inter', sans-serif", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      
      {/* Volumetric Lights (Background Orbs) */}
      <div style={{ position: "fixed", top: "10%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(10, 130, 68, 0.15) 0%, rgba(255,255,255,0) 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-10%", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(218, 41, 28, 0.08) 0%, rgba(255,255,255,0) 70%)", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "50%", left: "30%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, rgba(255,255,255,0) 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }} />

      {/* Sticky Premium Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: isScrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s ease",
        padding: isScrolled ? "1rem 2rem" : "1.5rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Usamos el logo default de FN1 asumiendo que existe en public/assets/ */}
          <img src="/assets/fn1-logo.png" alt="Frontera Número Uno" style={{ height: isScrolled ? "25px" : "30px", transition: "height 0.3s ease", filter: "brightness(0)" }} />
          <div style={{ height: "20px", width: "1px", background: "rgba(0,0,0,0.2)" }} />
          <img src="/assets/apolograma.png" alt="Apolograma" style={{ height: isScrolled ? "18px" : "22px", transition: "height 0.3s ease", filter: "brightness(0)" }} />
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: theme.textMuted }}>
          Propuesta Confidencial
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
          position: "fixed", bottom: "30px", right: "30px", zIndex: 100,
          background: theme.textMain, color: "#fff",
          padding: "1rem 2rem", borderRadius: "50px", fontWeight: "bold",
          textDecoration: "none", boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", gap: "10px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <span>Aprobar Propuesta</span>
      </motion.a>

      {/* Hero Section */}
      <div style={{ 
        padding: "12rem 2rem 8rem", 
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <motion.img 
            variants={fadeInUp}
            src="/assets/superette/Superette_Logo_White.png" 
            alt="Superette Logo" 
            style={{ height: "90px", marginBottom: "2rem", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1)) invert(1)" }}
          />
          <motion.h1 variants={fadeInUp} style={{ fontSize: "4.5rem", fontWeight: 800, margin: "0 0 1.5rem", letterSpacing: "-2px", lineHeight: 1.1, color: theme.superetteGreen }}>
            Ingeniería Gráfica y Comercial
          </motion.h1>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.4rem", color: theme.textMuted, maxWidth: "700px", margin: "0 auto", lineHeight: 1.6, fontWeight: 400 }}>
            No somos una agencia creativa tradicional. Somos la infraestructura técnica que absorberá la maquinaria operativa de sus 35 sucursales.
          </motion.p>
        </motion.div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 10 }}>
        
        {/* 1. El Desafío */}
        <GlassCard style={{ marginBottom: "3rem" }}>
          {/* Watermark Number */}
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>1</div>
          
          <h2 style={{ color: theme.superetteGreen, fontSize: "2.5rem", marginTop: 0, marginBottom: "1.5rem", position: "relative" }}>
            El Desafío Operativo
          </h2>
          <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8, maxWidth: "800px" }}>
            Al auditar su operación, identificamos un desafío matemático: procesar más de <strong>190 artes mensuales</strong> hace que la creatividad pase a segundo plano frente a la precisión. Sabemos que un error tipográfico en una lona masiva cuesta dinero y genera fricción en piso de venta.
          </p>
          <div style={{ background: "rgba(255,255,255,0.5)", borderLeft: `5px solid ${theme.superetteGreen}`, padding: "2rem", borderRadius: "16px", marginTop: "2.5rem", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.8)" }}>
            <h4 style={{ color: theme.superetteGreen, margin: "0 0 0.5rem", fontSize: "1.3rem" }}>La Solución: Célula Dedicada</h4>
            <p style={{ margin: 0, color: theme.textMain, fontSize: "1.1rem", lineHeight: 1.6 }}>Proponemos instalar una célula que funcionará como su brazo externo (equivalente a 6 especialistas de tiempo completo). Nosotros asumimos la carga laboral, los costos de licencias y el estrés operativo, otorgándoles absoluta paz mental.</p>
          </div>
        </GlassCard>

        {/* Las Garantías (Glass Cards) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
          <GlassCard borderTopColor={theme.superetteGreen}>
            <div style={{ width: "50px", height: "50px", background: "rgba(10, 130, 68, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: theme.superetteGreen }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem" }}>Filtro Técnico Estricto</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Dirección de arte y control de pre-prensa dedicado exclusivamente a asegurar cero errores antes de imprimir.</p>
          </GlassCard>
          <GlassCard borderTopColor={theme.superetteRed}>
            <div style={{ width: "50px", height: "50px", background: "rgba(218, 41, 28, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: theme.superetteRed }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem" }}>Velocidad Garantizada</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Tiempos de respuesta blindados (L-V 8a5). Lonas Express en 24h. Volantes en 24h. Cero retrasos.</p>
          </GlassCard>
          <GlassCard borderTopColor={theme.superetteYellow}>
            <div style={{ width: "50px", height: "50px", background: "rgba(250, 204, 21, 0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#b45309" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.4rem" }}>Flujo Anti-Burocracia</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Un Solo Canal (Asana/Chat) y Un Solo Filtro (una persona autorizando) para erradicar cuellos de botella.</p>
          </GlassCard>
        </motion.div>

        {/* 2. El Embudo Digital */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>2</div>
          <h2 style={{ color: theme.superetteGreen, fontSize: "2.5rem", marginTop: 0, marginBottom: "1.5rem" }}>
            Traffic Management (Embudo)
          </h2>
          <p style={{ fontSize: "1.2rem", color: theme.textMuted, lineHeight: 1.8, maxWidth: "800px" }}>
            No nos limitamos a oprimir el botón de promocionar. Implementamos un embudo industrial diseñado para comprar tráfico directo a piso de venta.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "3rem", position: "relative", zIndex: 1 }}>
            {[
              { title: "Top Funnel (Awareness)", color: theme.superetteGreen, desc: "Reproducciones de Reels In-Situ. Mostramos la frescura de la Carnicería a todo Juárez para generar antojo visual." },
              { title: "Mid Funnel (Retargeting)", color: theme.superetteYellow, desc: "Impactamos a los usuarios que vieron el video con nuestros Volantes Digitales y Ofertas Flash." },
              { title: "Bottom Funnel (Conversión)", color: theme.superetteRed, desc: "Ads geolocalizados estrictamente a 3KM a la redonda de las 35 sucursales. Publicados de Jueves a Domingo." }
            ].map((step, i) => (
              <div key={i} style={{ padding: "2rem", background: "rgba(255,255,255,0.6)", borderRadius: "16px", borderLeft: `6px solid ${step.color}`, backdropFilter: "blur(10px)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain, fontSize: "1.3rem" }}>{step.title}</h4>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: "1.1rem" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 3. Transición y Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem", marginBottom: "5rem" }}>
          
          <GlassCard borderTopColor={theme.superetteGreen}>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem" }}>Plan de Transición Exprés</h3>
            <p style={{ color: theme.textMuted, marginBottom: "2rem", fontSize: "1.1rem" }}>Empalme en 15 días sin detener su ritmo comercial.</p>
            <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem" }}>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Fase 1 (Días 1-5):</strong> Auditoría, extracción de credenciales, y descarga de plantillas.</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Fase 2 (Días 6-14):</strong> Inmersión presencial (2 jornadas) y <em>Shadowing</em> en paralelo.</li>
              <li><strong style={{ color: theme.textMain }}>Día 15:</strong> Toma de control total.</li>
            </ul>
          </GlassCard>

          <GlassCard borderTopColor={theme.superetteRed}>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem" }}>Protección Anti-Vanidad</h3>
            <p style={{ color: theme.textMuted, marginBottom: "2rem", fontSize: "1.1rem" }}>Métricas duros (KPIs) para evaluar la pauta:</p>
            <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem" }}>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Alcance (Reach):</strong> Volumen impactado exclusivamente a 3KM de la sucursal.</li>
              <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Costo Por Clic (CPC):</strong> Eficiencia hacia ofertas de fin de semana.</li>
              <li><strong style={{ color: theme.textMain }}>Engagement Video:</strong> Visualizaciones mayores al 50% en Reels In-Situ.</li>
            </ul>
          </GlassCard>

        </div>

        {/* 4. Tablas Animadas (Desglose) */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(10, 130, 68, 0.03)", pointerEvents: "none", lineHeight: 1 }}>3</div>
          <h2 style={{ color: theme.superetteGreen, fontSize: "2.5rem", marginTop: 0, marginBottom: "2.5rem" }}>
            Desglose Operativo Mensual
          </h2>
          
          <div style={{ overflowX: "auto", position: "relative", zIndex: 2 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.borderSolid}`, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Fase Operativa</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.borderSolid}`, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Volumen y Entregables (197)</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "right", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.borderSolid}`, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Inversión Mensual</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                
                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "2rem", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>1. Maquila Gráfica In-House</strong>
                  </td>
                  <td style={{ padding: "2rem", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>~118 Artes Impresos:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Lonas, Banners y Carteleras (54)</li>
                      <li>Material POP y Cenefas (36)</li>
                      <li>Planas de Periódico (16)</li>
                      <li>Adaptaciones de formato (12)</li>
                    </ul>
                  </td>
                  <td style={{ padding: "2rem", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>$116,400 MXN</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "2rem", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>2. Ecosistema Digital</strong>
                  </td>
                  <td style={{ padding: "2rem", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>~71 Entregables Digitales:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Volantes Digitales y Ofertas Flash (48)</li>
                      <li>Parrilla de Redes Sociales (15)</li>
                      <li>Banners Web y Medios Locales (8)</li>
                    </ul>
                  </td>
                  <td style={{ padding: "2rem", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>$49,000 MXN</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "2rem", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>3. Dirección Estratégica</strong>
                  </td>
                  <td style={{ padding: "2rem", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>8 Entregables Core + Pauta:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Redacción de Notas Corporativas PR (4)</li>
                      <li>Producción de Reels In-Situ (2)</li>
                      <li>Transmisiones En Vivo (2)</li>
                    </ul>
                    <span style={{ display: "inline-block", background: "rgba(218, 41, 28, 0.1)", color: theme.superetteRed, padding: "8px 12px", borderRadius: "8px", fontSize: "0.85rem", marginTop: "1rem", fontWeight: "bold" }}>
                      El Ad Spend corre por cuenta de Superette.
                    </span>
                  </td>
                  <td style={{ padding: "2rem", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>$70,000 MXN</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim}>
                  <td colSpan={2} style={{ padding: "3rem 2rem", textAlign: "right", verticalAlign: "middle" }}>
                    <strong style={{ color: theme.textMuted, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px" }}>Inversión Mensual Total</strong>
                  </td>
                  <td style={{ padding: "3rem 2rem", textAlign: "right", verticalAlign: "middle" }}>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, type: "spring" }}
                      style={{ background: theme.textMain, color: "#fff", padding: "1.2rem 2rem", borderRadius: "16px", display: "inline-block", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                    >
                      <strong style={{ fontSize: "2rem", letterSpacing: "-1px" }}>$235,400 MXN</strong>
                    </motion.div>
                  </td>
                </motion.tr>

              </motion.tbody>
            </table>
          </div>
        </GlassCard>

        {/* 5. Menú de Expansión */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h3 style={{ color: theme.textMain, fontSize: "2rem", marginBottom: "1rem", letterSpacing: "-1px" }}>Proyectos Out of Scope</h3>
          <p style={{ color: theme.textMuted, fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 3rem", lineHeight: 1.6 }}>Como agencia integral, escalamos su marca cuando estén listos. Cotizados de forma independiente.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
            {["Renders Arquitectónicos 3D para Sucursales", "Desarrollo de WebApps Corporativas", "Shooting Fotográfico Masivo In-Situ", "Activaciones BTL en Estacionamientos"].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", padding: "1.5rem", borderRadius: "16px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "flex-start", gap: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                <span style={{ color: theme.superetteGreen, fontSize: "1.5rem", fontWeight: 300 }}>✦</span>
                <span style={{ color: theme.textMain, fontWeight: 500, fontSize: "1.1rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Footer Premium */}
      <footer style={{ background: theme.textMain, color: "rgba(255,255,255,0.6)", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", opacity: 0.5 }}>
            <img src="/assets/fn1-logo.png" alt="Frontera Número Uno" style={{ height: "30px", filter: "brightness(0) invert(1)" }} />
            <div style={{ height: "24px", width: "1px", background: "rgba(255,255,255,0.3)" }} />
            <img src="/assets/apolograma.png" alt="Apolograma" style={{ height: "22px", filter: "brightness(0) invert(1)" }} />
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
