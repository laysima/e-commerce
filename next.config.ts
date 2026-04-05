import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allows product images stored in Supabase storage
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Allows placeholder images from Unsplash during development
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)', // Apply to every route
        headers: [
          {
            // Forces HTTPS for 2 years — prevents downgrade attacks
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Prevents your site being loaded inside an iframe
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Stops browsers guessing file types — prevents MIME attacks
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Controls how much referrer info is shared when navigating
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            // Speeds up resource loading with DNS prefetching
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

export default nextConfig