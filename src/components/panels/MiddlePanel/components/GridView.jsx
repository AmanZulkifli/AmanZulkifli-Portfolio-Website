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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const formattedName = item.replace(/ /g, '_');
        const isFolder = folderStructure[formattedName]?.type === 'folder';
        const isSpotify = currentFolder === 'Spotify_Playlists';
        const isTetris = formattedName === 'Tetris';
        
        return (
          <div
            key={index}
            onClick={() => onItemClick(item, isFolder)}
            onMouseEnter={() => setHoveredItem(formattedName)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`p-3 rounded-lg border-2 ${
              activeFile === formattedName 
                ? 'border-[#e8a87c] bg-[#f8e0d5]' 
                : 'border-[#f0d5c4] hover:bg-[#f8e0d5]'
            } cursor-pointer transition-all pixel-corners ${
              hoveredItem === formattedName ? 'transform -translate-y-1 shadow-md' : ''
            }`}
          >
            <div className="flex flex-col items-center">
              {isFolder ? (
                <FolderIcon size={40} />
              ) : isSpotify ? (
                <div className="w-8 h-8 mb-2 relative">
                  <img 
                    src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl} 
                    alt={item} 
                    className="w-full h-full object-cover rounded-full border border-[#e8a87c]"
                  />
                </div>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                  <path d="M21 27H11C9.89543 27 9 26.1046 9 25V7C9 5.89543 9.89543 5 11 5H17.5858C17.851 5 18.1054 5.10536 18.2929 5.29289L22.7071 9.70711C22.8946 9.89464 23 10.149 23 10.4142V25C23 26.1046 22.1046 27 21 27Z" stroke="#e8a87c" strokeWidth="1.5"/>
                </svg>
              )}
              <p className="text-sm text-center truncate w-full text-[#5a4a42]">
                {item.replace(/_/g, ' ')}
              </p>
              {isSpotify && (
                <p className="text-xs text-[#a38b7a] mt-1">
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