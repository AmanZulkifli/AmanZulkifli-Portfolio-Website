// RightPanel.jsx
import { useState, useEffect, useCallback } from 'react';
import { spotifyPlaylists } from '../data/spotifyPlaylists';
import { useMemo } from 'react';

// Tetris Game Component
const TetrisGame = ({ isMobile, onReturnToMenu }) => {
  // Game constants
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const NEXT_PIECE_COUNT = 5;
  const COLORS = {
    I: '#00F0F0', O: '#F0F000', T: '#A000F0',
    L: '#F0A000', J: '#0000F0', S: '#00F000', Z: '#F00000'
  };

  // Game state
  const [board, setBoard] = useState(() => Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [nextPieces, setNextPieces] = useState([]);
  const [heldPiece, setHeldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isFastDropping, setIsFastDropping] = useState(false);

  // Tetromino shapes
  const TETROMINOES = useMemo(() => ({
    I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: COLORS.I },
    O: { shape: [[1,1], [1,1]], color: COLORS.O },
    T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: COLORS.T },
    L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: COLORS.L },
    J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: COLORS.J },
    S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: COLORS.S },
    Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: COLORS.Z }
  }), []);

  // Game functions
  const randomTetromino = useCallback(() => {
    const types = 'IOTLJSZ';
    const type = types[Math.floor(Math.random() * types.length)];
    return { ...TETROMINOES[type], type };
  }, [TETROMINOES]);

  const initializeNextPieces = useCallback(() => {
    return Array(NEXT_PIECE_COUNT).fill().map(() => randomTetromino());
  }, [randomTetromino]);

  const checkCollision = useCallback((piece, pos, board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = pos.x + x;
          const boardY = pos.y + y;
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT || 
              (boardY >= 0 && board[boardY][boardX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const rotate = useCallback((piece, direction = 1) => {
    const rotated = piece.shape.map((_, i) => piece.shape.map(col => col[i]));
    return direction > 0 ? rotated.map(row => row.reverse()) : rotated.reverse();
  }, []);

  const startGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setNextPieces(initializeNextPieces());
    setCurrentPiece(randomTetromino());
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setHeldPiece(null);
    setCanHold(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsPaused(false);
    setIsFastDropping(false);
  }, [initializeNextPieces, randomTetromino]);

  const getNextPiece = useCallback(() => {
    const next = [...nextPieces];
    const piece = next.shift();
    next.push(randomTetromino());
    setNextPieces(next);
    return piece;
  }, [nextPieces, randomTetromino]);

  const holdPiece = useCallback(() => {
    if (!canHold || !currentPiece) return;
    
    setCanHold(false);
    if (!heldPiece) {
      setHeldPiece(currentPiece);
      setCurrentPiece(getNextPiece());
    } else {
      setHeldPiece(currentPiece);
      setCurrentPiece(heldPiece);
    }
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  }, [canHold, currentPiece, heldPiece, getNextPiece]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardX >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
      return newBoard;
    });

    const nextPiece = getNextPiece();
    setCurrentPiece(nextPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setCanHold(true);
    setIsFastDropping(false);

    if (checkCollision(nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, board)) {
      setGameOver(true);
    }
  }, [currentPiece, position, board, getNextPiece, checkCollision]);

  const clearLines = useCallback(() => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      let linesCleared = 0;

      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== 0)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        const linePoints = [0, 40, 100, 300, 1200];
        setScore(prev => prev + linePoints[linesCleared] * level);
        setLines(prev => prev + linesCleared);
        
        const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
        if (newLevel > level) setLevel(newLevel);
      }

      return newBoard;
    });
  }, [level, lines]);

  const movePiece = useCallback(({ x = 0, y = 0, rotateDir = 0 }) => {
    if (gameOver || isPaused || !currentPiece) return;

    let newPosition = { ...position };
    let newPiece = currentPiece;
    
    if (rotateDir !== 0) {
      newPiece = { ...currentPiece, shape: rotate(currentPiece, rotateDir) };
    }
    
    newPosition.x += x;
    newPosition.y += y;

    if (x !== 0) {
      const tryDown = { ...newPosition, y: newPosition.y + 1 };
      if (!checkCollision(newPiece, tryDown, board)) {
        newPosition = tryDown;
      }
    }

    if (!checkCollision(newPiece, newPosition, board)) {
      setPosition(newPosition);
      if (rotateDir !== 0) setCurrentPiece(newPiece);
      return true;
    }
    
    if (y > 0 || x !== 0) {
      lockPiece();
      clearLines();
      return false;
    }
    
    return false;
  }, [position, currentPiece, board, gameOver, isPaused, checkCollision, rotate, lockPiece, clearLines]);

  const hardDrop = useCallback(() => {
    setIsFastDropping(prev => !prev);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused || !currentPiece) return;

    const dropSpeed = isFastDropping ? 50 : 1000 / level;
    const gameInterval = setInterval(() => {
      movePiece({ y: 1 });
    }, dropSpeed);

    return () => clearInterval(gameInterval);
  }, [gameOver, isPaused, currentPiece, level, isFastDropping, movePiece]);

  // Initialize game
  useEffect(() => {
    startGame();
  }, [startGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) {
        if (e.key === 'r') startGame();
        return;
      }

      if (e.key === 'p') setIsPaused(prev => !prev);
      if (isPaused) return;

      switch (e.key.toLowerCase()) {
        case 'arrowleft': case 'a': movePiece({ x: -1 }); break;
        case 'arrowright': case 'd': movePiece({ x: 1 }); break;
        case 'arrowdown': case 's': movePiece({ y: 1 }); break;
        case 'arrowup': case 'w': movePiece({ rotateDir: 1 }); break;
        case 'z': movePiece({ rotateDir: -1 }); break;
        case ' ': hardDrop(); break;
        case 'c': holdPiece(); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, movePiece, hardDrop, holdPiece, startGame]);

  // Render functions
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardX >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const renderNextPieces = () => nextPieces.slice(0, NEXT_PIECE_COUNT).map((piece, i) => (
    <div key={i} className="mb-4">
      <div className="grid grid-cols-4 gap-1 w-16">
        {piece.shape.map((row, y) => row.map((cell, x) => cell !== 0 && (
          <div key={`${y}-${x}`} className="w-3 h-3 border border-gray-800" style={{ backgroundColor: piece.color }} />
        )))}
      </div>
    </div>
  ));

  const renderHeldPiece = () => heldPiece && (
    <div className="grid grid-cols-4 gap-1 w-16">
      {heldPiece.shape.map((row, y) => row.map((cell, x) => cell !== 0 && (
        <div key={`${y}-${x}`} className="w-3 h-3 border border-gray-800" style={{ backgroundColor: heldPiece.color }} />
      )))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-50">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#d4b8a8"/>
        </svg>
        <h3 className="text-lg font-medium text-[#5a4a42] mb-2">Tetris Not Available on Mobile</h3>
        <p className="text-[#a38b7a] max-w-md">
          Please play Tetris on a desktop device with a keyboard (WASD + Space controls).
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2">Hold</h3>
          {renderHeldPiece() || <div className="h-16"></div>}
        </div>

        <div className="relative">
          {gameOver && (
            <div className="absolute inset-0 bg-red-900 bg-opacity-70 flex flex-col items-center justify-center z-10">
              <h2 className="text-3xl font-bold mb-4">GAME OVER</h2>
              <button onClick={startGame} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-2">
                Play Again
              </button>
              <button onClick={onReturnToMenu} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Main Menu
              </button>
            </div>
          )}

          {isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">PAUSED</h2>
                <button onClick={() => setIsPaused(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Resume
                </button>
              </div>
            </div>
          )}

          <div className="border-4 border-gray-700 bg-gray-900 p-1">
            <div className="grid grid-cols-10 grid-rows-20 gap-0">
              {renderBoard().map((row, y) => row.map((cell, x) => (
                <div 
                  key={`${y}-${x}`} 
                  className={`w-6 h-6 border ${cell ? 'border-gray-800' : 'border-gray-900'}`}
                  style={{ backgroundColor: cell || 'transparent' }}
                />
              )))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-32">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">Next</h3>
            {renderNextPieces()}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">Score</h3>
              <p className="text-xl">{score}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Level</h3>
              <p className="text-xl">{level}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Lines</h3>
              <p className="text-xl">{lines}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="mb-2"><strong>Controls:</strong> ← → Move | ↑ Rotate | Z Rotate CCW | ↓ Soft Drop | Space Hard Drop | C Hold | P Pause</p>
        <button onClick={() => setIsPaused(prev => !prev)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={startGame} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Restart
        </button>
      </div>
    </div>
  );
};

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

  // Handle different file types
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
    // This is a Spotify playlist object
    setSelectedItem({ type: 'spotify', data: activeFile });
    setActiveTab(null);
  }

  setIsLoading(false);
}, [activeFile, projects]);

 const renderSpotifyPlaylist = (playlist) => {
    if (!playlist) return null;
    
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-[#d4b8a8] overflow-hidden flex-shrink-0">
            <img
              src={playlist.imageUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300/1DB954/FFFFFF?text=No+Image';
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#5a4a42]">{playlist.title}</h2>
            <p className="text-sm text-[#a38b7a]">{playlist.trackCount || 'Unknown'} songs</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#5a4a42]">{playlist.description}</p>

        {/* Actions */}
        <div className="flex space-x-3">
          <a
            href={playlist.playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-all pixel-corners"
          >
            <svg width="18" height="18" fill="currentColor" className="mr-2" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play on Spotify
          </a>
        </div>

        {/* Divider */}
        <hr className="border-dashed border-[#e8a87c]" />
      </div>
    );
  };  

  const renderProject = (project) => {
    if (!project) return null;

    const { title, description, image, link, steps } = project;

    return (
      <div className="space-y-4 animate-fade-in">
        {image && (
          <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#e8a87c]/20 to-[#f8e0d5]/20 border-2 border-dashed border-[#d4b8a8]">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-[#e8a87c] m-2" />
          </div>
        )}
        
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#e8a87c]">{title}</h2>
          <p className="text-[#5a4a42]">{description}</p>
          
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-[#e8a87c] hover:underline"
            >
              View Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                <path d="M6 3H13V10" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 3L3 13" stroke="#e8a87c" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
          )}
          
          {steps?.length > 0 && (
            <div className="mt-3">
              <h3 className="font-bold text-[#5a4a42] mb-2">Project Details:</h3>
              <ul className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e8a87c] mt-2 mr-2"></span>
                    <span className="text-[#5a4a42]">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#e8a87c]/20 to-[#f8e0d5]/20">
        <img 
          src="src/assets/about.jpg" 
          alt="About Me" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-0 m-2" />
        <div className="absolute bottom-4 left-4">
          <h2 className="text-xl font-bold text-white">About Me</h2>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[#5a4a42]">
          Hey, I'm Tegar Badruzzaman Zulkifli, a web development student and aspiring full-stack developer with a growing portfolio of real-world projects. I specialize in combining design thinking with technical skills to build meaningful digital experiences.
        </p>
        <p className="text-[#5a4a42]">
          My experience includes creating product-based websites, information systems, and user-centered applications. I'm passionate about learning, leading, and delivering thoughtful solutions that solve real problems — both through code and collaboration.
        </p>

        <div className="mt-4">
          <h3 className="font-bold text-[#5a4a42] mb-3">Expertise & Skills:</h3>
          <div className="grid grid-cols-2 gap-3">
            {['User Experience', 'User Interface', 'Front-End Development', 'Back-End Development', 'Project Management', 'HTML/CSS/JS', 'ReactJS', 'Laravel', 'MySQL', 'Bootstrap', 'Tailwind', 'GitHub'].map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a87c]"></span>
                <span className="text-sm text-[#5a4a42]">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6 overflow-y-auto h-full pr-2">
      {/* Golovera SC */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[#5a4a42] font-semibold">Golovera SC | Director of Human Resource Development</h3>
          <p className="text-sm text-[#a38b7a]">November 2024 – July 2025</p>
        </div>
        <ul className="list-disc pl-5 text-[#5a4a42] space-y-1">
          <li>Led HR strategies in a student company focused on sustainability and social entrepreneurship</li>
          <li>Coordinated internal communication, talent development, and team motivation</li>
          <li>Developed leadership, time management, and people skills through direct team supervision</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* OSIS SMK Wikrama */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[#5a4a42] font-semibold">OSIS SMK Wikrama Bogor | Division of English Communication</h3>
          <p className="text-sm text-[#a38b7a]">November 2023 – Present</p>
        </div>
        <ul className="list-disc pl-5 text-[#5a4a42] space-y-1">
          <li>Organized programs that enhanced English communication within the school</li>
          <li>Improved communication, public speaking, and teamwork skills</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* FOJB (Forum OSIS Jawa Barat) */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[#5a4a42] font-semibold">Forum OSIS Jawa Barat Wilayah II | Division of Learning Center</h3>
          <p className="text-sm text-[#a38b7a]">September 2024 – Present</p>
        </div>
        <ul className="list-disc pl-5 text-[#5a4a42] space-y-1">
          <li>Collaborated with students across West Java in organizing inter-school educational programs</li>
          <li>Assisted in building a Learning Center division focused on knowledge sharing</li>
          <li>Gained skills in collaboration, event planning, and cross-school networking</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>

      {/* Education */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[#5a4a42] font-semibold">SMK Wikrama Bogor | Software Development Student</h3>
          <p className="text-sm text-[#a38b7a]">July 2023 – Present</p>
        </div>
        <ul className="list-disc pl-5 text-[#5a4a42] space-y-1">
          <li>Majoring in Software and Game Development</li>
          <li>Completed certifications in web development through Dicoding</li>
          <li>Built practical web projects with HTML, CSS, JavaScript, ReactJS, PHP (Laravel), and MySQL (basic level)</li>
          <li>Improved skills in teamwork, communication, and leadership through school involvement</li>
        </ul>
        <div className="border-b-2 border-dashed border-[#d4b8a8]" />
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="grid grid-cols-2 gap-4 animate-fade-in">
      {[
        { name: 'React.js', icon: '⚛️' },
        { name: 'Laravel', icon: '🪄' },
        { name: 'PHP', icon: '🐘' },
        { name: 'HTML/CSS/JS', icon: '🖥️' },
        { name: 'MySQL', icon: '🗃️' },
        { name: 'Bootstrap', icon: '🎨' },
        { name: 'Tailwind', icon: '🌀' },
        { name: 'GitHub', icon: '🐙' },
        { name: 'Trello', icon: '📋' },
        { name: 'Canva', icon: '✏️' }
      ].map((tool) => (
        <div key={tool.name} className="flex items-center p-3 rounded-lg border-2 border-dashed border-[#d4b8a8] hover:bg-[#f8e0d5] transition-colors">
          <span className="text-xl mr-3">{tool.icon}</span>
          <span className="text-sm font-medium text-[#5a4a42]">{tool.name}</span>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-50">
        <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8M14 3L19 8M14 3V8H19" stroke="#d4b8a8" strokeWidth="1.5"/>
      </svg>
      <h3 className="text-lg font-medium text-[#5a4a42] mb-2">No file selected</h3>
      <p className="text-[#a38b7a] max-w-md">
        Select a file from the folder to view its contents. You can browse through projects, documents, and Spotify playlists.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8a87c]"></div>
    </div>
  );

  return (
  <div className={`right-panel h-full w-full p-6 bg-[#fff5ee] overflow-y-auto ${isGlitch ? 'glitch-effect' : ''}`}>
    {isLoading ? (
      renderLoading()
    ) : !activeFile ? (
      renderEmptyState()
    ) : selectedItem ? (
      selectedItem.type === 'spotify' ? (
        renderSpotifyPlaylist(selectedItem.data)
      ) : selectedItem.type === 'project' ? (
        renderProject(selectedItem.data)
      ) : selectedItem.type === 'tetris' ? (
        <TetrisGame />
      ) : null
    ) : (
      <>
        {activeTab === 'about' && renderAbout()}
        {activeTab === 'experience' && renderExperience()}
        {activeTab === 'tools' && renderTools()}
      </>
    )}
  </div>
);
}