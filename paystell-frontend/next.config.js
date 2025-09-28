/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['assets.coingecko.com', 's2.coinmarketcap.com'],
  },
  webpack: (config, { isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new withBundleAnalyzer({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
        })
      );
    }

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          stellar: {
            test: /[\\/]node_modules[\\/](@stellar|stellar-sdk)[\\/]/,
            name: 'stellar',
            chunks: 'all',
            priority: 20,
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Performance budget enforcement
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Bundle size limits
  webpack: (config, { isServer, dev }) => {
    // Existing webpack config...
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new withBundleAnalyzer({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
        })
      );
    }

    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244000, // 244KB per chunk
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 200000, // 200KB for vendor chunks
          },
          stellar: {
            test: /[\\/]node_modules[\\/](@stellar|stellar-sdk)[\\/]/,
            name: 'stellar',
            chunks: 'all',
            priority: 20,
            maxSize: 300000, // 300KB for Stellar SDK
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
            maxSize: 150000, // 150KB for charts
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 10,
            maxSize: 100000, // 100KB for UI libraries
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
