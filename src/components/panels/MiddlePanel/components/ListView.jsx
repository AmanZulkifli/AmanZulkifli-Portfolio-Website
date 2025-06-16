export default function ListView({ 
  items, 
  currentFolder, 
  activeFile, 
  onItemClick, 
  folderStructure, 
  spotifyPlaylists, 
  hoveredItem, 
  setHoveredItem 
}) {
  return (
    <div className="space-y-1 p-2 bg-[#f0d5c4] pixel-corners">
      {items.map((item, index) => {
        const formattedName = item.replace(/ /g, '_');
        const isFolder = folderStructure[formattedName]?.type === 'folder';
        const isSpotify = currentFolder === 'Spotify_Playlists';

        return (
          <div
            key={index}
            onClick={() => onItemClick(item, isFolder)}
            onMouseEnter={() => setHoveredItem(formattedName)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-center p-2 rounded-sm border-2 ${
              activeFile === formattedName 
                ? 'border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] bg-[#f8e0d5]' 
                : 'border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee] hover:bg-[#f8e0d5]'
            } cursor-pointer transition-all pixel-corners ${
              hoveredItem === formattedName ? 'translate-x-1 shadow-retro' : ''
            }`}
          >
            {isFolder ? (
              <svg width="24" height="24" viewBox="0 0 24 24" className="mr-3">
                <rect 
                  x="2" 
                  y="4" 
                  width="20" 
                  height="16" 
                  rx="1" 
                  fill="#f8e0d5"
                  stroke="#e8a87c"
                  strokeWidth="2"
                />
                <rect 
                  x="4" 
                  y="6" 
                  width="12" 
                  height="3" 
                  fill="#e8a87c"
                />
              </svg>
            ) : isSpotify ? (
              <div className="w-6 h-6 mr-3 relative pixel-corners">
                <img 
                  src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl} 
                  alt={item} 
                  className="w-full h-full object-cover pixel-corners border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8]"
                />
              </div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" className="mr-3">
                <rect 
                  x="4" 
                  y="4" 
                  width="16" 
                  height="16" 
                  rx="1" 
                  fill="#f8e0d5"
                  stroke="#e8a87c"
                  strokeWidth="2"
                />
                <rect 
                  x="6" 
                  y="6" 
                  width="12" 
                  height="3" 
                  fill="#e8a87c"
                />
              </svg>
            )}
            <div className="flex-1">
              <p className="text-sm text-[#5a4a42] pixel-font">{item.replace(/_/g, ' ')}</p>
              {isSpotify && (
                <p className="text-xs text-[#a38b7a] pixel-font">
                  {spotifyPlaylists[formattedName.replace('.pdf', '')]?.trackCount} tracks
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}