'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BackHomeButton from '@/components/BackHomeButton';
import TrustBadge from '@/components/TrustBadge';
import LoadingDots from '@/components/LoadingDots';
import { MaximizeIcon } from '@/components/Icons';

type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

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

  useEffect(() => {
    if (guides.length > 0) {
      guides.forEach((guide) => {
        router.prefetch(`/guides/${guide.slug}`);
      });
    }
  }, [guides, router]);

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-[#0366d6]/5 rounded-full blur-[200px] opacity-70"></div>
      </div>

      <Header />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            <span className="text-[#0366d6]">Engineering </span>
            <span className="text-[#e6edf3]">Resources</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto mb-8 font-mono">
            Guides, best practices, and deep dives into automated documentation,
            zero-retention security, and DevSecOps audits.
          </p>
          <div className="flex justify-center">
            <TrustBadge />
          </div>
        </div>

        <div className="mt-12">
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
                  prefetch={true}
                  className="group bg-[#161b22] p-6 rounded-2xl border border-[#30363d] hover:border-[#0366d6]/30 transition-colors duration-0 relative block"
                >
                  <div className="absolute top-4 right-4">
                    <MaximizeIcon className="w-5 h-5 text-neutral-500 group-hover:text-[#0366d6] transition-colors duration-0" />
                  </div>
                  <h2 className="text-xl font-bold text-[#e6edf3] mb-2 pr-8">{guide.title}</h2>
                  <p className="text-sm text-neutral-400">{guide.description}</p>
                  {guide.date && (
                    <p className="text-xs text-neutral-500 mt-3 font-mono">{guide.date}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BackHomeButton />
      <Footer />
    </main>
  );
}