'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DemoPreviewClient() {
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');

  const [selectedRepo, setSelectedRepo] = useState<'juice-shop' | 'calcom' | 'supabase'>(
    repoParam === 'juice-shop' || repoParam === 'calcom' || repoParam === 'supabase'
      ? repoParam
      : 'supabase'
  );
  const [activeTab, setActiveTab] = useState<'readme' | 'api' | 'security' | 'executive'>('readme');
  
  // State untuk semua konten (preloaded)
  const [contents, setContents] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);

  const repoConfig = {
    'juice-shop': {
      displayName: 'OWASP Juice Shop',
      folder: 'juice-shop',
    },
    'calcom': {
      displayName: 'Cal.com',
      folder: 'calcom',
    },
    'supabase': {
      displayName: 'Supabase',
      folder: 'supabase',
    }
  };

  const activeRepo = repoConfig[selectedRepo];
  const fileMap = {
    'readme': 'README.md',
    'api': 'API_Reference.md',
    'security': 'Vulnerability_Report.md',
    'executive': 'Executive_Summary.md',
  };

  // ============================================================
  // PRELOAD SEMUA KONTEN SEKALIGUS SAAT KOMPONEN MOUNT
  // ============================================================
  useEffect(() => {
    const preloadAllContent = async () => {
      const folder = activeRepo.folder;
      const allFiles = Object.values(fileMap);
      const cacheKey = `${folder}/all`;

      // Kalau udah pernah di-preload untuk repo ini, skip
      if (contents[cacheKey]) {
        setIsReady(true);
        return;
      }

      const fetchPromises = allFiles.map(async (fileName) => {
        const url = `/demo-content/${folder}/${fileName}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`File not found: ${url}`);
          }
          const text = await response.text();
          return { fileName, text };
        } catch (error) {
          console.error(`Error loading ${fileName}:`, error);
          return { 
            fileName, 
            text: `# Content Not Available\n\nFile \`${fileName}\` for **${activeRepo.displayName}** is not yet uploaded.`
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      
      // Gabungkan hasil ke state
      const newContents: Record<string, string> = {};
      results.forEach(({ fileName, text }) => {
        const key = `${folder}/${fileName}`;
        newContents[key] = text;
      });
      
      // Tandai bahwa semua konten untuk repo ini sudah dimuat
      newContents[cacheKey] = 'loaded';
      
      setContents((prev) => ({ ...prev, ...newContents }));
      setIsReady(true);
    };

    preloadAllContent();
  }, [selectedRepo]); // Hanya reload saat pindah repo

  // ============================================================
  // RENDER MARKDOWN (sama seperti sebelumnya)
  // ============================================================
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null;
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeContent = [];
          i++;
          continue;
        } else {
          inCodeBlock = false;
          const code = codeContent.join('\n');
          elements.push(
            <pre key={`code-${i}`} className="bg-[#16171a] p-4 rounded-xl border border-neutral-800 text-neutral-400 overflow-x-auto text-[11px] font-mono my-2">
              {code}
            </pre>
          );
          i++;
          continue;
        }
      }
      if (inCodeBlock) {
        codeContent.push(line);
        i++;
        continue;
      }
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-black text-white mt-6 mb-2">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-white mt-5 mb-2">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold text-blue-400 mt-4 mb-2">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={i} className="text-sm font-bold text-neutral-200 my-2">{line.replace(/\*\*/g, '')}</p>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="text-sm text-neutral-300 ml-4 list-disc">{line.replace('- ', '')}</li>);
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        elements.push(<li key={i} className="text-sm text-neutral-300 ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>);
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="text-sm text-neutral-400 my-1 leading-relaxed">{line}</p>);
      }
      i++;
    }
    return <div className="space-y-1">{elements}</div>;
  };

  // Ambil konten dari cache (udah preloaded)
  const cacheKey = `${activeRepo.folder}/${fileMap[activeTab]}`;
  const content = contents[cacheKey] || '';

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans pb-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[1000px] bg-blue-600/5 rounded-full blur-[250px] opacity-60"></div>
      </div>

      <div className="sticky top-0 w-full bg-[#0c0d12]/95 backdrop-blur-md border-b border-blue-500/20 p-4 text-center z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="GhostDoc Logo" width={20} height={20} />
          </div>
          <p className="text-xs font-mono text-neutral-400">
            ⚡ <b className="text-blue-400">GHOSTDOC SANDBOX:</b> {activeRepo.displayName}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 relative z-10">
        {/* Pilih Repo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 bg-[#1e1f20]/60 border border-neutral-800/80 rounded-2xl mb-8">
          {(['juice-shop', 'calcom', 'supabase'] as const).map((repo) => (
            <button
              key={repo}
              onClick={() => { setSelectedRepo(repo); setActiveTab('readme'); }}
              className={`text-xs font-mono py-4 px-3 rounded-xl transition-colors duration-150 ${
                selectedRepo === repo
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {repo === 'juice-shop' && '📦 Juice Shop'}
              {repo === 'calcom' && '📅 Cal.com'}
              {repo === 'supabase' && '⚡ Supabase'}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-950/10 mb-8">
          <div className="text-[10px] font-bold uppercase tracking-widest font-mono text-blue-400">
            STATUS // DEMO PREVIEW
          </div>
          <div className="text-xl font-black text-white mt-0.5">{activeRepo.displayName}</div>
          <div className="text-xs text-neutral-400 font-mono mt-1">
            Explore the generated documentation for this repository.
          </div>
        </div>

        {/* Tab Navigation — tanps efek berdenyut */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800/80 pb-3 mb-6">
          {(['readme', 'api', 'security', 'executive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono rounded-xl transition-colors duration-150 ${
                activeTab === tab
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40'
              }`}
            >
              {tab === 'readme' && '📄 README.md'}
              {tab === 'api' && '⚙️ API Contract'}
              {tab === 'security' && '🛡️ SecOps Findings'}
              {tab === 'executive' && '📊 Strategic Summary'}
            </button>
          ))}
        </div>

        {/* Content — INSTAN, tanpa loading */}
        <div className="bg-[#121318] border border-neutral-800/80 p-8 rounded-2xl min-h-[350px] max-h-[600px] overflow-y-auto">
          {content && renderMarkdown(content)}
        </div>

        <footer className="mt-20 text-center border-t border-neutral-800/60 pt-10">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}