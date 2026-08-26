import type { Metadata } from 'next';
import LlantasTecnologicoClient from './LlantasTecnologicoClient';

export const metadata: Metadata = {
  title: 'Llantas y Servicios Tecnológico | Alianza Estratégica Apolograma & Frontera',
  description: 'Carta de Presentación & Credenciales de Agencia preparadas exclusivamente para la Dirección General de Llantas y Servicios Tecnológico.',
  robots: { index: false, follow: false },
};

export default function LlantasTecnologicoPage() {
  return <LlantasTecnologicoClient />;
}
