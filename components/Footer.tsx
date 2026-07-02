import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-8 text-center text-xs text-neutral-500 bg-[#0c0d12]">
      <div className="max-w-4xl mx-auto">
        <p>&copy; {new Date().getFullYear()} GhostDoc — Jamborano Tech Studio. All rights reserved.</p>
        <p className="mt-1 text-neutral-600 font-medium tracking-wide">
          Zero Retention. Zero Compromise.
        </p>
        <p className="text-neutral-600 font-medium tracking-wide">
          Enterprise Grade Documentation.
        </p>
      </div>
    </footer>
  );
}