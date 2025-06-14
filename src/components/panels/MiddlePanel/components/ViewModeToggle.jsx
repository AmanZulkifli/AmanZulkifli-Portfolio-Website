export default function ViewModeToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex gap-2 my-4">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#f8e0d5]' : 'hover:bg-[#f8e0d5]'} pixel-corners transition-colors`}
        title="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="9" y="1" width="6" height="6" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="1" y="9" width="6" height="6" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="9" y="9" width="6" height="6" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#f8e0d5]' : 'hover:bg-[#f8e0d5]'} pixel-corners transition-colors`}
        title="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="3" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="1" y="6" width="14" height="3" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="1" y="11" width="14" height="3" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
        </svg>
      </button>
      <button
        onClick={() => setViewMode('column')}
        className={`p-2 rounded ${viewMode === 'column' ? 'bg-[#f8e0d5]' : 'hover:bg-[#f8e0d5]'} pixel-corners transition-colors`}
        title="Column view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="4" height="14" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="7" y="1" width="4" height="14" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
          <rect x="13" y="1" width="2" height="14" rx="1" stroke="#e8a87c" strokeWidth="1.5"/>
        </svg>
      </button>
    </div>
  );
}