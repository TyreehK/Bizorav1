/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  // Als je later images van externe domeinen gebruikt, voeg je die hier toe.
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
