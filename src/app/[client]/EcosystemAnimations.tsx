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
  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 2, ease: "easeInOut", delay: 0.5 } 
    }
  };

  const chartColor = isLight ? '#8a2be2' : '#a855f7'; // Purple brand

  return (
    <div style={{ width: '100%', height: '140px', marginTop: '2.5rem', position: 'relative' }}>
      <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Grid lines */}
        <line x1="0" y1="25" x2="400" y2="25" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
        <line x1="0" y1="50" x2="400" y2="50" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
        <line x1="0" y1="75" x2="400" y2="75" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
        
        {/* Animated Line - recreating the massive viral spike from the screenshot */}
        <motion.path
          d="M0 90 L40 90 L60 50 L80 60 L100 45 L120 50 L140 70 L160 55 L200 65 L240 80 L260 0 L280 40 L320 50 L350 45 L400 20"
          fill="transparent"
          stroke={chartColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ filter: `drop-shadow(0px 4px 6px ${chartColor}60)` }}
        />
        
        {/* Area under the curve */}
        <motion.path
          d="M0 90 L40 90 L60 50 L80 60 L100 45 L120 50 L140 70 L160 55 L200 65 L240 80 L260 0 L280 40 L320 50 L350 45 L400 20 L400 100 L0 100 Z"
          fill={`url(#viralGradient)`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 1.5 }}
        />
        <defs>
          <linearGradient id="viralGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity="1" />
            <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Metrics overlays */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2 }}
        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', textAlign: 'left' }}
      >
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: chartColor, lineHeight: 1 }}>
            <AnimatedCounter from={0} to={77.1} formatter={(v) => v.toFixed(1) + 'M'} />
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visualizaciones</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: chartColor, lineHeight: 1 }}>
            <AnimatedCounter from={0} to={460} formatter={(v) => Math.floor(v) + 'K'} />
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seguidores Totales</div>
        </div>
      </motion.div>
    </div>
  );
};


// --- Apolograma Showcase ---
export const ApologramaShowcase = ({ isLight }: { isLight: boolean }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  
  // Elegant placeholders that demonstrate capability
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

  const tags = ["App Dev", "Videojuegos", "E-Commerce", "UI/UX", "Arquitectura"];

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* Video Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '160px', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        backgroundColor: '#050505', 
        marginBottom: '1rem', 
        border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` 
      }}>
        {videos.map((vid, idx) => (
          <motion.video
            key={idx}
            src={vid.src}
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeVideo === idx ? 0.6 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        {/* Label */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: 'white', fontWeight: 700, fontSize: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          {videos[activeVideo].title}
        </div>
        
        {/* Progress bars */}
        <div style={{ position: 'absolute', top: '12px', left: '15px', right: '15px', display: 'flex', gap: '6px' }}>
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
      </div>

      {/* Floating Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-start' }}>
        {tags.map((tag, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 0 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: idx * 0.3, ease: "easeInOut" }}
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '20px', 
              background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`,
              color: isLight ? '#555' : '#aaa',
              fontWeight: 500
            }}
          >
            {tag}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
