'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type GuideContent = {
  title: string;
  description: string;
  date: string;
  content: string;
};

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<GuideContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/guides/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setData(null);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <p className="text-neutral-400 font-mono">Loading...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <p className="text-neutral-400 font-mono">Guide not found.</p>
      </main>
    );
  }

  // ✅ FIX: Pastikan content ada, jika tidak beri fallback
  const contentLines = data.content ? data.content.split('\n') : ['No content available.'];

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <Link
          href="/guides"
          className="text-blue-400 hover:text-blue-300 text-sm font-mono mb-6 inline-block"
        >
          ← Back to Resources
        </Link>
        <h1 className="text-4xl font-black text-white mb-4">{data.title}</h1>
        {data.date && <p className="text-sm text-neutral-500 font-mono mb-8">{data.date}</p>}
        <div className="prose prose-invert prose-blue max-w-none">
          {contentLines.map((line, i) => (
            <p key={i} className="text-neutral-300 text-sm leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-800/60">
          <Link
            href="/guides"
            className="text-blue-400 hover:text-blue-300 text-sm font-mono"
          >
            ← All Resources
          </Link>
        </div>
      </div>
    </main>
  );
}