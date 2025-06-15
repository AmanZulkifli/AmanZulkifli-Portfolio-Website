import { useState, useEffect } from 'react';
import LeftPanel from './components/panels/LeftPanel/LeftPanel';
import MiddlePanel from './components/panels/MiddlePanel/MiddlePanel';
import RightPanel from './components/panels/RightPanel/RightPanel';

export default function App() {
  const [activeFile, setActiveFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState('middle'); // 'left' | 'middle' | 'right'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileSelect = (file) => {
    setActiveFile(file);
    if (isMobile) setCurrentMobileView('right');
  };

  const renderMobilePanel = () => {
    switch (currentMobileView) {
      case 'left': return <LeftPanel />;
      case 'middle': return <MiddlePanel onFileSelect={handleFileSelect} />;
      case 'right': return <RightPanel activeFile={activeFile} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fff5ee]">
      {/* Content */}
      <div className={`flex-1 overflow-hidden relative ${isMobile ? 'pb-16' : ''}`}>
        {!isMobile ? (
          <div className="flex h-full">
            <div className="w-[30%] overflow-auto border-r border-dashed border-[#d4b8a8]">
              <LeftPanel />
            </div>
            <div className="w-[40%] overflow-auto border-r border-dashed border-[#d4b8a8]">
              <MiddlePanel onFileSelect={handleFileSelect} />
            </div>
            <div className="w-[30%] overflow-auto">
              <RightPanel activeFile={activeFile} />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-auto">
            {renderMobilePanel()}
          </div>
        )}
      </div>

      {/* Bottom Navigation (mobile only) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-dashed border-[#d4b8a8] flex justify-around py-2">
          <button
            onClick={() => setCurrentMobileView('left')}
            className={`flex flex-col items-center text-sm ${currentMobileView === 'left' ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <span>🏠</span>
            Home
          </button>
          <button
            onClick={() => setCurrentMobileView('middle')}
            className={`flex flex-col items-center text-sm ${currentMobileView === 'middle' ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <span>📂</span>
            Browse
          </button>
          <button
            onClick={() => setCurrentMobileView('right')}
            disabled={!activeFile}
            className={`flex flex-col items-center text-sm ${currentMobileView === 'right' ? 'text-orange-500' : 'text-gray-400'} ${!activeFile ? 'opacity-50' : ''}`}
          >
            <span>📄</span>
            Details
          </button>
        </nav>
      )}
    </div>
  );
}
