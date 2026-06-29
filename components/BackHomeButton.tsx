'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BackHomeButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="fixed bottom-6 left-6 z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        href="/"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-[#4d6cf7]/80 border border-neutral-700/50 transition-all duration-200 shadow-lg backdrop-blur-sm"
        aria-label="Back to Home"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5 text-neutral-300"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800/90 text-white text-xs rounded-md whitespace-nowrap border border-neutral-700/50 backdrop-blur-sm">
          Back to Home
        </div>
      )}
    </div>
  );
}