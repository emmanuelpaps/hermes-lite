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
    images: ["/assets/og-apolograma.png"],
  }
};

export default function Page() {
  return <MysiClient />;
}
