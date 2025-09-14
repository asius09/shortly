/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://shortly-5zij.onrender.com/api/:path*", // Proxy to Express backend
      },
    ];
  },
};
