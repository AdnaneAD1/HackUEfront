/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove experimental features that are causing issues
  experimental: {
    swcMinify: true
  }
};

module.exports = nextConfig;