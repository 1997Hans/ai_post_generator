# 🧠 AI-Powered Social Media Post Generator App

A modern, lightweight, and modular web app for generating compelling social media posts using AI. Users can input a prompt, and AI will generate a complete post with captions, visuals, and hashtags. Designed with a simple and clean UX using **Next.js 15**, **React 19**, **Tailwind CSS**, and **Vercel AI SDK**.

---

## 📌 Project Goals

- Creative use of AI for social media content generation
- Modular and scalable architecture
- Beautiful, responsive UI/UX
- Easy for Social Media Managers to review and approve content
- Built entirely in `Next.js 15` using the `App Router`

---

## 🚀 Tech Stack

| Layer        | Tech Used                                        |
|--------------|--------------------------------------------------|
| Frontend     | **Next.js 15** (App Router, React 19)            |
| UI/Styling   | **Tailwind CSS**, **Shadcn UI**, Headless UI     |
| AI Services  | **Vercel AI SDK** with **Google Gemini** or **OpenAI** |
| Image Gen    | **Hugging Face Inference API** (free tier available) |
| Auth (opt)   | **Clerk** or **Supabase Auth**                   |
| Storage      | **Supabase** (optional: Firebase)                |
| Hosting      | **Vercel** (fully optimized for this stack)      |

---

## 🧭 User Journey

1. **User lands** on the app and enters a basic prompt:
   > "Create a post for the Sinulog Festival"

2. **Extra options** are provided:
   - 🎭 Tone (Exciting, Professional, Friendly, etc.)
   - 🎨 Visual Preference (Realistic, AI Art, Minimalist)
   - 🖼️ Upload branding (logo, color preference, etc.)

3. Prompt is passed through an **AI refinement stage** (Vercel AI SDK):
   > "Create an engaging social media post for the 2025 Sinulog Festival..."

4. The app uses AI to generate:
   - 📝 Main social media **post content**
   - 🖼️ **Visual** (image or short video)
   - ✍️ **Captivating caption**
   - 🔖 Suggested **hashtags**

5. A **Social Media Manager** logs in to:
   - ✅ Approve
   - ❌ Reject with feedback
   - 🔄 Regenerate with new settings

6. Approved posts are saved for versioning and export.

---

## 🤖 AI Provider Options

This application supports two AI providers for text generation:

### 1. Google Gemini (Recommended)
- **Completely free** tier with generous usage limits
- 60 requests per minute limit on free tier
- No credit card required to get started
- Similar quality to OpenAI for text generation
- More cost-effective for production use

### 2. OpenAI
- Requires credit card for API access
- $5 free credits for new accounts (expires in 3 months)
- Pay-as-you-go pricing after free credits
- Potential for higher costs with increased usage

### 3. Hugging Face (Image Generation)
- Free tier available with rate limits
- No credit card required to get started
- Variety of models for different image styles
- Simple REST API for text-to-image generation

We recommend starting with Gemini for text and Hugging Face for images during development and testing due to their free tiers.

---

## 🔧 Installation Guide (for Cursor AI IDE or Terminal)

```bash
# 1. Initialize a new Next.js 15 project (React 19, App Router)
npx create-next-app@latest social-post-generator --experimental-app --typescript
cd social-post-generator

# 2. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Add Tailwind to config
# In tailwind.config.ts:
# content: ["./app/**/*.{js,ts,jsx,tsx}"]

# 4. Install Vercel AI SDK and AI providers
npm install ai @google/generative-ai --legacy-peer-deps
# OR for OpenAI
# npm install ai openai

# 5. Install Shadcn UI components
npx shadcn-ui@latest init

# 6. Install Hugging Face for image generation
npm install @huggingface/inference uuid

# 7. (Optional) Install Clerk for authentication
npm install @clerk/nextjs

# 8. Set up .env.local with your API keys
```

## 📁 Environment Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Choose either Gemini OR OpenAI for text generation

# Google Gemini API (recommended, free tier available)
GEMINI_API_KEY=your_gemini_api_key_here
# Get your key at: https://ai.google.dev/

# OR OpenAI API (requires payment after free credits)
# OPENAI_API_KEY=your_openai_api_key_here
# Get your key at: https://platform.openai.com/api-keys

# Hugging Face API (for image generation, free tier available)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
# Get your key at: https://huggingface.co/settings/tokens

# Clerk (if using auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase (if using for storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔑 Getting API Keys

### Google Gemini API Key (Recommended)
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to "Get API key" in the top navigation
4. Create a new API key (no credit card required)
5. Copy your API key and add it to your `.env.local` file

