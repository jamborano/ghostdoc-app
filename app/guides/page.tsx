// app/guides/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import BackHomeButton from '@/components/BackHomeButton';
import LoadingDots from '@/components/LoadingDots';

type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

// Ikon maximize (panah diagonal) — tanpa delay
const MaximizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 text-neutral-500 group-hover:text-[#4d6cf7] transition-colors duration-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9.75M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 14.25M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9.75M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 14.25"
    />
  </svg>
);

export default function GuidesPage() {
  const router = useRouter();
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

  // Prefetch semua detail guide setelah data dimuat
  useEffect(() => {
    if (guides.length > 0) {
      guides.forEach((guide) => {
        router.prefetch(`/guides/${guide.slug}`);
      });
    }
  }, [guides, router]);

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-[#4d6cf7]/5 rounded-full blur-[200px] opacity-70"></div>
      </div>

      {/* HEADER */}
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

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-center">
          <span className="text-[#4d6cf7]">Engineering </span>
          <span className="text-white">Resources</span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto mb-12 font-mono text-center">
          Guides, best practices, and deep dives into automated documentation,
          zero-retention security, and DevSecOps audits.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingDots />
          </div>
        ) : guides.length === 0 ? (
          <p className="text-neutral-500 font-mono text-sm text-center">No guides yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                prefetch={true} // Explicit prefetch (juga sudah di-prefetch via router)
                className="group bg-[#1e1f20]/60 p-6 rounded-2xl border border-neutral-800/80 hover:border-[#4d6cf7]/30 transition-colors duration-0 relative block"
              >
                <div className="absolute top-4 right-4">
                  <MaximizeIcon />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 pr-8">{guide.title}</h2>
                <p className="text-sm text-neutral-400">{guide.description}</p>
                {guide.date && (
                  <p className="text-xs text-neutral-500 mt-3 font-mono">{guide.date}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <BackHomeButton />
      <Footer />
    </main>
  );
}