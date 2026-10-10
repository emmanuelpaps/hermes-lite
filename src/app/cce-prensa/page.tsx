import type { Metadata } from 'next';
import CcePrensaClient from './CcePrensaClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://hermes-lite.vercel.app'),
  title: 'Invitación a Rueda de Prensa | CCE Ciudad Juárez',
  description:
    'Invitación a rueda de prensa · Consejo Coordinador Empresarial de Ciudad Juárez.',
  alternates: {
    canonical: 'https://hermes-lite.vercel.app/cce-prensa',
  },
  openGraph: {
    title: 'Invitación a Rueda de Prensa',
    description: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    url: 'https://hermes-lite.vercel.app/cce-prensa',
    siteName: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: [
      {
        url: '/assets/cce-juarez/og_cce_prensa.png?v=20261012',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Invitación a Rueda de Prensa · Consejo Coordinador Empresarial de Ciudad Juárez',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitación a Rueda de Prensa',
    description: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: ['/assets/cce-juarez/og_cce_prensa.png?v=20261012'],
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
