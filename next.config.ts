import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: 'export' y unoptimized: true para aprovechar todo el poder de Vercel
  experimental: {
    optimizeCss: true
  },
  async redirects() {
    return [
      {
        source: '/la-nueva-laguna',
        destination: '/nueva-laguna',
        permanent: true,
      },
      {
        source: '/la-nueva-laguna/',
        destination: '/nueva-laguna',
        permanent: true,
      },
      {
        source: '/hoteles-aniversario-2026',
        destination: '/hoteles-aniversario-2026/index.html',
        permanent: false,
      },
      {
        source: '/hoteles-aniversario-2026/',
        destination: '/hoteles-aniversario-2026/index.html',
        permanent: false,
      },
      {
        source: '/ai-grupo-constructor',
        destination: '/ai-grupo-constructor/index.html',
        permanent: false,
      },
      {
        source: '/ai-grupo-constructor/',
        destination: '/ai-grupo-constructor/index.html',
        permanent: false,
      },
      {
        source: '/constructores',
        destination: '/constructores/index.html',
        permanent: false,
      },
      {
        source: '/constructores/',
        destination: '/constructores/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
