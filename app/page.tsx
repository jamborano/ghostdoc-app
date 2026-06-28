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

      {/* HEADER — tanpa Resources */}
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-blue-400 tracking-wider">API OPERATIONAL</span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl text-[#F5F5DC] font-light tracking-wide mb-4 leading-tight">
            Ship code. We write the docs. <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Then we vanish.</span>
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

      {/* ===== PLANS ===== */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
            Choose Your Documentation Engine
          </h2>
          <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-12 text-sm md:text-base">
            One‑time payment. Zero retention. Enterprise-grade documentation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* ===== CORE ($9) ===== */}
            <div className="bg-[#1e1f20]/60 p-8 rounded-2xl border border-neutral-800/80 hover:border-blue-500/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white tracking-tight">GhostDoc Core</h3>
                <span className="text-3xl font-black text-blue-500">$9</span>
              </div>
              <p className="text-sm text-neutral-400 mb-6 font-mono">Stop writing READMEs. Start shipping.</p>
              <p className="text-xs text-neutral-500 mb-6 font-mono">We analyze. We document. We vanish.</p>

              <div className="space-y-4 flex-1">
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">📄 README.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Architectural map of your entire codebase — structure, dependencies, data flow.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">⚙️ API_Reference.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Every endpoint, payload schema, and edge case — documented. Period.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-blue-500/20">
                  <p className="text-xs text-blue-400 font-mono">🛡️ Security Audit (Light)</p>
                  <p className="text-sm text-neutral-300 mt-1">OWASP Top 10 scan + high-level risk summary with actionable recommendations.</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-800/60">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Zero‑Retention • One‑time • No subscriptions</span>
                </div>
                <a
                  href="https://jamborano.gumroad.com/l/ghostdoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full block text-center py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-all uppercase tracking-widest"
                >
                  Initialize Engine → ($9)
                </a>
              </div>
            </div>

            {/* ===== ENTERPRISE ($99) ===== */}
            <div className="bg-[#1e1f20]/80 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 flex flex-col relative">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">
                Most Complete
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white tracking-tight">Enterprise Vault</h3>
                <span className="text-3xl font-black text-blue-500">$99</span>
              </div>
              <p className="text-sm text-neutral-400 mb-6 font-mono">Built for monolithic scale, corporate agencies, and proprietary codebases.</p>
              <p className="text-xs text-neutral-500 mb-6 font-mono">No GitHub links. No API tokens. No public repository access required.</p>

              <div className="space-y-4 flex-1">
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-blue-500/20">
                  <p className="text-xs text-neutral-500 font-mono">🔒 SECURE ZIP UPLOAD</p>
                  <p className="text-sm text-neutral-300 mt-1">100% NDA compliant. Upload your .zip archive — no public exposure.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">📄 README.md + ⚙️ API_Reference.md</p>
                  <p className="text-sm text-neutral-300 mt-1">Production‑ready architectural mapping for massive codebases.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">🛡️ DevSecOps Audit (Deep)</p>
                  <p className="text-sm text-neutral-300 mt-1">Advanced OWASP scan with exact code‑patch remediations.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-neutral-500 font-mono">📊 Executive Pitch Deck</p>
                  <p className="text-sm text-neutral-300 mt-1">Business‑driven summary for board members and investors.</p>
                </div>
                <div className="bg-[#0c0d12] p-4 rounded-xl border border-green-500/20">
                  <p className="text-xs text-green-400 font-mono">🛡️ STRICT ZERO-RETENTION PROTOCOL</p>
                  <p className="text-sm text-neutral-300 mt-1">Ephemeral node. Instant vaporization. No logs. No traces.</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-800/60">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>One‑time • NDA compliant • Off‑network upload</span>
                </div>
                <a
                  href="https://jamborano.gumroad.com/l/ghostdoc-enterprise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full block text-center py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-sm rounded-xl transition-all uppercase tracking-widest"
                >
                  Initialize Enterprise → ($99)
                </a>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-600 text-center mt-8 font-mono">
            🔒 End‑to‑end encrypted • No training data • Zero retention
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
            Engineered for Enterprise Security &amp; Speed
          </h2>
          <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-12 text-sm md:text-base">
            GhostDoc generates deep contextual analysis of your codebase without storing a single byte of logic. High-performance documentation meets ironclad data isolation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
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
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="sr-only">Testimonials</h2>
          <blockquote className="text-center text-neutral-300 italic text-lg md:text-xl max-w-3xl mx-auto">
            “GhostDoc reduced our documentation overhead by 80%. The zero-retention policy made our security team very happy.”
          </blockquote>
          <cite className="block mt-4 text-blue-400 font-medium not-italic">
            — CTO, Fortune 500 Fintech
          </cite>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-neutral-500">
            <span className="flex items-center gap-1">⭐ 4.9/5</span>
            <span className="flex items-center gap-1">🔒 SOC2 Compliant</span>
            <span className="flex items-center gap-1">🚀 10k+ repos analyzed</span>
          </div>
          <div className="mt-8">
            <Link href="/testimonials" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
              Read more reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 w-full px-6 py-16 border-t border-neutral-900/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <dl className="space-y-6 text-left max-w-2xl mx-auto">
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
        </div>
      </section>

      {/* RISK-FREE GUARANTEE */}
      <section className="relative z-10 w-full px-6 py-10 border-t border-neutral-900/60">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-blue-950/10 p-8 rounded-2xl border border-blue-500/20">
            <p className="text-2xl font-black text-white mb-2">🛡️ Risk-Free Guarantee</p>
            <p className="text-sm text-neutral-400 font-mono">
              "Don't like the docs? We'll refund 100% within 7 days. No questions asked."
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER — dengan link Resources */}
      <footer className="relative z-10 w-full border-t border-neutral-900/60 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto">
          <p>&copy; {new Date().getFullYear()} GhostDoc — Jamborano Tech Studio. All rights reserved.</p>
          <p className="mt-1 text-neutral-600 font-medium tracking-wide">
            Zero Retention. Zero Compromise. Enterprise Grade Documentation.
          </p>
          <div className="mt-3 flex justify-center gap-6 text-[11px]">
            <Link href="/guides" className="hover:text-white transition-colors">
              Engineering Resources
            </Link>
            <Link href="/testimonials" className="hover:text-white transition-colors">
              Testimonials
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}