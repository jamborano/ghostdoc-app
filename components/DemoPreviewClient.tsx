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
  const [email, setEmail] = useState('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (repoParam === 'juice-shop' || repoParam === 'calcom' || repoParam === 'supabase') {
      setSelectedRepo(repoParam);
    }
  }, [repoParam]);

  const repoConfig = {
    'juice-shop': {
      name: 'bkimminich/juice-shop',
      displayName: 'OWASP Juice Shop',
      files: 412,
      credits: '45.210',
      tier: 'Core Bundle ($9)',
      priceLabel: '$9',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-core-9',
      isOverlimit: false,
      folder: 'juice-shop',
    },
    'calcom': {
      name: 'calcom/cal.diy (Monorepo Fork)',
      displayName: 'Cal.com',
      files: 2450,
      credits: '320.450',
      tier: 'Enterprise Vault ($99)',
      priceLabel: '$99',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
      isOverlimit: true,
      folder: 'calcom',
    },
    'supabase': {
      name: 'supabase/supabase (Studio Monorepo)',
      displayName: 'Supabase',
      files: 7775,
      credits: '1.430.600',
      tier: 'Enterprise Vault ($99)',
      priceLabel: '$99',
      gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
      isOverlimit: true,
      folder: 'supabase',
    }
  };

  const activeRepo = repoConfig[selectedRepo];

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const fileMap = {
        'readme': 'README.md',
        'api': 'API_Reference.md',
        'security': 'Vulnerability_Report.md',
        'executive': 'Executive_Summary.md',
      };

      const fileName = fileMap[activeTab];
      const folder = activeRepo.folder;
      const url = `/demo-content/${folder}/${fileName}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`File not found: ${url}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        setContent(`# Content Not Available\n\nFile \`${fileName}\` for **${activeRepo.displayName}** is not yet uploaded.\n\nPlease add \`${fileName}\` to \`public/demo-content/${folder}/\`.`);
        console.error('Error loading markdown:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [selectedRepo, activeTab]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email is required.');
      return;
    }
    window.location.href = activeRepo.gumroadLink;
  };

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans pb-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[1000px] bg-blue-600/5 rounded-full blur-[250px] opacity-60"></div>
      </div>

      <div className="sticky top-0 w-full bg-[#0c0d12]/95 backdrop-blur-md border-b border-blue-500/20 p-4 text-center z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="Logo" width={20} height={20} />
          </div>
          <p className="text-xs font-mono text-neutral-400">
            ⚡ <b className="text-blue-400">GHOSTDOC SANDBOX:</b> {activeRepo.displayName}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 relative z-10">
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
              {repo === 'juice-shop' && '📦 Juice Shop'}
              {repo === 'calcom' && '📅 Cal.com'}
              {repo === 'supabase' && '⚡ Supabase'}
            </button>
          ))}
        </div>

        <div className={`p-6 rounded-2xl border mb-8 ${activeRepo.isOverlimit ? 'bg-red-950/10 border-red-500/30' : 'bg-blue-950/10 border-blue-500/20'}`}>
          <div className={`text-[10px] font-bold uppercase tracking-widest font-mono ${activeRepo.isOverlimit ? 'text-red-400' : 'text-blue-400'}`}>
            STATUS // {activeRepo.isOverlimit ? 'MONOLITHIC SCALE OVERLIMIT' : 'STANDARD STACK PASSED'}
          </div>
          <div className="text-xl font-black text-white mt-0.5">{activeRepo.name}</div>
          <div className="text-xs text-neutral-400 font-mono mt-1">
            {activeRepo.files.toLocaleString()} Files / {activeRepo.credits} Compute Credits
          </div>
        </div>

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

        <div className="bg-[#121318] border border-neutral-800/80 p-8 rounded-2xl min-h-[350px] max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-neutral-500 text-sm font-mono animate-pulse">⏳ Loading documentation...</div>
            </div>
          ) : (
            renderMarkdown(content)
          )}
        </div>

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

        <footer className="mt-20 text-center border-t border-neutral-800/60 pt-10">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}