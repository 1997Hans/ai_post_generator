"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

export function Header() {
  return (
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
      </div>
    </header>
  );
}