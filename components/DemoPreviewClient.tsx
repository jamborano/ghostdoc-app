'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DemoPreviewClient() {
  const [selectedRepo, setSelectedRepo] = useState<'juice-shop' | 'calcom' | 'supabase'>('supabase');
  const [activeTab, setActiveTab] = useState<'readme' | 'api' | 'security' | 'executive'>('readme');
  const [email, setEmail] = useState('');

  const repoConfig = {
    'juice-shop': {
      name: 'bkimminich/juice-shop',
      files: 412,
      credits: '45.210',
      tier: 'Core Bundle ($9)',
      priceLabel: '$9',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-core-9',
      isOverlimit: false,
    },
    'calcom': {
      name: 'calcom/cal.diy (Monorepo Fork)',
      files: 2450,
      credits: '320.450',
      tier: 'Enterprise Vault ($99)',
      priceLabel: '$99',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
      isOverlimit: true,
    },
    'supabase': {
      name: 'supabase/supabase (Studio Monorepo)',
      files: 7775,
      credits: '1.430.600',
      tier: 'Enterprise Vault ($99)',
      priceLabel: '$99',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
      isOverlimit: true,
    }
  };

  const activeRepo = repoConfig[selectedRepo];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email is required.');
      return;
    }
    window.location.href = activeRepo.gumroadLink;
  };

  // ================================================================
  // 🧠 KONTEN DINAMIS PER REPO & TAB
  // ================================================================
  const renderContent = () => {
    // ---------- SUPABASE ----------
    if (selectedRepo === 'supabase') {
      if (activeTab === 'readme') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <div className="text-xs text-green-400 font-bold">STATUS: PARSING COMPLETE // PRODUCTION REPO TOPOLOGY MAPPED</div>
            <h3 className="text-lg font-black text-white tracking-tight">Supabase Monorepo – Architecture & Development Guide</h3>
            <p className="text-neutral-400">Production-ready monorepo comprising the Supabase Studio dashboard, marketing site, documentation, shared UI component library, and a suite of backend microservices. Built with pnpm workspaces, Turborepo, Next.js, React 19, and a rigorous security-first type system.</p>
            <h4 className="text-sm font-bold text-blue-400 pt-2">Repository Topology Graph</h4>
            <pre className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-neutral-400 overflow-x-auto text-[11px]">
{`supabase/
├── apps/
│   ├── studio/          # Next.js Pages Router (React 19 Dashboard)
│   ├── www/             # Next.js App Router (Marketing Hub)
│   └── docs/            # Contentlayer + MDX Technical Docs
└── packages/
    ├── ui/              # Shared Tailwind Component Library
    ├── pg-meta/         # Postgres Management & Direct Inspection Asset
    └── dev-tools/       # Internal Inspection Toolbars`}
            </pre>
          </article>
        );
      }
      if (activeTab === 'api') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Supabase Studio API Reference Contract</h3>
            <p className="text-neutral-400">Version: 2.6 | Base URL: http://localhost:8080. All endpoints strictly require session JWT tokens obtained from Supabase Auth.</p>
            <pre className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-purple-400 overflow-x-auto text-[11px]">
{`// Example SQL Query Execution Endpoint
POST /api/projects/{ref}/query
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "query": "SELECT * FROM public.users WHERE role = $1",
  "params": ["admin"]
}`}
            </pre>
          </article>
        );
      }
      if (activeTab === 'security') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">SecOps Findings: Branded Type Enforcement</h3>
            <div className="bg-[#16171a] p-5 rounded-xl border border-neutral-800 space-y-2">
              <span className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">MEDIUM (V-001)</span>
              <div className="text-white font-bold">Runtime validation missing for SafeSqlFragment</div>
              <p className="text-neutral-400 text-xs">All data access layers rely on the integrity of the TypeScript compiler; no runtime enforcement exists for the branded SQL type system. Risk of type assertion bypass via manual casts.</p>
            </div>
          </article>
        );
      }
      if (activeTab === 'executive') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Investor Valuation & Architectural Strategic Summary</h3>
            <p className="text-neutral-400">The brand-differentiated SQL protection system, combined with a modular UI framework and rigorous testing pipeline, positions the platform to capture enterprise revenue while maintaining top-line growth. Technical debt is minimal (&lt;1% total codebase complexity).</p>
          </article>
        );
      }
    }

    // ---------- CAL.COM ----------
    if (selectedRepo === 'calcom') {
      if (activeTab === 'readme') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <div className="text-xs text-green-400 font-bold">STATUS: PARSING COMPLETE // SCHEDULING INFRASTRUCTURE LAYERS MAPPED</div>
            <h3 className="text-lg font-black text-white tracking-tight">Cal.diy Monorepo – Community-maintained Scheduling System</h3>
            <p className="text-neutral-400">MIT-licensed open-source scheduling infrastructure built for scale. Employs a vertical slice architecture and a strict dependency matrix layer to avoid dependency entanglements.</p>
            <pre className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-neutral-400 overflow-x-auto text-[11px]">
{`Dependency Hierarchy Matrix:
@calcom/lib ──> @calcom/app-store ──> @calcom/features ──> @calcom/trpc ──> apps/web`}
            </pre>
          </article>
        );
      }
      if (activeTab === 'api') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Cal.diy Surface Layer API Reference</h3>
            <p className="text-neutral-400">Exposes two primary surfaces: a high-performance tRPC tunnel layer for first-party interfaces, and traditional REST API v2 endpoints backed by NestJS.</p>
            <pre className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-purple-400 overflow-x-auto text-[11px]">
{`// Procedure Contract: bookings.create
POST /api/trpc/bookings.create
Input Validation Context:
{
  "eventTypeId": "string (z.uuid())",
  "start": "string (z.string().datetime())",
  "end": "string (z.string().datetime())",
  "responses": "z.record(z.any())"
}`}
            </pre>
          </article>
        );
      }
      if (activeTab === 'security') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">SecOps Findings: Database Masking Strategy</h3>
            <div className="bg-[#16171a] p-5 rounded-xl border border-neutral-800 space-y-2">
              <span className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">HIGH (VULN-001)</span>
              <div className="text-white font-bold">Snaplet Transform Unsafe Mode Enables Data Leakage</div>
              <p className="text-neutral-400 text-xs">packages/snaplet/transform.ts uses $mode: "unsafe", disabling runtime type checks. Custom functions could leak production keys (credential.key, client_secret) directly into development snapshots.</p>
            </div>
          </article>
        );
      }
      if (activeTab === 'executive') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Strategic Recommendations for Funding & Scaling</h3>
            <p className="text-neutral-400">1. Complete PBAC migration to unlock enterprise seat-based licensing. 2. Enforce mandatory rate limiting via Unkey. 3. Budget $50k/year for a dedicated upstream maintenance developer role.</p>
          </article>
        );
      }
    }

    // ---------- JUICE SHOP ----------
    if (selectedRepo === 'juice-shop') {
      if (activeTab === 'readme') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <div className="text-xs text-green-400 font-bold">STATUS: UNLOCKED PREVIEW // STANDARD SCALE ACCESSIBLE</div>
            <h3 className="text-lg font-black text-white tracking-tight">OWASP Juice Shop Architecture Audit</h3>
            <p className="text-neutral-400">An intentional insecure web application written in Node.js, Express, and Angular. GhostDoc maps the abstract structural models to track real-time architectural decay boundaries.</p>
          </article>
        );
      }
      if (activeTab === 'api') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Juice Shop Legacy Endpoint Mapping</h3>
            <p className="text-neutral-400">The application utilizes standard RESTful patterns with weak data validation contracts exposed at the router layer.</p>
            <pre className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-purple-400 overflow-x-auto text-[11px]">
{`GET /rest/products/search?q=
// Exploit surface: Traditional raw SQL query string interpolation`}
            </pre>
          </article>
        );
      }
      if (activeTab === 'security') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">SecOps Findings: Injection Vulnerabilities</h3>
            <div className="bg-[#16171a] p-5 rounded-xl border border-neutral-800 space-y-2">
              <span className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">HIGH</span>
              <div className="text-white font-bold">SQL Injection (SQLi) in Search Field</div>
              <p className="text-neutral-400 text-xs">Product search route concatenates queries directly without parameterization bounds, allowing full information disclosure via UNION operations.</p>
            </div>
          </article>
        );
      }
      if (activeTab === 'executive') {
        return (
          <article className="font-mono text-xs md:text-sm leading-relaxed text-neutral-300 space-y-4">
            <h3 className="text-lg font-black text-white tracking-tight">Remediation Cost Summary</h3>
            <p className="text-neutral-400">Converting insecure standard controllers to repository pattern requires major refactoring. Estimated architectural cost: $15,000 for full sanitation coverage.</p>
          </article>
        );
      }
    }

    return <p className="text-neutral-400">Content not available.</p>;
  };

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans pb-24 relative overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[1000px] bg-blue-600/5 rounded-full blur-[250px] opacity-60"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 w-full bg-[#0c0d12]/95 backdrop-blur-md border-b border-blue-500/20 p-4 text-center z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="Logo" width={20} height={20} />
          </div>
          <p className="text-xs font-mono text-neutral-400">
            ⚡ <b className="text-blue-400">GHOSTDOC SANDBOX:</b> {activeRepo.name}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 relative z-10">
        {/* Repository selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 bg-[#1e1f20]/60 border border-neutral-800/80 rounded-2xl mb-8">
          {(['juice-shop', 'calcom', 'supabase'] as const).map((repo) => (
            <button
              key={repo}
              onClick={() => { setSelectedRepo(repo); setActiveTab('readme'); }}
              className={`text-xs font-mono py-4 px-3 rounded-xl transition-all ${
                selectedRepo === repo
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {repo === 'juice-shop' && '📦 juice-shop'}
              {repo === 'calcom' && '📅 cal.com'}
              {repo === 'supabase' && '⚡ supabase'}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className={`p-6 rounded-2xl border mb-8 ${activeRepo.isOverlimit ? 'bg-red-950/10 border-red-500/30' : 'bg-blue-950/10 border-blue-500/20'}`}>
          <div className={`text-[10px] font-bold uppercase tracking-widest font-mono ${activeRepo.isOverlimit ? 'text-red-400' : 'text-blue-400'}`}>
            STATUS // {activeRepo.isOverlimit ? 'MONOLITHIC SCALE OVERLIMIT' : 'STANDARD STACK PASSED'}
          </div>
          <div className="text-xl font-black text-white mt-0.5">{activeRepo.name}</div>
          <div className="text-xs text-neutral-400 font-mono mt-1">
            {activeRepo.files.toLocaleString()} Files / {activeRepo.credits} Compute Credits
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800/80 pb-3 mb-6">
          {(['readme', 'api', 'security', 'executive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono rounded-xl transition-all ${
                activeTab === tab ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab === 'readme' && '📄 README.md'}
              {tab === 'api' && '⚙️ API Contract'}
              {tab === 'security' && '🛡️ SecOps Findings'}
              {tab === 'executive' && '📊 Strategic Summary'}
            </button>
          ))}
        </div>

        {/* Content preview — PAKAI FUNCTION renderContent() */}
        <div className="bg-[#121318] border border-neutral-800/80 p-8 rounded-2xl min-h-[350px]">
          {renderContent()}
        </div>

        {/* Payment form */}
        <div className="bg-[#121318] p-8 rounded-2xl border border-neutral-800/80 mt-8 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-blue-500 font-black uppercase tracking-widest block font-mono">
                Encrypted Payload Routing Destination *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#16171a] border border-neutral-800/80 p-4 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className={`w-full font-black text-xs py-4 rounded-xl transition-all uppercase tracking-widest text-white border ${
                activeRepo.isOverlimit
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border-amber-500/40'
                  : 'bg-blue-600 hover:bg-blue-500 border-blue-500/40'
              }`}
            >
              Initialize Generation ({activeRepo.priceLabel}) →
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center border-t border-neutral-800/60 pt-10">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}