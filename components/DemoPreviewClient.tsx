<div className="flex flex-wrap gap-2 border-b border-neutral-800/80 pb-3 mb-6">
  {(['readme', 'api', 'security', 'executive'] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2.5 text-xs font-mono rounded-xl transition-colors duration-150 ${
        activeTab === tab
          ? 'bg-neutral-800 text-white border border-neutral-700'
          : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40'
      }`}
    >
      {tab === 'readme' && '📄 README.md'}
      {tab === 'api' && '⚙️ API Contract'}
      {tab === 'security' && '🛡️ SecOps Findings'}
      {tab === 'executive' && '📊 Strategic Summary'}
    </button>
  ))}
</div>