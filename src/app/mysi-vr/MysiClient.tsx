"use client";

import { motion } from "framer-motion";
import { ChevronRight, Video, Target, Globe, ArrowRight, Download, Bot } from "lucide-react";
import React from "react";

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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

export default function MysiClient() {
  return (
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
      <header style={{ 
        position: "fixed", 
        top: 0, left: 0, right: 0, 
        padding: "clamp(1rem, 2vw, 1.5rem) clamp(1rem, 5vw, 4rem)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <img src="/assets/fn1-logo-white.png" alt="FN1" style={{ height: "24px", opacity: 0.95 }} />
          <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.15)" }} />
          <img src="/assets/apolograma-logo-v2.png" alt="Apolograma" style={{ height: "16px", opacity: 0.9, filter: "brightness(0) invert(1)" }} />
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
              <div>
                <h2 style={{ color: theme.mysiAccent, fontSize: "2.5rem", marginTop: 0, marginBottom: "1.5rem", position: "relative" }}>
                  Arquitectura del Entorno VR
                </h2>
                <p style={{ color: theme.textMuted, fontSize: "1.2rem", lineHeight: 1.7 }}>
                  Desarrollado con la misma tecnología usada en videojuegos de última generación (Unity 3D). Diseñamos el recorrido para que dure <strong>máximo 10 minutos</strong>, asegurando que cientos de personas en la expo puedan probarlo sin causar cuellos de botella.
                </p>
              </div>
              <div style={{ display: "grid", gap: "1.5rem" }}>
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
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 2. EMBUDO DE FERIA (LANDING PAGE) */}
        <GlassCard style={{ marginBottom: "5rem" }}>
          <div style={{ position: "absolute", top: "-20px", right: "20px", fontSize: "15rem", fontWeight: 900, color: "rgba(255, 255, 255, 0.02)", pointerEvents: "none", lineHeight: 1 }}>2</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "center" }}>
            <div>
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
            </div>
            <div style={{ position: "relative", height: "300px", borderRadius: "16px", overflow: "hidden", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "url('/assets/abstract-3d.png') center/cover", opacity: 0.4 }} />
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <Globe size={48} color={theme.mysiAccent} style={{ marginBottom: "1rem" }} />
                <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Captura Segura de Leads</h3>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 3. CRONOGRAMA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ marginBottom: "5rem" }}>
          <h2 style={{ color: "#FFF", fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>Cronograma (Hacia Atrás)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <GlassCard borderTopColor={theme.mysiSteel} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.mysiAccent, margin: "0 0 1rem" }}>Todo Mayo</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Desarrollo intensivo de la Arquitectura 3D y Programación Lógica de VR.</p>
            </GlassCard>
            <GlassCard borderTopColor={theme.mysiBlue} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.mysiAccent, margin: "0 0 1rem" }}>8 de Junio</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Demo Beta V.1 (Pruebas de recorrido en las oficinas del cliente).</p>
            </GlassCard>
            <GlassCard borderTopColor={theme.textMain} style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ fontSize: "2rem", color: theme.textMain, margin: "0 0 1rem" }}>15 de Junio</h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>Freeze de código, entrega final de Oculus y capacitación al equipo de ventas.</p>
            </GlassCard>
          </div>
        </motion.div>

        {/* 4. REQUISITOS (NECESITAMOS) */}
        <GlassCard borderTopColor={theme.mysiBlue} style={{ marginBottom: "5rem" }}>
          <h3 style={{ color: theme.textMain, marginTop: 0, fontSize: "1.8rem" }}>Requerimientos Técnicos (A proveer por MYSI)</h3>
          <ul style={{ paddingLeft: "1.2rem", color: theme.textMuted, lineHeight: 1.8, fontSize: "1.1rem", margin: "1.5rem 0 0" }}>
            <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Referencias Visuales 3D:</strong> Fotos y videos de las 4 máquinas estáticas (VF-3 SXT, ST-15Y, Mini Mill, VF-2 SXT).</li>
            <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Máquina Interactiva:</strong> Referencias del panel de control de la HAAS VF-2SSYT y del Bar Feeder.</li>
            <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Arquitectura:</strong> Fotos y metros cuadrados exactos de la superficie de la planta en Costa Rica.</li>
            <li style={{ marginBottom: "1rem" }}><strong style={{ color: theme.textMain }}>Voiceover:</strong> Aprobación final del guion comercial de 8 diálogos antes de enviar a grabar la locución profesional.</li>
            <li><strong style={{ color: theme.textMain }}>Hardware VR:</strong> El cliente cuenta con y proveerá los visores Meta Quest para la instalación del software.</li>
          </ul>
        </GlassCard>

        {/* 5. TABLA DE INVERSIÓN */}
        <div style={{ marginBottom: "5rem" }}>
          <h2 style={{ color: "#FFF", fontSize: "2.5rem", marginBottom: "3rem", textAlign: "center" }}>Desglose de Ingeniería</h2>
          
          <div style={{ overflowX: "auto", position: "relative", zIndex: 2 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px", minWidth: "600px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, paddingBottom: "1rem", letterSpacing: "1px" }}>FASE OPERATIVA</th>
                  <th style={{ textAlign: "left", color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, paddingBottom: "1rem", letterSpacing: "1px" }}>VOLUMEN Y ENTREGABLES</th>
                  <th style={{ textAlign: "right", color: theme.textMuted, fontSize: "0.9rem", fontWeight: 600, paddingBottom: "1rem", letterSpacing: "1px" }}>HORAS</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                
                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>1. Arquitectura 3D</strong>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.mysiAccent }}>Modelado Físico y Estructura:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Modelado en 3D de 4 máquinas estáticas (VF-3 SXT, ST-15Y, Mini Mill, VF-2 SXT).</li>
                      <li>Modelado ultra-detallado de la Máquina Interactiva (VF-2SSYT y Bar Feeder).</li>
                      <li>Diseño del entorno virtual de la planta de Costa Rica a escala.</li>
                    </ul>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>80 hrs</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>2. Lógica VR</strong>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.mysiAccent }}>Interactividad y Sincronización:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Programación de las 8 locuciones del guion y sincronización de eventos.</li>
                      <li>Programación de la animación interactiva de la HAAS VF-2SSYT.</li>
                      <li>Configuración del Teleport para avanzar fluidamente entre las 5 estaciones.</li>
                    </ul>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>50 hrs</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim} style={{ borderRadius: "16px" }}>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.textMain, fontSize: "1.2rem" }}>3. Ecosistema de Leads</strong>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ color: theme.mysiAccent }}>Base de Datos y WhatsApp:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", color: theme.textMuted, lineHeight: 1.6 }}>
                      <li>Diseño de página web (Landing Page) atractiva para registro en iPads/Celulares.</li>
                      <li>Creación de Base de Datos en la Nube (CRM) para almacenar prospectos seguros.</li>
                      <li>Automatización robotizada para que WhatsApp envíe mensajes y brochures al instante 24/7.</li>
                    </ul>
                  </td>
                  <td style={{ padding: "clamp(1rem, 3vw, 2rem)", textAlign: "right", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", background: "rgba(0,0,0,0.3)", verticalAlign: "top" }}>
                    <strong style={{ fontSize: "1.3rem", color: theme.textMain }}>35 hrs</strong>
                  </td>
                </motion.tr>

                <motion.tr variants={tableRowAnim}>
                  <td colSpan={2} style={{ padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)", textAlign: "right", verticalAlign: "middle" }}>
                    <strong style={{ color: theme.textMuted, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px" }}>Inversión Total (165 Horas)</strong>
                  </td>
                  <td style={{ padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)", textAlign: "right", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <strong style={{ fontSize: "2rem", letterSpacing: "-1px", color: theme.mysiAccent }}>$107,250 MXN</strong>
                    </motion.div>
                  </td>
                </motion.tr>
              </motion.tbody>
            </table>
          </div>
        </div>

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
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", justifyContent: "center" }}>
            <img src="/assets/fn1-logo-white.png" alt="FN1" style={{ height: "20px", opacity: 0.5 }} />
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />
            <img src="/assets/apolograma-logo-v2.png" alt="Apolograma" style={{ height: "14px", opacity: 0.5, filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", margin: 0, letterSpacing: "1px" }}>
            © {new Date().getFullYear()} Frontera Número Uno & Apolograma. Todos los derechos reservados.
          </p>
        </footer>

      </div>

    </div>
  );
}
