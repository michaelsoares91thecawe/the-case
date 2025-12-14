import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.vivino.com',
      },
    ],
  },
  serverExternalPackages: ['tesseract.js', 'bcryptjs'],
};

export default nextConfig;
