import type { Metadata } from 'next';
import NuevaLagunaClient from '../nueva-laguna/NuevaLagunaClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
  description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital (Menú Interactivo Vertical + Minijuego QR de Captación de WhatsApp) para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
  openGraph: {
    title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
    description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital (Menú Interactivo Vertical + Minijuego QR de Captación de WhatsApp) para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    url: 'https://propuestas.tecza.com.mx/la-nueva-laguna',
    siteName: 'Apolograma Software & Design Studio',
    images: [
      {
        url: 'https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Propuesta Integral Tortería La Nueva Laguna - Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Propuesta Integral: Tortería La Nueva Laguna | Apolograma',
    description: 'Estrategia de Redes Sociales, Pauta Hiperlocal y Ecosistema Digital para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    images: ['https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg'],
  },
  robots: { index: false, follow: false },
};

export default function LaNuevaLagunaPage() {
  return <NuevaLagunaClient />;
}
