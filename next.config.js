const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },
  env: {
    FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  },
};

module.exports = nextConfig;