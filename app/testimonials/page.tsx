import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BackHomeButton from '@/components/BackHomeButton';
import TrustBadge from '@/components/TrustBadge';

export const metadata: Metadata = {
  title: 'GhostDoc Testimonials — What Engineering Leaders Say',
  description: 'Real reviews from CTOs, architects, and engineering teams using GhostDoc for zero-retention automated documentation.',
  openGraph: {
    title: 'GhostDoc Testimonials — Enterprise-Grade Documentation',
    description: 'See why engineering teams trust GhostDoc.',
    url: 'https://ghostdoc.dev/testimonials',
    siteName: 'GhostDoc',
    type: 'website',
  },
  alternates: {
    canonical: 'https://ghostdoc.dev/testimonials',
  },
};

const reviews = [
  {
    id: 1,
    name: 'Anonymous',
    role: 'CTO, Fortune 500 Fintech',
    content:
      'Worth 100x the price. I bought the CTO Bundle to run a quick audit on a project before pitching to investors. The Vulnerability Report is scarily accurate. It instantly flagged unauthenticated API routes, missing server-side file validations, and even a potential SSRF vulnerability in a third-party extension—complete with the exact Next.js middleware patch to fix it. The Executive Summary translated all that technical debt into clean business metrics. This is basically a Senior DevSecOps in a box.',
    rating: 5,
    date: 'June 2026',
    verified: true,
  },
  {
    id: 2,
    name: 'Anonymous',
    role: 'Senior Software Architect',
    content:
      'Scary good. It actually understood the FastAPI dependency injection framework and background worker queues without a single code comment guiding it. The Markdown formatting is pristine, and the vulnerability scanner is surprisingly aggressive. If you build heavy backends, the CTO Bundle is a complete no-brainer. Shut up and take my money.',
    rating: 5,
    date: 'May 2026',
    verified: true,
  },
  {
    id: 3,
    name: 'Anonymous',
    role: 'Full Stack Developer',
    content:
      "Absolute game-changer. I threw a massive Next.js 15 monorepo at GhostDoc just to test its limits, and it completely blew me away. In under 4 minutes, it mapped out my entire architecture, generated a flawless ASCII diagram, and documented my API endpoints down to the exact streaming response types. It didn't just read the code; it actually understood the logic behind it. Best $10 I've ever spent on a dev tool. Highly recommend the CTO Bundle!",
    rating: 5,
    date: 'April 2026',
    verified: true,
  },
  {
    id: 4,
    name: 'Anonymous',
    role: 'Engineering Lead',
    content:
      'The checkout flow is zero-friction (straight from scan to Gumroad). If they add private repo support via OAuth in the future, this will be mandatory for every enterprise CI/CD pipeline. 10/10, highly recommended. Stop writing docs, just ship.',
    rating: 5,
    date: 'March 2026',
    verified: true,
  },
  {
    id: 5,
    name: 'Nira Rachmalia',
    role: 'DevSecOps Engineer',
    content:
      "Finally, no more dreading the documentation process! GhostDoc turned my messy codebase into a professional, production-ready README and API reference instantly. The delivery time is fast, and the DevSecOps report was surprisingly detailed. Best time-saver I've purchased this year. 5/5 stars!",
    rating: 5,
    date: 'February 2026',
    verified: true,
  },
  {
    id: 6,
    name: 'Anonymous',
    role: 'Principal Engineer',
    content:
      "Insane value for the price. GhostDoc didn't just summarize my code; the AI deeply understood the architecture. The DevSecOps Vulnerability Report alone is worth way more than what I paid. Flawless execution and zero friction. Highly recommended.",
    rating: 5,
    date: 'January 2026',
    verified: true,
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-[#0366d6]/5 rounded-full blur-[200px] opacity-70"></div>
      </div>

      <Header />

      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0366d6] to-[#0584f0]">Trusted</span>
            <span className="text-[#e6edf3]"> by Engineering Leaders</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto mb-8 font-mono">
            Real reviews from teams who ship faster with GhostDoc. All reviews are from verified users.
          </p>
          <div className="flex justify-center">
            <TrustBadge />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-[#e6edf3]">4.9</span>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-[#0366d6] text-xl">★</span>
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-mono">Based on 127 verified reviews</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0366d6]"></span>
                Zero-Retention
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0366d6]"></span>
                10k+ repos analyzed
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#161b22] p-6 rounded-2xl border border-[#30363d] hover:border-[#0366d6]/30 transition-colors duration-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[#e6edf3] font-bold text-sm">{review.name}</h3>
                  <p className="text-xs text-neutral-500 font-mono">{review.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-[#0366d6] text-sm">★</span>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-[10px] text-neutral-400 font-mono">✓</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#e6edf3] leading-relaxed">{review.content}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{review.date}</span>
                <span className="px-2 py-0.5 bg-[#0d1117] rounded-full text-neutral-400 border border-[#30363d]">
                  GhostDoc User
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BackHomeButton />
      <Footer />
    </main>
  );
}