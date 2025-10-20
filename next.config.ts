import type { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    domains: ['videodelivery.net'], // Allow Cloudflare Stream images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudflarestream.com',
      },
    ],
  },
  experimental: {
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
    serverActions: {
      bodySizeLimit: '100mb',
    },
    optimizePackageImports: [
      '@mui/material',
      '@mui/system',
      '@mui/icons-material',
      '@mui/x-data-grid',
      '@mui/x-date-pickers',
    ],
  },
} satisfies NextConfig;

export default nextConfig;
