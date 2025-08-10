import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure compiler options
  compiler: {
    // Enable styled-components support
    styledComponents: true,
  },
  // Skip lint checks during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
