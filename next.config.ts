import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  },
};

export default nextConfig;
