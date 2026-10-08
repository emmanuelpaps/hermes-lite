import type { Metadata } from 'next';
import NuevaLagunaClient from '../nueva-laguna/NuevaLagunaClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: '📋 Experiencia Integral & Ecosistema de Comedor: Tortería La Nueva Laguna | Apolograma',
  description: 'Experiencia de Comedor 360°, Menú Digital QR, Playlist Curada, Videos en Pantallas 16:9, Minijuego WhatsApp, Pasaporte de Lealtad y Checklist Operativo para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
  openGraph: {
    title: '📋 Experiencia Integral & Ecosistema de Comedor: Tortería La Nueva Laguna | Apolograma',
    description: 'Experiencia de Comedor 360°, Menú Digital QR, Playlist Curada, Videos en Pantallas 16:9, Minijuego WhatsApp, Pasaporte de Lealtad y Checklist Operativo para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    url: 'https://propuestas.tecza.com.mx/la-nueva-laguna',
    siteName: 'Apolograma Software & Design Studio',
    images: [
      {
        url: 'https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Propuesta Experiencia Integral Tortería La Nueva Laguna - Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Experiencia Integral & Ecosistema de Comedor: Tortería La Nueva Laguna | Apolograma',
    description: 'Experiencia de Comedor 360°, Menú Digital QR, Playlist Curada, Videos en Pantallas 16:9, Minijuego WhatsApp, Pasaporte de Lealtad y Checklist Operativo para Tortería La Nueva Laguna. Desarrollado por Apolograma.',
    images: ['https://propuestas.tecza.com.mx/assets/nueva-laguna/og_nueva_laguna.jpg'],
  },
  robots: { index: false, follow: false },
};

export default function LaNuevaLagunaPage() {
  return <NuevaLagunaClient />;
}
