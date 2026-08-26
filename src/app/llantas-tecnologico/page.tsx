import type { Metadata } from 'next';
import LlantasTecnologicoClient from './LlantasTecnologicoClient';

export const metadata: Metadata = {
  title: 'Llantas y Servicios Tecnológico | Propuesta Comercial Apolograma & Frontera',
  description: 'Propuesta de Servicios de Marketing Estratégico, IA, Pauta Publicitaria y Software para Llantas y Servicios Tecnológico.',
  robots: { index: false, follow: false },
};

export default function LlantasTecnologicoPage() {
  return <LlantasTecnologicoClient />;
}
