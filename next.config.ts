import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable image optimization to speed up builds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.clerk.accounts.dev",
      },
    ],
  },
  // Increase the timeout for static generation
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
