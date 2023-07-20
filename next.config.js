/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://hodl.ar",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/lnurlp/:path*",
        destination: "/api/hodlar/lnurlp?username=:path*",
      },
      {
        source: "/.well-known/nostr.json",
        destination: "/api/hodlar/nostr",
      },
    ];
  },
};

module.exports = nextConfig;
