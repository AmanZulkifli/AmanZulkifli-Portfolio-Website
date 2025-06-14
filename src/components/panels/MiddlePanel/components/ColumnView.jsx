export default function ColumnView({ 
  items, 
  currentFolder, 
  activeFile, 
  onItemClick, 
  folderStructure, 
  spotifyPlaylists 
}) {
  return (
    <div className="flex w-full h-full">
      <div className="w-1/3 pr-4 border-r border-dashed border-[#d4b8a8]">
        {items.map((item, index) => {
          const formattedName = item.replace(/ /g, '_');
          const isFolder = folderStructure[formattedName]?.type === 'folder';
          const isSpotify = currentFolder === 'Spotify_Playlists';
          const isTetris = formattedName === 'Tetris';

          return (
            <div
              key={index}
              onClick={() => onItemClick(item, isFolder)}
              className={`flex items-center p-2 rounded ${
                activeFile === formattedName 
                  ? 'bg-[#f8e0d5]' 
                  : 'hover:bg-[#f8e0d5]'
              } cursor-pointer transition-all pixel-corners`}
            >
              {isFolder ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                  <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" 
                    stroke="#e8a87c" strokeWidth="1.5"/>
                </svg>
              ) : isSpotify ? (
                <div className="w-5 h-5 mr-2 relative">
                  <img 
                    src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl} 
                    alt={item} 
                    className="w-full h-full object-cover rounded-full border border-[#e8a87c]"
                  />
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                  <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" 
                    stroke="#e8a87c" strokeWidth="1.5"/>
                </svg>
              )}
              <p className="text-sm text-[#5a4a42] truncate">{item.replace(/_/g, ' ')}</p>
            </div>
          );
        })}
      </div>

      {activeFile && folderStructure[activeFile] && (
        <div className="w-2/3 pl-4">
          {folderStructure[activeFile].items.map((subItem, index) => {
            const subFormattedName = subItem.replace(/ /g, '_');
            const isSubFolder = folderStructure[subFormattedName]?.type === 'folder';
            return (
              <div
                key={index}
                onClick={() => {
                  if (isSubFolder) {
                    onItemClick(subItem, true);
                  } else {
                    onItemClick(subItem, false);
                  }
                }}
                className="flex items-center p-2 hover:bg-[#f8e0d5] cursor-pointer transition-all pixel-corners"
              >
                {isSubFolder ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                    <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" 
                      stroke="#e8a87c" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                    <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" 
                      stroke="#e8a87c" strokeWidth="1.5"/>
                  </svg>
                )}
                <p className="text-sm text-[#5a4a42] truncate">{subItem}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}