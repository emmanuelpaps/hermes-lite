"use client";

import { motion, Variants } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";

interface Service {
  name: string;
  price: number;
  description: string;
}

interface ClientData {
  clientName: string;
  clientLogo: string;
  industry: string;
  heroText: string;
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
          <motion.div className={`${styles.statCard} glass`} whileHover={{ scale: 1.02 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className={`${styles.statNumber} text-gradient`}>391K</div>
            <h3>The Millennials</h3>
            <p>Facebook · 72% de 25-44 años</p>
          </motion.div>
          <motion.div className={`${styles.statCard} glass`} whileHover={{ scale: 1.02 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
            <div className={`${styles.statNumber} text-gradient`}>69K</div>
            <h3>The Centennials</h3>
            <p>Instagram · 63% de 18-34 años</p>
          </motion.div>
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
          
          <div className={styles.servicesGrid}>
            {data.packages.fn1.map((service, idx) => (
              <motion.div 
                key={idx} 
                className={`${styles.serviceItem} glass`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.serviceInfo}>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
              </motion.div>
            ))}
          </div>
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
          
          <div className={styles.servicesGrid}>
            {data.packages.apolograma.map((service, idx) => (
              <motion.div 
                key={idx} 
                className={`${styles.serviceItem} glass`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.serviceInfo}>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
              </motion.div>
            ))}
          </div>
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
          
          <div style={{textAlign: "left", marginBottom: "2rem", color: "var(--muted-text)"}}>
            {subtotal > 0 && <p>Subtotal: {formatPrice(subtotal)}</p>}
            {data.discountPercent > 0 && <p style={{color: "#4ade80"}}>Descuento ({data.discountPercent}%): -{formatPrice(discountAmount)}</p>}
          </div>

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
