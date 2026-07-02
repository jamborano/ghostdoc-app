'use client';

import Link from 'next/link';

export default function BackHomeButton() {
  return (
    <Link
      href="/"
      prefetch={true}
      className="fixed bottom-6 left-6 z-50 p-3 bg-[#1e1f20] border border-neutral-800 rounded-full hover:bg-[#2a2b2e] transition-colors duration-0 shadow-lg"
      aria-label="Back to Home"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-neutral-400 hover:text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </Link>
  );
}