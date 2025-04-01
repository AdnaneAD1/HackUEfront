/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export since we need client-side features
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;