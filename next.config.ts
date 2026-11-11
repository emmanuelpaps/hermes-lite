import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: 'export' y unoptimized: true para aprovechar todo el poder de Vercel
  serverExternalPackages: ['tesseract.js', 'sharp', 'unpdf'],
  outputFileTracingIncludes: {
    '/api/cce-galardon-registro': [
      './node_modules/tesseract.js/**/*',
      './node_modules/tesseract.js-core/**/*',
      './node_modules/bmp-js/**/*',
      './node_modules/idb-keyval/**/*',
      './node_modules/is-url/**/*',
      './node_modules/regenerator-runtime/**/*',
      './node_modules/wasm-feature-detect/**/*',
      './node_modules/zlibjs/**/*',
    ],
  },
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
  async rewrites() {
    return [
      {
        source: '/superette-google-ads',
        destination: '/superette-google-ads/index.html',
      },
      {
        source: '/superette-google-ads/',
        destination: '/superette-google-ads/index.html',
      },
    ];
  },
};

export default nextConfig;
