/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'duovel-backend.onrender.com'],
  },
};

export default nextConfig;
