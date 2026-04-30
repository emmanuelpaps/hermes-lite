"use client";

import { motion } from "framer-motion";

export const Preloader = ({ isLight }: { isLight: boolean }) => {
  const chartColor = isLight ? '#8a2be2' : '#a855f7'; // Purple brand
  const bgColor = isLight ? '#f9fafb' : '#0a0a0a';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: bgColor,
        zIndex: 9999, // Cubre toda la aplicación
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem'
      }}
    >
      {/* SVG Laser Drawing: Representa la Tríada Operativa (Pirámide/Conexión) */}
      <svg width="150" height="150" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {/* Línea externa (Argos) */}
        <motion.path
          d="M100,20 L180,160 L20,160 Z"
          fill="none"
          stroke={chartColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0px 0px 8px ${chartColor})` }}
        />
        {/* Línea interna (Hermes) */}
        <motion.path
          d="M100,50 L140,140 L60,140 Z"
          fill="none"
          stroke={chartColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0px 0px 8px ${chartColor})` }}
        />
        {/* Punto central (Pitágoras) */}
        <motion.circle
          cx="100"
          cy="120"
          r="4"
          fill={chartColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={{ filter: `drop-shadow(0px 0px 12px ${chartColor})` }}
        />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          display: 'flex',
          gap: '1rem',
          color: chartColor,
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600
        }}
      >
        <span>Frontera Número Uno</span>
        <span style={{ opacity: 0.5 }}>×</span>
        <span>Apolograma</span>
      </motion.div>
    </motion.div>
  );
};
