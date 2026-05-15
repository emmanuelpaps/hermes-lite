"use client";

import React from "react";
import { motion } from "framer-motion";

const theme = {
  superetteGreen: "#008e4f",
  superetteGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  superetteRed: "#da291c",
  superetteYellow: "#facc15",
  surface: "#ffffff",
  bg: "#f8fafc",
  textMain: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const tableRowAnim: any = {
  hidden: { opacity: 0, x: -20, backgroundColor: "rgba(255,255,255,0)" },
  visible: { opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,1)", transition: { duration: 0.5 } }
};

export default function SuperetteClient() {
  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingBottom: "5rem" }}>
      
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
          background: theme.superetteGradient, color: "#fff",
          padding: "1rem 2rem", borderRadius: "50px", fontWeight: "bold",
          textDecoration: "none", boxShadow: "0 10px 25px rgba(4, 120, 87, 0.4)",
          display: "flex", alignItems: "center", gap: "10px"
        }}
      >
        <span>Aprobar Propuesta</span>
      </motion.a>

      {/* Hero Section */}
      <div style={{ 
        background: theme.superetteGradient, 
        padding: "6rem 2rem 8rem", 
        textAlign: "center",
        color: "#ffffff",
        clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "rgba(255,255,255,0.05)", transform: "rotate(25deg)" }} />
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "50%", height: "200%", background: "rgba(0,0,0,0.05)", transform: "rotate(-25deg)" }} />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.img 
            variants={fadeInUp}
            src="/assets/superette/Superette_Logo_White.png" 
            alt="Superette Logo" 
            style={{ height: "80px", marginBottom: "2rem", objectFit: "contain" }}
          />
          <motion.h1 variants={fadeInUp} style={{ fontSize: "3.5rem", fontWeight: 800, margin: "0 0 1rem", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Propuesta Estratégica y Operativa
          </motion.h1>
          <motion.p variants={fadeInUp} style={{ fontSize: "1.3rem", opacity: 0.9, maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
            Ingeniería Gráfica y Comunicación Masiva. No somos una agencia creativa tradicional; somos la infraestructura que absorberá la maquinaria operativa de sus 35 sucursales.
          </motion.p>
        </motion.div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "-4rem auto 0", padding: "0 2rem", position: "relative", zIndex: 10 }}>
        
        {/* 1. El Desafío */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{
          background: theme.surface, borderRadius: "20px", padding: "3rem", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", marginBottom: "3rem"
        }}>
          <h2 style={{ color: theme.superetteGreen, fontSize: "2rem", marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ background: theme.superetteGreen, color: "#fff", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>1</span>
            El Desafío Operativo
          </h2>
          <p style={{ fontSize: "1.1rem", color: theme.textMuted, lineHeight: 1.8 }}>
            Al auditar su operación, identificamos un desafío matemático: procesar más de <strong>190 artes mensuales</strong> hace que la creatividad pase a segundo plano frente a la precisión. Sabemos que un error tipográfico en una lona impresa masiva cuesta dinero y genera fricción en piso de venta.
          </p>
          <div style={{ background: "#f0fdf4", borderLeft: `5px solid ${theme.superetteGreen}`, padding: "1.5rem", borderRadius: "0 10px 10px 0", marginTop: "2rem" }}>
            <h4 style={{ color: theme.superetteGreen, margin: "0 0 0.5rem", fontSize: "1.2rem" }}>Nuestra Misión</h4>
            <p style={{ margin: 0, color: theme.textMain }}>Proponemos instalar una <strong>Célula Operativa Dedicada</strong> que funcionará como su brazo externo (equivalente a 6 especialistas de tiempo completo). Nosotros asumimos la carga laboral, los costos de licencias y el estrés operativo, otorgándoles absoluta paz mental.</p>
          </div>
        </motion.div>

        {/* Las Garantías (Cards) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          <motion.div variants={fadeInUp} style={{ background: theme.surface, padding: "2.5rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", borderTop: `4px solid ${theme.superetteGreen}` }}>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.3rem" }}>Filtro Técnico Estricto</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Dirección de arte y control de pre-prensa dedicado exclusivamente a asegurar cero errores antes de imprimir.</p>
          </motion.div>
          <motion.div variants={fadeInUp} style={{ background: theme.surface, padding: "2.5rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", borderTop: `4px solid ${theme.superetteRed}` }}>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.3rem" }}>Velocidad Garantizada</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Tiempos de respuesta blindados (L-V 8a5). Lonas Express en 24h-36h. Volantes en 24h. Cero retrasos.</p>
          </motion.div>
          <motion.div variants={fadeInUp} style={{ background: theme.surface, padding: "2.5rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", borderTop: `4px solid ${theme.superetteYellow}` }}>
            <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.3rem" }}>Flujo Anti-Burocracia</h3>
            <p style={{ color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>Un Solo Canal (Asana/Chat) y Un Solo Filtro (una persona de Superette autorizando) para erradicar cuellos de botella.</p>
          </motion.div>
        </motion.div>

        {/* 2. El Embudo Digital */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{
          background: theme.surface, borderRadius: "20px", padding: "3rem", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", marginBottom: "3rem"
        }}>
          <h2 style={{ color: theme.superetteGreen, fontSize: "2rem", marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ background: theme.superetteGreen, color: "#fff", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>2</span>
            El Embudo Omnicanal (Traffic Management)
          </h2>
          <p style={{ fontSize: "1.1rem", color: theme.textMuted, lineHeight: 1.8 }}>
            No nos limitamos a oprimir el botón de promocionar. Implementamos un embudo industrial de 3 fases diseñado para comprar tráfico directo a piso de venta.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <div style={{ padding: "1.5rem", background: theme.bg, borderRadius: "12px", borderLeft: `4px solid ${theme.superetteGreen}` }}>
              <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain }}>Top Funnel (Awareness)</h4>
              <p style={{ margin: 0, color: theme.textMuted }}>Reproducciones de Reels In-Situ. Mostramos la frescura de la Carnicería a todo Juárez para generar antojo visual.</p>
            </div>
            <div style={{ padding: "1.5rem", background: theme.bg, borderRadius: "12px", borderLeft: `4px solid ${theme.superetteYellow}` }}>
              <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain }}>Mid Funnel (Retargeting)</h4>
              <p style={{ margin: 0, color: theme.textMuted }}>Impactamos a los usuarios que vieron el video con nuestros Volantes Digitales y Ofertas Flash de corta duración.</p>
            </div>
            <div style={{ padding: "1.5rem", background: theme.bg, borderRadius: "12px", borderLeft: `4px solid ${theme.superetteRed}` }}>
              <h4 style={{ margin: "0 0 0.5rem", color: theme.textMain }}>Bottom Funnel (Conversión)</h4>
              <p style={{ margin: 0, color: theme.textMuted }}>Ads geolocalizados estrictamente a <strong>3KM a la redonda de las 35 sucursales</strong>. Publicados de Jueves a Domingo para inyectar tráfico real.</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Transición y Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ background: theme.surface, padding: "2.5rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h3 style={{ color: theme.superetteGreen, marginTop: 0, fontSize: "1.5rem" }}>Plan de Transición Exprés</h3>
            <p style={{ color: theme.textMuted, marginBottom: "1.5rem" }}>Empalme en 15 días sin detener su ritmo comercial.</p>
            <ul style={{ paddingLeft: "1.2rem", color: theme.textMain, lineHeight: 1.7 }}>
              <li style={{ marginBottom: "1rem" }}><strong>Fase 1 (Días 1-5):</strong> Auditoría, extracción de credenciales, y descarga de plantillas históricas.</li>
              <li style={{ marginBottom: "1rem" }}><strong>Fase 2 (Días 6-14):</strong> Inmersión presencial (2 jornadas) y Operación <em>"Shadowing"</em> produciendo artes en paralelo.</li>
              <li><strong>Día 15:</strong> Toma de control total y liberación de su equipo interno.</li>
            </ul>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ background: theme.surface, padding: "2.5rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h3 style={{ color: theme.superetteRed, marginTop: 0, fontSize: "1.5rem" }}>KPIs y Métricas de Éxito</h3>
            <p style={{ color: theme.textMuted, marginBottom: "1.5rem" }}>Nos protegemos de métricas de vanidad evaluando 3 KPIs duros:</p>
            <ul style={{ paddingLeft: "1.2rem", color: theme.textMain, lineHeight: 1.7 }}>
              <li style={{ marginBottom: "1rem" }}><strong>Métrica 1: Alcance (Reach).</strong> Volumen de juarenses impactados exclusivamente a 3KM de distancia de la sucursal.</li>
              <li style={{ marginBottom: "1rem" }}><strong>Métrica 2: Costo Por Clic (CPC).</strong> Eficiencia para lograr visitas hacia las ofertas de fin de semana.</li>
              <li><strong>Métrica 3: Engagement de Video.</strong> Porcentaje de retención de atención (Visualizaciones &gt; 50%) en Reels In-Situ.</li>
            </ul>
          </motion.div>

        </div>

        {/* 4. Tablas Animadas (Desglose) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{
          background: theme.surface, borderRadius: "20px", padding: "3rem", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", marginBottom: "4rem"
        }}>
          <h2 style={{ color: theme.superetteGreen, fontSize: "2rem", marginTop: 0, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ background: theme.superetteGreen, color: "#fff", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>3</span>
            Desglose Operativo (Los 197 Entregables)
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.border}` }}>Fase Operativa</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.border}` }}>Volumen y Entregables</th>
                  <th style={{ padding: "1rem", textAlign: "right", color: theme.textMuted, fontWeight: 600, borderBottom: `2px solid ${theme.border}` }}>Inversión Mensual</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                
                {/* Row 1 */}
                <motion.tr variants={tableRowAnim} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.02)", borderRadius: "10px" }}>
                  <td style={{ padding: "1.5rem", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: `1px solid ${theme.border}`, borderRight: "none", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.1rem" }}>1. Maquila Gráfica In-House</strong>
                  </td>
                  <td style={{ padding: "1.5rem", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>~118 Artes Impresos:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", color: theme.textMuted }}>
                      <li>Lonas, Banners y Carteleras (54)</li>
                      <li>Material POP y Cenefas (36)</li>
                      <li>Planas de Periódico (16)</li>
                      <li>Adaptaciones de formato (12)</li>
                    </ul>
                  </td>
                  <td style={{ padding: "1.5rem", textAlign: "right", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", border: `1px solid ${theme.border}`, borderLeft: "none", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.2rem", color: theme.textMain }}>$116,400 MXN</strong>
                  </td>
                </motion.tr>

                {/* Row 2 */}
                <motion.tr variants={tableRowAnim} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.02)", borderRadius: "10px" }}>
                  <td style={{ padding: "1.5rem", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: `1px solid ${theme.border}`, borderRight: "none", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.1rem" }}>2. Ecosistema Digital</strong>
                  </td>
                  <td style={{ padding: "1.5rem", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>~71 Entregables Digitales:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", color: theme.textMuted }}>
                      <li>Volantes Digitales y Ofertas Flash (48)</li>
                      <li>Parrilla de Redes Sociales (15)</li>
                      <li>Banners Web y Medios Locales (8)</li>
                    </ul>
                  </td>
                  <td style={{ padding: "1.5rem", textAlign: "right", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", border: `1px solid ${theme.border}`, borderLeft: "none", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.2rem", color: theme.textMain }}>$49,000 MXN</strong>
                  </td>
                </motion.tr>

                {/* Row 3 */}
                <motion.tr variants={tableRowAnim} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.02)", borderRadius: "10px" }}>
                  <td style={{ padding: "1.5rem", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: `1px solid ${theme.border}`, borderRight: "none", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.1rem" }}>3. Dirección Estratégica</strong>
                  </td>
                  <td style={{ padding: "1.5rem", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, verticalAlign: "top" }}>
                    <strong style={{ color: theme.superetteGreen }}>8 Entregables Core + Pauta:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", color: theme.textMuted }}>
                      <li>Redacción de Notas Corporativas PR (4)</li>
                      <li>Producción de Reels In-Situ (2)</li>
                      <li>Transmisiones En Vivo (2)</li>
                    </ul>
                    <span style={{ display: "inline-block", background: theme.superetteRed, color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", marginTop: "0.5rem", fontWeight: "bold" }}>
                      NOTA: El Ad Spend corre por cuenta de Superette.
                    </span>
                  </td>
                  <td style={{ padding: "1.5rem", textAlign: "right", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", border: `1px solid ${theme.border}`, borderLeft: "none", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.2rem", color: theme.textMain }}>$70,000 MXN</strong>
                  </td>
                </motion.tr>

                {/* Total Row */}
                <motion.tr variants={tableRowAnim}>
                  <td colSpan={2} style={{ padding: "2rem 1.5rem", textAlign: "right", verticalAlign: "middle" }}>
                    <strong style={{ color: theme.textMuted, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "1px" }}>Inversión Mensual Total</strong>
                  </td>
                  <td style={{ padding: "2rem 1.5rem", textAlign: "right", verticalAlign: "middle" }}>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, type: "spring" }}
                      style={{ background: theme.superetteGreen, color: "#fff", padding: "1rem 1.5rem", borderRadius: "12px", display: "inline-block" }}
                    >
                      <strong style={{ fontSize: "1.8rem" }}>$235,400 MXN</strong>
                    </motion.div>
                  </td>
                </motion.tr>

              </motion.tbody>
            </table>
          </div>
        </motion.div>

        {/* 5. Menú de Expansión (Out of Scope) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h3 style={{ color: theme.textMain, fontSize: "1.8rem", marginBottom: "1rem" }}>Proyectos Especiales (Out of Scope)</h3>
          <p style={{ color: theme.textMuted, fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto 3rem" }}>Como agencia integral, somos capaces de escalar la marca al siguiente nivel cuando estén listos. Estos servicios se cotizan de forma independiente a la iguala operativa.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
            {["Renders Arquitectónicos 3D para nuevas sucursales", "Desarrollo de WebApps Corporativas", "Shooting Fotográfico Masivo de Perecederos", "Activaciones BTL en Estacionamientos"].map((item, i) => (
              <div key={i} style={{ background: theme.surface, padding: "1.5rem", borderRadius: "12px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: theme.superetteGreen, fontSize: "1.5rem" }}>+</span>
                <span style={{ color: theme.textMain, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
