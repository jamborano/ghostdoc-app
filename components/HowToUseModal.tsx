'use client';

import React from 'react';

type HowToUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl leading-none transition-colors duration-0"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-[#e6edf3] tracking-tight text-center mb-2">
          How to Use GhostDoc
        </h3>
        <p className="text-sm text-neutral-400 text-center mb-8 font-mono">
          Two engines. One mission. Zero retention.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#0d1117] p-5 rounded-xl border border-[#30363d]">
            <h4 className="text-lg font-bold text-[#58a6ff] text-center mb-4">
              GhostDoc Core
              <span className="block text-sm font-mono text-neutral-400">$9</span>
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">1</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Paste GitHub URL</p>
                  <p className="text-neutral-400 text-xs">Enter your public GitHub repo URL.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">2</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">AI Scans &amp; Maps</p>
                  <p className="text-neutral-400 text-xs">Architecture, dependencies, endpoints analyzed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">3</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Email &amp; Checkout</p>
                  <p className="text-neutral-400 text-xs">Enter email → $9 via Gumroad.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">4</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Docs in Inbox</p>
                  <p className="text-neutral-400 text-xs">README + API + Light Security Audit (~4 min).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] p-5 rounded-xl border border-[#58a6ff]/20">
            <h4 className="text-lg font-bold text-[#58a6ff] text-center mb-4">
              Enterprise Vault
              <span className="block text-sm font-mono text-neutral-400">$99</span>
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">1</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Initialize Enterprise</p>
                  <p className="text-neutral-400 text-xs">Click Enterprise card → $99 via Gumroad.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">2</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Portal Link via Email</p>
                  <p className="text-neutral-400 text-xs">One‑time secure link to upload .zip.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">3</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Upload .zip + Email</p>
                  <p className="text-neutral-400 text-xs">NDA compliant. No public exposure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#58a6ff] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">4</span>
                <div>
                  <p className="font-bold text-[#e6edf3]">Deep Audit + Docs + Pitch</p>
                  <p className="text-neutral-400 text-xs">Full DevSecOps audit + Executive Pitch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#30363d] text-center">
          <p className="text-[10px] text-neutral-500 font-mono">
            Zero-retention · No data stored · Results delivered to your email
          </p>
        </div>
      </div>
    </div>
  );
}