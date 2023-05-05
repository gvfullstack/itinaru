const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
  }
};

module.exports = nextConfig;