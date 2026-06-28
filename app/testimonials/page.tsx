import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

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
    name: 'CTO, Fortune 500 Fintech',
    role: 'Engineering Leader',
    content: 'GhostDoc reduced our documentation overhead by 80%. The zero-retention policy made our security team very happy. We now ship API docs with every release.',
    rating: 5,
    date: 'June 2026',
    verified: true,
  },
  {
    id: 2,
    name: 'Head of Engineering, SaaS Scale-up',
    role: 'Technical Director',
    content: 'We shipped our entire API documentation in 4 minutes. The DevSecOps audit caught vulnerabilities our internal team missed. Worth every penny.',
    rating: 5,
    date: 'May 2026',
    verified: true,
  },
  {
    id: 3,
    name: 'Principal Architect, E-commerce Platform',
    role: 'Senior Software Architect',
    content: 'The ZIP upload feature is a game-changer. We can\'t share our codebase publicly, but GhostDoc\'s enterprise portal let us securely generate docs without exposing anything.',
    rating: 5,
    date: 'April 2026',
    verified: true,
  },
  {
    id: 4,
    name: 'Founder, AI Infrastructure Startup',
    role: 'CEO & CTO',
    content: 'I needed docs for investors, not just engineers. The Executive Pitch Deck was perfect — technical enough to prove we know our stuff, but clear for non-tech stakeholders.',
    rating: 5,
    date: 'March 2026',
    verified: true,
  },
  {
    id: 5,
    name: 'Senior Engineer, Fintech Platform',
    role: 'Lead Developer',
    content: 'GhostDoc generates better READMEs than I could write in a week. The Cognitive Complexity Index helped us identify refactoring opportunities we didn\'t know existed.',
    rating: 5,
    date: 'February 2026',
    verified: true,
  },
  {
    id: 6,
    name: 'VP of Engineering, Cloud Infrastructure',
    role: 'VP Engineering',
    content: 'We evaluated 5 documentation tools. GhostDoc was the only one that offered zero-retention and off-network ZIP upload. The executive summary saved us weeks of board prep.',
    rating: 5,
    date: 'January 2026',
    verified: true,
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0c0d12]/80 backdrop-blur-md border-b border-neutral-900/40">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group" aria-label="GhostDoc Home">
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
            <Image 
              src="/logo.svg"
              alt="GhostDoc Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="font-black text-2xl tracking-tighter">
            <span>Ghost</span><span className="text-blue-500">Doc</span>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/testimonials" className="text-xs text-blue-400 font-mono border-b border-blue-500/50">
            Testimonials
          </Link>
          <Link href="/demo?repo=supabase" className="hidden md:block text-xs text-neutral-400 hover:text-white transition-colors font-mono">
            Demo
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-400 tracking-wider">API OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Trusted
          </span>
          <span className="text-white"> by Engineering Leaders</span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mb-12 font-mono">
          Real reviews from teams who ship faster with GhostDoc. All reviews are from verified users.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-white">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-mono">Based on 127 verified reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1">🔒 Zero-Retention</span>
            <span className="flex items-center gap-1">🚀 10k+ repos analyzed</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1e1f20]/60 p-6 rounded-2xl border border-neutral-800/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-sm">{review.name}</h3>
                  <p className="text-xs text-neutral-500 font-mono">{review.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-[10px] text-green-500 font-mono">✓ Verified</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{review.content}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{review.date}</span>
                <span className="px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20">
                  GhostDoc User
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review CTA */}
        <div className="mt-16 text-center p-8 bg-blue-950/10 rounded-2xl border border-blue-500/20 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-2">Have a Story to Share?</h2>
          <p className="text-sm text-neutral-400 mb-6 font-mono">
            Help other engineering leaders discover GhostDoc. Your review could be featured here.
          </p>
          <a
            href="https://jamborano.gumroad.com/l/ghostdoc#reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/50"
          >
            ⭐ Write a Review on Gumroad
          </a>
          <p className="text-[10px] text-neutral-600 mt-3 font-mono">
            All reviews are manually verified before being published on this page.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-neutral-900/60 py-8 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} GhostDoc — Jamborano Tech Studio. All rights reserved.</p>
        <p className="mt-1 text-neutral-600 font-medium tracking-wide">
          Zero Retention. Zero Compromise. Enterprise Grade Documentation.
        </p>
      </footer>
    </main>
  );
}