import type { Metadata } from 'next';
import NuevaLagunaClient from './NuevaLagunaClient';

export const metadata: Metadata = {
  title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
  description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital (Menú Interactivo Vertical + Minijuego QR de Captación de WhatsApp) para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
  openGraph: {
    title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
    description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital (Menú Interactivo Vertical + Minijuego QR de Captación de WhatsApp) para Tortería La Nueva Laguna.',
    url: 'https://propuestas.tecza.com.mx/nueva-laguna',
    siteName: 'Apolograma Software & Design Studio',
    images: [
      {
        url: '/assets/nueva-laguna/hero-torta-lagunera.jpg',
        width: 1920,
        height: 1080,
        alt: 'Propuesta Integral Tortería La Nueva Laguna - Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
    description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital para Tortería La Nueva Laguna.',
    images: ['/assets/nueva-laguna/hero-torta-lagunera.jpg'],
  },
  robots: { index: false, follow: false },
};

export default function NuevaLagunaPage() {
  return <NuevaLagunaClient />;
}
