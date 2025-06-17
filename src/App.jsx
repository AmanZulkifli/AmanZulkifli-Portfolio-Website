// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import LeftPanel from './components/panels/LeftPanel/LeftPanel';
import MiddlePanel from './components/panels/MiddlePanel/MiddlePanel';
import RightPanel from './components/panels/RightPanel/RightPanel';
// import RainbowCursor from './components/RainbowCursor';

export default function App() {
  const [activeFile, setActiveFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState('middle');
  const [booting, setBooting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const bgAudioRef = useRef(null);
  const sfxAudioRef = useRef(null);

  // Track mouse position for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulate boot screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Initialize audio
    bgAudioRef.current = new Audio('/Italy.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.1;
    sfxAudioRef.current = new Audio('/SFX.mp3');
    
    // Try to play background audio
    const playBgAudio = () => {
      if (bgAudioRef.current && !isMuted) {
        bgAudioRef.current.play().catch(error => {
          console.log('Background audio playback failed:', error);
        });
      }
    };
    
    // Boot screen delay (2.5 seconds)
    const bootTimeout = setTimeout(() => {
      setBooting(false);
      playBgAudio();
    }, 2500);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(bootTimeout);
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current = null;
      }
    };
  }, [isMuted]);

  const toggleMute = () => {
    if (bgAudioRef.current) {
      if (isMuted) {
        bgAudioRef.current.play();
      } else {
        bgAudioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  };

  const playClickSound = () => {
    if (!isMuted && sfxAudioRef.current) {
      sfxAudioRef.current.currentTime = 0;
      sfxAudioRef.current.play().catch(error => {
        console.log('SFX playback failed:', error);
      });
    }
  };

  const handleFileSelect = (file) => {
    playClickSound();
    setActiveFile(file);
    if (isMobile) setCurrentMobileView('right');
  };

  const handleMobileNavClick = (view) => {
    playClickSound();
    setCurrentMobileView(view);
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
          <div className="mb-6 text-3xl text-[#f8e0d5] pixel-font">Aman Zulkifli OS</div>
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
  {/* 90s-style cursor elements */}
  <div className="fixed pointer-events-none z-[9999]" style={{
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    transform: 'translate(10px, 10px)'
  }}>
    {/* Main cursor (white arrow) - changes to pointer when over clickable elements */}
    <div className={`absolute w-4 h-4 transition-transform duration-100 ${
      document.querySelector(':hover')?.style?.cursor === 'pointer' ? 'scale-125' : ''
    }`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <polygon points="0,0 32,0 0,32" fill="white" />
      </svg>
      <svg viewBox="0 0 32 32" className="w-full h-full absolute top-0 left-0">
        <polygon points="0,0 32,0 0,32" fill="none" stroke="black" strokeWidth="1" />
      </svg>
    </div>
    
    {/* Hand pointer for clickable elements */}
    {document.querySelector(':hover')?.style?.cursor === 'pointer' && (
      <div className="absolute -translate-x-1 -translate-y-1">
        <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-80">
          <path d="M10 4V1L14 5L10 9V6H8C6.34315 6 5 7.34315 5 9V16C5 17.6569 6.34315 19 8 19H15C16.6569 19 18 17.6569 18 16V4H10Z" fill="white"/>
          <path d="M10 4V1L14 5L10 9V6H8C6.34315 6 5 7.34315 5 9V16C5 17.6569 6.34315 19 8 19H15C16.6569 19 18 17.6569 18 16V4H10Z" fill="none" stroke="black" strokeWidth="1"/>
        </svg>
      </div>
    )}
  </div>

  {/* Cursor trail remains the same */}
  {[...Array(5)].map((_, i) => (
    <div key={i} className="fixed pointer-events-none z-[9998]" style={{
      left: `${cursorPosition.x - i * 2}px`,
      top: `${cursorPosition.y - i * 2}px`,
      width: `${5 - i}px`,
      height: `${5 - i}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
      transform: 'translate(10px, 10px)',
      transition: `all ${0.05 * i}s linear`,
      opacity: 0.8 - (i * 0.15)
    }} />
  ))}

      {/* <RainbowCursor 
        length={15}
        size={4}
        trailSpeed={0.2}
        colorCycleSpeed={0.003}
        blur={0.5}
        pulseSpeed={0.01}
        pulseMin={0.8}
        pulseMax={1.2}
      /> */}
      
      <div className="h-screen flex flex-col bg-[#fff5ee] pixel-font cursor-none" onClick={playClickSound}>
        {/* Window Title Bar */}
        <div className="bg-[#e8a87c] text-[#5a4a42] p-1 flex justify-between items-center border-b-2 border-[#d4b8a8]">
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
              <rect x="1" y="1" width="14" height="14" rx="1" fill="#5a4a42"/>
              <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
            </svg>
            <span className="font-bold">AMAN ZULKIFLI OS</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-1 hover:bg-[#d4b8a8] rounded"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <span className="text-lg">🔇</span>
            ) : (
              <span className="text-lg">🔊</span>
            )}
          </button>
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
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('left');
              }}
              className={`flex flex-col items-center text-xs p-1 ${currentMobileView === 'left' ? 'text-[#5a4a42] font-bold' : 'text-[#a38b7a]'}`}
            >
              <span className="text-lg">🏠</span>
              HOME
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('middle');
              }}
              className={`flex flex-col items-center text-xs p-1 ${currentMobileView === 'middle' ? 'text-[#5a4a42] font-bold' : 'text-[#a38b7a]'}`}
            >
              <span className="text-lg">📂</span>
              BROWSE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('right');
              }}
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