"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence, animate, useInView } from "framer-motion";
import styles from "./page.module.css";
import React, { useRef, useState, useEffect } from "react";
import { ViralChart, ApologramaShowcase, PremiumAudienceCard } from "./EcosystemAnimations";
import { CursorSpotlight } from "./CursorSpotlight";

// --- Countdown Banner ---
const CountdownBanner = ({ targetDate, label, isLight, primaryColor }: { targetDate: string; label: string; isLight: boolean; primaryColor: string }) => {
  const [days, setDays] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
      setDays(diff);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        margin: '3rem auto',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        background: isLight 
          ? `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%)` 
          : `linear-gradient(135deg, ${primaryColor}20 0%, rgba(0,0,0,0.3) 100%)`,
        border: `1px solid ${primaryColor}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        maxWidth: '700px',
        boxShadow: `0 0 60px ${primaryColor}15`,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{ 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            color: primaryColor, 
            lineHeight: 1,
            textShadow: `0 0 30px ${primaryColor}50`
          }}
        >
          {days}
        </motion.div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, marginTop: '0.3rem' }}>
          días
        </div>
      </div>
      <div style={{ textAlign: 'left', flex: 1, minWidth: '200px' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: isLight ? '#222' : '#fff', marginBottom: '0.3rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.85rem', color: isLight ? '#666' : '#999', lineHeight: 1.4 }}>
          Tus competidores ya están invirtiendo. La pregunta no es si debes actuar, sino cuánto mercado perderás si no lo haces hoy.
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedPrice = ({ value, locale = 'es-MX', currency = 'MXN' }: { value: number, locale?: string, currency?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(val) {
        node.textContent = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
      }
    });
    return controls.stop;
  }, [value, isInView, locale, currency]);

  return <span ref={nodeRef}>{new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0)}</span>;
}

interface Service {
  name: string;
  price: number;
  description: string;
  bullets?: string[];
  image?: string;
  badge?: string;
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
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  priceSuffix?: string;
  selectionType?: 'radio' | 'checkbox';
}

const AccordionCard = ({ service, formatPrice, variants, isOpen, onToggle, isSelectable, isSelected, onSelect, priceSuffix, selectionType = 'radio' }: AccordionProps) => {
  return (
    <motion.div 
      layout
      className={`${styles.serviceItem} ${isOpen ? styles.serviceItemActive : 'glass'}`}
      onClick={onToggle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      style={{ 
        position: 'relative', zIndex: isOpen ? 45 : 1,
        ...(isSelectable && isSelected ? { 
          borderColor: 'var(--primary-color, #4ade80)',
          boxShadow: '0 0 20px rgba(74, 222, 128, 0.15)'
        } : {})
      }}
    >
      <motion.div layout className={styles.serviceHeader}>
        <div className={styles.serviceInfo}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {service.name}
            {service.badge && (
              <span style={{ 
                fontSize: '0.6rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                padding: '0.25rem 0.6rem', 
                borderRadius: '20px', 
                background: 'rgba(168, 85, 247, 0.15)', 
                border: '1px solid rgba(168, 85, 247, 0.3)', 
                color: '#a855f7', 
                marginLeft: '0.75rem',
                verticalAlign: 'middle'
              }}>{service.badge}</span>
            )}
            <motion.div 
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'inline-block', marginLeft: '0.75rem' }}
            >
              ▼
            </motion.div>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.servicePrice} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span>{formatPrice(service.price)}</span>
            {priceSuffix && <span style={{ fontSize: '0.65rem', color: 'var(--muted-text)', marginTop: '0.1rem', textTransform: 'uppercase', fontWeight: 600 }}>{priceSuffix}</span>}
          </div>
          {isSelectable && (
            <div 
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(); }}
              style={{
                width: '22px', height: '22px', 
                borderRadius: selectionType === 'checkbox' ? '6px' : '50%',
                border: `2px solid ${isSelected ? 'var(--primary-color, #4ade80)' : 'var(--muted-text)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'all 0.2s ease',
                background: isSelected && selectionType === 'checkbox' ? 'var(--primary-color, #4ade80)' : 'transparent',
                opacity: isSelected ? 1 : 0.5
              }}
            >
              {isSelected && (
                selectionType === 'checkbox' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color, #4ade80)'}} />
                )
              )}
            </div>
          )}
        </div>
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
  heroTitle?: string;
  heroText: string;
  hero?: {
    headline?: string;
    subheadline?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
  };
  config?: {
    currency?: string;
    locale?: string;
    priceSuffix?: string;
  };
  campaignDeepDive?: {
    title: string;
    subtitle: string;
    influencerSection: {
      image: string;
      description: string;
    };
    timelines: { 
      title: string; 
      steps: { step: string; description: string }[] 
    }[];
    budgetTable: {
      concept: string;
      responsibility: string;
      cost: string;
    }[];
    impactProjection: string;
  };
  features?: {
    showEcosystem?: boolean;
    showAudiences?: boolean;
    showPricing?: boolean;
    exclusivePackages?: boolean;
  };
  storytelling?: {
    narrative?: { title: string; content: string }[];
    challenge?: string;
    countdownDate?: string;
    countdownLabel?: string;
    pillars: { title: string; description: string; image?: string }[];
  };
  packages: {
    fn1: Service[];
    apolograma: Service[];
    blocks?: { name: string; services: Service[] }[];
  };
  discountPercent: number;
  hideTotal?: boolean;
  footerVideo?: string;
  theme?: {
    mode?: 'dark' | 'light';
    primary?: string;
    fontHeading?: string;
    fontBody?: string;
    textColor?: string;
    textGradient?: string;
    clientLogoRaw?: boolean;
    bgColor?: string;
  };
}

export default function MediaKitView({ data }: { data: ClientData }) {
  const [activeService, setActiveService] = useState<string | null>(null);
  
  const isExclusive = data.features?.exclusivePackages === true;
  const [selectedApoIdx, setSelectedApoIdx] = useState<number>(0);
  
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    if (data.packages.fn1) data.packages.fn1.forEach(s => initialState[s.name] = true);
    if (data.packages.blocks) data.packages.blocks.forEach(b => b.services.forEach(s => initialState[s.name] = true));
    if (!isExclusive && data.packages.apolograma) data.packages.apolograma.forEach(s => initialState[s.name] = true);
    return initialState;
  });

  const toggleServiceSelection = (name: string) => {
    setSelectedServices(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const fn1Total = data.packages.fn1 ? data.packages.fn1.reduce((acc, curr) => acc + (selectedServices[curr.name] ? curr.price : 0), 0) : 0;
  
  const apoTotal = isExclusive 
    ? (data.packages.apolograma && data.packages.apolograma.length > 0 ? data.packages.apolograma[selectedApoIdx].price : 0)
    : (data.packages.apolograma ? data.packages.apolograma.reduce((acc, curr) => acc + (selectedServices[curr.name] ? curr.price : 0), 0) : 0);
    
  const blocksTotal = data.packages.blocks ? data.packages.blocks.reduce((acc, block) => acc + block.services.reduce((sum, s) => sum + (selectedServices[s.name] ? s.price : 0), 0), 0) : 0;
  
  const subtotal = fn1Total + apoTotal + blocksTotal;
  const discountPercent = data.discountPercent || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const currency = data.config?.currency || "MXN";
  const locale = data.config?.locale || "es-MX";

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(num);
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const isLight = data.theme?.mode === 'light';

  const customTheme = data.theme ? {
    '--font-heading': data.theme.fontHeading || 'Space Grotesk, sans-serif',
    '--font-body': data.theme.fontBody || 'Inter, sans-serif',
    '--primary-gradient': `linear-gradient(135deg, ${data.theme.primary || '#a855f7'} 0%, ${isLight ? '#990000' : '#000'} 100%)`,
    '--text-gradient': data.theme.textGradient || 'linear-gradient(to right, #fff, #888)',
    ...(isLight ? {
      '--bg-color': '#ffffff',
      '--text-color': data.theme.textColor || '#111111',
      '--muted-text': '#555555',
      '--card-bg': 'rgba(0, 0, 0, 0.03)',
      '--glass-border': 'rgba(0, 0, 0, 0.08)',
      '--header-bg': 'rgba(255, 255, 255, 0.8)',
    } : {
      '--text-color': data.theme.textColor || '#ffffff',
      ...(data.theme.bgColor ? {
        '--bg-color': data.theme.bgColor,
        '--muted-text': '#d4d4d4',
        '--card-bg': 'rgba(255, 255, 255, 0.05)',
        '--glass-border': 'rgba(255, 255, 255, 0.1)',
        '--header-bg': `${data.theme.bgColor}cc`,
      } : {})
    })
  } as unknown as React.CSSProperties : {};

  return (
    <>
      <CursorSpotlight isLight={isLight} />
      
      <main className={styles.main} style={customTheme}>
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
          <img src="/assets/apolograma-logo.png" alt="Apolograma" className={isLight ? styles.apologramaLogoImageLight : styles.apologramaLogoImage} />
          <img src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} alt="Frontera Número Uno" className={styles.agencyLogoImage} />
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        {data.hero?.backgroundVideo ? (
          <>
            <video 
              src={data.hero.backgroundVideo} 
              autoPlay loop muted playsInline preload="auto"
              poster={data.hero.backgroundImage || undefined}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: isLight ? 'rgba(249, 246, 240, 0.40)' : 'rgba(5, 5, 5, 0.70)',
              zIndex: 1,
            }} />
          </>
        ) : data.hero?.backgroundImage ? (
          <>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `url(${data.hero.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }} />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: isLight ? 'rgba(249, 246, 240, 0.60)' : 'rgba(5, 5, 5, 0.85)',
              backdropFilter: 'blur(2px)',
              zIndex: 1,
            }} />
          </>
        ) : null}
        {!isLight && !data.hero?.backgroundImage && !data.hero?.backgroundVideo && (
          <>
            <div className={styles.heroBg} />
            <motion.div 
              className={styles.floating3D} 
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <motion.div 
          className={styles.logoContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {data.clientLogo && (
            <img 
              src={data.clientLogo} 
              alt={data.clientName} 
              className={data.theme?.clientLogoRaw ? styles.logoLight : (isLight ? styles.logoLight : styles.logo)} 
            />
          )}
        </motion.div>
        
        <motion.h1 
          className={`${styles.heroTitle} text-gradient`}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {data.hero?.headline || data.heroTitle || `Propuesta Estratégica para ${data.clientName}`}
        </motion.h1>
        
        <motion.p 
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {data.hero?.subheadline || data.heroText}
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

      {/* Storytelling: The Narrative & Challenge */}
      {data.storytelling && (
        <section className={styles.storySection}>
          {data.storytelling.narrative ? (
            <div style={{ marginBottom: '4rem', textAlign: 'left', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
              {data.storytelling.narrative.map((block, idx) => (
                <motion.div 
                  key={idx} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  variants={fadeUp}
                  style={{ marginBottom: '2.5rem' }}
                >
                  <h3 style={{ fontSize: '1.5rem', color: isLight ? '#222' : '#fff', marginBottom: '1rem', fontWeight: 700 }}>
                    {block.title}
                  </h3>
                  <p 
                    style={{ fontSize: '1.1rem', color: isLight ? '#555' : '#aaa', lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </motion.div>
              ))}
            </div>
          ) : data.storytelling.challenge && (
            <motion.h2 
              className={`${styles.storyChallenge} text-gradient`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              &quot;{data.storytelling.challenge}&quot;
            </motion.h2>
          )}

          {/* Countdown Banner */}
          {data.storytelling.countdownDate && (
            <CountdownBanner 
              targetDate={data.storytelling.countdownDate} 
              label={data.storytelling.countdownLabel || 'Para el evento'}
              isLight={isLight}
              primaryColor={data.theme?.primary || '#a855f7'}
            />
          )}

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
                  pillar.image.endsWith('.mp4') || pillar.image.endsWith('.webm') ? (
                    <video 
                      src={pillar.image} 
                      className={styles.pillarImage} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                    />
                  ) : (
                    <img src={pillar.image} alt={pillar.title} className={styles.pillarImage} />
                  )
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

      {/* El Ecosistema - Presentación Base */}
      {data.features?.showEcosystem !== false && (
        <section className={styles.section}>
          <motion.h2 
            className={styles.sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          ¿Quién está detrás de esta propuesta?
        </motion.h2>
        <motion.p 
          className={styles.sectionSubtitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Dos empresas. Un solo objetivo: que tu marca sea imposible de ignorar.
        </motion.p>
        
        <div className={styles.statsGrid}>
          <TiltCard className={`${styles.ecosystemCard} glass`}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2.5rem 2.5rem 0 2.5rem', flex: 1 }}>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                  <img 
                    src="/assets/apolograma-logo.png" 
                    alt="Apolograma" 
                    style={{ 
                      width: '150px', 
                      height: 'auto',
                      objectFit: 'contain',
                      filter: isLight ? 'grayscale(100%) brightness(0)' : 'none', 
                      mixBlendMode: isLight ? 'multiply' : 'normal' 
                    }} 
                  />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: isLight ? '#222' : '#eee', marginBottom: '0.5rem', lineHeight: 1.4 }}>Tu departamento de marketing externo.</p>
                <p style={{ fontSize: '0.9rem', color: isLight ? '#666' : '#999', marginBottom: '2rem' }}>Diseño gráfico, fotografía, estrategia y administración de redes sociales. Todo lo que necesitas, sin contratar un equipo interno.</p>
              </div>
              <div style={{ width: '100%', marginTop: 'auto' }}>
                <ApologramaShowcase isLight={isLight} />
              </div>
            </motion.div>
          </TiltCard>
          <TiltCard className={`${styles.ecosystemCard} glass`}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2.5rem 2.5rem 0 2.5rem', flex: 1, position: 'relative', zIndex: 10 }}>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                  <img 
                    src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} 
                    alt="Frontera Número Uno" 
                    style={{ width: '170px', height: 'auto', objectFit: 'contain' }} 
                  />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: isLight ? '#222' : '#eee', marginBottom: '0.5rem', lineHeight: 1.4 }}>La audiencia más grande de la frontera. Ya es tuya.</p>
                <p style={{ fontSize: '0.9rem', color: isLight ? '#666' : '#999', marginBottom: '1.5rem' }}>460,000 seguidores y 77 millones de visualizaciones listos para conocer tu marca.</p>
                
                {/* Odometer numbers moved here for Edge-to-Edge bleed */}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isLight ? '#8a2be2' : '#a855f7', lineHeight: 1 }}>77.1M</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.6, marginTop: '0.2rem' }}>Visualizaciones</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isLight ? '#8a2be2' : '#a855f7', lineHeight: 1 }}>460K</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.6, marginTop: '0.2rem' }}>Seguidores Totales</div>
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', marginTop: 'auto' }}>
                <ViralChart isLight={isLight} />
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </section>
      )}

      {/* Nuestras Audiencias (Restaurado con nuevos demográficos) */}
      {data.features?.showAudiences !== false && (
        <section className={styles.section}>
        <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Tu audiencia potencial
        </motion.h2>
        <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Estas son las personas que verán tu contenido desde el primer día.
        </motion.p>
        
        <div className={styles.statsGrid}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ height: '100%' }}>
            <PremiumAudienceCard
              platform="facebook"
              title="The Millennials"
              followers={391}
              ageRange="25-44 años"
              agePercent={70}
              juarezPercent={72}
              elPasoPercent={18}
              isLight={isLight}
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} style={{ height: '100%' }}>
            <PremiumAudienceCard
              platform="instagram"
              title="The Centennials"
              followers={69}
              ageRange="18-34 años"
              agePercent={65}
              juarezPercent={63}
              elPasoPercent={32}
              isLight={isLight}
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Campaign Deep Dive (e.g. Phase 1 Expansion) */}
      {data.campaignDeepDive && (
        <section className={styles.section} style={{ marginTop: '2rem' }}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.campaignDeepDive.title}
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.campaignDeepDive.subtitle}
          </motion.p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '3rem' }}>
            {/* Influencer Roster */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Roster de Influencers</h3>
              <img src={data.campaignDeepDive.influencerSection.image} alt="Influencers" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>{data.campaignDeepDive.influencerSection.description}</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Timelines (Multi-Video Support) */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {data.campaignDeepDive.timelines.map((tl, tlIdx) => (
                  <div key={tlIdx} className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>{tl.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {tl.steps.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.8rem' }}>{idx + 1}</div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-color)', marginBottom: '0.25rem' }}>{item.step}</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>{item.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* ROI & Budget */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Responsabilidad Presupuestal</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.campaignDeepDive.budgetTable.map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx === data.campaignDeepDive!.budgetTable.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--text-color)', fontSize: '0.95rem' }}>{row.concept}</strong>
                          <span style={{ color: 'var(--muted-text)', fontSize: '0.8rem' }}>{row.responsibility}</span>
                        </div>
                        <div style={{ fontWeight: row.cost.includes('Incluido') ? 700 : 400, color: row.cost.includes('Incluido') ? '#4ade80' : 'var(--muted-text)', fontSize: '0.9rem' }}>
                          {row.cost}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📈</span> Proyección de ROAS
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: 1.6, opacity: 0.9 }}>
                    {data.campaignDeepDive.impactProjection}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* FN1 Services */}
      {data.features?.showPricing !== false && data.packages.fn1.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Difusión y Alcance Masivo
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Tu marca en el medio digital más influyente de Juárez y El Paso.
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
                isSelectable={true}
                isSelected={selectedServices[service.name]}
                onSelect={() => toggleServiceSelection(service.name)}
                selectionType="checkbox"
                priceSuffix={data.config?.priceSuffix}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Apolograma Services (Legacy Flat List) */}
      {data.features?.showPricing !== false && data.packages.apolograma.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Producción de Contenido y Redes Sociales
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Contenido profesional diseñado para convertir seguidores en clientes.
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
                isSelectable={isExclusive}
                isSelected={selectedApoIdx === idx}
                onSelect={() => setSelectedApoIdx(idx)}
                priceSuffix={data.config?.priceSuffix}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Blocks Structure */}
      {data.features?.showPricing !== false && data.packages.blocks && data.packages.blocks.map((block, blockIdx) => (
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
                isSelectable={true}
                isSelected={selectedServices[service.name]}
                onSelect={() => toggleServiceSelection(service.name)}
                selectionType="checkbox"
                priceSuffix={data.config?.priceSuffix}
              />
            ))}
          </motion.div>
        </section>
      ))}

      {/* Footer Video */}
      {data.footerVideo && (
        <section className={styles.section} style={{ paddingBottom: 0 }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}
          >
            <h2 className={styles.sectionTitle} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              Nuestra Calidad Cinematográfica
            </h2>
            <video 
              src={data.footerVideo} 
              controls
              playsInline
              style={{
                width: '100%',
                maxWidth: '350px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '1px solid var(--glass-border)'
              }}
            />
          </motion.div>
        </section>
      )}

      {/* Summary */}
      {data.features?.showPricing !== false && (
      <section className={styles.summarySection}>
        <motion.div 
          className={`${styles.summaryCard} glass`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>
            {data.packages.blocks && data.packages.blocks.length > 0 ? "Ejecución Modular" : "Tu inversión, desglosada."}
          </h2>
          <p className={styles.sectionSubtitle} style={{marginBottom: "1rem"}}>
            {isExclusive ? "Total basado en la opción seleccionada:" : (data.packages.blocks && data.packages.blocks.length > 0 ? "Inversión Total del Proyecto" : "Esto es exactamente lo que recibirás cada mes:")}
          </p>

          {data.packages.blocks && data.packages.blocks.length > 0 && (
            <div style={{
              background: "rgba(168, 85, 247, 0.1)", 
              border: "1px solid rgba(168, 85, 247, 0.3)", 
              borderRadius: "8px", 
              padding: "1rem", 
              marginBottom: "2rem",
              color: "var(--text-color)",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              textAlign: "left"
            }}>
              <strong>Metodología Flexible:</strong> Podemos ejecutar el ecosistema completo de forma simultánea, o bien, realizar un despliegue por bloques individuales <strong>(lapsos de 30 días naturales por bloque)</strong> para escalar la inversión a tu ritmo.
            </div>
          )}
          
          {!data.hideTotal && (
            <>
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
                    <span style={{ color: "#a855f7" }}>Contenido y Redes ({Math.round((apoTotal/subtotal)*100)}%)</span>
                    <span style={{ color: "#3b82f6" }}>Difusión y Alcance ({Math.round((fn1Total/subtotal)*100)}%)</span>
                  </div>
                </>
              )}

              <div className={`${styles.totalPrice} text-gradient`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AnimatedPrice value={total} locale={locale} currency={currency} />
                {data.config?.priceSuffix && (
                  <span style={{ fontSize: '1rem', color: 'var(--muted-text)', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {data.config.priceSuffix}
                  </span>
                )}
              </div>
            </>
          )}
          
          <motion.a 
            href={`https://wa.me/526561031571?text=${encodeURIComponent(`Hola Emmanuel, revisé la propuesta de ${data.clientName} y estoy listo para avanzar.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Aprobar Propuesta →
          </motion.a>
        </motion.div>
      </section>
      )}

      {/* Sticky CTA */}
      <motion.a 
        href={`https://wa.me/526561031571?text=${encodeURIComponent(`Hola Emmanuel, revisé la propuesta de ${data.clientName} y estoy listo para avanzar.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.stickyCta}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 100 }}
      >
        Iniciar Proyecto →
      </motion.a>

      <footer className={styles.footer}>
        <motion.div 
          className={styles.footerDecoration}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img src="/assets/puerta-juarez.png" alt="Puerta Juárez" className={isLight ? styles.footerDecorationImageLight : styles.footerDecorationImage} />
        </motion.div>
        
        <div className={styles.footerContent}>
          <div className={styles.footerAgencyLogos}>
            <img src="/assets/apolograma-logo.png" alt="Apolograma" className={isLight ? styles.footerApologramaLogoLight : styles.footerApologramaLogo} />
            <img src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} alt="Frontera Número Uno" className={styles.agencyLogoImage} />
          </div>
          <p>© {new Date().getFullYear()} Frontera Número Uno & Apolograma.</p>
          <p>Propuesta confidencial preparada exclusivamente para {data.clientName}. Vigencia: 30 días naturales.</p>
        </div>
      </footer>
    </main>
    </>
  );
}
