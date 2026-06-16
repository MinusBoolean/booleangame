import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;
