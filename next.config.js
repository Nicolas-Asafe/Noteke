/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true // Importante para build estática
  },
  output: 'export',
};

module.exports = nextConfig; 