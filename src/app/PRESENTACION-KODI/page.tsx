import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KODI DOSE+ · Presentación Ejecutiva Maestra | Apolograma",
  description: "Suite Ejecutiva de 3 Fases: Due Diligence Competitivo, Blindaje Legal COFEPRIS, Prototipo Web y Plan de Sprints.",
};

export default function Page() {
  return (
    <iframe
      src="/PRESENTACION-KODI.html"
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
      title="KODI DOSE Presentación Maestra"
    />
  );
}
