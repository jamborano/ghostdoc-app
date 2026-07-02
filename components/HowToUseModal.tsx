'use client';

import React from 'react';

type HowToUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-[#1e1f20] border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-neutral-400 hover:text-white text-2xl">✕</button>
        <h3 className="text-xl font-black text-white text-center mb-6">How to Use GhostDoc</h3>
        <div className="space-y-6 text-sm text-neutral-300">
          <div>
            <h4 className="text-base font-bold text-[#4d6cf7] mb-3 text-center">GhostDoc Core ($9)</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">1</span><div><p className="font-bold text-white">Paste GitHub URL</p><p className="text-neutral-400 text-xs">Enter your public GitHub repository URL.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">2</span><div><p className="font-bold text-white">AI Scans &amp; Maps</p><p className="text-neutral-400 text-xs">Engine analyzes architecture.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">3</span><div><p className="font-bold text-white">Enter Email &amp; Checkout</p><p className="text-neutral-400 text-xs">$9 payment via Gumroad.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">4</span><div><p className="font-bold text-white">Docs in Your Inbox</p><p className="text-neutral-400 text-xs">Within ~4 minutes.</p></div></div>
            </div>
          </div>
          <div className="border-t border-neutral-800/60"></div>
          <div>
            <h4 className="text-base font-bold text-[#4d6cf7] mb-3 text-center">Enterprise Vault ($99)</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">1</span><div><p className="font-bold text-white">Click &quot;Initialize Enterprise&quot;</p><p className="text-neutral-400 text-xs">$99 payment via Gumroad.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">2</span><div><p className="font-bold text-white">Receive Portal Link</p><p className="text-neutral-400 text-xs">One‑time secure link.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">3</span><div><p className="font-bold text-white">Upload .zip &amp; Enter Email</p><p className="text-neutral-400 text-xs">Proprietary archive.</p></div></div>
              <div className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-xs flex items-center justify-center">4</span><div><p className="font-bold text-white">Deep Audit + Docs + Pitch</p><p className="text-neutral-400 text-xs">Full package.</p></div></div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-neutral-800/60 text-center">
          <p className="text-[10px] text-neutral-500">Zero-retention · No data stored</p>
        </div>
      </div>
    </div>
  );
}