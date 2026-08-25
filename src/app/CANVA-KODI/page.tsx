import { Metadata } from 'next';
import CanvasKodiClient from './CanvasKodiClient';

export const metadata: Metadata = {
  title: "KODI DOSE+ · Business Model Canvas Interactivo | Apolograma",
  description: "Arquitectura Estratégica de 9 Bloques, Unit Economics, Proyecciones Financieras e Investigación Operativa de Kodi Dose+.",
  icons: {
    icon: "/icon-apolograma.png"
  },
  openGraph: {
    title: "KODI DOSE+ · Business Model Canvas Interactivo",
    description: "Arquitectura Estratégica de 9 Bloques y Modelado Financiero.",
    images: [
      {
        url: "https://propuestas.tecza.com.mx/assets/og-apolograma.png",
        width: 1200,
        height: 630,
        alt: "KODI DOSE+ Business Model Canvas",
      }
    ],
  }
};

export default function Page() {
  return <CanvasKodiClient />;
}
