'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LightningIcon, LockIcon, CloseIcon } from '@/components/Icons';
import LoadingDots from './LoadingDots';

const SendUpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
  </svg>
);

const DEMO_REPOS = [
  { id: 'juice-shop', label: 'OWASP Juice Shop', url: 'https://github.com/juice-shop/juice-shop', desc: 'Security testing playground' },
  { id: 'calcom', label: 'Cal.com', url: 'https://github.com/calcom/cal.com', desc: 'Open-source scheduling infrastructure' },
  { id: 'supabase', label: 'Supabase', url: 'https://github.com/supabase/supabase', desc: 'Open-source Firebase alternative' },
];

const ENTERPRISE_THRESHOLD = 2000;

const DEMO_DATA: Record<string, { fileCount: number; totalFiles: number; tierName: string; credits: number }> = {
  'juice-shop': { fileCount: 412, totalFiles: 520, tierName: 'Standard Codebase Detected', credits: 412 * 184 },
  'calcom': { fileCount: 2450, totalFiles: 3000, tierName: 'Monolithic Scale Detected', credits: 2450 * 184 },
  'supabase': { fileCount: 5757, totalFiles: 7690, tierName: 'Monolithic Scale Detected', credits: 5757 * 184 },
};

const GUMROAD_ENTERPRISE_BASE = 'https://jamborano.gumroad.com/l/ghostdoc-enterprise?_gl=1*17k4oa4*_ga*MTUzODI2Ny4xNzgxMTk5MDM2*_ga_6LJN6D94N6*czE3ODI5ODU0NzgkbzY4JGcxJHQxNzgyOTg3MTAzJGo2MCRsMCRoMA..';
const GUMROAD_CORE_BASE = 'https://jamborano.gumroad.com/l/ghostdoc?_gl=1*17k4oa4*_ga*MTUzODI2Ny4xNzgxMTk5MDM2*_ga_6LJN6D94N6*czE3ODI5ODU0NzgkbzY4JGcxJHQxNzgyOTg3MTAzJGo2MCRsMCRoMA..';

