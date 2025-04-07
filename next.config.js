/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output static export for Netlify
  output: 'export',
  // Make environment variables available to the client and server
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Image configuration for static export
  images: {
    unoptimized: true,
  },
  // Disable server actions in static export
  experimental: {},
}

module.exports = nextConfig 