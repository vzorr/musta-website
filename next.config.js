/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  
  // Performance optimizations
  swcMinify: true,
  
  experimental: {
    serverComponentsExternalPackages: ['nodemailer', 'googleapis'],
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!(googleapis|nodemailer|@types[\\/]node))/],
      };
    }
    
    if (dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_RUNTIME': JSON.stringify('nodejs'),
        })
      );
    }
    
    return config;
  },
  
  // Headers for security and CORS + reCAPTCHA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; " +
                   "script-src-elem 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; " +
                   "frame-src 'self' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; " +
                   "style-src 'self' 'unsafe-inline' https://www.gstatic.com; " +
                   "img-src 'self' data: blob: https: https://www.gstatic.com; " +
                   "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; " +
                   "font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },
  
  async rewrites() {
    return [];
  },
  
  output: 'standalone',
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig