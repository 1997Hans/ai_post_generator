import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { StarField } from "@/components/star-field";
import { PostProvider } from '@/lib/context/PostContext'
import { Toaster as SonnerToaster } from "sonner";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space"
});

export const metadata: Metadata = {
  title: "AI Social Media Post Generator",
  description: "Generate compelling social media posts with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a081a" />
      </head>
      <body 
        className={spaceGrotesk.className}
        style={{
          backgroundColor: "#0a081a",
          color: "#fff",
          minHeight: "100vh",
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(91, 37, 178, 0.15) 0%, rgba(10, 10, 30, 0) 60%),
            radial-gradient(circle at 90% 50%, rgba(234, 76, 137, 0.1) 0%, rgba(10, 10, 30, 0) 60%),
            radial-gradient(circle at 50% 80%, rgba(76, 104, 234, 0.1) 0%, rgba(10, 10, 30, 0) 60%)
          `,
          backgroundAttachment: "fixed"
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <PostProvider>
            <StarField />
            <div className="min-h-screen relative z-10">
              {children}
            </div>
            <Toaster />
          </PostProvider>
        </ThemeProvider>
        <SonnerToaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}