import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TerminalConsole from '@/components/TerminalConsole';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0c0d12]/80 backdrop-blur-md border-b border-neutral-900/40">
        <div className="flex items-center gap-3 cursor-pointer group" aria-label="GhostDoc Home">
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
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-blue-400 tracking-wider">API OPERATIONAL</span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center mt-32 p-4 text-center">
        <h1 className="text-3xl md:text-5xl text-[#F5F5DC] font-light tracking-wide mb-4 leading-tight">
          Ship code. We write the docs. <br />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Then we vanish.</span>
        </h1>
        <p className="text-neutral-500 text-sm md:text-base max-w-xl mb-10 font-medium">
          Automated production-grade system architecture blueprints and code manuals for Next.js, Python, and microservice stacks.
        </p>
        
        <TerminalConsole />

        <div className="flex items-center justify-center gap-2.5 text-sm font-medium text-neutral-400 mt-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          <span>Bank-Grade Security: Zero-retention ephemeral nodes</span>
        </div>

        {/* CTA - HANYA SATU TOMBOL */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="https://github.com/jamborano/ghostdoc-app/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/50"
          >
            Start Documentation →
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-neutral-900/60 mt-12 w-full">
        <h2 className="text-2xl md:text-4xl font-black text-center tracking-tight mb-4">
          Engineered for Enterprise Security &amp; Speed
        </h2>
        <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-16 text-sm md:text-base">
          GhostDoc generates deep contextual analysis of your codebase without storing a single byte of logic. High-performance documentation meets ironclad data isolation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
            <div className="text-blue-500 font-bold text-xl mb-3">01 / Ephemeral Compute</div>
            <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Zero Data Retention</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Our worker nodes spin dynamically for each repository scan, generating documentation mapping, routing encrypted payloads to your inbox, and automatically destroying instances completely.
            </p>
          </article>

          <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
            <div className="text-blue-500 font-bold text-xl mb-3">02 / Deep Intelligence</div>
            <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Cognitive Indexing</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Advanced parsing patterns read code complexities, logical structures, API endpoints, and data flows to map precise markdown engineering reference manuals effortlessly.
            </p>
          </article>

          <article className="bg-[#1e1f20]/40 p-8 rounded-2xl border border-neutral-800/80 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
            <div className="text-blue-500 font-bold text-xl mb-3">03 / Frictionless Pricing</div>
            <h3 className="text-lg font-bold mb-2 text-[#F5F5DC]">Flat-Rate Licensing</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Forget expensive monthly platform software seats. Pay an accessible flat $9 fee per repository bundle deployment, or opt for an off-network ZIP vault encryption upload tier.
            </p>
          </article>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 border-t border-neutral-900/60 w-full">
        <h2 className="sr-only">Testimonials</h2>
        <blockquote className="text-center text-neutral-300 italic text-lg md:text-xl max-w-3xl mx-auto">
          “GhostDoc reduced our documentation overhead by 80%. The zero-retention policy made our security team very happy.”
        </blockquote>
        <cite className="block mt-4 text-blue-400 font-medium not-italic">
          — CTO, Fortune 500 Fintech
        </cite>
        <div className="flex justify-center gap-6 mt-8 text-xs text-neutral-500">
          <span className="flex items-center gap-1">⭐ 4.9/5</span>
          <span className="flex items-center gap-1">🔒 SOC2 Compliant</span>
          <span className="flex items-center gap-1">🚀 10k+ repos analyzed</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 border-t border-neutral-900/60 w-full">
        <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-blue-400 font-semibold">What is zero-retention?</dt>
            <dd className="text-neutral-400 mt-1 text-sm">Your code is never stored on our servers. It’s processed in ephemeral containers and destroyed immediately after documentation is generated.</dd>
          </div>
          <div>
            <dt className="text-blue-400 font-semibold">Which languages are supported?</dt>
            <dd className="text-neutral-400 mt-1 text-sm">Next.js, Python, Go, Rust, Java, C++, C#, PHP, Ruby, and many more.</dd>
          </div>
          <div>
            <dt className="text-blue-400 font-semibold">Is there a free trial?</dt>
            <dd className="text-neutral-400 mt-1 text-sm">Yes, we offer a free tier for open-source projects. Contact us for details.</dd>
          </div>
        </dl>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-neutral-900/60 py-8 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} GhostDoc — Jamborano Tech Studio. All rights reserved.</p>
        <p className="mt-1 text-neutral-600 font-medium tracking-wide">
          Zero Retention. Zero Compromise. Enterprise Grade Documentation.
        </p>
      </footer>
    </main>
  );
}