import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const SnakeWindowContent: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const moveRef = useRef(direction);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    moveRef.current = INITIAL_DIRECTION;
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) moveRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) moveRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) moveRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) moveRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setDirection(moveRef.current);
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setGameOver(true);
            setIsPlaying(false);
            return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
             const newScore = s + 1;
             if (newScore > highScore) setHighScore(newScore);
             return newScore;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#9BBC0F] p-4 relative font-mono">
      {/* Game Boy Frame feel */}
      <div className="bg-[#0f380f] p-4 rounded-lg shadow-retro-lg border-4 border-[#0f380f]">
        
        {/* Screen */}
        <div className="bg-[#8bAc0f] border-4 border-[#306230] mb-4 relative" 
             style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
            
            {snake.map((segment, i) => (
                <div
                    key={i}
                    className="absolute bg-[#0f380f]"
                    style={{
                        left: segment.x * CELL_SIZE,
                        top: segment.y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        border: '1px solid #8bAc0f'
                    }}
                />
            ))}
            <div
                className="absolute bg-[#306230] rounded-full"
                style={{
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                }}
            />

            {gameOver && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-[#9BBC0F]">
                    <div className="text-2xl font-bold mb-2">GAME OVER</div>
                    <button 
                        onClick={resetGame}
                        className="px-4 py-2 bg-[#0f380f] text-[#9BBC0F] border-2 border-[#9BBC0F] hover:bg-[#306230]"
                    >
                        TRY AGAIN
                    </button>
                </div>
            )}
        </div>

        {/* Controls/Stats */}
        <div className="flex justify-between items-end text-[#9BBC0F]">
            <div>
                <div className="text-xs">SCORE</div>
                <div className="text-xl font-bold font-mono">{String(score).padStart(4, '0')}</div>
            </div>
            <div className="text-right">
                <div className="text-xs">HI-SCORE</div>
                <div className="text-xl font-bold font-mono">{String(highScore).padStart(4, '0')}</div>
            </div>
        </div>

        {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-10">
                <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0f380f] text-[#9BBC0F] border-2 border-[#9BBC0F] font-bold shadow-lg hover:bg-[#306230] hover:scale-105 transition-all"
                >
                    <Play size={20} fill="currentColor" /> START GAME
                </button>
            </div>
        )}
      </div>
      
      <p className="mt-4 text-[#0f380f] font-bold text-xs opacity-75">Use Arrow Keys to Move</p>
    </div>
  );
};

export default SnakeWindowContent;