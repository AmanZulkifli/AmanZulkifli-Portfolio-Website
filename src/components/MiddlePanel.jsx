  // MiddlePanel.jsx
  import { useState, useEffect } from 'react';
  import { spotifyPlaylists } from '../data/spotifyPlaylists';

  const folderStructure = {
    root: {
      type: 'folder',
      items: ['Work', 'Spotify Playlists', 'Tetris']
    },
    Work: {
      type: 'folder',
      items: ['About', 'Projects',]
    },
    About: {
      type: 'folder',
      items: ['about_me.pdf', 'experience.pdf', 'tools.pdf']
    },
    Projects: {
      type: 'folder',
      items: ['Project 1', 'Project 2', 'Project 3'],
      protected: true
    },
    Images: {
      type: 'folder',
      items: ['AI Images', 'Unsplash Images']
    },
    // 'AI Images': {
    //   type: 'folder',
    //   items: ['image1.jpg', 'image2.jpg', 'image3.jpg']
    // },
    // 'Unsplash Images': {
    //   type: 'folder',
    //   items: ['photo1.jpg', 'photo2.jpg']
    // },
    'Spotify_Playlists': {
      type: 'folder',
      items: ['Space Out.pdf', 'Air mulai turun kamerad.pdf', 'Berkabut Berdebu.pdf']
    },
      Tetris: {
      type: 'file',
      items: []
    }
  };

  export default function MiddlePanel({ onFileSelect }) {
    const [path, setPath] = useState(['root']);
    const [password, setPassword] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [activeFile, setActiveFile] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const currentFolder = path[path.length - 1];
    const folderData = folderStructure[currentFolder] || { items: [] };

    const navigateToFolder = (folderName) => {
      const formattedName = folderName.replace(/ /g, '_');
      if (folderStructure[formattedName]?.protected) {
        setShowPasswordInput(true);
        setActiveFile(formattedName);
      } else {
        setPath([...path, formattedName]);
        setActiveFile(null);
      }
    };

    const goBack = () => {
      if (path.length > 1) {
        setPath(path.slice(0, -1));
        setShowPasswordInput(false);
        setPasswordError(false);
        setActiveFile(null);
      }
    };

    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('https://joe8lee-portfolio.netlify.app/.netlify/functions/passwordProtectedContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        
        if (response.ok) {
          const projects = await response.json();
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('projectsData', JSON.stringify(projects));
          setPath([...path, activeFile]);
          setShowPasswordInput(false);
          setPassword('');
        } else {
          setPasswordError(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setPasswordError(true);
      }
    };

    const renderBreadcrumbs = () => {
      if (path.length <= 1) return null;

      return (
        <div className="flex items-center my-auto text-sm text-[#5a4a42]">
          {path.map((folder, index) => (
            <span key={index} className="flex items-center">
              <span
                onClick={() => {
                  if (index < path.length - 1) {
                    setPath(path.slice(0, index + 1));
                    setActiveFile(null);
                  }
                }}
                className={`cursor-pointer hover:underline ${
                  index === path.length - 1 ? 'font-bold' : ''
                }`}
              >
                {folder === 'root' ? 'Home' : folder.replace(/_/g, ' ')}
              </span>
              {index < path.length - 1 && (
                <span className="mx-2 text-[#a38b7a]">/</span>
              )}
            </span>
          ))}
        </div>
      );
    };

    const renderViewModeToggle = () => (
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

    const renderGridItems = () => (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {folderData.items.map((item, index) => {
          const formattedName = item.replace(/ /g, '_');
          const isFolder = folderStructure[formattedName]?.type === 'folder';
          const isSpotify = currentFolder === 'Spotify_Playlists';
          const isTetris = formattedName === 'Tetris';
          
          return (
            <div
              key={index}
              onClick={() => {
                  if (isFolder) {
                    navigateToFolder(item);
                  } else if (isTetris) {
                    // Toggle Tetris selection
                    if (activeFile === 'Tetris') {
                      setActiveFile(null);
                      onFileSelect(null);
                    } else {
                      setActiveFile('Tetris');
                      onFileSelect('Tetris');
                    }
                  } else {
                    const cleanedName = formattedName.replace('.pdf', '');
                    const spotify = spotifyPlaylists[cleanedName];
                    setActiveFile(activeFile === formattedName ? null : formattedName);
                    onFileSelect(activeFile === formattedName ? null : (spotify ? spotify : cleanedName));
                  }
                }}
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
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                    <path d="M26 12H6V25C6 25.5523 6.44772 26 7 26H25C25.5523 26 26 25.5523 26 25V12Z" stroke="#e8a87c" strokeWidth="1.5"/>
                    <path d="M6 12L7 7H13L15 4H21L23 7H25C25.5523 7 26 7.44772 26 8V12H6Z" stroke="#e8a87c" strokeWidth="1.5"/>
                  </svg>
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

    const renderListItems = () => (
      <div className="space-y-2">
        {folderData.items.map((item, index) => {
          const formattedName = item.replace(/ /g, '_');
          const isFolder = folderStructure[formattedName]?.type === 'folder';
          const isSpotify = currentFolder === 'Spotify_Playlists';
          const isTetris = formattedName === 'Tetris';

          return (
            <div
              key={index}
              onClick={() => {
                  if (isFolder) {
                    navigateToFolder(item);
                  } else if (isTetris) {
                    // Toggle Tetris selection
                    if (activeFile === 'Tetris') {
                      setActiveFile(null);
                      onFileSelect(null);
                    } else {
                      setActiveFile('Tetris');
                      onFileSelect('Tetris');
                    }
                  } else {
                    const cleanedName = formattedName.replace('.pdf', '');
                    const spotify = spotifyPlaylists[cleanedName];
                    setActiveFile(activeFile === formattedName ? null : formattedName);
                    onFileSelect(activeFile === formattedName ? null : (spotify ? spotify : cleanedName));
                  }
                }}
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

    const renderColumnItems = () => (
      <div className="flex w-full h-full">
        <div className="w-1/3 pr-4 border-r border-dashed border-[#d4b8a8]">
          {folderData.items.map((item, index) => {
            const formattedName = item.replace(/ /g, '_');
            const isFolder = folderStructure[formattedName]?.type === 'folder';
            const isSpotify = currentFolder === 'Spotify_Playlists';
            const isTetris = formattedName === 'Tetris';

            return (
              <div
                key={index}
                onClick={() => {
                  if (isFolder) {
                    navigateToFolder(item);
                  } else if (isTetris) {
                    // Toggle Tetris selection
                    if (activeFile === 'Tetris') {
                      setActiveFile(null);
                      onFileSelect(null);
                    } else {
                      setActiveFile('Tetris');
                      onFileSelect('Tetris');
                    }
                  } else {
                    const cleanedName = formattedName.replace('.pdf', '');
                    const spotify = spotifyPlaylists[cleanedName];
                    setActiveFile(activeFile === formattedName ? null : formattedName);
                    onFileSelect(activeFile === formattedName ? null : (spotify ? spotify : cleanedName));
                  }
                }}
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
                      navigateToFolder(subItem);
                    } else {
                      onFileSelect(subFormattedName);
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

    return (
      <div className="middle-panel p-6 h-full border-x border-dashed border-[#d4b8a8] w-full bg-[#fff5ee] overflow-y-auto">
        <div className="flex justify-between border-b-2 border-dashed border-[#d4b8a8] items-center mb-4">
          <div className="flex-1">
            {renderBreadcrumbs()}
          </div>
          {renderViewModeToggle()}
        </div>

        {showPasswordInput ? (
          <div className="password-prompt p-4 bg-[#f8e0d5] rounded-lg border-2 border-dashed border-[#e8a87c]">
            <h3 className="text-lg font-bold text-[#5a4a42] mb-3">Protected Content</h3>
            <form onSubmit={handlePasswordSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 border-2 border-dashed border-[#d4b8a8] rounded bg-white text-[#5a4a42] focus:outline-none focus:ring-1 focus:ring-[#e8a87c] pixel-corners"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-[#f0d5c4] p-1 rounded"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 8L3 8" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10 5L13 8L10 11" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">Incorrect password. Please try again.</p>
              )}
            </form>
            <button
              onClick={() => {
                setShowPasswordInput(false);
                setPasswordError(false);
                setPassword('');
              }}
              className="text-sm text-[#5a4a42] hover:underline flex items-center"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
                <path d="M9 3L3 9" stroke="#5a4a42" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 3L9 9" stroke="#5a4a42" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Cancel
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && renderGridItems()}
            {viewMode === 'list' && renderListItems()}
            {viewMode === 'column' && renderColumnItems()}
          </>
        )}
      </div>
    );
  }