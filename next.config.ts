import type { NextConfig } from 'next';

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
      allowedOrigins: ['localhost:3000'],
    },

    // Optimize package imports for better tree-shaking
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

    // Use SWC minifier for faster builds
    swcMinify: true,

    // Optimize CSS
    optimizeCss: true,

    // Enable partial prerendering for improved performance
    ppr: false, // Set to true when ready for PPR

    // Turbopack optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    // React 19 optimizations
    reactCompiler: false, // Enable when babel-plugin-react-compiler is configured

    // Optimize font loading
    optimizeServerReact: true,

    // Instrumentation for performance monitoring
    instrumentationHook: false,

    // Optimize memory usage during builds
    workerThreads: true,
    cpus: 4,
  },

  // Webpack optimizations for production builds
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // MUI vendor chunk
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // TipTap editor chunk
            editor: {
              name: 'editor',
              test: /[\\/]node_modules[\\/](@tiptap|prosemirror)[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            // PDF libraries chunk
            pdf: {
              name: 'pdf',
              test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            // Chart libraries
            charts: {
              name: 'charts',
              test: /[\\/]node_modules[\\/](@mui\/x-charts)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Common vendor libraries
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Common components
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }

    return config;
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
