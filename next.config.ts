import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
