import FolderIcon from './FolderIcon';

export default function GridView({ 
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2 bg-[#f0d5c4] pixel-corners">
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
            className={`p-2 rounded-sm border-2 ${
              activeFile === formattedName 
                ? 'border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] bg-[#f8e0d5]' 
                : 'border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee] hover:bg-[#f8e0d5]'
            } cursor-pointer transition-all pixel-corners ${
              hoveredItem === formattedName ? 'transform -translate-y-0.5 shadow-retro' : ''
            }`}
          >
            <div className="flex flex-col items-center p-1">
              {isFolder ? (
                <FolderIcon size={40} />
              ) : isSpotify ? (
                <div className="w-10 h-10 mb-2 relative pixel-corners">
                  <img 
                    src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl} 
                    alt={item} 
                    className="w-full h-full object-cover pixel-corners border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8]"
                  />
                </div>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" className="mb-2">
                  <rect 
                    x="5" 
                    y="5" 
                    width="22" 
                    height="22" 
                    rx="1" 
                    fill="#f8e0d5"
                    stroke="#e8a87c"
                    strokeWidth="2"
                  />
                  <rect 
                    x="8" 
                    y="8" 
                    width="16" 
                    height="4" 
                    fill="#e8a87c"
                  />
                </svg>
              )}
              <p className="text-sm text-center truncate w-full text-[#5a4a42] pixel-font">
                {item.replace(/_/g, ' ')}
              </p>
              {isSpotify && (
                <p className="text-xs text-[#a38b7a] mt-1 pixel-font">
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