export default function TerminalConsole() {
  const [step, setStep] = useState(1);
  const [repoUrl, setRepoUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [repoStats, setRepoStats] = useState({
    tierName: 'Awaiting Architecture Scan',
    files: 0,
    credits: 0,
    totalFiles: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showGumroadLoading, setShowGumroadLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const simulateScan = async (url?: string, repoId?: string, isDemo: boolean = false) => {
    const targetUrl = url || repoUrl;
    const targetRepoId = repoId || selectedRepoId;

    if (!targetUrl) {
      setErrorMsg('Please paste a valid GitHub Repository URL.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setErrorMsg(null);

    if (isDemo && targetRepoId && DEMO_DATA[targetRepoId]) {
      const dummy = DEMO_DATA[targetRepoId];
      setIsScanning(true);
      setStep(2);

      const logMessages = [
        '[SYSTEM] Bootstrapping zero-retention ephemeral worker node...',
        `[INFO] Authenticating and mapping GitHub API for ${targetUrl}...`,
        '[INFO] Crawling repository tree...',
        `[INFO] Pruning boilerplate and lockfiles. Valid logic files: ${dummy.fileCount}...`,
        '[SUCCESS] Architecture mapped successfully.',
      ];

      setLogs([]);
      for (const msg of logMessages) {
        setLogs((prev) => [...prev, msg]);
        await sleep(300);
      }

      setRepoStats({
        tierName: dummy.tierName,
        files: dummy.fileCount,
        credits: dummy.credits,
        totalFiles: dummy.totalFiles,
      });

      setIsScanning(false);

      await sleep(1000);
      window.location.href = `/demo?repo=${targetRepoId}`;
      return;
    }

    const match = targetUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      setErrorMsg('Invalid format. Expected: https://github.com/username/repo');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    const owner = match[1];
    const repo = match[2].replace('.git', '');

    setIsScanning(true);
    setStep(2);
    setLogs(['[SYSTEM] Bootstrapping zero-retention ephemeral worker node...']);

    try {
      setLogs((prev) => [...prev, `[INFO] Authenticating and mapping GitHub API for ${owner}/${repo}...`]);

      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) {
        throw new Error(
          repoRes.status === 404
            ? 'Repository is private or does not exist.'
            : 'GitHub API rate limit exceeded or unresponsive.'
        );
      }

      const repoData = await repoRes.json();
      const defaultBranch = repoData.default_branch;

      setLogs((prev) => [...prev, `[INFO] Crawling repository tree on branch: ${defaultBranch}...`]);

      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
      );
      const treeData = await treeRes.json();

      const totalFiles = treeData.tree ? treeData.tree.filter((file: any) => file.type === 'blob').length : 0;

      const validExtensions = [
        '.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs',
        '.java', '.c', '.cpp', '.cs', '.php', '.rb', '.md',
        '.html', '.css', '.json',
      ];

      const validFiles = treeData.tree
        ? treeData.tree.filter((file: any) => {
            if (file.type !== 'blob') return false;
            if (
              file.path.includes('package-lock.json') ||
              file.path.includes('yarn.lock') ||
              file.path.includes('pnpm-lock.yaml')
            ) {
              return false;
            }
            const ext = file.path.slice((Math.max(0, file.path.lastIndexOf('.')) || Infinity) + 1);
            return validExtensions.includes(`.${ext.toLowerCase()}`);
          })
        : [];

      const fileCount = validFiles.length;

      setLogs((prev) => [...prev, `[INFO] Pruning boilerplate and lockfiles. Valid logic files: ${fileCount}...`]);

      let tier = 'Micro-Architecture';
      if (fileCount > ENTERPRISE_THRESHOLD) tier = 'Monolithic Scale';
      else if (fileCount > 40) tier = 'Standard Codebase';

      const credits = fileCount === 0 ? 120 : fileCount * 184;

      setRepoStats({
        tierName: `${tier} Detected`,
        files: fileCount,
        credits,
        totalFiles,
      });

      setLogs((prev) => [...prev, '[SUCCESS] Architecture mapped successfully.']);
    } catch (err: any) {
      setLogs((prev) => [...prev, `[ERROR] ${err.message}`]);
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsScanning(false);
      setTimeout(() => setStep(3), 1500);
    }
  };

  const handleSelectDemo = (repo: { id: string; url: string }) => {
    setRepoUrl(repo.url);
    setSelectedRepoId(repo.id);
    setShowPopup(false);
    simulateScan(repo.url, repo.id, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') simulateScan();
  };

  const handleCheckout = () => {
    const isEnterprise = repoStats.files > ENTERPRISE_THRESHOLD;

    if (isEnterprise) {
      setShowGumroadLoading(true);
      const url = `${GUMROAD_ENTERPRISE_BASE}&repo_url=${encodeURIComponent(repoUrl)}&output_mode=enterprise`;
      window.location.href = url;
      return;
    }

    if (deliveryEmail.trim() === '') {
      setErrorMsg('Please enter a valid delivery email.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setShowGumroadLoading(true);
    const url = `${GUMROAD_CORE_BASE}&email=${encodeURIComponent(deliveryEmail)}&repo_url=${encodeURIComponent(repoUrl)}&output_mode=standard`;
    window.location.href = url;
  };

  const isEnterprise = repoStats.files > ENTERPRISE_THRESHOLD;

  return (
    <>
      {step === 1 && (
        <div className="w-full max-w-3xl relative z-20">
          <div className="w-full flex flex-col items-center">
            <div className="w-full relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <LockIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Paste your GitHub URL or upload a .zip..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#161b22] rounded-full pl-12 pr-16 py-5 text-[#e6edf3] text-lg focus:outline-none focus:ring-2 focus:ring-[#0366d6] placeholder:text-neutral-500 shadow-2xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  onClick={() => simulateScan()}
                  className="w-10 h-10 flex items-center justify-center bg-[#0366d6] hover:bg-[#0355b4] text-white rounded-full transition-all active:scale-95"
                >
                  <SendUpArrowIcon />
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 text-sm text-red-400 font-mono bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowPopup(true)}
                className="text-[#0366d6] hover:text-[#0584f0] text-sm border border-[#0366d6]/30 px-6 py-3 rounded-full hover:bg-[#0366d6]/10 transition-all font-mono w-full sm:w-auto text-center"
              >
                <LightningIcon className="w-4 h-4 inline-block mr-1 text-[#0366d6]" />
                Try Instant Demo
              </button>
              <button
                onClick={() => {
                  const url = `${GUMROAD_ENTERPRISE_BASE}&repo_url=${encodeURIComponent(repoUrl)}&output_mode=enterprise`;
                  window.location.href = url;
                }}
                className="text-[#0366d6] hover:text-[#0584f0] text-sm border border-[#0366d6]/30 px-6 py-3 rounded-full hover:bg-[#0366d6]/20 transition-all w-full sm:w-auto text-center"
              >
                <LockIcon className="w-4 h-4 inline-block mr-1 text-[#0366d6]" />
                Upload Secure ZIP · $99
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#e6edf3] tracking-tight flex-1">Select Demo Repository</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-neutral-400 hover:text-white text-2xl leading-none transition-colors duration-100"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-neutral-400 mb-6 font-mono text-center">
              Choose a repo to instantly populate the URL and run a live architecture scan.
            </p>
            <div className="space-y-3">
              {DEMO_REPOS.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => handleSelectDemo(repo)}
                  className="w-full text-left bg-[#0d1117] hover:bg-[#30363d] border border-[#30363d] hover:border-[#0366d6]/50 rounded-xl px-5 py-4 cursor-pointer transition-colors duration-0"
                >
                  <div className="text-[#e6edf3] font-bold text-sm">{repo.label}</div>
                  <div className="text-xs text-neutral-500 font-mono truncate">{repo.desc}</div>
                  <div className="text-[10px] text-neutral-600 font-mono truncate mt-1">{repo.url}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#30363d]">
              <p className="text-[10px] text-neutral-500 font-mono text-center">
                🔒 Zero-retention · No data stored · Redirects to sandbox after scan
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {step === 2 && mounted && createPortal(
        <div className="fixed inset-0 z-[999] bg-[#0d1117] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-xl p-6 font-mono text-sm shadow-2xl">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#161b22]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-neutral-500 ml-2">ghostdoc@scan:~$</span>
            </div>
            <div ref={terminalRef} className="h-64 overflow-y-auto space-y-2 text-green-400/90">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.includes('[SUCCESS]')
                      ? 'text-[#0366d6] font-bold'
                      : log.includes('[ERROR]')
                      ? 'text-red-400'
                      : ''
                  }
                >
                  {log}
                </div>
              ))}
              {isScanning && <LoadingDots />}
            </div>
          </div>
        </div>,
        document.body
      )}

      {step === 3 && mounted && createPortal(
        <div className="fixed inset-0 z-[999] bg-[#0d1117] flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto bg-[#161b22] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#30363d] relative pt-8 sm:pt-10">
            <button
              onClick={() => window.location.href = '/'}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-2xl leading-none transition-colors duration-100"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mt-6">
              <div className="bg-[#0d1117] p-4 rounded-xl flex items-center gap-4 mb-6 border border-green-500/20">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckIcon />
                </div>
                <div>
                  <div className="font-black text-lg text-[#e6edf3]">{repoStats.tierName}</div>
                  <div className="text-xs text-neutral-400 font-mono">
                    {repoStats.files.toLocaleString()} Source Files Mapped
                    {repoStats.totalFiles > 0 && (
                      <span className="text-neutral-600"> (of {repoStats.totalFiles.toLocaleString()} total files)</span>
                    )}
                  </div>
                </div>
              </div>

              {!isEnterprise && (
                <div className="mb-5">
                  <label className="text-xs text-neutral-500 font-mono mb-1 block">Delivery Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={deliveryEmail}
                    onChange={(e) => setDeliveryEmail(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-[#e6edf3] text-base focus:outline-none focus:border-[#0366d6] placeholder:text-neutral-600"
                  />
                </div>
              )}

              {isEnterprise && (
                <div className="mb-5 text-sm text-neutral-400 font-mono">
                  ✅ Enterprise Vault includes: README · API Reference · Deep Security Audit · Executive Pitch
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#0366d6] hover:bg-[#0355b4] text-white font-black text-sm rounded-full transition-all uppercase tracking-widest"
              >
                {isEnterprise ? 'Initialize Enterprise Vault — $99' : 'Initialize Generation — $9'}
              </button>

              {isEnterprise && (
                <p className="text-[10px] text-amber-400/70 text-center mt-3 font-mono">
                  <LightningIcon className="w-3 h-3 inline-block mr-1 text-amber-400" />
                  Monolithic scale detected — auto‑upgraded to Enterprise Vault
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {showGumroadLoading && (
        <div className="fixed inset-0 z-[999999] bg-[#0d1117] flex flex-col items-center justify-center">
          <LoadingDots />
          <p className="text-neutral-400 text-sm mt-4 font-mono">Redirecting to secure checkout...</p>
        </div>
      )}
    </>
  );
}