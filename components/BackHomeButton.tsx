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
      {/* ICON RUMAH MONOCHROME */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-neutral-400 hover:text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    </Link>
  );
}