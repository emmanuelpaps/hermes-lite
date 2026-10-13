import type { Metadata, Viewport } from 'next';
import CceGalardonClient from './CceGalardonClient';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#042e23',
};

export const metadata: Metadata = {
  title: 'Galardones 2026 · CCE Ciudad Juárez | Boletos Oficiales',
  description:
    'Adquiere tus boletos oficiales para la magna entrega de galardones del Consejo Coordinador Empresarial de Ciudad Juárez y la Conferencia Magistral de Carlos Loret de Mola en Centro de Eventos Cibeles.',
  keywords: [
    'CCE Ciudad Juárez',
    'Galardones 2026',
    'Empresario del Año 2026',
    'Carlos Loret de Mola',
    'Centro de Eventos Cibeles',
    'Consejo Coordinador Empresarial',
    'Boletos CCE',
    'Ciudad Juárez',
  ],
  metadataBase: new URL('https://hermes-lite.vercel.app'),
  alternates: {
    canonical: 'https://hermes-lite.vercel.app/cce-galardon-EG',
  },
  openGraph: {
    title: 'Galardones 2026 · CCE Ciudad Juárez',
    description:
      'Conferencia Magistral Carlos Loret de Mola y Entrega de Galardones. Jueves 19 de Noviembre, 9:00 a.m. en Centro de Eventos Cibeles. Boletos a la venta.',
    url: 'https://hermes-lite.vercel.app/cce-galardon-EG',
    siteName: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: [
      {
        url: 'https://hermes-lite.vercel.app/assets/cce-juarez/og_galardon_cce_oficial.jpg',
        width: 1024,
        height: 1024,
        alt: 'Entrega de Galardones 2026 · Conferencia Magistral Carlos Loret de Mola · CCE Ciudad Juárez',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galardones 2026 · CCE Ciudad Juárez',
    description:
      'Conferencia Magistral Carlos Loret de Mola en Centro de Eventos Cibeles. Boletos a la venta.',
    images: ['https://hermes-lite.vercel.app/assets/cce-juarez/og_galardon_cce_oficial.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CceGalardonPage() {
  return <CceGalardonClient />;
}
