/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Disable static generation for all pages — required because this app
  // uses localStorage & client-side auth that cannot be prerendered server-side.
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent @react-pdf/renderer (browser-only library) from being
      // bundled server-side — it uses canvas & PDF.js which don't exist in Node.
      const externals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : [];
      config.externals = [...externals, '@react-pdf/renderer'];
    }
    // Alias 'canvas' to false so webpack gracefully ignores it
    // when resolving @react-pdf/renderer's optional native dependencies.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;