import { Metadata } from 'next';
import ToucheMotorsClient from './ToucheMotorsClient';

export const metadata: Metadata = {
  title: '✦ Touché Motors × Apolograma | Contenido Audiovisual de Alta Calidad',
  description: 'Producción Cinematográfica In-Situ y Pauta Meta Ads para Touché Motors (RAM TRX, Jeep Grand Cherokee, Dodge SRT) en Paseo Triunfo 6080.',
  openGraph: {
    title: '✦ Touché Motors × Apolograma | Contenido Audiovisual de Alta Calidad',
    description: 'Producción Cinematográfica In-Situ y Pauta Meta Ads para Touché Motors en Paseo Triunfo 6080.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_ram_trx.jpg'],
    url: 'https://propuestas.tecza.com.mx/touche-motors',
    type: 'website',
    siteName: 'Apolograma Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: '✦ Touché Motors × Apolograma | Contenido Audiovisual de Alta Calidad',
    description: 'Producción Cinematográfica In-Situ y Pauta Meta Ads para Touché Motors en Paseo Triunfo 6080.',
    images: ['https://propuestas.tecza.com.mx/assets/touche-motors/hero_ram_trx.jpg'],
  },
};

export default function ToucheMotorsPage() {
  return <ToucheMotorsClient />;
}
