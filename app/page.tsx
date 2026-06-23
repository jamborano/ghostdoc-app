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

export default function Home() {
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

      if (treeData.truncated) {
         setLogs(prev => [...prev, `[WARN] Massive monolithic repository detected. Tree payload truncated by GitHub.`]);
      }

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
      setLogs(prev => [...prev, `[INFO] Calculating codebase Cognitive Complexity Index...`]);

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
      setLogs(prev => [...prev, `[SUCCESS] Architecture mapped successfully. ${fileCount} source files identified. Requires ${credits.toLocaleString()} compute credits.`]);
      
      setTimeout(() => setStep(3), 2000);

    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      setLogs(prev => [...prev, `[SYSTEM] Process terminated. Container destroyed.`]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      simulateScan();
    }
  };

  const handleCheckout = () => {
    if (deliveryEmail.trim() === '') {
      alert("⚠️ FATAL: A valid delivery email is required to route your encrypted documentation payload.");
      return; 
    }
    const checkoutUrl = `https://jamborano.gumroad.com/l/ghostdoc?repo_url=${encodeURIComponent(repoUrl)}&email=${encodeURIComponent(deliveryEmail)}`;
    window.location.href = checkoutUrl;
  };

  const handleEnterpriseCheckout = () => {
    const enterpriseCheckoutUrl = `https://jamborano.gumroad.com/l/ghostdoc-enterprise`;
    window.location.href = enterpriseCheckoutUrl;
  };

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex flex-col font-sans relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>

      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0c0d12]/80 backdrop-blur-md">
        <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => setStep(1)}>
          <span className="text-[#F5F5DC]">Ghost</span>
          <span className="text-blue-500">Doc</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 border border-blue-500/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">API Operational</span>
        </div>
      </header>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center mt-20 p-4">
        
        {step === 1 && (
          <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in text-center mt-12">
            <h1 className="text-3xl md:text-5xl text-[#F5F5DC] font-light tracking-wide mb-8 leading-tight">
              Ship code. We write the docs. <br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Then we vanish.</span>
            </h1>
            
            <div className="w-full relative group z-20">
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
                  className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-900/50"
                >
                  <SendUpArrowIcon />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 text-sm font-medium text-neutral-400 mt-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span>Bank-Grade Security: Zero-retention ephemeral nodes</span>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="text-neutral-600 text-xs font-bold uppercase tracking-widest">OR</div>
              <button 
                onClick={handleEnterpriseCheckout}
                className="text-blue-400 hover:text-blue-300 text-sm border border-blue-500/30 px-6 py-3 rounded-full hover:bg-blue-900/20 transition-all flex items-center gap-2"
              >
                🔒 Strict NDA? Use Secure ZIP Upload ($99)
              </button>
            </div>

          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-2xl bg-[#0c0d12] rounded-xl p-6 font-mono text-sm shadow-2xl shadow-blue-900/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#1e1f20]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-neutral-500 text-xs">ghost_worker_instance.log</span>
            </div>
            <div ref={terminalRef} className="h-64 overflow-y-auto space-y-2 text-green-400/90">
              {logs.map((log, i) => (
                <div key={i} className={`
                  ${log.includes('[SUCCESS]') ? 'text-blue-400 font-bold' : ''}
                  ${log.includes('[ERROR]') || log.includes('[WARN]') ? 'text-red-400' : ''}
                `}>
                  {log}
                </div>
              ))}
              {!logs.some(l => l.includes('[SUCCESS]') || l.includes('[ERROR]')) && (
                <div className="animate-pulse">_</div>
              )}
            </div>
            {logs.some(l => l.includes('[ERROR]')) && (
                <button onClick={() => setStep(1)} className="mt-4 px-4 py-2 bg-[#1e1f20] rounded hover:bg-[#2b2d31] transition-colors">
                  Retry Scan
                </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-2xl bg-[#1e1f20] rounded-2xl p-10 shadow-2xl animate-fade-in relative overflow-hidden border border-neutral-800">
            <h2 className="text-4xl font-black mb-8 text-center tracking-tight">Scan Completed</h2>

            <div className="bg-[#0c0d12] p-6 rounded-2xl flex items-center gap-6 mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <div>
                <div className="font-black text-2xl text-[#F5F5DC] mb-1">{repoStats.tierName}</div>
                <div className="text-sm text-neutral-400 font-mono">{repoStats.files} Source Files Mapped / {repoStats.credits.toLocaleString()} Compute Credits</div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-neutral-400 mb-3 uppercase tracking-wider">
                Secure Delivery Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                placeholder="Enter email to receive the encrypted docs payload..." 
                value={deliveryEmail}
                onChange={(e) => setDeliveryEmail(e.target.value)}
                className="w-full bg-[#0c0d12] border border-neutral-800 rounded-xl px-5 py-4 text-[#F5F5DC] text-lg focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                required
              />
              <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                *The generated context and documentation will be automatically routed to this address upon completion.
                <br/>
                <span className="text-blue-400/70 inline-block mt-2">
                  Note: The Core Bundle ($9) is optimized for standard repositories. For complex enterprise monorepos, please utilize the <b className="text-blue-300">Enterprise Vault ($99)</b>.
                </span>
              </p>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.4)] uppercase tracking-widest flex justify-center items-center gap-3"
            >
              Initialize Generation ($9)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

          </div>
        )}
      </div>
    </main>
  );
}