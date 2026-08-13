import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://propuestas.tecza.com.mx'),
  title: "Media Kit | Frontera Número Uno",
  description: "Propuesta de Ecosistema Digital por Frontera Número Uno y Apolograma",
  icons: {
    icon: "/icon.png"
  },
  openGraph: {
    title: "Media Kit | Frontera Número Uno",
    description: "Propuesta de Ecosistema Digital",
    images: ["/assets/fn1-logo-stacked.png"],
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
