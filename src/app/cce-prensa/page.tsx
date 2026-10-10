import type { Metadata } from 'next';
import CcePrensaClient from './CcePrensaClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: 'Acreditación de Prensa · Rueda de Prensa CCE Juárez | Empresario del Año 2026',
  description:
    'Acreditación oficial para medios de comunicación y reporteros al desayuno y rueda de prensa del Consejo Coordinador Empresarial (CCE) de Ciudad Juárez. Lunes 12 de Octubre de 2026, 9:00 a.m. en Taquería La No 4.',
  alternates: {
    canonical: 'https://propuestas.tecza.com.mx/cce-prensa',
  },
  openGraph: {
    title: 'Acreditación de Prensa · Rueda de Prensa CCE Juárez | Empresario del Año 2026',
    description:
      'Acreditación oficial para medios y reporteros al desayuno y rueda de prensa del CCE Ciudad Juárez. Lunes 12 de Octubre de 2026, 9:00 a.m. en Taquería La No 4.',
    url: 'https://propuestas.tecza.com.mx/cce-prensa',
    siteName: 'Apolograma · Propuestas TECZA',
    images: [
      {
        url: '/assets/cce-juarez/og_cce_juarez.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Acreditación de Prensa Rueda de Prensa CCE Ciudad Juárez - Empresario del Año 2026',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acreditación de Prensa · Rueda de Prensa CCE Juárez | Empresario del Año 2026',
    description:
      'Acreditación oficial para medios de comunicación al desayuno y rueda de prensa del CCE Ciudad Juárez. Lunes 12 de Octubre de 2026, 9:00 a.m. en Taquería La No 4.',
    images: ['/assets/cce-juarez/og_cce_juarez.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/assets/cce-juarez/logo_cce.png',
    apple: '/assets/cce-juarez/logo_cce.png',
  },
};

export default function CcePrensaPage() {
  return <CcePrensaClient />;
}
