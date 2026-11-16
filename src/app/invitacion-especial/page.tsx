import type { Metadata, Viewport } from 'next';
import InvitacionEspecialClient from './InvitacionEspecialClient';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#042e23',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://hermes-lite.vercel.app'),
  title: 'Invitación Especial · Galardones Empresariales 2026 | CCE Ciudad Juárez',
  description:
    'Invitación de honor a la Entrega de Galardones Empresariales 2026 y Conferencia Magistral de Carlos Loret de Mola. Jueves 19 de noviembre, 8:30 a.m., Centro de Eventos Cibeles.',
  alternates: {
    canonical: 'https://hermes-lite.vercel.app/invitacion-especial',
  },
  openGraph: {
    title: 'Invitación Especial · Galardones Empresariales 2026',
    description:
      'Jueves 19 de noviembre · Registro 8:30 a.m. · Centro de Eventos Cibeles · Conferencia Magistral de Carlos Loret de Mola.',
    url: 'https://hermes-lite.vercel.app/invitacion-especial',
    siteName: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: [
      {
        url: 'https://hermes-lite.vercel.app/assets/cce-juarez/og_invitacion_especial_cce.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Invitación Especial · Galardones Empresariales 2026 · CCE Ciudad Juárez',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitación Especial · Galardones Empresariales 2026',
    description:
      'Jueves 19 de noviembre · Registro 8:30 a.m. · Centro de Eventos Cibeles · Conferencia Magistral de Carlos Loret de Mola.',
    images: ['https://hermes-lite.vercel.app/assets/cce-juarez/og_invitacion_especial_cce.jpg'],
  },
  icons: {
    icon: '/assets/cce-juarez/cce_icon_512.png',
    apple: '/assets/cce-juarez/cce_icon_512.png',
  },
};

export default function InvitacionEspecialPage() {
  return <InvitacionEspecialClient />;
}
