import type { Metadata, Viewport } from 'next';
import { Cinzel } from 'next/font/google';
import CceAcreditacionPrensaClient from './CceAcreditacionPrensaClient';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cinzel',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#042e23',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://hermes-lite.vercel.app'),
  title: 'Acreditación de Prensa · Galardones Empresariales 2026 | CCE Ciudad Juárez',
  description:
    'Registro de prensa para la cobertura de la Entrega de Galardones Empresariales 2026 y la Conferencia Magistral de Carlos Loret de Mola. Jueves 19 de noviembre, 9:00 a.m., Centro de Eventos Cibeles.',
  alternates: {
    canonical: 'https://hermes-lite.vercel.app/acreditacion-prensa',
  },
  openGraph: {
    title: 'Acreditación de Prensa · Galardones Empresariales 2026',
    description:
      'Consejo Coordinador Empresarial de Ciudad Juárez · Jueves 19 de noviembre, 9:00 a.m. · Centro de Eventos Cibeles.',
    url: 'https://hermes-lite.vercel.app/acreditacion-prensa',
    siteName: 'Consejo Coordinador Empresarial de Ciudad Juárez',
    images: [
      {
        url: '/assets/cce-juarez/og_cce_logo_only.png?v=20261112',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Acreditación de Prensa · Galardones Empresariales 2026 · CCE Ciudad Juárez',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acreditación de Prensa · Galardones Empresariales 2026',
    description:
      'Consejo Coordinador Empresarial de Ciudad Juárez · Jueves 19 de noviembre, 9:00 a.m. · Centro de Eventos Cibeles.',
    images: ['/assets/cce-juarez/og_cce_logo_only.png?v=20261112'],
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

export default function AcreditacionPrensaPage() {
  return (
    <div className={cinzel.variable}>
      <CceAcreditacionPrensaClient />
    </div>
  );
}
