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
  poweredByHeader: false,
  compress: true,
  
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  
  // بهینه‌سازی فونت
  optimizeFonts: true,
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'date-fns'],
};

async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        },
        // ... سایر هدرهای امنیتی
      ],
    },
  ]
}

module.exports = nextConfig;