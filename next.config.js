/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  i18n: {
    locales: ['sq', 'en'],
    defaultLocale: 'sq',
  },
  // Optimize for production
  swcMinify: true,
  // Enable experimental features if needed
  experimental: {
    // optimizeCss: true,
  },
}

module.exports = nextConfig