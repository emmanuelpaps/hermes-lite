import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KODI DOSE+ · Wireframes & Arquitectura Web Interactiva | Apolograma",
  description: "Prototipo de Navegación, Quiz Circadiano con IA y Flujo de Suscripción de kodidose.com.",
};

export default function Page() {
  return (
    <iframe
      src="/WIREFRAMES-KODI.html"
      className="w-full h-screen border-0"
      title="KODI DOSE Wireframes"
    />
  );
}
