import { Metadata } from "next";
import HospitalAngelesClient from "./HospitalAngelesClient";

export const metadata: Metadata = {
  title: "Apolograma Studio & Frontera — Credenciales de Agencia & Media Kit | Hospital Ángeles",
  description: "Propuesta de Ecosistema Digital Integral, Producción Cinematográfica y Campañas Transfronterizas para Hospital Ángeles Juárez.",
  icons: { icon: "https://apolograma.com/wp-content/uploads/2021/06/cropped-favicon-192x192.png" },
  openGraph: {
    title: "Apolograma Studio & Frontera — Media Kit Hospital Ángeles Juárez",
    description: "Propuesta de Ecosistema Digital Integral, Producción Cinematográfica y Campañas Transfronterizas.",
    url: "https://propuestas.tecza.com.mx/hospital-angeles",
    images: [{ url: "https://propuestas.tecza.com.mx/assets/hospital-angeles/hero_cinema_hospital.jpg", width: 1200, height: 630, alt: "Hospital Ángeles Juárez" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apolograma Studio & Frontera — Media Kit Hospital Ángeles Juárez",
    description: "Propuesta de Ecosistema Digital Integral, Producción Cinematográfica y Campañas Transfronterizas.",
    images: ["https://propuestas.tecza.com.mx/assets/hospital-angeles/hero_cinema_hospital.jpg"],
  }
};

export default function Page() {
  return <HospitalAngelesClient />;
}
