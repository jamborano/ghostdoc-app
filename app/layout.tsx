import type { Metadata, Viewport } from "next";
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://ghostdoc.dev'),
  title: {
    default: "GhostDoc — Zero-Retention AI Auto-Documentation for Enterprise Codebases",
    template: "%s | GhostDoc"
  },
  description: "GhostDoc is a Pentagon-grade automated documentation engine that generates production-ready markdown, API references, and security audits from your codebase. Zero data retention. Enterprise security.",
  keywords: [
    "GhostDoc",
    "auto documentation AI",
    "AI code documentation",
    "zero retention software",
    "Next.js documentation generator",
    "Python code documentation",
    "Jamborano Tech Studio",
    "enterprise documentation tool",
    "automated API reference",
    "DevSecOps audit"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "GhostDoc — Zero-Retention Auto-Documentation for High-Performance Systems",
    description: "Ship code. We write the docs. Then we vanish. Automated codebase analysis, API blueprints, and security audits — all with zero data retention.",
    url: "https://ghostdoc.dev",
    siteName: "GhostDoc",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "https://ghostdoc.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "GhostDoc — Zero-Retention Auto-Documentation"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostDoc — Zero-Retention Auto-Documentation",
    description: "Pentagon-grade automated code documentation for high-performance systems. Zero data retention. Enterprise security.",
    images: ["https://ghostdoc.dev/og-image.png"]
  },
  alternates: {
    canonical: "https://ghostdoc.dev"
  },
  authors: [{ name: "Jamborano Tech Studio", url: "https://jamborano.com" }],
  category: "Technology",
  classification: "Software Development, DevOps, AI Documentation",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GhostDoc",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    description: "Zero-retention AI-powered automated documentation engine for enterprise codebases. Generates markdown, API references, and security audits.",
    url: "https://ghostdoc.dev",
    author: {
      "@type": "Organization",
      name: "Jamborano Tech Studio",
      url: "https://jamborano.com"
    },
    offers: {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: "Flat-rate per repository bundle deployment"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5"
    }
  };

  return (
    <html lang="id" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" href="/logo.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased bg-[#0d1117] text-[#e6edf3] selection:bg-blue-500/30 selection:text-white">
        {children}
        <script
          async
          defer
          src="https://gumroad.com/js/gumroad.js"
        />
        <Analytics />
      </body>
    </html>
  );
}