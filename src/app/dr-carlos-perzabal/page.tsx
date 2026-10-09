import type { Metadata } from 'next';
import DrCarlosPerzabalClient from './DrCarlosPerzabalClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: 'Dr. Carlos Tadeo Perzabal Avilez | Cirugía General, Bariátrica y Robótica · Apolograma',
  description:
    'Ecosistema Digital Quirúrgico de Alta Autoridad para el Dr. Carlos Tadeo Perzabal Avilez: Portal Clínico Binacional (Juárez · El Paso, TX), Triaje Inteligente en WhatsApp y Campañas Educativas de Cirugía Metabólica y Robótica Da Vinci.',
  alternates: {
    canonical: 'https://propuestas.tecza.com.mx/dr-carlos-perzabal',
  },
  openGraph: {
    title: 'Dr. Carlos Tadeo Perzabal Avilez | Cirugía General, Bariátrica y Robótica · Apolograma',
    description:
      'Ecosistema Digital Quirúrgico de Alta Autoridad: Portal Clínico Binacional, Asistente de Triaje Médico en WhatsApp 24/7 y Estrategia de Pauta Educativa para Cirugía Metabólica y Robótica.',
    url: 'https://propuestas.tecza.com.mx/dr-carlos-perzabal',
    siteName: 'Apolograma · Propuestas TECZA',
    images: [
      {
        url: '/assets/dr-carlos-perzabal/og_dr_carlos_perzabal.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Dr. Carlos Tadeo Perzabal Avilez - Cirugía General, Bariátrica y Robótica | Apolograma',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Carlos Tadeo Perzabal Avilez | Cirugía General, Bariátrica y Robótica · Apolograma',
    description:
      'Ecosistema Digital Quirúrgico de Alta Autoridad: Portal Clínico Binacional, Asistente de Triaje Médico en WhatsApp 24/7 y Estrategia de Pauta Educativa.',
    images: ['/assets/dr-carlos-perzabal/og_dr_carlos_perzabal.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DrCarlosPerzabalPage() {
  return <DrCarlosPerzabalClient />;
}
