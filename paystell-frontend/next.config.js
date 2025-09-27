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
};

module.exports = nextConfig;
