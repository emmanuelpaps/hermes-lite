import { Metadata } from 'next';
import ToucheMotorsClient from './ToucheMotorsClient';

export const metadata: Metadata = {
  title: '✦ Touché Motors × Apolograma | VIP Paddock Club 2026',
  description: 'Curaduría Audiovisual Flagship, Producción Bimestral In-Situ y Pauta Meta Ads para Touché Motors (RAM TRX, Jeep Grand Cherokee, Dodge SRT) en Paseo Triunfo 6080.',
  openGraph: {
    title: '✦ Touché Motors × Apolograma | VIP Paddock Club 2026',
    description: 'Producción de Alto Impacto para el Élite Automotriz en Paseo Triunfo 6080. Curaduría audiovisual y pauta directa en Ciudad Juárez y El Paso.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_ram_trx.jpg'],
    url: 'https://propuestas.tecza.com.mx/touche-motors',
    type: 'website',
    siteName: 'Apolograma Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: '✦ Touché Motors × Apolograma | VIP Paddock Club 2026',
    description: 'Curaduría Audiovisual Flagship y Pauta Meta Ads para Touché Motors en Paseo Triunfo 6080.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_ram_trx.jpg'],
  },
};

export default function ToucheMotorsPage() {
  return <ToucheMotorsClient />;
}
