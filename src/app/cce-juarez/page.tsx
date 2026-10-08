import type { Metadata } from 'next';
import CceJuarezClient from './CceJuarezClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: 'Propuesta Ejecutiva · Empresario del Año 2026 | CCE Ciudad Juárez × Apolograma',
  description:
    'Estrategia integral: Invitación Digital Web, Canal Automatizado de WhatsApp para Patrocinios, Pauta Meta Ads y Coordinación de 50-60 Mesas con Carlos Loret de Mola.',
  alternates: {
    canonical: 'https://propuestas.tecza.com.mx/cce-juarez',
  },
  openGraph: {
    title: 'Propuesta Ejecutiva · Empresario del Año 2026 | CCE Ciudad Juárez × Apolograma',
    description:
      'Estrategia integral: Invitación Digital Web, Canal Automatizado de WhatsApp para Patrocinios, Pauta Meta Ads y Coordinación de 50-60 Mesas con Carlos Loret de Mola.',
    url: 'https://propuestas.tecza.com.mx/cce-juarez',
    siteName: 'Apolograma · Propuestas TECZA',
    images: [
      {
        url: '/assets/cce-juarez/og_cce_juarez.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Propuesta Ejecutiva Empresario del Año 2026 - CCE Ciudad Juárez y Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Propuesta Ejecutiva · Empresario del Año 2026 | CCE Ciudad Juárez × Apolograma',
    description:
      'Estrategia integral: Invitación Digital Web, Canal Automatizado de WhatsApp para Patrocinios, Pauta Meta Ads y Coordinación de 50-60 Mesas con Carlos Loret de Mola.',
    images: ['/assets/cce-juarez/og_cce_juarez.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CceJuarezPage() {
  return <CceJuarezClient />;
}
