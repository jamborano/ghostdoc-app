'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// ✅ Definisikan tipe Guide
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
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Engineering Resources
          </span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mb-12 font-mono">
          Guides, best practices, and deep dives into automated documentation,
          zero-retention security, and DevSecOps audits.
        </p>

        {loading ? (
          <p className="text-neutral-500 font-mono text-sm">Loading guides...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="bg-[#1e1f20]/60 p-6 rounded-2xl border border-neutral-800/80 hover:border-blue-500/30 transition-all duration-300"
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
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}