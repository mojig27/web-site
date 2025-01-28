// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1'],
    formats: ['image/avif', 'image/webp']
  },
  i18n: {
    locales: ['fa'],
    defaultLocale: 'fa',
    localeDetection: false
  },
  experimental: {
    serverActions: true,
    typedRoutes: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

module.exports = nextConfig;