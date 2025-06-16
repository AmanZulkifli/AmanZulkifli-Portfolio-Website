import { useState, useEffect } from 'react';
import { spotifyPlaylists } from '../../../data/spotifyPlaylists';
import TetrisGame from './components/TetrisGame/TetrisGame';
import SpotifyPlaylist from './components/SpotifyPlaylist';
import ProjectView from './components/ProjectView';
import AboutView from './components/AboutView';
import ExperienceView from './components/ExperienceView';
import ToolsView from './components/ToolsView';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function RightPanel({ activeFile }) {
  const [activeTab, setActiveTab] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isGlitch, setIsGlitch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('projectsData');
    if (stored) setProjects(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!activeFile) {
      setActiveTab(null);
      setSelectedItem(null);
      return;
    }

    setIsLoading(true);

    if (typeof activeFile === 'string') {
      const lower = activeFile.toLowerCase().replace(/_/g, ' ');

      if (lower.includes('about')) {
        setActiveTab('about');
        setSelectedItem(null);
      }
      else if (lower.includes('experience')) {
        setActiveTab('experience');
        setSelectedItem(null);
      }
      else if (lower.includes('tools')) {
        setActiveTab('tools');
        setSelectedItem(null);
      }
      else if (lower.includes('project')) {
        const index = parseInt(activeFile.replace(/\D/g, ''), 10) - 1;
        if (!isNaN(index)) {
          setIsGlitch(true);
          setTimeout(() => setIsGlitch(false), 1000);
          if (projects[index]) {
            setSelectedItem({ type: 'project', data: projects[index] });
            setActiveTab(null);
          }
        }
      }
      else if (activeFile === 'Tetris') {
        setSelectedItem({ type: 'tetris', data: null });
        setActiveTab(null);
      }
    } else if (activeFile?.title) {
      setSelectedItem({ type: 'spotify', data: activeFile });
      setActiveTab(null);
    }

    setIsLoading(false);
  }, [activeFile, projects]);

  const handleReturnToMenu = () => {
    setSelectedItem(null);
    setActiveTab(null);
  };

  return (
    <div className={`right-panel h-full w-full p-4 bg-[#f0d5c4] overflow-y-auto border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] ${isGlitch ? 'glitch-effect' : ''}`}>
      {isLoading ? (
        <LoadingState />
      ) : !activeFile ? (
        <EmptyState />
      ) : selectedItem ? (
        selectedItem.type === 'spotify' ? (
          <SpotifyPlaylist playlist={selectedItem.data} />
        ) : selectedItem.type === 'project' ? (
          <ProjectView project={selectedItem.data} />
        ) : selectedItem.type === 'tetris' ? (
          <TetrisGame isMobile={isMobile} onReturnToMenu={handleReturnToMenu} />
        ) : null
      ) : (
        <>
          {activeTab === 'about' && <AboutView />}
          {activeTab === 'experience' && <ExperienceView />}
          {activeTab === 'tools' && <ToolsView />}
        </>
      )}
    </div>
  );
}