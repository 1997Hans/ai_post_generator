/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to the client and server
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Enable experimental server actions (required for Next.js 15)
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", 
        "localhost:3001", 
        "hanstech-post-generator.netlify.app",
        ".netlify.app"
      ],
    },
  },
}

module.exports = nextConfig 