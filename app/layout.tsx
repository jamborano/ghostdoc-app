import type { Metadata } from "next";
import React from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

// ================= SUPLEMENTASI SEO PREMIUM GHOSTDOC =================
export const metadata: Metadata = {
  title: "GhostDoc — Zero-Retention Auto-Documentation Berbasis AI",
  description: "Ekosistem dokumentasi otomatis berskala industri dengan arsitektur terisolasi. Otomatisasi cetak biru kode Next.js & Python tanpa retensi data murni.",
  keywords: [
    "GhostDoc", 
    "auto-documentation AI", 
    "dokumentasi otomatis", 
    "zero retention app", 
    "nextjs documentation generator", 
    "Jamborano Tech Studio"
  ],
  robots: "index, follow",
  openGraph: {
    title: "GhostDoc — Zero-Retention Auto-Documentation Berbasis AI",
    description: "Ship code. We write the docs. Then we vanish. Solusi dokumentasi otomatis super aman tingkat industri.",
    url: "https://ghostdoc.dev", // Sesuaikan dengan domain asli GhostDoc lu nanti
    siteName: "GhostDoc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostDoc — Zero-Retention Auto-Documentation",
    description: "Pentagon-grade automated code documentation for high-performance systems.",
  }
};
// =====================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
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