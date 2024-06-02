/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spoonacular.com"
      },
      {
        "protocol": "https",
        "hostname": "img.spoonacular.com",
      }
    ],
  }
}

module.exports = nextConfig
