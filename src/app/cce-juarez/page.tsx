import type { Metadata } from 'next';
import CceJuarezClient from './CceJuarezClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: 'Propuesta Ejecutiva · CCE Ciudad Juárez × Apolograma',
  description:
    'Estrategia Digital, Contenido en Facebook (Reels & Carruseles), Pauta Meta Ads e Invitación Web para la Entrega de Galardones 2026 del CCE con Carlos Loret de Mola.',
  alternates: {
    canonical: 'https://propuestas.tecza.com.mx/cce-juarez',
  },
  openGraph: {
    title: 'Propuesta Ejecutiva · CCE Ciudad Juárez × Apolograma',
    description:
      'Estrategia Digital, Contenido en Facebook (Reels & Carruseles), Pauta Meta Ads e Invitación Web para la Entrega de Galardones 2026 del CCE con Carlos Loret de Mola.',
    url: 'https://propuestas.tecza.com.mx/cce-juarez',
    siteName: 'Apolograma · Propuestas TECZA',
    images: [
      {
        url: '/assets/cce-juarez/og_cce_juarez.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Propuesta Ejecutiva Entrega de Galardones 2026 - CCE Ciudad Juárez y Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propuesta Ejecutiva · Entrega de Galardones 2026 | CCE Ciudad Juárez × Apolograma',
    description:
      'Estrategia de Convocatoria Digital, Patrocinios Confidenciales y Coordinación Logística para la Entrega de Galardones 2026 del CCE con Carlos Loret de Mola en Centro de Eventos Cibeles.',
    images: ['/assets/cce-juarez/og_cce_juarez.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CceJuarezPage() {
  return <CceJuarezClient />;
}
