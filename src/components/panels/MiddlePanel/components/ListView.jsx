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
    <div className="space-y-2">
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
            className={`flex items-center p-3 rounded-lg ${
              activeFile === formattedName 
                ? 'bg-[#f8e0d5]' 
                : 'hover:bg-[#f8e0d5]'
            } cursor-pointer transition-all pixel-corners ${
              hoveredItem === formattedName ? 'translate-x-1 shadow-sm' : ''
            }`}
          >
            {isFolder ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-3">
                <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" 
                  stroke="#e8a87c" strokeWidth="1.5"/>
              </svg>
            ) : isSpotify ? (
              <div className="w-6 h-6 mr-3 relative">
                <img 
                  src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl} 
                  alt={item} 
                  className="w-full h-full object-cover rounded-full border border-[#e8a87c]"
                />
              </div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-3">
                <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" 
                  stroke="#e8a87c" strokeWidth="1.5"/>
              </svg>
            )}
            <div className="flex-1">
              <p className="text-sm text-[#5a4a42]">{item.replace(/_/g, ' ')}</p>
              {isSpotify && (
                <p className="text-xs text-[#a38b7a]">
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