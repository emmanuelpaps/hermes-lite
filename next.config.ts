import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: 'export' y unoptimized: true para aprovechar todo el poder de Vercel
  experimental: {
    optimizeCss: true
  },
  async rewrites() {
    return [
      {
        source: '/hoteles-aniversario-2026',
        destination: '/hoteles-aniversario-2026/index.html',
      },
      {
        source: '/hoteles-aniversario-2026/',
        destination: '/hoteles-aniversario-2026/index.html',
      },
      {
        source: '/ai-grupo-constructor',
        destination: '/ai-grupo-constructor/index.html',
      },
      {
        source: '/ai-grupo-constructor/',
        destination: '/ai-grupo-constructor/index.html',
      },
    ];
  },
};

export default nextConfig;
