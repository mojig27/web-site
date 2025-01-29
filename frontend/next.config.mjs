/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true
  },
  images: {
    domains: ['images.unsplash.com'] // اگر از تصاویر خارجی استفاده می‌کنید
  }
};

export default nextConfig;