import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export default function TetrisGame({ isMobile, onReturnToMenu }) {
    // Game constants
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    const NEXT_PIECE_COUNT = 5;
    const LOCK_DELAY = 500; // 0.5 seconds
    const COLORS = {
        I: '#00F0F0', O: '#F0F000', T: '#A000F0',
        L: '#F0A000', J: '#0000F0', S: '#00F000', Z: '#F00000',
        GHOST: 'rgba(255, 255, 255, 0.2)'
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
    const [isLocking, setIsLocking] = useState(false);
    const [backToBack, setBackToBack] = useState(false);
    
    const lockTimer = useRef(null);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    // Tetromino shapes with proper wall kick data
    const TETROMINOES = useMemo(() => ({
        I: { 
            shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], 
            color: COLORS.I,
            wallKicks: [
                [[0,0], [-2,0], [1,0], [-2,-1], [1,2]], // 0>>1
                [[0,0], [-1,0], [2,0], [-1,2], [2,-1]], // 1>>2
                [[0,0], [2,0], [-1,0], [2,1], [-1,-2]], // 2>>3
                [[0,0], [1,0], [-2,0], [1,-2], [-2,1]]  // 3>>0
            ]
        },
        O: { 
            shape: [[1,1], [1,1]], 
            color: COLORS.O,
            wallKicks: [] // O piece doesn't rotate
        },
        T: { 
            shape: [[0,1,0], [1,1,1], [0,0,0]], 
            color: COLORS.T,
            wallKicks: [
                [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]], // 0>>1
                [[0,0], [1,0], [1,-1], [0,2], [1,2]],     // 1>>2
                [[0,0], [1,0], [1,1], [0,-2], [1,-2]],    // 2>>3
                [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]   // 3>>0
            ]
        },
        L: { 
            shape: [[0,0,1], [1,1,1], [0,0,0]], 
            color: COLORS.L,
            wallKicks: [
                [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]], // 0>>1
                [[0,0], [1,0], [1,-1], [0,2], [1,2]],     // 1>>2
                [[0,0], [1,0], [1,1], [0,-2], [1,-2]],    // 2>>3
                [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]   // 3>>0
            ]
        },
        J: { 
            shape: [[1,0,0], [1,1,1], [0,0,0]], 
            color: COLORS.J,
            wallKicks: [
                [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]], // 0>>1
                [[0,0], [1,0], [1,-1], [0,2], [1,2]],     // 1>>2
                [[0,0], [1,0], [1,1], [0,-2], [1,-2]],    // 2>>3
                [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]   // 3>>0
            ]
        },
        S: { 
            shape: [[0,1,1], [1,1,0], [0,0,0]], 
            color: COLORS.S,
            wallKicks: [
                [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]], // 0>>1
                [[0,0], [1,0], [1,-1], [0,2], [1,2]],     // 1>>2
                [[0,0], [1,0], [1,1], [0,-2], [1,-2]],    // 2>>3
                [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]   // 3>>0
            ]
        },
        Z: { 
            shape: [[1,1,0], [0,1,1], [0,0,0]], 
            color: COLORS.Z,
            wallKicks: [
                [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]], // 0>>1
                [[0,0], [1,0], [1,-1], [0,2], [1,2]],     // 1>>2
                [[0,0], [1,0], [1,1], [0,-2], [1,-2]],    // 2>>3
                [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]   // 3>>0
            ]
        }
    }), []);

    // Calculate ghost piece position
    const calculateGhostPosition = useCallback(() => {
        if (!currentPiece) return { x: 0, y: 0 };
        
        let ghostY = position.y;
        while (!checkCollision(currentPiece, { x: position.x, y: ghostY + 1 }, board)) {
            ghostY++;
        }
        return { x: position.x, y: ghostY };
    }, [currentPiece, position, board]);

    // Game functions
    const randomTetromino = useCallback(() => {
        const types = 'IOTLJSZ';
        const type = types[Math.floor(Math.random() * types.length)];
        return { ...TETROMINOES[type], type, rotation: 0 };
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

    const rotatePiece = useCallback((piece, direction = 1) => {
        if (piece.type === 'O') return piece; // O piece doesn't rotate
        
        const newRotation = (piece.rotation + direction + 4) % 4;
        let newShape = piece.shape.map((_, i) => 
            piece.shape.map(col => col[i])
        );
        
        if (direction > 0) {
            newShape = newShape.map(row => row.reverse());
        } else {
            newShape = newShape.reverse();
        }
        
        return { ...piece, shape: newShape, rotation: newRotation };
    }, []);

    const attemptWallKick = useCallback((piece, pos, rotationDir, board) => {
        if (piece.type === 'O') return null; // No wall kicks for O piece
        
        const testPositions = TETROMINOES[piece.type].wallKicks[piece.rotation];
        
        for (const [x, y] of testPositions) {
            const newPos = { x: pos.x + x, y: pos.y + y };
            const rotatedPiece = rotatePiece(piece, rotationDir);
            if (!checkCollision(rotatedPiece, newPos, board)) {
                return { piece: rotatedPiece, position: newPos };
            }
        }
        
        return null;
    }, [TETROMINOES, rotatePiece, checkCollision]);

    const startGame = useCallback(() => {
        clearTimeout(lockTimer.current);
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
        setIsLocking(false);
        setBackToBack(false);
    }, [initializeNextPieces, randomTetromino]);

    const getNextPiece = useCallback(() => {
        const next = [...nextPieces];
        const piece = next.shift();
        next.push(randomTetromino());
        setNextPieces(next);
        return piece;
    }, [nextPieces, randomTetromino]);

    const holdPiece = useCallback(() => {
        if (!canHold || !currentPiece || isLocking) return;
        
        setCanHold(false);
        if (!heldPiece) {
            setHeldPiece(currentPiece);
            setCurrentPiece(getNextPiece());
        } else {
            setHeldPiece(currentPiece);
            setCurrentPiece(heldPiece);
        }
        setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
        clearTimeout(lockTimer.current);
        setIsLocking(false);
    }, [canHold, currentPiece, heldPiece, getNextPiece, isLocking]);

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
        setIsLocking(false);

        if (checkCollision(nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }, board)) {
            setGameOver(true);
        }
    }, [currentPiece, position, board, getNextPiece, checkCollision]);

    const clearLines = useCallback(() => {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            let linesCleared = 0;
            let isTSpin = false;

            // Check for T-Spin
            if (currentPiece?.type === 'T' && isLocking) {
                const corners = [
                    { x: position.x, y: position.y },
                    { x: position.x + 2, y: position.y },
                    { x: position.x, y: position.y + 2 },
                    { x: position.x + 2, y: position.y + 2 }
                ];
                const filledCorners = corners.filter(corner => 
                    corner.y >= 0 && corner.y < BOARD_HEIGHT && 
                    corner.x >= 0 && corner.x < BOARD_WIDTH &&
                    newBoard[corner.y][corner.x] !== 0
                ).length;
                isTSpin = filledCorners >= 3;
            }

            // Clear lines
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (newBoard[y].every(cell => cell !== 0)) {
                    newBoard.splice(y, 1);
                    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
                    linesCleared++;
                    y++; // Check same row again after deletion
                }
            }

            // Calculate score
            if (linesCleared > 0) {
                let points = 0;
                const levelMultiplier = level;
                
                if (isTSpin) {
                    if (linesCleared === 1) points = 800;
                    else if (linesCleared === 2) points = 1200;
                    else if (linesCleared === 3) points = 1600;
                } else {
                    if (linesCleared === 1) points = 100 * levelMultiplier;
                    else if (linesCleared === 2) points = 300 * levelMultiplier;
                    else if (linesCleared === 3) points = 500 * levelMultiplier;
                    else if (linesCleared === 4) points = 800 * levelMultiplier; // Tetris
                }

                // Back-to-back bonus
                if ((linesCleared === 4 || isTSpin) && backToBack) {
                    points = Math.floor(points * 1.5);
                }

                setScore(prev => prev + points);
                setLines(prev => prev + linesCleared);
                setBackToBack(linesCleared === 4 || isTSpin);
                
                // Level up every 10 lines with increasing speed
                const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
                if (newLevel > level) {
                    setLevel(newLevel);
                }
            }

            return newBoard;
        });
    }, [currentPiece, position, level, lines, backToBack, isLocking]);

    const movePiece = useCallback(({ x = 0, y = 0, rotateDir = 0 }) => {
        if (gameOver || isPaused || !currentPiece) return false;

        // Handle rotation with wall kicks
        if (rotateDir !== 0) {
            const rotatedPiece = rotatePiece(currentPiece, rotateDir);
            const kickResult = attemptWallKick(currentPiece, position, rotateDir, board);

            if (kickResult) {
                setCurrentPiece(kickResult.piece);
                setPosition(kickResult.position);
                clearTimeout(lockTimer.current);
                setIsLocking(false);
                return true;
            } else if (!checkCollision(rotatedPiece, position, board)) {
                setCurrentPiece(rotatedPiece);
                clearTimeout(lockTimer.current);
                setIsLocking(false);
                return true;
            }
            return false;
        }

        const newPosition = { x: position.x + x, y: position.y + y };
        
        if (!checkCollision(currentPiece, newPosition, board)) {
            setPosition(newPosition);
            
            // Reset lock delay if moving sideways
            if (x !== 0 && isLocking) {
                clearTimeout(lockTimer.current);
                setIsLocking(false);
            }
            
            return true;
        }
        
        // Handle landing
        if (y > 0) {
            if (!isLocking) {
                setIsLocking(true);
                lockTimer.current = setTimeout(() => {
                    lockPiece();
                    clearLines();
                }, LOCK_DELAY);
            }
            return false;
        }
        
        return false;
    }, [gameOver, isPaused, currentPiece, position, board, isLocking, rotatePiece, attemptWallKick, checkCollision, lockPiece, clearLines]);

    const softDrop = useCallback(() => {
        if (isFastDropping) return;
        movePiece({ y: 1 });
        setScore(prev => prev + level); // Soft drop points
    }, [movePiece, isFastDropping, level]);

    const hardDrop = useCallback(() => {
        if (!currentPiece) return;

        let dropDistance = 0;
        let newY = position.y;

        // Calculate drop distance
        while (!checkCollision(currentPiece, { x: position.x, y: newY + 1 }, board)) {
            newY++;
            dropDistance++;
        }

        if (dropDistance > 0) {
            // Manually lock the piece at final position
            const finalPosition = { x: position.x, y: newY };
            const newBoard = board.map(row => [...row]);

            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x] !== 0) {
                        const boardY = finalPosition.y + y;
                        const boardX = finalPosition.x + x;
                        if (boardY >= 0 && boardX >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                            newBoard[boardY][boardX] = currentPiece.color;
                        }
                    }
                }
            }

            setBoard(newBoard);
            setScore(prev => prev + dropDistance * 2 * level);
            setIsFastDropping(false);
            setCanHold(true);
            setIsLocking(false);

            // Prepare next piece
            const nextPiece = getNextPiece();
            const nextPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
            setCurrentPiece(nextPiece);
            setPosition(nextPos);

            // Check for game over
            if (checkCollision(nextPiece, nextPos, newBoard)) {
                setGameOver(true);
            }

            clearLines();
        }
    }, [currentPiece, position, board, level, getNextPiece, checkCollision, clearLines]);

    // Game loop
    useEffect(() => {
        if (gameOver || isPaused || !currentPiece) return;

        // Calculate drop speed based on level (faster as level increases)
        const baseSpeed = 1000; // 1 second at level 1
        const speedDecrease = 50; // Decrease by 50ms per level
        const minSpeed = 100; // Minimum speed (100ms)
        const dropSpeed = isFastDropping ? 50 : Math.max(minSpeed, baseSpeed - (level - 1) * speedDecrease);
        
        const gameInterval = setInterval(() => {
            if (!isFastDropping) {
                softDrop();
            }
        }, dropSpeed);

        return () => clearInterval(gameInterval);
    }, [gameOver, isPaused, currentPiece, level, isFastDropping, softDrop]);

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

            if (e.key === 'Escape') setIsPaused(prev => !prev);
            if (isPaused) return;

            switch (e.key.toLowerCase()) {
                case 'arrowleft': case 'a': movePiece({ x: -1 }); break;
                case 'arrowright': case 'd': movePiece({ x: 1 }); break;
                case 'arrowdown': case 's': softDrop(); break;
                case 'arrowup': case 'w': movePiece({ rotateDir: 1 }); break;
                case 'z': case 'q': movePiece({ rotateDir: -1 }); break;
                case ' ': hardDrop(); break;
                case 'c': case 'shift': holdPiece(); break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, isPaused, movePiece, softDrop, hardDrop, holdPiece, startGame]);

    // Mouse controls
    const handleMouseDown = (e) => {
        if (gameOver || isPaused || !currentPiece) return;
        
        if (e.button === 0) { // Left click
            movePiece({ x: -1 });
        } else if (e.button === 2) { // Right click
            movePiece({ x: 1 });
        }
    };

    const handleWheel = (e) => {
        if (gameOver || isPaused || !currentPiece) return;
        
        if (e.deltaY > 0) {
            hardDrop();
        } else {
            movePiece({ rotateDir: 1 });
        }
    };

    // Touch controls
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current || !touchStartY.current || gameOver || isPaused || !currentPiece) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX.current;
        const diffY = touchEndY - touchStartY.current;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            movePiece({ x: diffX > 0 ? 1 : -1 });
        } else if (diffY > 50) {
            // Swipe down
            hardDrop();
        } else if (diffY < -50) {
            // Swipe up
            movePiece({ rotateDir: 1 });
        }
        
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // Render functions
    const renderBoard = () => {
        const displayBoard = board.map(row => [...row]);
        const ghostPosition = calculateGhostPosition();

        // Draw ghost piece
        if (currentPiece && !gameOver && !isFastDropping) {
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x] !== 0) {
                        const boardY = ghostPosition.y + y;
                        const boardX = ghostPosition.x + x;
                        if (boardY >= 0 && boardX >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                            displayBoard[boardY][boardX] = COLORS.GHOST;
                        }
                    }
                }
            }
        }

        // Draw current piece
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
            <div className="grid grid-cols-4 gap-1 w-20">
                {piece.shape.map((row, y) => row.map((cell, x) => cell !== 0 && (
                    <div 
                        key={`${y}-${x}`} 
                        className="w-4 h-4 border border-[#5a4a42]" 
                        style={{ backgroundColor: piece.color }} 
                    />
                )))}
            </div>
        </div>
    ));

    const renderHeldPiece = () => heldPiece && (
        <div className="grid grid-cols-4 gap-1 w-20">
            {heldPiece.shape.map((row, y) => row.map((cell, x) => cell !== 0 && (
                <div 
                    key={`${y}-${x}`} 
                    className="w-4 h-4 border border-[#5a4a42]" 
                    style={{ backgroundColor: heldPiece.color }} 
                />
            )))}
        </div>
    );

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-50">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#d4b8a8"/>
                </svg>
                <h3 className="text-sm font-bold text-[#5a4a42] mb-2">TETRIS UNAVAILABLE</h3>
                <p className="text-xs text-[#a38b7a] max-w-md">
                    Please play on desktop with keyboard (WASD + Space controls)
                </p>
            </div>
        );
    }

    return (
        <div 
            className="flex flex-col items-center justify-center h-full p-4 pixel-font"
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="flex gap-6 items-start">
                {/* Hold Piece */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2">HOLD</h3>
                    {renderHeldPiece() || <div className="h-16"></div>}
                </div>

                {/* Main Game Board */}
                <div className="relative">
                    {gameOver && (
                        <div className="absolute inset-0 bg-[#5a4a42] bg-opacity-90 flex flex-col items-center justify-center z-10 pixel-corners">
                            <h2 className="text-2xl font-bold mb-4 text-[#fff5ee]">GAME OVER</h2>
                            <button 
                                onClick={startGame} 
                                className="px-6 py-2 bg-[#e8a87c] text-[#fff5ee] pixel-corners mb-3 hover:bg-[#d4b8a8] transition"
                            >
                                PLAY AGAIN
                            </button>
                            <button 
                                onClick={onReturnToMenu} 
                                className="px-6 py-2 bg-[#a38b7a] text-[#fff5ee] pixel-corners hover:bg-[#d4b8a8] transition"
                            >
                                MAIN MENU
                            </button>
                        </div>
                    )}

                    {isPaused && (
                        <div className="absolute inset-0 bg-[#5a4a42] bg-opacity-90 flex items-center justify-center z-10 pixel-corners">
                            <div className="p-4 bg-[#f8e0d5] pixel-corners">
                                <h2 className="text-2xl font-bold mb-4">PAUSED</h2>
                                <button 
                                    onClick={() => setIsPaused(false)} 
                                    className="px-6 py-2 bg-[#e8a87c] text-[#fff5ee] pixel-corners hover:bg-[#d4b8a8] transition"
                                >
                                    RESUME
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="border-4 border-[#5a4a42] bg-[#5a4a42] p-2 pixel-corners">
                        <div className="grid grid-cols-10 grid-rows-20 gap-0">
                            {renderBoard().map((row, y) => row.map((cell, x) => (
                                <div 
                                    key={`${y}-${x}`} 
                                    className={`w-6 h-6 ${cell === COLORS.GHOST ? 'border border-dashed border-[#fff5ee]' : cell ? 'border border-[#5a4a42]' : 'border border-[#5a4a42]'}`}
                                    style={{ backgroundColor: cell || 'transparent' }}
                                />
                            )))}
                        </div>
                    </div>
                </div>

                {/* Next Pieces and Stats */}
                <div className="flex flex-col w-28">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2">NEXT</h3>
                        {renderNextPieces()}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold">SCORE</h3>
                            <p className="text-xl font-mono">{score.toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">LEVEL</h3>
                            <p className="text-xl font-mono">{level}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">LINES</h3>
                            <p className="text-xl font-mono">{lines}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <div className="bg-[#f8e0d5] p-3 pixel-corners mb-4">
                    <p className="text-sm font-bold mb-1">
                        CONTROLS:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>←→ Move</div>
                        <div>↑ Rotate CW</div>
                        <div>↓ Soft Drop</div>
                        <div>Z/Q Rotate CCW</div>
                        <div>Space Hard Drop</div>
                        <div>C/Shift Hold</div>
                        <div>ESC Pause</div>
                        <div>R Restart</div>
                    </div>
                </div>
                
                <div className="flex justify-center gap-3">
                    <button 
                        onClick={() => setIsPaused(prev => !prev)} 
                        className="px-5 py-2 bg-[#e8a87c] text-[#fff5ee] pixel-corners hover:bg-[#d4b8a8] transition"
                    >
                        {isPaused ? 'RESUME' : 'PAUSE'}
                    </button>
                    <button 
                        onClick={startGame} 
                        className="px-5 py-2 bg-[#a38b7a] text-[#fff5ee] pixel-corners hover:bg-[#d4b8a8] transition"
                    >
                        RESTART
                    </button>
                </div>
            </div>
        </div>
    );
}