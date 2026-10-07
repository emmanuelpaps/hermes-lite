import type { Metadata } from 'next';
import NuevaLagunaClient from './NuevaLagunaClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: '📋 Ecosistema de Comedor & Lealtad: Tortería La Nueva Laguna | Apolograma',
  description: 'Menú Digital QR, Minijuego Interactivo de WhatsApp, Circuito de Videos para Pantallas de Comedor y Sistema Integrado de Lealtad para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
  openGraph: {
    title: '📋 Ecosistema de Comedor & Lealtad: Tortería La Nueva Laguna | Apolograma',
    description: 'Menú Digital QR, Minijuego Interactivo de WhatsApp, Circuito de Videos para Pantallas de Comedor y Sistema Integrado de Lealtad para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    url: 'https://propuestas.tecza.com.mx/nueva-laguna',
    siteName: 'Apolograma Software & Design Studio',
    images: [
      {
        url: 'https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Propuesta Ecosistema de Comedor Tortería La Nueva Laguna - Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Ecosistema de Comedor & Lealtad: Tortería La Nueva Laguna | Apolograma',
    description: 'Menú Digital QR, Minijuego Interactivo de WhatsApp, Circuito de Videos para Pantallas de Comedor y Sistema Integrado de Lealtad para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    images: ['https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg'],
  },
  robots: { index: false, follow: false },
};

export default function NuevaLagunaPage() {
  return <NuevaLagunaClient />;
}
