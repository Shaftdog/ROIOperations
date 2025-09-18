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
};

export default nextConfig;
