/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['assets.coingecko.com', 's2.coinmarketcap.com'],
  },
};

module.exports = nextConfig;
