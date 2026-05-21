import SuperetteClient from "./SuperetteClient";

export const metadata = {
  title: "Propuesta Estratégica | Superette",
  description: "Ingeniería Gráfica y Comunicación Masiva",
  openGraph: {
    title: "Propuesta Estratégica | Superette",
    description: "Ingeniería Gráfica y Comunicación Masiva",
    images: ["/assets/superette/og-image.png"],
  }
};

export default function SuperettePage() {
  return <SuperetteClient />;
}
