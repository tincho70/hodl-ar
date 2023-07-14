/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://hodl.ar",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
