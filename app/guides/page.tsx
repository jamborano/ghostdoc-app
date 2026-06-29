// app/guides/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import BackHomeButton from '@/components/BackHomeButton';

type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/guides')
      .then((res) => res.json())
      .then((data) => {
        setGuides(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-[#4d6cf7]/5 rounded-full blur-[200px] opacity-70"></div>
      </div>

      {/* HEADER — seragam dengan halaman lain */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0c0d12]">
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
            <span>Ghost</span><span className="text-[#4d6cf7]">Doc</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4d6cf7]/10 border border-[#4d6cf7]/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-[#4d6cf7] tracking-wider">API OPERATIONAL</span>
        </div>
      </header>

      {/* KONTEN — rata tengah */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d6cf7] to-[#6b86f9]">
            Engineering Resources
          </span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto mb-12 font-mono text-center">
          Guides, best practices, and deep dives into automated documentation,
          zero-retention security, and DevSecOps audits.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : guides.length === 0 ? (
          <p className="text-neutral-500 font-mono text-sm text-center">No guides yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="bg-[#1e1f20]/60 p-6 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-all duration-300 text-center"
              >
                <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
                <p className="text-sm text-neutral-400">{guide.description}</p>
                {guide.date && (
                  <p className="text-xs text-neutral-500 mt-3 font-mono">{guide.date}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-[#4d6cf7] hover:text-[#6b86f9] text-sm font-mono">
          </Link>
        </div>
      </div>

      <BackHomeButton />
      <Footer />
    </main>
  );
}