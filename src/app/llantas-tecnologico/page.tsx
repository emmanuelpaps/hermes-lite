import type { Metadata } from 'next';
import LlantasTecnologicoClient from './LlantasTecnologicoClient';

export const metadata: Metadata = {
  title: '📋 Propuesta Comercial: Llantas y Servicios Tecnológico | Apolograma & FN1',
  description: 'Estrategia de Marketing, Inteligencia Artificial y Alianza de Medios con Frontera Número Uno para Llantas Tecnológico en Ciudad Juárez. Cotizador interactivo, paquetes de producción y tarifario oficial 2026.',
  openGraph: {
    title: '📋 Propuesta Comercial: Llantas y Servicios Tecnológico | Apolograma & FN1',
    description: 'Estrategia de Marketing, Inteligencia Artificial y Alianza de Medios con Frontera Número Uno para Llantas Tecnológico en Ciudad Juárez. Cotizador interactivo, paquetes de producción y tarifario oficial 2026.',
    url: 'https://propuestas.tecza.com.mx/llantas-tecnologico',
    siteName: 'Apolograma Interactive Studio | Frontera Número Uno',
    images: [
      {
        url: '/assets/llantas-tecnologico/hero_backdrop.jpg',
        width: 1920,
        height: 1080,
        alt: 'Propuesta Comercial Llantas y Servicios Tecnológico - Apolograma & Frontera Número Uno',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '📋 Propuesta Comercial: Llantas y Servicios Tecnológico | Apolograma & FN1',
    description: 'Estrategia de Marketing, Inteligencia Artificial y Alianza de Medios con Frontera Número Uno para Llantas Tecnológico en Ciudad Juárez.',
    images: ['/assets/llantas-tecnologico/hero_backdrop.jpg'],
  },
  robots: { index: false, follow: false },
};

export default function LlantasTecnologicoPage() {
  return <LlantasTecnologicoClient />;
}
