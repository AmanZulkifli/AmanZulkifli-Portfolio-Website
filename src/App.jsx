// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import LeftPanel from './components/panels/LeftPanel/LeftPanel';
import MiddlePanel from './components/panels/MiddlePanel/MiddlePanel';
import RightPanel from './components/panels/RightPanel/RightPanel';
import RainbowCursor from './components/RainbowCursor'; // Adjust the import path as needed

export default function App() {
  const [activeFile, setActiveFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState('middle');
  const [booting, setBooting] = useState(true);

  // Simulate boot screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Boot screen delay (2.5 seconds)
    const bootTimeout = setTimeout(() => setBooting(false), 2500);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(bootTimeout);
    };
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

  // ⬇️ Booting screen shows first
  if (booting) {
    return (
      <div className="middle-panel bg-[#5a4a42] flex items-center justify-center p-6 h-screen border-x-2 border-[#d4b8a8]">
        <div className="text-center">
          <div className="mb-6 text-3xl text-[#f8e0d5] pixel-font">90s OS</div>
          <div className="w-64 h-4 border-2 border-[#f8e0d5] bg-[#5a4a42] mb-4 mx-auto pixel-corners">
            <div 
              className="h-full bg-[#e8a87c] transition-all duration-2000" 
              style={{ width: booting ? '100%' : '0%' }}
            />
          </div>
          <div className="text-sm text-[#f8e0d5] pixel-font">Loading nostalgic memories...</div>
        </div>
      </div>
    );
  }

  // ⬇️ Normal UI loads after boot
  return (
    <>
      {/* Add RainbowCursor component here */}
      <RainbowCursor 
        length={15}
        size={4}
        trailSpeed={0.2}
        colorCycleSpeed={0.003}
        blur={0.5}
        pulseSpeed={0.01}
        pulseMin={0.8}
        pulseMax={1.2}
      />
      
      <div className="h-screen flex flex-col bg-[#fff5ee] pixel-font">
        {/* Window Title Bar */}
        <div className="bg-[#e8a87c] text-[#5a4a42] p-1 flex justify-between items-center border-b-2 border-[#d4b8a8]">
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
              <rect x="1" y="1" width="14" height="14" rx="1" fill="#5a4a42"/>
              <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
            </svg>
            <span className="font-bold">AMAN ZULKIFLI OS</span>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-hidden relative ${isMobile ? 'pb-12' : ''}`}>
          {!isMobile ? (
            <div className="flex h-full">
              <div className="w-[30%] overflow-auto border-r-2 border-[#d4b8a8]">
                <LeftPanel />
              </div>
              <div className="w-[40%] overflow-auto border-r-2 border-[#d4b8a8]">
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

        {/* Mobile Navigation */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f8e0d5] border-t-2 border-[#d4b8a8] flex justify-around py-1 pixel-corners">
            <button
              onClick={() => setCurrentMobileView('left')}
              className={`flex flex-col items-center text-xs p-1 ${currentMobileView === 'left' ? 'text-[#5a4a42] font-bold' : 'text-[#a38b7a]'}`}
            >
              <span className="text-lg">🏠</span>
              HOME
            </button>
            <button
              onClick={() => setCurrentMobileView('middle')}
              className={`flex flex-col items-center text-xs p-1 ${currentMobileView === 'middle' ? 'text-[#5a4a42] font-bold' : 'text-[#a38b7a]'}`}
            >
              <span className="text-lg">📂</span>
              BROWSE
            </button>
            <button
              onClick={() => setCurrentMobileView('right')}
              disabled={!activeFile}
              className={`flex flex-col items-center text-xs p-1 ${currentMobileView === 'right' ? 'text-[#5a4a42] font-bold' : 'text-[#a38b7a]'} ${!activeFile ? 'opacity-50' : ''}`}
            >
              <span className="text-lg">📄</span>
              DETAILS
            </button>
          </nav>
        )}
      </div>
    </>
  );
}