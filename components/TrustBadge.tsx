export default function TrustBadge() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">🔒 Zero-retention</span>
        <span className="flex items-center gap-1">⚡ ~4 min average</span>
        <span className="flex items-center gap-1">🏆 4.9/5 (127 reviews)</span>
        <span className="flex items-center gap-1">🛡️ SOC2 compliant</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 font-mono">
        <span className="bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">👨‍💻 Indie devs</span>
        <span className="bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">🏢 Engineering teams</span>
        <span className="bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">🔐 Security‑conscious CTOs</span>
      </div>
    </div>
  );
}