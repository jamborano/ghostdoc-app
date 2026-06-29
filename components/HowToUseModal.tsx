'use client';

import React from 'react';
import { LockIcon } from '@/components/Icons';

type HowToUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain">
      <div className="bg-[#1e1f20] border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white text-2xl leading-none transition-colors duration-100"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="mt-6">
          <h3 className="text-xl font-black text-white tracking-tight text-center mb-6">How to Use GhostDoc</h3>

          <div className="space-y-6 text-sm text-neutral-300">
            <div>
              <h4 className="text-base font-bold text-[#4d6cf7] mb-3 text-center">GhostDoc Core ($9)</h4>
              <div className="space-y-3 pl-1">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">1</span>
                  <div>
                    <p className="font-bold text-white text-sm">Paste GitHub URL</p>
                    <p className="text-neutral-400 text-xs">Enter your public GitHub repository URL.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-white text-sm">AI Scans &amp; Maps</p>
                    <p className="text-neutral-400 text-xs">Engine analyzes architecture, dependencies, endpoints. Results: file count + tier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">3</span>
                  <div>
                    <p className="font-bold text-white text-sm">Enter Email &amp; Checkout</p>
                    <p className="text-neutral-400 text-xs">Provide email, click "Initialize Engine". Redirected to Gumroad for $9 payment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">4</span>
                  <div>
                    <p className="font-bold text-white text-sm">Docs in Your Inbox</p>
                    <p className="text-neutral-400 text-xs">Within ~4 minutes: README.md, API_Reference.md, and Light Security Audit — zero‑retention.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800/60"></div>

            <div>
              <h4 className="text-base font-bold text-[#4d6cf7] mb-3 text-center">Enterprise Vault ($99)</h4>
              <div className="space-y-3 pl-1">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">1</span>
                  <div>
                    <p className="font-bold text-white text-sm">Click "Initialize Enterprise"</p>
                    <p className="text-neutral-400 text-xs">Click the Enterprise card's button. Redirected to Gumroad for $99 payment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-white text-sm">Receive Portal Link</p>
                    <p className="text-neutral-400 text-xs">After checkout, receive email from GhostDoc with a secure, one‑time link to Enterprise portal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">3</span>
                  <div>
                    <p className="font-bold text-white text-sm">Upload .zip &amp; Enter Email</p>
                    <p className="text-neutral-400 text-xs">In the portal, upload your proprietary .zip archive and enter your email — NDA compliant.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4d6cf7] text-white font-bold text-[10px] flex items-center justify-center mt-0.5">4</span>
                  <div>
                    <p className="font-bold text-white text-sm">Deep Audit + Docs + Pitch</p>
                    <p className="text-neutral-400 text-xs">Receive README.md, API_Reference.md, Deep DevSecOps Audit (with patches), and Executive Pitch Deck — zero‑retention.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800/60 text-center">
            <p className="text-[10px] text-neutral-500 font-mono flex items-center justify-center gap-1">
              <LockIcon className="w-3 h-3 text-neutral-500" />
              Zeroretention · No data stored · Results delivered to your email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}