import MysiClient from './MysiClient';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Media Kit | Apolograma Interactive Studio",
  description: "Propuesta de Ecosistema Virtual: MYSI Costa Rica",
  icons: {
    icon: "/icon-apolograma.png"
  },
  openGraph: {
    title: "MYSI Costa Rica | Apolograma Interactive Studio",
    description: "Desarrollo de entorno inmersivo y simulador VR.",
    images: [
      {
        url: "https://fronteranumero1.tecza.com.mx/assets/og-apolograma.png",
        width: 615,
        height: 445,
        alt: "Apolograma Interactive Studio",
      }
    ],
  }
};

export default function Page() {
  return <MysiClient />;
}
