import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable to successfully build even if there are type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
