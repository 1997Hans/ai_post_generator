/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to the client and server
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Image domain configuration for Netlify
  images: {
    domains: ['ai-social-post-generator.netlify.app'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental server actions (required for Next.js 15)
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", 
        "localhost:3001", 
        "hanstech-post-generator.netlify.app",
        "ai-social-post-generator.netlify.app",
        ".netlify.app"
      ],
    },
  },
}

module.exports = nextConfig 