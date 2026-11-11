import type { Metadata, Viewport } from 'next';
import ConfirmacionGalardonClient from './ConfirmacionGalardonClient';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#042e23',
};

export const metadata: Metadata = {
  title: 'Confirmación Prioritaria de Folio · Galardones 2026 CCE Ciudad Juárez',
  description:
    'Ventana especial de confirmación de registro y comprobante SPEI para asistentes de la Entrega de Galardones Empresariales 2026 · CCE Ciudad Juárez.',
  metadataBase: new URL('https://hermes-lite.vercel.app'),
  alternates: {
    canonical: 'https://hermes-lite.vercel.app/cce-galardon-EG/confirmacion',
  },
  openGraph: {
    title: 'Confirmación Prioritaria de Folio · Galardones 2026 CCE Juárez',
    description:
      'Completa la confirmación de tu comprobante SPEI y obtén tu folio oficial de acreditación. Vigencia exclusiva hasta el jueves 12 de noviembre a las 11:59 p.m.',
    url: 'https://hermes-lite.vercel.app/cce-galardon-EG/confirmacion',
    siteName: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: [
      {
        url: 'https://hermes-lite.vercel.app/assets/cce-juarez/og_galardon_cce_oficial.jpg',
        width: 1024,
        height: 1024,
        alt: 'Confirmación Prioritaria · Galardones 2026 CCE Ciudad Juárez',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmacionGalardonPage() {
  return <ConfirmacionGalardonClient />;
}
