"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer 
      className={cn(
        "w-full relative overflow-hidden", 
        className
      )}
      style={{
        background: "#0a0a1e",
        borderTop: "1px solid rgba(143, 75, 222, 0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem"
      }}
    >
      {/* Background glow */}
      <div 
        className="absolute left-0 right-0 bottom-0 h-[100px] opacity-30"
        style={{
          background: "linear-gradient(to top, rgba(70, 104, 234, 0.2), transparent)"
        }}
      />

      {/* Force centering with maximum specificity using inline styles */}
      <div 
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {/* Centered content container */}
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* HansTech logo with gradient */}
          <div style={{ marginBottom: "0.75rem", textAlign: "center" }}>
            <h3 
              className="font-bold text-xl relative inline-block" 
              style={{ 
                padding: 0,
                margin: 0,
                lineHeight: 1.2
              }}
            >
              <span 
                className="relative z-10"
                style={{
                  color: "transparent",
                  background: "linear-gradient(90deg, #ea4c89, #8f4bde, #4668ea)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  padding: 0
                }}
              >
                HansTech
              </span>
              <span 
                className="absolute -bottom-1 left-0 right-0 h-[1px] opacity-40"
                style={{
                  background: "linear-gradient(90deg, transparent, #8f4bde, transparent)"
                }}
              />
            </h3>
          </div>
          
          {/* Copyright text */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "#94a3b8"
            }}
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ marginRight: "0.375rem", opacity: 0.7, color: "#ea4c89" }}
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor" />
            </svg>
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 