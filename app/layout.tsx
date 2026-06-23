import type { Metadata } from "next";
import React from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react'; // <-- Pastikan pakai /react seperti ini[cite: 1]
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostDoc.dev - Zero-Retention Auto-Documentation",
  description: "Pentagon-grade automated code documentation for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0c0d12] text-[#F5F5DC]">
        {children}
        
        {/* INJEKSI SCRIPT GUMROAD OVERLAY WAJIB */}
        <Script 
          src="https://gumroad.com/js/gumroad.js" 
          strategy="beforeInteractive" 
        />

        {/* INJEKSI VERCEL WEB ANALYTICS */}
        <Analytics />
      </body>
    </html>
  );
}