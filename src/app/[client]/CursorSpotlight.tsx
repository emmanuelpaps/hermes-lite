"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export const CursorSpotlight = ({ isLight }: { isLight: boolean }) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Físicas de resorte para un seguimiento suave y táctil
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    // Solo en navegador
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Color de iluminación. Morado institucional, más intenso en oscuro, sutil en claro.
  const color = isLight ? 'rgba(138,43,226,0.04)' : 'rgba(168,85,247,0.06)';
  
  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, ${color}, transparent 80%)`;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0, // Fondo base, la luz permea hacia arriba.
        background,
      }}
    />
  );
};
