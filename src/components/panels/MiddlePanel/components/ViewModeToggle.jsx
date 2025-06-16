export default function ViewModeToggle({ viewMode, setViewMode }) {
  const buttonStyle = (mode) =>
    `p-1 w-8 h-8 flex items-center justify-center ${
      viewMode === mode
        ? 'bg-[#f8e0d5] border-t-2 border-l-2 border-r-2 border-b-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8]'
        : 'hover:bg-[#f8e0d5] border-t-2 border-l-2 border-r-2 border-b-2 border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee]'
    } pixel-corners`;

  return (
    <div className="flex gap-1 bg-[#f0d5c4] p-1 pixel-corners border-2 border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee]">
      {/* Grid */}
      <button onClick={() => setViewMode('grid')} className={buttonStyle('grid')} title="Grid view">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="9" y="1" width="6" height="6" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="1" y="9" width="6" height="6" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="9" y="9" width="6" height="6" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
        </svg>
      </button>

      {/* List */}
      <button onClick={() => setViewMode('list')} className={buttonStyle('list')} title="List view">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="3" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="1" y="6" width="14" height="3" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="1" y="11" width="14" height="3" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
        </svg>
      </button>

      {/* Column */}
      <button onClick={() => setViewMode('column')} className={buttonStyle('column')} title="Column view">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="4" height="14" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="7" y="1" width="4" height="14" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
          <rect x="13" y="1" width="2" height="14" rx="1" stroke="#333" strokeWidth="1.5"  fill="#e8a87c" />
        </svg>
      </button>
    </div>
  );
}
