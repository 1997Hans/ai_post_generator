import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { StarField } from "@/components/star-field";
import { PostProvider } from '@/lib/context/PostContext'
import { Toaster as SonnerToaster } from "sonner";
import Link from 'next/link'
import { BarChart, Pencil } from "lucide-react";

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
            <header style={{
              borderBottom: "1px solid rgba(58, 46, 99, 0.4)",
              backgroundColor: "rgba(18, 16, 32, 0.8)",
              backdropFilter: "blur(16px)",
              position: "sticky",
              top: 0,
              zIndex: 50
            }}>
              <div style={{
                maxWidth: "1200px", 
                margin: "0 auto",
                padding: "0 1rem",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      background: "linear-gradient(135deg, #ffa63d 0%, #ea4c89 50%, #7367f0 100%)",
                      animation: "float 6s infinite ease-in-out"
                    }}>
                      <Pencil size={20} style={{ color: "white" }} />
                    </div>
                    <span style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "transparent",
                      backgroundImage: "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text"
                    }}>
                      Social Media Post Generator
                    </span>
                  </Link>
                </div>
                
                <nav>
                  <Link href="/dashboard" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "white",
                    fontSize: "14px",
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)"
                  }}>
                    <BarChart size={16} />
                    <span>Dashboard</span>
                  </Link>
                </nav>
              </div>
            </header>
            <StarField />
            <main style={{ 
              minHeight: "100vh", 
              display: "flex", 
              flexDirection: "column",
              position: "relative",
              zIndex: 10
            }}>
              {children}
            </main>
            <Toaster />
          </PostProvider>
        </ThemeProvider>
        <SonnerToaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}