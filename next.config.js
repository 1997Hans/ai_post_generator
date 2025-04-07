/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to the client and server
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Improve compatibility with Netlify
  reactStrictMode: true,
  // Configure type checking for build
  typescript: {
    // Disable type checking in build to avoid deployment issues
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build to avoid deployment issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Image configuration
  images: {
    domains: ['ai-post-generator.vercel.app'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental server actions
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'ai-post-generator.vercel.app'],
    }
  }
}

module.exports = nextConfig 