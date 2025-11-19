import type { NextConfig } from 'next';

const serverActionsAllowedOrigins = (() => {
  const raw =
    process.env.SERVER_ACTIONS_ALLOWED_ORIGINS ??
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    '';

  if (!raw) {
    return undefined;
  }

  const entries = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(value).host || value;
      } catch {
        return value.replace(/^https?:\/\//, '');
      }
    })
    .filter(Boolean);

  return entries.length ? entries : undefined;
})();

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  // Compiler optimizations for faster builds and better runtime performance
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Image optimization with modern formats
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'videodelivery.net',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflarestream.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Experimental features for Next.js 15+ and React 19
  experimental: {
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
    serverActions: {
      bodySizeLimit: '100mb',
      ...(serverActionsAllowedOrigins
        ? { allowedOrigins: serverActionsAllowedOrigins }
        : {}),
    },
    optimizePackageImports: [
      '@mui/material',
      '@mui/system',
      '@mui/icons-material',
      '@mui/x-data-grid',
      '@mui/x-date-pickers',
      '@mui/x-charts',
      '@mui/x-tree-view',
      '@tiptap/react',
      '@tiptap/core',
      'framer-motion',
      'react-pdf',
    ],

    optimizeCss: true,

    ppr: false,
    optimizeServerReact: true,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
