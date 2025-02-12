// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/image-to-pdf',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/image-to-pdf/',
}

module.exports = nextConfig