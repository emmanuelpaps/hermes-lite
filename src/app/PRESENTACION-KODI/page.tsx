import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KODI DOSE+ · Presentación Ejecutiva Maestra | Apolograma",
  description: "Suite Ejecutiva de 3 Fases: Due Diligence Competitivo, Blindaje Legal COFEPRIS, Prototipo Web y Plan de Sprints.",
};

export default function Page() {
  return (
    <iframe
      src="/PRESENTACION-KODI.html"
      className="w-full h-screen border-0"
      title="KODI DOSE Presentación Maestra"
    />
  );
}