### Hugging Face API Key (Free)
1. Visit [Hugging Face](https://huggingface.co/) and create an account
2. Go to Settings > Access Tokens
3. Generate a new token with "Read" scope
4. Copy your token and add it to your `.env.local` file as HUGGINGFACE_API_KEY

### OpenAI API Key (Alternative)
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Add a payment method (required for API access)
4. Create a new API key
5. Copy your API key and add it to your `.env.local` file

---

## 🏗️ Project Structure

```
social-post-generator/
├── app/                      # Next.js App Router
│   ├── actions/              # Server Actions
│   │   ├── generatePost.ts   # OpenAI post generation
│   │   ├── generateGeminiPost.ts # Gemini post generation
│   │   ├── generateImage.ts  # Image generation with Hugging Face
│   │   └── refinePrompt.ts   # Prompt refinement
│   ├── api/                  # API Routes
│   │   ├── chat/             # Chat API endpoint
│   │   └── upload/           # Image upload endpoint
│   ├── (auth)/               # Auth-protected routes
│   │   └── dashboard/        # Admin dashboard
│   ├── page.tsx              # Home page
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
│   ├── PromptForm.tsx        # Input form for users
│   ├── TestGeminiGenerator.tsx # Gemini test component
│   ├── PostPreview.tsx       # Preview of generated post
│   ├── ToneSelector.tsx      # Tone selection component
│   ├── ImagePreview.tsx      # Image preview component
│   └── ImageUploader.tsx     # Component for uploading images
├── lib/                      # Utility functions
│   ├── openai.ts             # OpenAI configuration
│   ├── gemini.ts             # Gemini configuration
│   ├── huggingface.ts        # Hugging Face configuration
│   ├── types.ts              # TypeScript types
│   ├── prompts.ts            # AI prompt templates
│   ├── image-prompts.ts      # Image generation prompts
│   ├── image-upload.ts       # Image upload utilities
│   ├── error-handler.ts      # Error handling utilities
│   └── utils.ts              # Helper functions
├── ui/                       # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ... other UI components
├── public/                   # Static assets
│   └── uploads/              # Folder for uploaded images
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies
```

---

## 🌟 Features Breakdown

### 1. Post Generation Flow

The main user flow for generating AI posts:

1. **User Input** (`app/page.tsx` & `components/PromptForm.tsx`)
   - Basic prompt entry
   - Optional tone selection
   - Visual style preferences

2. **AI Processing** (`app/actions/generateGeminiPost.ts` or `generatePost.ts`)
   - Server action processes the user input
   - Uses Vercel AI SDK to refine and expand the prompt
   - Generates post content, caption, and hashtags

3. **Image Generation** (`app/actions/generateImage.ts`)
   - Uses Hugging Face API to create custom visuals
   - Options for different styles (realistic, artistic, etc.)
   - Also supports direct image uploads

4. **Preview & Edit** (`components/PostPreview.tsx`)
   - Users can view the generated content
   - Options to regenerate or tweak specific parts

### 2. Admin Dashboard (Optional)

For social media managers to review content:

- **Post Approval System**
- **Feedback Mechanism**
- **Content Library**
- **Export Options** (direct to social platforms)

---

## 🚀 Deployment

### Deploying to Vercel

The simplest way to deploy this app:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Alternatively, connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Ensure all environment variables from your `.env.local` file are added to your Vercel project settings.

---

## 🔍 Troubleshooting

Common issues and solutions:

### 1. API Key Issues

**Problem**: "API key not configured" error.
**Solution**: Double-check your `.env.local` file and ensure the correct API key (GEMINI_API_KEY or HUGGINGFACE_API_KEY) is set up.

### 2. Gemini API Errors

**Problem**: "Failed to fetch" errors with Gemini API.
**Solution**: Ensure you're using the correct API key and that you haven't exceeded the rate limits (60 requests/minute).

### 3. Hugging Face API Errors

**Problem**: "Failed to generate image" errors.
**Solution**: Verify your Hugging Face API token and check that you haven't exceeded the free tier limits.

### 4. Image Generation Errors

**Problem**: Images not generating or errors in the console.
**Solution**: Check if the model ID is correct and that the prompt is not violating content policies.

### 5. Server Actions Not Working

**Problem**: Server actions returning errors or not processing.
**Solution**: Make sure your Next.js version supports server actions and that you're using the "use server" directive correctly.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the incredible React framework
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for AI integration
- [Google Gemini](https://ai.google.dev/) for free AI text generation
- [OpenAI](https://openai.com/) for GPT models
- [Hugging Face](https://huggingface.co/) for free image generation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
