import { useState, useEffect } from 'react';

// MiddlePanel.jsx
const folderStructure = {
  root: {
    type: 'folder',
    items: ['Work', 'Spotify Playlists', 'Tetris']
  },
  Work: {
    type: 'folder',
    items: ['About', 'Projects', 'Images']
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
  'AI Images': {
    type: 'folder',
    items: ['image1.jpg', 'image2.jpg', 'image3.jpg']
  },
  'Unsplash Images': {
    type: 'folder',
    items: ['photo1.jpg', 'photo2.jpg']
  },
  'Spotify Playlists': {
    type: 'file',
    items: ['Creative Coding']
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
        setPath([...path, currentFolder]);
        setShowPasswordInput(false);
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError(true);
    }
  };

const renderBackButton = () => {
  if (path.length <= 1) return null;

  return (
    <div className="flex items-center my-4 text-sm text-[#5a4a42]">
      {path.map((folder, index) => (
        <span key={index} className="flex items-center">
          <span
            onClick={() => setPath(path.slice(0, index + 1))}
            className={`cursor-pointer hover:underline ${
              index === path.length - 1 ? 'font-bold' : ''
            }`}
          >
            {folder === 'root' ? '< ' : folder}
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
    <div className="flex justify-center my-4">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-1 rounded ${viewMode === 'grid' ? 'bg-transparent' : 'hover:bg-[#f8e0d5]'} pixel-corners`}
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
        className={`p-1 rounded ${viewMode === 'list' ? 'bg-transparent' : 'hover:bg-[#f8e0d5]'} pixel-corners`}
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
        className={`p-1 rounded ${viewMode === 'column' ? 'bg-[#fff5fe]' : 'hover:bg-[#f8e0d5]'} pixel-corners`}
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
        return (
          <div
            key={index}
            onClick={() => {
              if (isFolder) {
                navigateToFolder(item);
              } else {
                setActiveFile(formattedName);
                onFileSelect(formattedName);
              }
            }}
            onMouseEnter={() => setHoveredItem(formattedName)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`p-3 rounded-lg border-2 ${activeFile === formattedName ? 'border-[#e8a87c] bg-[#f8e0d5]' : 'border-[#f0d5c4] hover:bg-[#f8e0d5]'} cursor-pointer transition-all pixel-corners ${hoveredItem === formattedName ? 'translate-y-[-4px] shadow-lg' : ''}`}
          >
            <div className="flex flex-col items-center">
              {isFolder ? (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                  <path d="M26 12H6V25C6 25.5523 6.44772 26 7 26H25C25.5523 26 26 25.5523 26 25V12Z" stroke="#e8a87c" strokeWidth="1.5"/>
                  <path d="M6 12L7 7H13L15 4H21L23 7H25C25.5523 7 26 7.44772 26 8V12H6Z" stroke="#e8a87c" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2">
                  <path d="M21 27H11C9.89543 27 9 26.1046 9 25V7C9 5.89543 9.89543 5 11 5H17.5858C17.851 5 18.1054 5.10536 18.2929 5.29289L22.7071 9.70711C22.8946 9.89464 23 10.149 23 10.4142V25C23 26.1046 22.1046 27 21 27Z" stroke="#e8a87c" strokeWidth="1.5"/>
                </svg>
              )}
              <p className="text-sm text-center truncate w-full text-[#5a4a42]">{item}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

const renderListItems = () => {
  const renderFolder = (folderName, level = 0) => {
    const formattedName = folderName.replace(/ /g, '_');
    const isOpen = currentFolder === formattedName;
    const children = folderStructure[formattedName]?.items || [];

    return (
      <div key={formattedName} className="ml-[calc(1rem*level)]">
        <div
          onClick={() => {
            setPath([...path.slice(0, level), formattedName]);
            setActiveFile(null);
            onFileSelect(null);
          }}
          className="flex items-center gap-1 text-[#5a4a42] text-sm cursor-pointer hover:bg-[#f8e0d5] px-2 py-1 rounded transition-all pixel-corners"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" stroke="#e8a87c" strokeWidth="1.5" />
          </svg>
          {folderName}
        </div>

        {isOpen && (
          <div className="ml-4">
            {children.map((child) => {
              const childFormatted = child.replace(/ /g, '_');
              if (folderStructure[childFormatted]?.type === 'folder') {
                return renderFolder(child, level + 1);
              }
              return (
                <div
                  key={child}
                  className="flex items-center gap-2 text-sm text-[#5a4a42] ml-4 cursor-pointer hover:bg-[#f8e0d5] px-2 py-1 rounded transition pixel-corners"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" stroke="#d4b8a8" strokeWidth="1.5" />
                  </svg>
                  {child}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderColumnItems = () => (
    <div className="flex w-full gap-6">
      {/* First column: folders in currentFolder */}
      <div className="w-1/2 border-r-2 border-dashed border-[#d4b8a8] pr-4">
        {folderData.items.map((item, index) => {
          const formattedName = item.replace(/ /g, '_');
          const isFolder = folderStructure[formattedName]?.type === 'folder';
          return (
            <div
              key={index}
              onClick={() => {
                if (isFolder) {
                  setActiveFile(formattedName);
                }
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-[#f8e0d5] px-2 py-1 rounded transition pixel-corners text-sm text-[#5a4a42]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" stroke="#e8a87c" strokeWidth="1.5"/>
              </svg>
              {item}
            </div>
          );
        })}
      </div>

      {/* Second column: subfolders of selected folder */}
      {activeFile && folderStructure[activeFile]?.items && (
        <div className="w-1/2">
          {folderStructure[activeFile].items.map((subItem, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer hover:bg-[#f8e0d5] px-2 py-1 rounded transition pixel-corners text-sm text-[#5a4a42]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 19V8C22 7.44772 21.5523 7 21 7H13L11 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z" stroke="#e8a87c" strokeWidth="1.5"/>
              </svg>
              {subItem}
            </div>
          ))}
        </div>
      )}
    </div>
  )};


  return (
<div className="middle-panel p-6 h-full border-x-2 border-dashed border-[#d4b8a8] w-full bg-[#fff5ee] overflow-y-auto">
        <div className="flex justify-between border-y-2 border-dashed border-[#d4b8a8] items-start mb-4">
        {path.length > 1 ? (
          <>
            {renderBackButton()}
            <div className="ml-auto">{renderViewModeToggle()}</div>
          </>
        ) : (
          <div className="ml-auto">{renderViewModeToggle()}</div>
        )}
      </div>

      {showPasswordInput ? (
        <div className="password-prompt">
          <form onSubmit={handlePasswordSubmit} className="mb-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 border-2 border-dashed border-[#d4b8a8] rounded bg-[#f8e0d5] text-[#5a4a42] focus:outline-none focus:ring-1 focus:ring-[#e8a87c] pixel-corners"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8L3 8" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 5L13 8L10 11" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-[#c38d9e] mt-1">Incorrect password. Please try again.</p>
            )}
          </form>
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#f8e0d5] rounded-full flex items-center justify-center border-4 border-[#e8a87c] animate-pulse">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="10" width="18" height="11" rx="2" stroke="#e8a87c" strokeWidth="1.5"/>
                <path d="M7 10V6C7 4.34315 8.34315 3 10 3H14C15.6569 3 17 4.34315 17 6V10" stroke="#e8a87c" strokeWidth="1.5"/>
                <circle cx="12" cy="15" r="1" fill="#e8a87c"/>
              </svg>
            </div>
          </div>
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

