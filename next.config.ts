import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack
  experimental: {
    turbopack: false,
  },
  images: {
    unoptimized: true, // Disable image optimization to speed up builds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  // Increase the timeout for static generation
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
