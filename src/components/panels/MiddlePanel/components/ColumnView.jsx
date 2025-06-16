import { useState, useEffect } from 'react';

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <rect 
        x="1" 
        y="3" 
        width="18" 
        height="14" 
        rx="1" 
        fill="#f8e0d5"
        stroke="#e8a87c"
        strokeWidth="1.5"
      />
      <rect 
        x="3" 
        y="5" 
        width="10" 
        height="2" 
        fill="#e8a87c"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <rect 
        x="3" 
        y="3" 
        width="14" 
        height="14" 
        rx="1" 
        fill="#f8e0d5"
        stroke="#e8a87c"
        strokeWidth="1.5"
      />
      <rect 
        x="5" 
        y="5" 
        width="10" 
        height="2" 
        fill="#e8a87c"
      />
    </svg>
  );
}

export default function ColumnView({ 
  items, 
  folderStructure, 
  spotifyPlaylists,
  currentFolder,
  onFileSelect,
  onNavigateToFolder,
  path,
  setPath
}) {
  const [activeColumns, setActiveColumns] = useState([]);

  useEffect(() => {
    const buildColumns = () => {
      const columns = [];
      let currentItems = items;
      let currentPath = ['root'];

      columns.push({ path: currentPath, items: currentItems });

      for (const folder of path.slice(1)) {
        const formattedName = folder.replace(/ /g, '_');
        if (folderStructure[formattedName]?.items) {
          currentPath = [...currentPath, formattedName];
          currentItems = folderStructure[formattedName].items;
          columns.push({ path: currentPath, items: currentItems });
        } else {
          break;
        }
      }

      setActiveColumns(columns);
    };

    buildColumns();
  }, [path, items, folderStructure]);

  const handleItemClick = (item, columnIndex) => {
    const formattedName = item.replace(/ /g, '_');
    const isFolder = folderStructure[formattedName]?.type === 'folder';

    if (isFolder) {
      const newPath = path.slice(0, columnIndex + 1).concat(formattedName);
      setPath(newPath);
      onNavigateToFolder(item);
    } else {
      const cleanedName = formattedName.replace('.pdf', '');
      const spotify = spotifyPlaylists[cleanedName];
      onFileSelect(spotify || cleanedName);
    }
  };

  const renderColumn = (column, columnIndex) => {
    const isLastColumn = columnIndex === activeColumns.length - 1;

    return (
      <div 
        key={columnIndex}
        className={`w-64 flex-shrink-0 border-r-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] flex flex-col h-full bg-[#f0d5c4]`}
      >
        <div 
          className="p-2 text-sm font-medium text-[#5a4a42] cursor-pointer hover:bg-[#f8e0d5] border-b-2 border-[#d4b8a8] pixel-font flex items-center gap-2"
          onClick={() => setPath(column.path)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#e8a87c"/>
          </svg>
          {column.path[column.path.length - 1] === 'root' ? 'Home' : 
           column.path[column.path.length - 1].replace(/_/g, ' ')}
        </div>
        
        <div className="flex-1 overflow-y-auto p-1">
          {column.items.map((item, index) => {
            const formattedName = item.replace(/ /g, '_');
            const isFolder = folderStructure[formattedName]?.type === 'folder';
            const isSpotify = column.path.includes('Spotify_Playlists');
            const isActive = isLastColumn && path[path.length - 1] === formattedName;

            return (
              <div
                key={index}
                onClick={() => handleItemClick(item, columnIndex)}
                className={`flex items-center gap-2 p-2 rounded-sm border-2 ${
                  isActive 
                    ? 'border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] bg-[#f8e0d5]' 
                    : 'border-t-[#d4b8a8] border-l-[#d4b8a8] border-r-[#fff5ee] border-b-[#fff5ee] hover:bg-[#f8e0d5]'
                } cursor-pointer transition-all pixel-corners`}
              >
                {isFolder ? (
                  <FolderIcon />
                ) : isSpotify ? (
                  <div className="w-5 h-5 flex-shrink-0 pixel-corners">
                    <img
                      src={spotifyPlaylists[formattedName.replace('.pdf', '')]?.imageUrl}
                      alt={item}
                      className="w-full h-full object-cover pixel-corners border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8]"
                    />
                  </div>
                ) : (
                  <FileIcon />
                )}
                <p className="text-sm text-[#5a4a42] truncate pixel-font">
                  {item.replace(/_/g, ' ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full overflow-x-auto bg-[#f0d5c4] p-1 pixel-corners">
      {activeColumns.map(renderColumn)}
    </div>
  );
}