'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import BackHomeButton from '@/components/BackHomeButton';
import { DocumentIcon, ApiIcon, ShieldIcon, ChartIcon, LightningIcon } from '@/components/Icons';

export default function DemoPreviewClient() {
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');

  const [selectedRepo, setSelectedRepo] = useState<'juice-shop' | 'calcom' | 'supabase'>(
    repoParam === 'juice-shop' || repoParam === 'calcom' || repoParam === 'supabase'
      ? repoParam
      : 'supabase'
  );
  const [activeTab, setActiveTab] = useState<'readme' | 'api' | 'security' | 'executive'>('readme');
  const [contents, setContents] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);

  const repoConfig = {
    'juice-shop': { displayName: 'OWASP Juice Shop', folder: 'juice-shop' },
    'calcom': { displayName: 'Cal.com', folder: 'calcom' },
    'supabase': { displayName: 'Supabase', folder: 'supabase' }
  };

  const activeRepo = repoConfig[selectedRepo];
  const fileMap = {
    'readme': 'README.md',
    'api': 'API_Reference.md',
    'security': 'Vulnerability_Report.md',
    'executive': 'Executive_Summary.md',
  };

  useEffect(() => {
    const preloadAllContent = async () => {
      const folder = activeRepo.folder;
      const allFiles = Object.values(fileMap);
      const cacheKey = `${folder}/all`;
      if (contents[cacheKey]) {
        setIsReady(true);
        return;
      }

      const results = await Promise.all(
        allFiles.map(async (fileName) => {
          const url = `/demo-content/${folder}/${fileName}`;
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`File not found: ${url}`);
            const text = await response.text();
            return { fileName, text };
          } catch (error) {
            console.error(`Error loading ${fileName}:`, error);
            return { 
              fileName, 
              text: `# Content Not Available\n\nFile \`${fileName}\` for **${activeRepo.displayName}** is not yet uploaded.`
            };
          }
        })
      );

      const newContents: Record<string, string> = {};
      results.forEach(({ fileName, text }) => {
        const key = `${folder}/${fileName}`;
        newContents[key] = text;
      });
      newContents[cacheKey] = 'loaded';
      setContents(prev => ({ ...prev, ...newContents }));
      setIsReady(true);
    };

    preloadAllContent();
  }, [selectedRepo]);

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
            <pre key={`code-${i}`} className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] text-neutral-400 overflow-x-auto text-[11px] font-mono my-2">
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
        elements.push(<h1 key={i} className="text-2xl font-black text-[#e6edf3] mt-6 mb-2">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-[#e6edf3] mt-5 mb-2">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold text-[#58a6ff] mt-4 mb-2">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={i} className="text-sm font-bold text-[#e6edf3] my-2">{line.replace(/\*\*/g, '')}</p>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="text-sm text-[#e6edf3] ml-4 list-disc">{line.replace('- ', '')}</li>);
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        elements.push(<li key={i} className="text-sm text-[#e6edf3] ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>);
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="text-sm text-neutral-400 my-1 leading-relaxed">{line}</p>);
      }
      i++;
    }
    return <div className="space-y-1">{elements}</div>;
  };

  const cacheKey = `${activeRepo.folder}/${fileMap[activeTab]}`;
  const content = contents[cacheKey] || '';

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans pb-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[1000px] bg-[#58a6ff]/5 rounded-full blur-[250px] opacity-60"></div>
      </div>

      <div className="sticky top-0 w-full bg-[#0d1117] p-4 text-center z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="GhostDoc Logo" width={20} height={20} />
          </div>
          <p className="text-xs font-mono text-neutral-400">
            <LightningIcon className="w-3 h-3 inline-block mr-1 text-[#58a6ff]" />
            <b className="text-[#58a6ff]">GHOSTDOC SANDBOX:</b> {activeRepo.displayName}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 bg-[#161b22] border border-[#30363d] rounded-2xl mb-8">
          {(['juice-shop', 'calcom', 'supabase'] as const).map(repo => (
            <button
              key={repo}
              onClick={() => { setSelectedRepo(repo); setActiveTab('readme'); }}
              className={`text-xs font-mono py-4 px-3 rounded-xl transition-colors duration-0 ${
                selectedRepo === repo
                  ? 'bg-[#58a6ff] text-white font-bold shadow-lg shadow-[#58a6ff]/40'
                  : 'text-neutral-400 hover:text-[#e6edf3] hover:bg-[#30363d]/50'
              }`}
            >
              {repo === 'juice-shop' && 'Juice Shop'}
              {repo === 'calcom' && 'Cal.com'}
              {repo === 'supabase' && 'Supabase'}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-[#58a6ff]/20 bg-[#58a6ff]/5 mb-8 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#58a6ff]">
            STATUS // DEMO PREVIEW
          </div>
          <div className="text-xl font-black text-[#e6edf3] mt-0.5">{activeRepo.displayName}</div>
          <div className="text-xs text-neutral-400 font-mono mt-1">
            Explore the generated documentation for this repository.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#30363d] pb-3 mb-6">
          {(['readme', 'api', 'security', 'executive'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-mono rounded-xl transition-colors duration-0 ${
                activeTab === tab
                  ? 'bg-[#161b22] text-[#e6edf3] border border-[#30363d]'
                  : 'text-neutral-500 hover:text-[#e6edf3] hover:bg-[#161b22]/40'
              }`}
            >
              {tab === 'readme' && (
                <span className="flex items-center gap-1">
                  <DocumentIcon className="w-3 h-3" />
                  README.md
                </span>
              )}
              {tab === 'api' && (
                <span className="flex items-center gap-1">
                  <ApiIcon className="w-3 h-3" />
                  API Contract
                </span>
              )}
              {tab === 'security' && (
                <span className="flex items-center gap-1">
                  <ShieldIcon className="w-3 h-3" />
                  SecOps Findings
                </span>
              )}
              {tab === 'executive' && (
                <span className="flex items-center gap-1">
                  <ChartIcon className="w-3 h-3" />
                  Strategic Summary
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] p-8 rounded-2xl min-h-[350px] max-h-[600px] overflow-y-auto">
          {content && renderMarkdown(content)}
        </div>
      </div>

      <BackHomeButton />
      <Footer />
    </main>
  );
}