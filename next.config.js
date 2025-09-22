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
  
  // Internationalization (keeping for potential future use)
 // i18n: {
  //  locales: ['sq', 'en'],
  //  defaultLocale: 'sq',
  //},
  
  // Performance optimizations
  swcMinify: true,
  
  // FIXED: Updated experimental features for Next.js 14.2.0
  experimental: {
    // REMOVED: appDir is now default in Next.js 14+
    // REMOVED: serverActions is now enabled by default
    // Server components external packages
    serverComponentsExternalPackages: ['nodemailer', 'googleapis'],
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // FIXED: Webpack configuration with cache improvements
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle node modules that might not be compatible with edge runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // FIXED: Improved webpack cache configuration for both dev and production
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        // Exclude problematic packages from managed paths
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!(googleapis|nodemailer|@types[\\/]node))/],
      };
    } else {
      // Production: Use memory cache to avoid filesystem issues
      config.cache = {
        type: 'memory',
      };
    }
    
    // Add DefinePlugin for both dev and production
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_RUNTIME': JSON.stringify('nodejs'),
      })
    );
    
    return config;
  },
  
  // Headers for security and CORS
  async headers() {
    return [
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
  
  // Redirects (if needed)
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },
  
  // Rewrites for API or other routes
  async rewrites() {
    return [
      // Example rewrite
      // {
      //   source: '/api-proxy/:path*',
      //   destination: 'https://external-api.com/:path*',
      // },
    ];
  },
  
  // Output configuration
  output: 'standalone', // For Docker deployments
  
  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig