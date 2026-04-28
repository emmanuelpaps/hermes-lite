"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./page.module.css";
import React, { useRef } from "react";

interface Service {
  name: string;
  price: number;
  description: string;
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

interface ClientData {
  clientName: string;
  clientLogo: string;
  industry: string;
  heroText: string;
  storytelling?: {
    challenge: string;
    pillars: { title: string; description: string }[];
  };
  packages: {
    fn1: Service[];
    apolograma: Service[];
  };
  discountPercent: number;
}

export default function MediaKitView({ data }: { data: ClientData }) {
  const fn1Total = data.packages.fn1.reduce((acc, curr) => acc + curr.price, 0);
  const apoTotal = data.packages.apolograma.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = fn1Total + apoTotal;
  const discountAmount = subtotal * (data.discountPercent / 100);
  const total = subtotal - discountAmount;

  const formatPrice = (num: number) => `$${num.toLocaleString("es-MX")} MXN`;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className={styles.main}>
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
              <TiltCard key={idx} className={styles.storyPillarCard}>
                <motion.div variants={fadeUp}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </section>
      )}

      {/* Audiences */}
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
              <TiltCard key={idx} className={`${styles.serviceItem} glass`}>
                <motion.div 
                  variants={fadeUp}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
                >
                  <div className={styles.serviceInfo} style={{ textAlign: 'left', flex: 1, paddingRight: '2rem' }}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </section>
      )}

      {/* Apolograma Services */}
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
              <TiltCard key={idx} className={`${styles.serviceItem} glass`}>
                <motion.div 
                  variants={fadeUp}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
                >
                  <div className={styles.serviceInfo} style={{ textAlign: 'left', flex: 1, paddingRight: '2rem' }}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </section>
      )}

      {/* Summary */}
      <section className={styles.summarySection}>
        <motion.div 
          className={`${styles.summaryCard} glass`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>Tu ecosistema, consolidado.</h2>
          <p className={styles.sectionSubtitle} style={{marginBottom: "1rem"}}>Resumen de Inversión Mensual</p>
          
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
          
          <button className={styles.ctaButton}>Aprobar Propuesta</button>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Tecza Tecnologies S. de R.L. de C.V.
      </footer>
    </main>
  );
}
