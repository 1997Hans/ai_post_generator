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
| AI Services  | **Vercel AI SDK** (OpenAI), **Replicate** (Image/Video) |
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

# 4. Install Vercel AI SDK and OpenAI
npm install ai openai

# 5. Install Shadcn UI components
npx shadcn-ui@latest init

# 6. (Optional) Install Replicate SDK for image generation
npm install replicate

# 7. (Optional) Install Clerk for authentication
npm install @clerk/nextjs

# 8. Set up .env.local with your API keys
```

## 📁 Environment Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# OpenAI API (required for text generation)
OPENAI_API_KEY=your_openai_api_key_here

# Replicate API (for image generation)
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Clerk (if using auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase (if using for storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🏗️ Project Structure

```
social-post-generator/
├── app/                      # Next.js App Router
│   ├── actions/              # Server Actions
│   │   ├── generatePost.ts   # AI post generation
│   │   ├── generateImage.ts  # Image generation
│   │   └── refinePrompt.ts   # Prompt refinement
│   ├── api/                  # API Routes
│   ├── (auth)/               # Auth-protected routes
│   │   └── dashboard/        # Admin dashboard
│   ├── page.tsx              # Home page
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
│   ├── PromptForm.tsx        # Input form for users
│   ├── PostPreview.tsx       # Preview of generated post
│   ├── ToneSelector.tsx      # Tone selection component
│   └── ImagePreview.tsx      # Image preview component
├── lib/                      # Utility functions
│   ├── ai.ts                 # AI configuration
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions
├── ui/                       # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ... other UI components
├── public/                   # Static assets
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

2. **AI Processing** (`app/actions/generatePost.ts`)
   - Server action processes the user input
   - Uses Vercel AI SDK to refine and expand the prompt
   - Generates post content, caption, and hashtags

3. **Image Generation** (`app/actions/generateImage.ts`)
   - Uses Replicate API to create custom visuals
   - Options for different styles (realistic, artistic, etc.)

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

**Problem**: "OpenAI API key not configured" error.
**Solution**: Double-check your `.env.local` file and ensure the OPENAI_API_KEY is correctly set up.

### 2. Image Generation Errors

**Problem**: Images not generating or errors in the console.
**Solution**: Verify your Replicate API token and check network requests for specific error messages.

### 3. Server Actions Not Working

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
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
- [OpenAI](https://openai.com/) for the powerful language model
- [Replicate](https://replicate.com/) for image generation capabilities
