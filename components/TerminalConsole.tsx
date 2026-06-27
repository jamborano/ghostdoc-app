'use client';

import React, { useState, useEffect, useRef } from 'react';

const SendUpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-500">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
  </svg>
);

const DEMO_REPOS = [
  { id: 'juice-shop', label: 'OWASP Juice Shop', url: 'https://github.com/juice-shop/juice-shop' },
  { id: 'calcom', label: 'Cal.com', url: 'https://github.com/calcom/cal.com' },
  { id: 'supabase', label: 'Supabase', url: 'https://github.com/supabase/supabase' },
];

export default function TerminalConsole() {
  const [step, setStep] = useState(1);
  const [repoUrl, setRepoUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [repoStats, setRepoStats] = useState({
    tierName: 'Awaiting Architecture Scan',
    files: 0,
    credits: 0
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // ============================================================
  // SCAN SIMULATION
  // ============================================================
  const simulateScan = async (url?: string, repoId?: string) => {
    const targetUrl = url || repoUrl;
    const targetRepoId = repoId || selectedRepoId;

    if (!targetUrl) {
      alert("System requires a valid GitHub Repository URL to proceed.");
      return;
    }
    
    const match = targetUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      alert("Invalid format detected. Expected format: https://github.com/username/repo");
      return;
    }
    
    const owner = match[1];
    const repo = match[2].replace('.git', '');

    setIsScanning(true);
    setStep(2);
    setLogs(["[SYSTEM] Bootstrapping zero-retention ephemeral worker node..."]);

    try {
      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, `[INFO] Authenticating and mapping GitHub API for ${owner}/${repo}...`]);
      
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!repoRes.ok) {
        throw new Error(repoRes.status === 404 ? "Repository is private or does not exist." : "GitHub API rate limit exceeded or unresponsive.");
      }
      
      const repoData = await repoRes.json();
      const defaultBranch = repoData.default_branch;

      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, `[INFO] Crawling repository tree on branch: ${defaultBranch}...`]);
      
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
      const treeData = await treeRes.json();

      const validExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.c', '.cpp', '.cs', '.php', '.rb', '.md', '.html', '.css', '.json'];
      
      const validFiles = treeData.tree ? treeData.tree.filter((file: any) => {
        if (file.type !== 'blob') return false;
        if (file.path.includes('package-lock.json') || file.path.includes('yarn.lock') || file.path.includes('pnpm-lock.yaml')) return false;
        const ext = file.path.slice((Math.max(0, file.path.lastIndexOf(".")) || Infinity) + 1);
        return validExtensions.includes(`.${ext.toLowerCase()}`);
      }) : [];

      const fileCount = validFiles.length;

      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, `[INFO] Pruning boilerplate and lockfiles. Valid logic files: ${fileCount}...`]);

      let tier = "Micro-Architecture";
      if (fileCount > 150) tier = "Monolithic Scale";
      else if (fileCount > 40) tier = "Standard Codebase";

      const credits = fileCount === 0 ? 120 : fileCount * 184;

      setRepoStats({
        tierName: `${tier} Detected`,
        files: fileCount,
        credits: credits
      });

      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, "[SUCCESS] Architecture mapped successfully."]);

    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setIsScanning(false);
      // ============================================================
      // REDIRECT KE /demo-preview?repo=xxx
      // ============================================================
      if (isDemoMode && targetRepoId) {
        setTimeout(() => {
          window.location.href = `/demo-preview?repo=${targetRepoId}`;
        }, 1500);
      } else if (!isDemoMode) {
        // Mode normal → pindah ke step 3 (checkout)
        setTimeout(() => setStep(3), 2000);
      }
    }
  };

  // ============================================================
  // POPUP HANDLER
  // ============================================================
  const handleSelectDemo = (repo: { id: string; url: string }) => {
    setRepoUrl(repo.url);
    setSelectedRepoId(repo.id);
    setIsDemoMode(true);
    setShowPopup(false);
    simulateScan(repo.url, repo.id);
  };

  // ============================================================
  // KEYBOARD & CHECKOUT
  // ============================================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') simulateScan();
  };

  const handleCheckout = () => {
    if (deliveryEmail.trim() === '') {
      alert("⚠️ FATAL: A valid delivery email is required.");
      return;
    }
    window.location.href = `https://jamborano.gumroad.com/l/ghostdoc?repo_url=${encodeURIComponent(repoUrl)}&email=${encodeURIComponent(deliveryEmail)}`;
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="w-full max-w-3xl relative z-20">
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full relative group">
            <input 
              type="text" 
              placeholder="Paste your GitHub Repository URL..." 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#1e1f20] rounded-full pl-8 pr-16 py-5 text-[#F5F5DC] text-lg focus:outline-none placeholder:text-neutral-500 shadow-2xl"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button 
                onClick={() => simulateScan()} 
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95"
              >
                <SendUpArrowIcon />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowPopup(true)}
              className="text-green-400 hover:text-green-300 text-sm border border-green-500/30 px-6 py-3 rounded-full hover:bg-green-900/10 transition-all font-mono w-full sm:w-auto text-center"
            >
              ⚡ Try Instant Demo ($0)
            </button>
            <button 
              onClick={() => window.location.href = "https://jamborano.gumroad.com/l/ghostdoc-enterprise"}
              className="text-blue-400 hover:text-blue-300 text-sm border border-blue-500/30 px-6 py-3 rounded-full hover:bg-blue-900/20 transition-all w-full sm:w-auto text-center"
            >
              🔒 Upload Secure ZIP ($99)
            </button>
          </div>

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#1e1f20] border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-white tracking-tight">Select Demo Repository</h3>
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="text-neutral-400 hover:text-white text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-neutral-400 mb-6 font-mono">
                  Choose a repo to instantly populate the URL and run a live architecture scan.
                </p>
                <div className="space-y-3">
                  {DEMO_REPOS.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectDemo(repo)}
                      className="w-full text-left bg-[#0c0d12] hover:bg-[#2a2b2e] border border-neutral-800 hover:border-blue-500/50 rounded-xl px-5 py-4 transition-all duration-200"
                    >
                      <div className="text-white font-bold text-sm">{repo.label}</div>
                      <div className="text-xs text-neutral-500 font-mono truncate">{repo.url}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-800/60">
                  <p className="text-[10px] text-neutral-600 font-mono text-center">
                    🔒 Zero-retention • No data stored • Redirects to sandbox after scan
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-2xl mx-auto bg-[#0c0d12] border border-neutral-800 rounded-xl p-6 font-mono text-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#1e1f20]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div ref={terminalRef} className="h-64 overflow-y-auto space-y-2 text-green-400/90">
            {logs.map((log, i) => (
              <div key={i} className={log.includes('[SUCCESS]') ? 'text-blue-400 font-bold' : log.includes('[ERROR]') ? 'text-red-400' : ''}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && !isDemoMode && (
        <div className="w-full max-w-2xl mx-auto bg-[#1e1f20] rounded-2xl p-10 shadow-2xl border border-neutral-800">
          <h2 className="text-3xl font-black mb-8 text-center tracking-tight">Scan Completed</h2>
          <div className="bg-[#0c0d12] p-6 rounded-2xl flex items-center gap-6 mb-8 border border-green-500/20">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckIcon />
            </div>
            <div>
              <div className="font-black text-2xl text-[#F5F5DC] mb-1">{repoStats.tierName}</div>
              <div className="text-sm text-neutral-400 font-mono">{repoStats.files} Source Files Mapped</div>
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-400 mb-3 uppercase">Secure Delivery Address *</label>
            <input 
              type="email" 
              placeholder="Enter email..." 
              value={deliveryEmail}
              onChange={(e) => setDeliveryEmail(e.target.value)}
              className="w-full bg-[#0c0d12] border border-neutral-800 rounded-xl px-5 py-4 text-[#F5F5DC] text-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button onClick={handleCheckout} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-xl transition-all uppercase tracking-widest">
            Initialize Generation ($9)
          </button>
        </div>
      )}
    </div>
  );
}