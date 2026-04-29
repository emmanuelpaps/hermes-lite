import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://fronteranumero1.tecza.com.mx'),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
