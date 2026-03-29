import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@clerk/nextjs', '@clerk/backend', '@clerk/react', '@clerk/shared'],
};

export default nextConfig;
