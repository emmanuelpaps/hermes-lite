"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import React, { useRef, useState } from "react";

interface Service {
  name: string;
  price: number;
  description: string;
  bullets?: string[];
  image?: string;
}

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

interface AccordionProps {
  service: Service;
  formatPrice: (n:number)=>string;
  variants: Variants;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionCard = ({ service, formatPrice, variants, isOpen, onToggle }: AccordionProps) => {
  return (
    <motion.div 
      layout
      className={`${styles.serviceItem} ${isOpen ? styles.serviceItemActive : 'glass'}`}
      onClick={onToggle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      style={{ position: 'relative', zIndex: isOpen ? 45 : 1 }}
    >
      <motion.div layout className={styles.serviceHeader}>
        <div className={styles.serviceInfo}>
          <h3>
            {service.name}
            <motion.div 
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'inline-block' }}
            >
              ▼
            </motion.div>
          </h3>
        </div>
        <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.accordionContent}
          >
            {service.image && (
              <img src={service.image} alt={service.name} className={styles.accordionImage} />
            )}
            <div className={styles.accordionText}>
              <p style={{ marginBottom: service.bullets ? "1.5rem" : "0" }}>
                {service.description}
              </p>
              
              {service.bullets && (
                <ul className={styles.bulletList}>
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <span className={styles.bulletCheck}>✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ClientData {
  clientName: string;
  clientLogo: string;
  industry: string;
  heroText: string;
  storytelling?: {
    challenge: string;
    pillars: { title: string; description: string; image?: string }[];
  };
  packages: {
    fn1: Service[];
    apolograma: Service[];
    blocks?: { name: string; services: Service[] }[];
  };
  discountPercent: number;
}

export default function MediaKitView({ data }: { data: ClientData }) {
  const [activeService, setActiveService] = useState<string | null>(null);

  const fn1Total = data.packages.fn1.reduce((acc, curr) => acc + curr.price, 0);
  const apoTotal = data.packages.apolograma.reduce((acc, curr) => acc + curr.price, 0);
  const blocksTotal = data.packages.blocks ? data.packages.blocks.reduce((acc, block) => acc + block.services.reduce((sum, s) => sum + s.price, 0), 0) : 0;
  const subtotal = fn1Total + apoTotal + blocksTotal;
  const discountAmount = subtotal * (data.discountPercent / 100);
  const total = subtotal - discountAmount;

  const formatPrice = (num: number) => `$${num.toLocaleString("es-MX")} MXN`;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className={styles.main}>
      <AnimatePresence>
        {activeService && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className={styles.globalBackdrop} 
            onClick={() => setActiveService(null)}
          />
        )}
      </AnimatePresence>

      {/* Agency Header Navbar */}
      <header className={styles.header}>
        <div className={styles.agencyLogos}>
          <div className={styles.agencyLogoText}>APOLOGRAMA</div>
          <img src="/assets/fn1-logo-white.png" alt="Frontera Número Uno" className={styles.agencyLogoImage} />
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        
        <motion.div 
          className={styles.floating3D} 
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={styles.logoContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {data.clientLogo && (
            <img src={data.clientLogo} alt={data.clientName} className={styles.logo} />
          )}
        </motion.div>
        
        <motion.h1 
          className={`${styles.heroTitle} text-gradient`}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Transformamos la manera en que {data.clientName} conecta con la comunidad.
        </motion.h1>
        
        <motion.p 
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
        >
          {data.heroText}
        </motion.p>
      </section>

      {/* Brand Divider */}
      <motion.div 
        className={styles.brandDivider}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/assets/stickers/x-purple.png" alt="Frontera X" />
      </motion.div>

      {/* Storytelling: The Challenge */}
      {data.storytelling && (
        <section className={styles.storySection}>
          <motion.h2 
            className={`${styles.storyChallenge} text-gradient`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            &quot;{data.storytelling.challenge}&quot;
          </motion.h2>

          <motion.div 
            className={styles.storyPillarsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            {data.storytelling.pillars.map((pillar, idx) => (
              <motion.div key={idx} variants={fadeUp} className={styles.storyPillarCard}>
                {pillar.image && (
                  <img src={pillar.image} alt={pillar.title} className={styles.pillarImage} />
                )}
                <div className={styles.pillarContent}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Audiences */}
      {data.packages.fn1.length > 0 && (
        <section className={styles.section}>
          <motion.h2 
            className={styles.sectionTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            Nuestras Audiencias
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            El respaldo que tu marca necesita.
          </motion.p>
          
          <div className={styles.statsGrid}>
            <TiltCard className={`${styles.statCard} glass`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className={`${styles.statNumber} text-gradient`}>391K</div>
                <h3>The Millennials</h3>
                <p>Facebook · 72% de 25-44 años</p>
              </motion.div>
            </TiltCard>
            <TiltCard className={`${styles.statCard} glass`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
                <div className={`${styles.statNumber} text-gradient`}>69K</div>
                <h3>The Centennials</h3>
                <p>Instagram · 63% de 18-34 años</p>
              </motion.div>
            </TiltCard>
          </div>
        </section>
      )}

      {/* FN1 Services */}
      {data.packages.fn1.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Estrategia de Medios
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Alcance masivo y credibilidad con Frontera Número Uno.
          </motion.p>
          
          <motion.div 
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {data.packages.fn1.map((service, idx) => (
              <AccordionCard 
                key={idx} 
                service={service} 
                formatPrice={formatPrice} 
                variants={fadeUp} 
                isOpen={activeService === service.name}
                onToggle={() => setActiveService(activeService === service.name ? null : service.name)}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Apolograma Services (Legacy Flat List) */}
      {data.packages.apolograma.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Estrategia de Agencia
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Desarrollo de marca y presencia digital impecable con Apolograma.
          </motion.p>
          
          <motion.div 
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {data.packages.apolograma.map((service, idx) => (
              <AccordionCard 
                key={idx} 
                service={service} 
                formatPrice={formatPrice} 
                variants={fadeUp} 
                isOpen={activeService === service.name}
                onToggle={() => setActiveService(activeService === service.name ? null : service.name)}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Blocks Structure */}
      {data.packages.blocks && data.packages.blocks.map((block, blockIdx) => (
        <section key={`block-${blockIdx}`} className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {block.name}
          </motion.h2>
          
          <motion.div 
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {block.services.map((service, idx) => (
              <AccordionCard 
                key={`${blockIdx}-${idx}`} 
                service={service} 
                formatPrice={formatPrice} 
                variants={fadeUp} 
                isOpen={activeService === service.name}
                onToggle={() => setActiveService(activeService === service.name ? null : service.name)}
              />
            ))}
          </motion.div>
        </section>
      ))}

      {/* Summary */}
      <section className={styles.summarySection}>
        <motion.div 
          className={`${styles.summaryCard} glass`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>
            {data.packages.blocks && data.packages.blocks.length > 0 ? "Ejecución Modular" : "Tu ecosistema, consolidado."}
          </h2>
          <p className={styles.sectionSubtitle} style={{marginBottom: "1rem"}}>
            {data.packages.blocks && data.packages.blocks.length > 0 ? "Inversión Total del Proyecto" : "Resumen de Inversión Mensual"}
          </p>

          {data.packages.blocks && data.packages.blocks.length > 0 && (
            <div style={{
              background: "rgba(168, 85, 247, 0.1)", 
              border: "1px solid rgba(168, 85, 247, 0.3)", 
              borderRadius: "8px", 
              padding: "1rem", 
              marginBottom: "2rem",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              textAlign: "left"
            }}>
              <strong>Metodología Flexible:</strong> Podemos ejecutar el ecosistema completo de forma simultánea, o bien, realizar un despliegue por bloques individuales <strong>(lapsos de 30 días naturales por bloque)</strong> para escalar la inversión a tu ritmo.
            </div>
          )}
          
          <div style={{textAlign: "left", marginBottom: "1rem", color: "var(--muted-text)"}}>
            {subtotal > 0 && <p>Subtotal: {formatPrice(subtotal)}</p>}
            {data.discountPercent > 0 && <p style={{color: "#4ade80"}}>Descuento ({data.discountPercent}%): -{formatPrice(discountAmount)}</p>}
          </div>

          {(fn1Total > 0 && apoTotal > 0) && (
            <>
              <div className={styles.progressContainer}>
                <div className={styles.progressAgency} style={{ width: `${(apoTotal / subtotal) * 100}%` }} />
                <div className={styles.progressMedia} style={{ width: `${(fn1Total / subtotal) * 100}%` }} />
              </div>
              <div className={styles.progressLabels}>
                <span style={{ color: "#a855f7" }}>Agencia ({Math.round((apoTotal/subtotal)*100)}%)</span>
                <span style={{ color: "#3b82f6" }}>Medios ({Math.round((fn1Total/subtotal)*100)}%)</span>
              </div>
            </>
          )}

          <div className={`${styles.totalPrice} text-gradient`}>
            {formatPrice(total)}
          </div>
          
          <motion.button 
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aprobar Propuesta
          </motion.button>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        <motion.div 
          className={styles.footerDecoration}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img src="/assets/puerta-juarez.png" alt="Puerta Juárez" />
        </motion.div>
        
        <div className={styles.footerContent}>
          <p>© {new Date().getFullYear()} Frontera Número Uno & Apolograma.</p>
          <p>Strictly Confidential. Do not distribute sin autorización.</p>
        </div>
      </footer>
    </main>
  );
}
