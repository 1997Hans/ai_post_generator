'use client';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <head>
        <meta name="theme-color" content="#0a081a" />
      </head>
      <body suppressHydrationWarning className={`${spaceGrotesk.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PostProvider>
            <main className="min-h-screen">
              <div className="sticky top-0 z-50">
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
              </div>
              {children}
            </main>
            <Toaster />
            <SonnerToaster theme="dark" position="top-right" />
          </PostProvider>
        </ThemeProvider>
        <Analytics />
        
        {/* Global styles for StatusDisplay component */}
        <style jsx global>{`
          /* Status display component styles */
          .status-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
          
          .tone-indicator {
            font-size: 12px;
            color: #a7a3bc;
            font-weight: 400;
          }
          
          .status-row {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .status-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          
          .status-text {
            font-size: 12px;
            line-height: 1;
            position: relative;
            top: 1px;
          }
          
          .status-pending { color: #f59e0b; }
          .status-approved { color: #10b981; }
          .status-rejected { color: #ef4444; }
        `}</style>
      </body>
    </html>
  );
}