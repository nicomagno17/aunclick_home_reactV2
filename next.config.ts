import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración estándar de Next.js
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;