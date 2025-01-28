/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // غیرفعال کردن تنظیمات Babel اضافی
    experimental: {
      forceSwcTransforms: true // اجبار به استفاده از SWC به جای Babel
    }
  };
  
  export default nextConfig;