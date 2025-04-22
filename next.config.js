/** @type {import('next').NextConfig} */

const dotenv = require("dotenv");

dotenv.config();

const nextConfig = {
  /* distDir: "build", // Specify your desired output directory here */
  /*   output: "standalone", */
  /* output: "export", */
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

/* module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Replace 'crypto' with 'crypto-browserify' and 'stream' with 'stream-browserify' using the fallback property
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    };

    return config;
  },
};
 */
