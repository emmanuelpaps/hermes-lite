import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KODI DOSE+ · Wireframes & Prototipo Interactivo | Apolograma",
  description: "Prototipo de Navegación, Quiz Circadiano con IA y Flujo de Suscripción de kodidose.com.",
};

export default function Page() {
  return (
    <iframe
      src="/WIREFRAMES-KODI.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        border: "none",
        margin: 0,
        padding: 0,
        zIndex: 999999,
      }}
      title="KODI DOSE Wireframes"
    />
  );
}
