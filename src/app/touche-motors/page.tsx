import { Metadata } from 'next';
import ToucheMotorsClient from './ToucheMotorsClient';

export const metadata: Metadata = {
  title: '📋 Propuesta Comercial: Touché Motors | Apolograma',
  description: 'Estrategia de Contenido con IA, Pauta Digital y Automatización BDC para Touché Motors (Jeep, RAM, Dodge, Fiat, Peugeot, Seminuevos y Mopar) en Ciudad Juárez.',
  openGraph: {
    title: '📋 Propuesta Comercial: Touché Motors | Apolograma',
    description: 'Estrategia de Contenido con IA, Pauta Digital y Automatización BDC para Touché Motors (Jeep, RAM, Dodge, Fiat, Peugeot, Seminuevos y Mopar) en Ciudad Juárez.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_backdrop.jpg'],
    url: 'https://propuestas.tecza.com.mx/touche-motors',
    type: 'website',
    siteName: 'Apolograma Interactive Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Propuesta Comercial: Touché Motors | Apolograma',
    description: 'Estrategia de Contenido con IA, Pauta Digital y Automatización BDC para Touché Motors en Ciudad Juárez.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_backdrop.jpg'],
  },
};

export default function ToucheMotorsPage() {
  return <ToucheMotorsClient />;
}
