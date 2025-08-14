import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow common local network IPs and patterns
  allowedDevOrigins: ['*'],
  // basePath: '/frontend', // to use as localhost/frontend
  output: 'standalone',
  // Ensure proper SPA behavior in standalone mode
  trailingSlash: false,
};

export default nextConfig;
