'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TerminalConsole from '@/components/TerminalConsole';
import Footer from '@/components/Footer';
import HowToUseModal from '@/components/HowToUseModal';

export default function Home() {
  const [showHowToUse, setShowHowToUse] = useState(false);

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex flex-col font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-[#4d6cf7]/5 rounded-full blur-[200px] opacity-70"></div>
      </div>

      {/* HEADER — Zero Delay */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0c0d12]">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group" aria-label="GhostDoc Home">
          <div className="relative w-8 h-8 transition-transform duration-0 group-hover:scale-110">
            <Image 
              src="/logo.svg"
              alt="GhostDoc Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="font-black text-2xl tracking-tighter">
            <span>Ghost</span><span className="text-[#4d6cf7]">Doc</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4d6cf7]/10 border border-[#4d6cf7]/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-[#4d6cf7] tracking-wider">API OPERATIONAL</span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl text-[#F5F5DC] font-light tracking-wide mb-4 leading-tight">
            Ship code. We write the docs. <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4d6cf7] to-[#6b86f9]">Then we vanish.</span>
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto mb-10 font-medium">
            Automated production-grade system architecture blueprints and code manuals for Next.js, Python, and microservice stacks.
          </p>
          
          <TerminalConsole />

          <div className="flex items-center justify-center gap-2.5 text-sm font-medium text-neutral-400 mt-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span>Bank-Grade Security: Zero-retention ephemeral nodes</span>
          </div>
        </div>
      </section>

      {/* PRICING — Zero Delay + HOW IT WORKS DI BAWAHNYA */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">Choose Your Documentation Engine</h2>
          <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-12 text-sm md:text-base">
            One‑time payment. Zero retention. Enterprise-grade documentation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Core Card */}
            <div className="bg-[#1e1f20]/60 p-8 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-colors duration-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white tracking-tight">GhostDoc Core</h3>
                <span className="text-4xl font-black text-[#4d6cf7]">$9</span>
              </div>
              <p className="text-sm text-neutral-400 mb-6 font-mono">Stop writing READMEs. Start shipping.</p>
              <div className="space-y-4 flex-1">
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">README.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Architectural map of your entire codebase.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">API_Reference.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Every endpoint, payload schema, and edge case.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-[#4d6cf7]/20">
                  <p className="text-xs text-[#4d6cf7] font-mono">Security Audit (Light)</p>
                  <p className="text-sm text-neutral-300 mt-1">OWASP Top 10 scan + high-level risk summary.</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-800/60">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Zero‑Retention · One‑time</span>
                </div>
                <a href="https://jamborano.gumroad.com/l/ghostdoc" target="_blank" rel="noopener noreferrer" className="mt-4 w-full block text-center py-4 bg-[#4d6cf7] hover:bg-[#3b5de7] text-white font-black text-sm rounded-full transition-colors duration-0 uppercase tracking-widest">
                  Initialize Engine
                </a>
              </div>
            </div>

            {/* Enterprise Card */}
            <div className="bg-[#1e1f20]/80 p-8 rounded-2xl border border-[#4d6cf7]/30 hover:border-[#4d6cf7]/60 transition-colors duration-0 flex flex-col relative">
              <div className="absolute -top-3 right-6 bg-[#4d6cf7] text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">Most Complete</div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white tracking-tight">Enterprise Vault</h3>
                <span className="text-4xl font-black text-[#4d6cf7]">$99</span>
              </div>
              <p className="text-sm text-neutral-400 mb-6 font-mono">Built for monolithic scale, corporate agencies.</p>
              <div className="space-y-4 flex-1">
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-[#4d6cf7]/20">
                  <p className="text-xs text-[#4d6cf7] font-mono">Secure ZIP Upload</p>
                  <p className="text-sm text-neutral-300 mt-1">100% NDA compliant.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">README.md + API_Reference.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Production‑ready mapping.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">DevSecOps Audit (Deep)</p>
                  <p className="text-sm text-neutral-300 mt-1">Advanced OWASP scan with code patches.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">Executive Pitch Deck</p>
                  <p className="text-sm text-neutral-300 mt-1">Business‑driven summary.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-green-500/20">
                  <p className="text-xs text-green-400 font-mono">Strict Zero-Retention Protocol</p>
                  <p className="text-sm text-neutral-300 mt-1">Ephemeral node. Instant vaporization.</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-800/60">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>One‑time · NDA compliant</span>
                </div>
                <a href="https://jamborano.gumroad.com/l/ghostdoc-enterprise" target="_blank" rel="noopener noreferrer" className="mt-4 w-full block text-center py-4 bg-[#4d6cf7] hover:bg-[#3b5de7] text-white font-black text-sm rounded-full transition-colors duration-0 uppercase tracking-widest">
                  Initialize Enterprise
                </a>
              </div>
            </div>
          </div>

          {/* ===== HOW IT WORKS — DI SINI (DI BAWAH PRICING) ===== */}
          <div className="mt-12 pt-8 border-t border-neutral-800/60">
            <button
              onClick={() => setShowHowToUse(true)}
              className="px-8 py-3 bg-[#4d6cf7] hover:bg-[#3b5de7] text-white font-bold text-sm rounded-full transition-colors duration-0 shadow-lg shadow-[#4d6cf7]/25 hover:shadow-[#4d6cf7]/50"
            >
              How It Works
            </button>
            <p className="text-[12px] text-neutral-600 text-center mt-4 font-mono">
              End‑to‑end encrypted · No training data · Zero retention
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">Engineered for Enterprise Security &amp; Speed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-colors duration-0">
              <div className="text-[#4d6cf7] font-bold text-xl mb-3">01 / Ephemeral Compute</div>
              <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Zero Data Retention</h3>
              <p className="text-sm text-neutral-400">Our worker nodes spin dynamically for each scan.</p>
            </article>
            <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-colors duration-0">
              <div className="text-[#4d6cf7] font-bold text-xl mb-3">02 / Deep Intelligence</div>
              <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Cognitive Indexing</h3>
              <p className="text-sm text-neutral-400">Advanced parsing patterns read code complexities.</p>
            </article>
            <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-colors duration-0">
              <div className="text-[#4d6cf7] font-bold text-xl mb-3">03 / Frictionless Pricing</div>
              <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Flat-Rate Licensing</h3>
              <p className="text-sm text-neutral-400">Pay an accessible flat $9 per repository.</p>
            </article>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-center text-neutral-300 italic text-lg md:text-xl max-w-3xl mx-auto">
            “GhostDoc reduced our documentation overhead by 80%. The zero-retention policy made our security team very happy.”
          </blockquote>
          <cite className="block mt-4 text-[#4d6cf7] font-medium not-italic">— CTO, Fortune 500 Fintech</cite>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-neutral-500">
            <span>★ 4.9/5</span>
            <span>SOC2 Compliant</span>
            <span>10k+ repos analyzed</span>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/testimonials" className="px-6 py-3 bg-[#4d6cf7] hover:bg-[#3b5de7] text-white font-bold text-sm rounded-full transition-colors duration-0">
              Read more reviews
            </Link>
            <Link href="/guides" className="px-6 py-3 bg-[#4d6cf7] hover:bg-[#3b5de7] text-white font-bold text-sm rounded-full transition-colors duration-0">
              Engineering Resources
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <dl className="space-y-6 text-center max-w-2xl mx-auto">
            <div>
              <dt className="text-[#4d6cf7] font-semibold">What is zero-retention?</dt>
              <dd className="text-neutral-400 mt-1 text-sm">Your code is never stored on our servers.</dd>
            </div>
            <div>
              <dt className="text-[#4d6cf7] font-semibold">Which languages are supported?</dt>
              <dd className="text-neutral-400 mt-1 text-sm">Next.js, Python, Go, Rust, Java, C++, C#, PHP, Ruby, and many more.</dd>
            </div>
            <div>
              <dt className="text-[#4d6cf7] font-semibold">Is there a free trial?</dt>
              <dd className="text-neutral-400 mt-1 text-sm">Yes, we offer a free tier for open-source projects.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* RISK-FREE GUARANTEE */}
      <section className="relative z-10 w-full px-6 py-10 border-t border-neutral-900/60">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-[#4d6cf7]/5 p-8 rounded-2xl border border-[#4d6cf7]/20">
            <p className="text-2xl font-black text-white mb-2">Risk-Free Guarantee</p>
            <p className="text-sm text-neutral-400 font-mono">"Don't like the docs? We'll refund 100% within 7 days."</p>
          </div>
        </div>
      </section>

      <Footer />
      <HowToUseModal isOpen={showHowToUse} onClose={() => setShowHowToUse(false)} />
    </main>
  );
}