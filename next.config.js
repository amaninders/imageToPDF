const isLocal = process.env.NODE_ENV === 'development'; // Check if running locally

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: '/imagetopdf/', // Add this line
  basePath: isLocal ? '' : '/imagetopdf', // Set basePath only for local development
  trailingSlash: true, // Add this line
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Needed for pdf-lib WASM support
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

module.exports = nextConfig;
