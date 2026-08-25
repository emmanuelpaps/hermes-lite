import { Metadata } from 'next';
import RadarKodiClient from './RadarKodiClient';

export const metadata: Metadata = {
  title: "KODI DOSE+ · Inteligencia de Mercado, Radar de Competencia & Hero SKUs | Apolograma",
  description: "Estudio Estratégico de Mercado ($920M USD), Posicionamiento contra B-Life, GNC y Farmacias, Deconstrucción Forense de Etiquetas y Selección Científica de Hero SKUs.",
  icons: {
    icon: "/icon-apolograma.png"
  },
  openGraph: {
    title: "KODI DOSE+ · Inteligencia de Mercado & Hero SKUs",
    description: "Estudio Estratégico de Mercado y Benchmark de Competidores.",
    images: [
      {
        url: "https://propuestas.tecza.com.mx/assets/og-apolograma.png",
        width: 1200,
        height: 630,
        alt: "KODI DOSE+ Inteligencia de Mercado",
      }
    ],
  }
};

export default function Page() {
  return <RadarKodiClient />;
}
