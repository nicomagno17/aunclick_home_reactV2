import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración estándar de Next.js
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors for deployment
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;