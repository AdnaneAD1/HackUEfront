/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['fonts.googleapis.com', 'fonts.gstatic.com']
  },
  // Remove experimental features that are causing issues
  experimental: {
    swcMinify: true
  }
};

module.exports = nextConfig;