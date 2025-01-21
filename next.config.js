module.exports = {
    reactStrictMode: true,
    images: {
      domains: ['your-image-domain.com'], // دامنه‌هایی که تصاویر از آن‌ها بارگذاری می‌شوند
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
  };