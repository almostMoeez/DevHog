import React, { useState, useEffect } from 'react';
import { Bomb, Flag, Smile, Frown, Meh } from 'lucide-react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const MinesweeperWindowContent: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameStarted && !gameOver && !win) {
      interval = setInterval(() => setTimer(t => Math.min(t + 1, 999)), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, win]);

  const initGame = () => {
    // 1. Create empty grid
    let newGrid: Cell[][] = [];
    for (let y = 0; y < ROWS; y++) {
      let row: Cell[] = [];
      for (let x = 0; x < COLS; x++) {
        row.push({ x, y, isMine: false, isOpen: false, isFlagged: false, neighborCount: 0 });
      }
      newGrid.push(row);
    }

    // 2. Place Mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!newGrid[y][x].isMine) {
        newGrid[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate Neighbors
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!newGrid[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (y + dy >= 0 && y + dy < ROWS && x + dx >= 0 && x + dx < COLS) {
                if (newGrid[y + dy][x + dx].isMine) count++;
              }
            }
          }
          newGrid[y][x].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setFlagsUsed(0);
    setGameStarted(false);
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameOver || win || grid[y][x].isFlagged || grid[y][x].isOpen) return;

    if (!gameStarted) setGameStarted(true);

    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[y][x];

    if (cell.isMine) {
      // Boom
      cell.isOpen = true;
      setGameOver(true);
      // Reveal all mines
      newGrid.forEach(row => row.forEach(c => {
        if (c.isMine) c.isOpen = true;
      }));
    } else {
      floodFill(newGrid, x, y);
      checkWin(newGrid);
    }
    setGrid(newGrid);
  };

  const floodFill = (grid: Cell[][], x: number, y: number) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS || grid[y][x].isOpen || grid[y][x].isFlagged) return;
    
    grid[y][x].isOpen = true;

    if (grid[y][x].neighborCount === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) floodFill(grid, x + dx, y + dy);
        }
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || win || grid[y][x].isOpen) return;
    if (!gameStarted) setGameStarted(true);

    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[y][x];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsUsed(prev => prev - 1);
    } else {
      if (flagsUsed < MINES) {
          cell.isFlagged = true;
          setFlagsUsed(prev => prev + 1);
      }
    }
    setGrid(newGrid);
  };

  const checkWin = (currentGrid: Cell[][]) => {
    let openCount = 0;
    currentGrid.forEach(row => row.forEach(c => {
      if (c.isOpen) openCount++;
    }));
    if (openCount === (ROWS * COLS - MINES)) {
      setWin(true);
      setGameOver(true);
    }
  };

  const getNumberColor = (num: number) => {
    const colors = ['transparent', 'blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'gray'];
    return colors[num] || 'black';
  };

  return (
    <div className="bg-[#c0c0c0] p-1 border-2 border-white border-b-gray-500 border-r-gray-500 h-full flex flex-col select-none">
      
      {/* Header Info */}
      <div className="flex justify-between items-center p-2 mb-2 border-2 border-gray-500 border-b-white border-r-white bg-[#c0c0c0]">
        <div className="bg-black text-red-500 font-mono text-2xl px-1 border-2 border-gray-500 border-b-white border-r-white w-16 text-right">
            {String(MINES - flagsUsed).padStart(3, '0')}
        </div>
        
        <button 
            onClick={initGame}
            className="w-10 h-10 border-2 border-white border-b-gray-500 border-r-gray-500 active:border-gray-500 active:border-b-white active:border-r-white flex items-center justify-center bg-[#c0c0c0] shadow-sm"
        >
            {gameOver ? <Frown className="text-black" size={24} /> : win ? <Smile className="text-black" size={24} /> : <Meh className="text-black" size={24} />}
        </button>

        <div className="bg-black text-red-500 font-mono text-2xl px-1 border-2 border-gray-500 border-b-white border-r-white w-16 text-right">
            {String(timer).padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex justify-center items-start overflow-auto">
        <div className="border-4 border-gray-500 border-b-white border-r-white inline-block">
            {grid.map((row, y) => (
            <div key={y} className="flex">
                {row.map((cell, x) => (
                <div
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    onContextMenu={(e) => handleContextMenu(e, x, y)}
                    className={`w-8 h-8 flex items-center justify-center text-lg font-bold border-2 
                    ${cell.isOpen 
                        ? 'border-gray-400 border-l-gray-400 border-t-gray-400 bg-[#c0c0c0]' 
                        : 'border-white border-b-gray-500 border-r-gray-500 bg-[#c0c0c0] active:border-none'
                    }`}
                >
                    {cell.isOpen ? (
                        cell.isMine ? <Bomb size={18} fill="black" /> : 
                        cell.neighborCount > 0 ? <span style={{ color: getNumberColor(cell.neighborCount) }}>{cell.neighborCount}</span> : 
                        null
                    ) : (
                        cell.isFlagged ? <Flag size={16} className="text-red-600 fill-red-600" /> : null
                    )}
                </div>
                ))}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperWindowContent;