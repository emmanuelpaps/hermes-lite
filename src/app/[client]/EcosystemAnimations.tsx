"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, useInView, Variants } from 'framer-motion';

// --- Animated Counter ---
interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  formatter: (v: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ from = 0, to, duration = 2.5, formatter }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(from, { 
    duration: duration * 1000, 
    bounce: 0 
  });
  
  useEffect(() => {
    if (isInView) {
      spring.set(to);
    }
  }, [isInView, spring, to]);

  const display = useTransform(spring, (current) => formatter(current));

  return <motion.span ref={ref}>{display}</motion.span>;
};


// --- Viral Chart ---
export const ViralChart = ({ isLight }: { isLight: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const chartColor = isLight ? '#8a2be2' : '#a855f7'; // Purple brand

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0, filter: 'drop-shadow(0px 0px 0px transparent)' },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      filter: `drop-shadow(0px 4px 6px ${chartColor}60)`,
      transition: { duration: 2, ease: "easeInOut", delay: 0.5 } 
    },
    hover: {
      filter: `drop-shadow(0px 0px 12px ${chartColor})`,
      strokeWidth: 4,
      transition: { duration: 0.3 }
    }
  };

  const areaVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.25, transition: { duration: 1, delay: 1.5 } },
    hover: { opacity: 0.4, transition: { duration: 0.3 } }
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} whileHover="hover" style={{ width: '100%', height: '220px', position: 'relative' }}>
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}>
        {/* Area under the curve full bleed */}
        <motion.path
          d="M0 110 L40 110 L60 70 L80 80 L100 65 L120 70 L140 90 L160 75 L200 85 L240 100 L260 20 L280 60 L320 70 L350 65 L400 40 L400 120 L0 120 Z"
          fill={`url(#viralGradient)`}
          variants={areaVariants}
        />
        {/* Animated Line */}
        <motion.path
          d="M0 110 L40 110 L60 70 L80 80 L100 65 L120 70 L140 90 L160 75 L200 85 L240 100 L260 20 L280 60 L320 70 L350 65 L400 40"
          fill="transparent"
          stroke={chartColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        <defs>
          <linearGradient id="viralGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity="1" />
            <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};


// --- Apolograma Showcase ---
export const ApologramaShowcase = ({ isLight }: { isLight: boolean }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  
  const videos = [
    { title: "Apps & Plataformas", src: "/assets/apolograma/apps.mp4" },
    { title: "Identidad de Marca", src: "/assets/apolograma/branding.mp4" },
    { title: "Desarrollo y Código", src: "/assets/apolograma/code.mp4" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [videos.length]);

  const tags = ["App Dev", "UI/UX", "Arquitectura"];

  return (
    <motion.div 
      initial="hidden" 
      whileHover="hover" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '220px', 
        backgroundColor: '#050505',
        overflow: 'hidden'
      }}
    >
      <motion.div variants={{ hover: { scale: 1.05, transition: { duration: 1.5, ease: "easeOut" } } }} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        {videos.map((vid, idx) => (
          <motion.video
            key={idx}
            src={vid.src}
            autoPlay
            loop
            muted
            playsInline
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeVideo === idx ? 0.6 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </motion.div>
      
      {/* Progress bars */}
      <div style={{ position: 'absolute', top: '20px', left: '25px', right: '25px', display: 'flex', gap: '6px', zIndex: 10 }}>
        {videos.map((_, idx) => (
          <div key={idx} style={{ height: '3px', flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
             {activeVideo === idx && (
               <motion.div 
                 style={{ height: '100%', backgroundColor: 'white' }}
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 4, ease: "linear" }}
               />
             )}
          </div>
        ))}
      </div>

      {/* Floating frosted tags */}
      <div style={{ position: 'absolute', bottom: '50px', left: '25px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', zIndex: 10 }}>
        {tags.map((tag, idx) => (
          <div key={idx} style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>
            {tag}
          </div>
        ))}
      </div>

      {/* Label */}
      <div style={{ position: 'absolute', bottom: '20px', left: '25px', color: 'white', fontWeight: 800, fontSize: '1.1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)', zIndex: 10 }}>
        {videos[activeVideo].title}
      </div>
    </motion.div>
  );
};

// --- Premium Audience Cards ---
const FbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IgIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export const PremiumAudienceCard = ({ 
  platform, title, followers, ageRange, agePercent, juarezPercent, elPasoPercent, isLight 
}: { 
  platform: 'facebook' | 'instagram', title: string, followers: number, ageRange: string, agePercent: number, juarezPercent: number, elPasoPercent: number, isLight: boolean 
}) => {
  const isFb = platform === 'facebook';
  const accentColor = isFb ? '#1877F2' : '#E1306C';
  const gradientBg = isFb 
    ? 'linear-gradient(135deg, rgba(24,119,242,0.15) 0%, rgba(0,0,0,0) 100%)' 
    : 'linear-gradient(135deg, rgba(225,48,108,0.15) 0%, rgba(131,58,180,0.1) 100%)';

  return (
    <div style={{
      background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(20,20,20,0.4)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '2.5rem',
      border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
      boxShadow: `inset 0 0 20px ${isLight ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}, 0 10px 30px rgba(0,0,0,0.05)`,
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'left',
      height: '100%'
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: gradientBg, opacity: 1, zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{title}</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: accentColor }}>
              {isFb ? 'Facebook' : 'Instagram'}
            </span>
          </div>
          <div style={{ color: accentColor }}>
            {isFb ? <FbIcon /> : <IgIcon />}
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px', color: isLight ? '#111' : '#fff' }}>
            <AnimatedCounter from={0} to={followers} duration={2} formatter={(v) => Math.floor(v) + 'K'} />
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem', fontWeight: 500 }}>Seguidores Activos</div>
        </div>

        {/* Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Age Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ opacity: 0.8 }}>Edad ({ageRange})</span>
              <span style={{ fontWeight: 700 }}>{agePercent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${agePercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                style={{ height: '100%', background: accentColor, borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Geo Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ opacity: 0.8 }}>Cd. Juárez vs El Paso</span>
              <span style={{ fontWeight: 700 }}>{juarezPercent}% / {elPasoPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${juarezPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                style={{ height: '100%', background: accentColor }}
              />
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${elPasoPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                style={{ height: '100%', background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
