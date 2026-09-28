import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all HTTPS images for development convenience
    // In production, restrict to specific trusted domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
