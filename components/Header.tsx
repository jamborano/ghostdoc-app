import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 w-full p-6 flex justify-between items-center z-40 bg-[#0d1117]">
      <Link href="/" className="flex items-center gap-3 cursor-pointer group" aria-label="GhostDoc Home">
        <div className="relative w-8 h-8 transition-transform duration-0 group-hover:scale-110">
          <Image 
            src="/logo.svg"
            alt="GhostDoc Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="font-black text-2xl tracking-tighter">
          <span>Ghost</span><span className="text-[#0366d6]">Doc</span>
        </div>
      </Link>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0366d6]/10 border border-[#0366d6]/20">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-xs font-bold text-[#0366d6] tracking-wider">API OPERATIONAL</span>
      </div>
    </header>
  );
}