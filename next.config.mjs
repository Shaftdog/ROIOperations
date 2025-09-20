/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
    turbo: {
      rules: {},
    },
  },
  // Essential for Replit environment
  output: 'standalone',
  trailingSlash: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  },
  // Allow all hosts for Replit environment
  webpack: (config, { isServer }) => {
    return config;
  },
  async rewrites() {
    return [];
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Allow requests from iframe/proxy environments  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  // Critical for Replit: bypass host check
  devIndicators: {
    buildActivity: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
