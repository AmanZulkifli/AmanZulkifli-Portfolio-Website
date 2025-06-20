import { useState, useEffect } from 'react';
import { folderStructure } from '../../../data/folderStructure';
import { spotifyPlaylists } from '../../../data/spotifyPlaylists';
import Breadcrumbs from './components/BreadCrumbs';
import ViewModeToggle from './components/ViewModeToggle';
import GridView from './components/GridView';
import ListView from './components/ListView';
import ColumnView from './components/ColumnView';
import PasswordPrompt from './PasswordPrompt';

export default function MiddlePanel({ onFileSelect }) {
  const [path, setPath] = useState(['root']);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFile, setActiveFile] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="middle-panel bg-[#f0d5c4] p-0 h-full border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
      
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 bg-[#f0d5c4] border-b-2 border-[#d4b8a8]">
        <Breadcrumbs path={path} setPath={setPath} setActiveFile={setActiveFile} />
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Main content */}
      <div className="p-2 h-[calc(100%-80px)] overflow-auto">
        {showPasswordInput ? (
          <PasswordPrompt 
            password={password}
            setPassword={setPassword}
            onSubmit={handlePasswordSubmit}
            onCancel={() => {
              setShowPasswordInput(false);
              setPasswordError(false);
              setPassword('');
            }}
            error={passwordError}
          />
        ) : (
          <>
            {viewMode === 'grid' && (
              <GridView 
                items={folderData.items} 
                currentFolder={currentFolder}
                activeFile={activeFile}
                onItemClick={(item, isFolder) => {
                  if (isFolder) {
                    navigateToFolder(item);
                  } else {
                    const formattedName = item.replace(/ /g, '_');
                    const isTetris = formattedName === 'Tetris';
                    
                    if (isTetris) {
                      setActiveFile(activeFile === 'Tetris' ? null : 'Tetris');
                      onFileSelect(activeFile === 'Tetris' ? null : 'Tetris');
                    } else {
                      const cleanedName = formattedName.replace('.pdf', '');
                      const spotify = spotifyPlaylists[cleanedName];
                      setActiveFile(activeFile === formattedName ? null : formattedName);
                      onFileSelect(activeFile === formattedName ? null : (spotify ? spotify : cleanedName));
                    }
                  }
                }}
                folderStructure={folderStructure}
                spotifyPlaylists={spotifyPlaylists}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />
            )}
            {viewMode === 'list' && (
              <ListView 
                items={folderData.items}
                currentFolder={currentFolder}
                activeFile={activeFile}
                onItemClick={(item, isFolder) => {
                  if (isFolder) {
                    navigateToFolder(item);
                  } else {
                    const formattedName = item.replace(/ /g, '_');
                    const isTetris = formattedName === 'Tetris';
                    
                    if (isTetris) {
                      setActiveFile(activeFile === 'Tetris' ? null : 'Tetris');
                      onFileSelect(activeFile === 'Tetris' ? null : 'Tetris');
                    } else {
                      const cleanedName = formattedName.replace('.pdf', '');
                      const spotify = spotifyPlaylists[cleanedName];
                      setActiveFile(activeFile === formattedName ? null : formattedName);
                      onFileSelect(activeFile === formattedName ? null : (spotify ? spotify : cleanedName));
                    }
                  }
                }}
                folderStructure={folderStructure}
                spotifyPlaylists={spotifyPlaylists}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />
            )}
            {viewMode === 'column' && (
              <ColumnView 
                items={folderStructure['root']?.items || []}
                currentFolder={currentFolder}
                folderStructure={folderStructure}
                spotifyPlaylists={spotifyPlaylists}
                path={path}
                setPath={setPath}
                onFileSelect={(file) => {
                  setActiveFile(file);
                  onFileSelect(file);
                }}
                onNavigateToFolder={(item) => {
                  const formattedName = item.replace(/ /g, '_');
                  if (folderStructure[formattedName]?.protected) {
                    setShowPasswordInput(true);
                    setActiveFile(formattedName);
                  } else {
                    setActiveFile(null);
                  }
                }}
              />
            )}
          </>
        )}
      </div>
      
    </div>
  );
}