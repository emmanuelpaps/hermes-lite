import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: 'export' y unoptimized: true para aprovechar todo el poder de Vercel
  experimental: {
    optimizeCss: true
  }
};

export default nextConfig;
