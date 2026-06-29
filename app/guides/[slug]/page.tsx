// app/guides/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';
import BackHomeButton from '@/components/BackHomeButton';
import LoadingDots from '@/components/LoadingDots';

type GuideContent = {
  title: string;
  description: string;
  date: string;
  content: string;
};

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [guide, setGuide] = useState<GuideContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    fetch(`/api/guides/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setGuide(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setGuide(null);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <LoadingDots />
      </main>
    );
  }

  if (!guide) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <p className="text-neutral-400 font-mono">Guide not found.</p>
      </main>
    );
  }

  const htmlContent = marked.parse(guide.content || '', {
    gfm: true,
    breaks: true,
  });

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <h1 className="text-4xl font-black text-white mb-4">{guide.title}</h1>
        {guide.date && <p className="text-sm text-neutral-500 font-mono mb-8">{guide.date}</p>}

        <div
          className="prose prose-invert prose-blue max-w-none terminal"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      <BackHomeButton />
      <Footer />
    </main>
  );
}