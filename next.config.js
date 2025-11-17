/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel deployment
  swcMinify: true,
  
  // Ensure all pages are properly handled
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  
  // Proper headers for SPA routing
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
