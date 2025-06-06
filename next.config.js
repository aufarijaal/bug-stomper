const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // add supabase storage hostname
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'emugflbrlhkzfjhsvksw.supabase.co',
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
