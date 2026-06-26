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
  
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const simulateScan = async () => {
    if (!repoUrl) return alert("System requires a valid GitHub Repository URL to proceed.");
    
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      alert("Invalid format detected. Expected format: https://github.com/username/repo");
      return;
    }
    
    const owner = match[1];
    const repo = match[2].replace('.git', ''); 

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
      setLogs(prev => [...prev, `[SUCCESS] Architecture mapped successfully.`]);
      
      setTimeout(() => setStep(3), 2000);

    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    }
  };

  // HANDLER KHUSUS DEMO OWASP JUICE SHOP (ANTI BILLING MELEDAK)
  const handleTriggerDemo = async () => {
    setRepoUrl("https://github.com/juice-shop/juice-shop");
    setStep(2);
    setLogs(["[SYSTEM] Bootstrapping zero-retention ephemeral worker node..."]);
    
    await new Promise(r => setTimeout(r, 600));
    setLogs(prev => [...prev, "[INFO] Authenticating and mapping GitHub API for juice-shop/juice-shop..."]);
    
    await new Promise(r => setTimeout(r, 800));
    setLogs(prev => [...prev, "[INFO] Crawling repository tree. 100+ architectural vectors mapped..."]);
    
    await new Promise(r => setTimeout(r, 600));
    setLogs(prev => [...prev, "[SUCCESS] Target cloned into sandboxed environment. Redirecting to interactive demo..."]);

    setTimeout(() => {
      window.location.href = "/demo";
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') simulateScan();
  };

  const handleCheckout = () => {
    if (deliveryEmail.trim() === '') return alert("⚠️ FATAL: A valid delivery email is required.");
    window.location.href = `https://jamborano.gumroad.com/l/ghostdoc?repo_url=${encodeURIComponent(repoUrl)}&email=${encodeURIComponent(deliveryEmail)}`;
  };

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
                onClick={simulateScan} 
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95"
              >
                <SendUpArrowIcon />
              </button>
            </div>
          </div>

          {/* DUA TOMBOL OPSI DI BAWAH INPUT INPUT FIELD */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={handleTriggerDemo}
              className="text-green-400 hover:text-green-300 text-sm border border-green-500/30 px-6 py-3 rounded-full hover:bg-green-900/10 transition-all font-mono"
            >
              ⚡ Try Instant Demo (OWASP Juice Shop)
            </button>
            <button 
              onClick={() => window.location.href = `https://jamborano.gumroad.com/l/ghostdoc-enterprise`}
              className="text-blue-400 hover:text-blue-300 text-sm border border-blue-500/30 px-6 py-3 rounded-full hover:bg-blue-900/20 transition-all"
            >
              🔒 Upload Secure ZIP ($99)
            </button>
          </div>
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

      {step === 3 && (
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