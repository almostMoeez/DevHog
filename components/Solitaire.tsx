import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

// --- Types ---
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Color = 'red' | 'black';

interface Card {
  id: string;
  suit: Suit;
  value: number; // 1 (Ace) to 13 (King)
  faceUp: boolean;
}

interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles
  tableau: Card[][]; // 7 columns
}

interface DragState {
  cards: Card[]; // The stack being dragged
  source: { type: 'waste' | 'tableau' | 'foundation', colIdx?: number, cardIdx?: number };
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
}

// --- Constants & Helpers ---
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const getSuitColor = (suit: Suit): Color => (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
const getSuitSymbol = (suit: Suit) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};
const getValueLabel = (val: number) => {
  if (val === 1) return 'A';
  if (val === 11) return 'J';
  if (val === 12) return 'Q';
  if (val === 13) return 'K';
  return val.toString();
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push({ id: `${suit}-${value}`, suit, value, faceUp: false });
    });
  });
  return deck;
};

const shuffle = (array: Card[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Component ---
const SolitaireWindowContent: React.FC = () => {
  const [game, setGame] = useState<GameState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  // Refs for collision detection
  const tableauRefs = useRef<(HTMLDivElement | null)[]>([]);
  const foundationRefs = useRef<(HTMLDivElement | null)[]>([]);

  const initGame = () => {
    const deck = shuffle(createDeck());
    const newTableau: Card[][] = Array(7).fill([]).map(() => []);
    
    // Deal to tableau
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck.pop()!;
        card.faceUp = (j === i); // Top card face up
        newTableau[i].push(card);
      }
    }

    setGame({
      stock: deck,
      waste: [],
      foundations: [[], [], [], []],
      tableau: newTableau,
    });
    setDragState(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  // --- Drag and Drop Handlers ---

  const handleMouseDown = (e: React.MouseEvent, source: { type: 'waste' | 'tableau' | 'foundation', colIdx?: number, cardIdx?: number }, card: Card) => {
    if (!game || !card.faceUp) return;
    
    // Only left click
    if (e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();

    let draggingCards: Card[] = [];

    if (source.type === 'waste') {
      draggingCards = [card];
    } else if (source.type === 'foundation') {
      draggingCards = [card];
    } else if (source.type === 'tableau') {
      draggingCards = game.tableau[source.colIdx!].slice(source.cardIdx!);
    }

    if (draggingCards.length > 0) {
      // Calculate offset from the card's top-left
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      setDragState({
        cards: draggingCards,
        source,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        offsetX,
        offsetY
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      setDragState(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragState || !game) return;

      // Drop Logic
      let moveSuccessful = false;
      let target: { type: 'foundation' | 'tableau', idx: number } | null = null;

      // Check collisions with Foundations
      for (let i = 0; i < 4; i++) {
        const ref = foundationRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            target = { type: 'foundation', idx: i };
            break;
          }
        }
      }

      // Check collisions with Tableau if not dropped on foundation
      if (!target) {
        for (let i = 0; i < 7; i++) {
          const ref = tableauRefs.current[i];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            // Expanded collision area for empty columns or long columns
            // Use the rect of the entire column container
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom + 200) {
              target = { type: 'tableau', idx: i };
              break;
            }
          }
        }
      }

      if (target) {
        const movingCards = dragState.cards;
        const firstMoving = movingCards[0];
        const newGame = { 
            ...game,
            tableau: game.tableau.map(t => [...t]),
            foundations: game.foundations.map(f => [...f]),
            waste: [...game.waste],
            stock: [...game.stock]
        };

        if (target.type === 'tableau') {
          const targetCol = newGame.tableau[target.idx];
          const targetCard = targetCol.length > 0 ? targetCol[targetCol.length - 1] : null;
          
          const isKingMove = targetCol.length === 0 && firstMoving.value === 13;
          const isNormalMove = targetCard && targetCard.faceUp && 
                               getSuitColor(targetCard.suit) !== getSuitColor(firstMoving.suit) && 
                               targetCard.value === firstMoving.value + 1;

          if (isKingMove || isNormalMove) {
            // Valid Move
            removeFromSource(newGame, dragState.source);
            newGame.tableau[target.idx] = [...newGame.tableau[target.idx], ...movingCards];
            moveSuccessful = true;
          }

        } else if (target.type === 'foundation') {
          if (movingCards.length === 1) {
             const targetPile = newGame.foundations[target.idx];
             const targetCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;
             
             const isAceMove = targetPile.length === 0 && firstMoving.value === 1;
             const isNormalMove = targetCard && targetCard.suit === firstMoving.suit && targetCard.value === firstMoving.value - 1;

             if (isAceMove || isNormalMove) {
                removeFromSource(newGame, dragState.source);
                newGame.foundations[target.idx].push(firstMoving);
                moveSuccessful = true;
             }
          }
        }

        if (moveSuccessful) {
          setGame(newGame);
        }
      }

      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, game]);

  const removeFromSource = (g: GameState, source: { type: string, colIdx?: number, cardIdx?: number }) => {
    if (source.type === 'waste') {
        g.waste.pop();
    } else if (source.type === 'tableau') {
        const col = g.tableau[source.colIdx!];
        g.tableau[source.colIdx!] = col.slice(0, source.cardIdx!);
        // Flip up new top card
        const newCol = g.tableau[source.colIdx!];
        if (newCol.length > 0 && !newCol[newCol.length - 1].faceUp) {
            newCol[newCol.length - 1].faceUp = true;
        }
    } else if (source.type === 'foundation') {
        g.foundations[source.colIdx!].pop();
    }
  };

  const handleStockClick = () => {
    if (!game) return;
    const newStock = [...game.stock];
    const newWaste = [...game.waste];

    if (newStock.length === 0) {
      // Recycle
      const recycledStock = newWaste.reverse().map(c => ({ ...c, faceUp: false }));
      setGame({ ...game, stock: recycledStock, waste: [] });
    } else {
      // Draw
      const card = newStock.pop()!;
      card.faceUp = true;
      setGame({ ...game, stock: newStock, waste: [...newWaste, card] });
    }
  };

  if (!game) return <div>Loading...</div>;

  // --- Render Helpers ---

  const CardView = ({ card, style, onMouseDown, isDraggingGhost }: { card: Card | null, style?: React.CSSProperties, onMouseDown?: (e: React.MouseEvent) => void, isDraggingGhost?: boolean }) => {
    if (!card) return <div className="w-16 h-24 border-2 border-dashed border-white/20 rounded-md flex items-center justify-center text-white/30" style={style}></div>;

    if (!card.faceUp) {
       return (
         <div 
            className="w-16 h-24 bg-blue-800 border-2 border-white rounded-md shadow-sm relative overflow-hidden"
            style={{ ...style, backgroundImage: 'repeating-linear-gradient(45deg, #1e3a8a 25%, #172554 25%, #172554 50%, #1e3a8a 50%, #1e3a8a 75%, #172554 75%, #172554 100%)', backgroundSize: '10px 10px' }}
         >
            <div className="absolute inset-0 border-4 border-white/20 rounded-md"></div>
         </div>
       );
    }

    const colorClass = getSuitColor(card.suit) === 'red' ? 'text-red-600' : 'text-black';
    return (
      <div 
        onMouseDown={onMouseDown}
        className={`w-16 h-24 bg-white border-2 rounded-md cursor-pointer select-none flex flex-col justify-between p-1 
            ${isDraggingGhost ? 'shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-[9999]' : 'shadow-md'}
            ${!isDraggingGhost && 'hover:brightness-95'}
            border-gray-400
            ${colorClass}`}
        style={style}
      >
        <div className="text-xs font-bold leading-none">{getValueLabel(card.value)} {getSuitSymbol(card.suit)}</div>
        <div className="text-2xl self-center">{getSuitSymbol(card.suit)}</div>
        <div className="text-xs font-bold leading-none self-end rotate-180">{getValueLabel(card.value)} {getSuitSymbol(card.suit)}</div>
      </div>
    );
  };

  return (
    <div className="h-full bg-[#008000] flex flex-col p-4 font-sans select-none overflow-hidden relative">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
            {/* Stock */}
            <div onClick={handleStockClick} className="relative w-16 h-24 cursor-pointer group">
                {game.stock.length > 0 ? (
                    <CardView card={{ ...game.stock[0], faceUp: false } as Card} />
                ) : (
                    <div className="w-16 h-24 border-2 border-white/20 rounded-md flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <RefreshCw className="text-white/50" size={20} />
                    </div>
                )}
                <div className="absolute -top-6 text-white text-xs font-bold w-full text-center">Stock</div>
            </div>

            {/* Waste */}
            <div className="w-16 h-24 relative">
                {game.waste.length > 0 && (
                  (() => {
                     const card = game.waste[game.waste.length - 1];
                     // If currently dragging this specific card, hide it? 
                     // Usually better to keep it but maybe dim it. For simplicity, we just render it.
                     const isBeingDragged = dragState?.source.type === 'waste' && dragState.cards[0].id === card.id;
                     return (
                       <div style={{ opacity: isBeingDragged ? 0 : 1 }}>
                          <CardView 
                            card={card} 
                            onMouseDown={(e) => handleMouseDown(e, { type: 'waste' }, card)}
                          />
                       </div>
                     )
                  })()
                )}
                <div className="absolute -top-6 text-white text-xs font-bold w-full text-center">Waste</div>
            </div>
            
            <div className="ml-4 flex flex-col justify-center">
                 <button 
                    onClick={initGame} 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                 >
                    <RefreshCw size={12} /> New Game
                 </button>
            </div>
        </div>

        {/* Foundations */}
        <div className="flex gap-2">
            {game.foundations.map((pile, i) => (
                <div 
                  key={i} 
                  ref={el => foundationRefs.current[i] = el}
                  className="w-16 h-24 rounded-md border-2 border-white/10"
                >
                    {pile.length > 0 ? (
                         <CardView 
                           card={pile[pile.length - 1]} 
                           onMouseDown={(e) => handleMouseDown(e, { type: 'foundation', colIdx: i }, pile[pile.length - 1])}
                         />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-2xl font-bold">
                            {['♥', '♦', '♣', '♠'][i]}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="flex-1 relative flex gap-2 justify-center pl-2">
         {game.tableau.map((col, colIdx) => (
             <div 
               key={colIdx} 
               ref={el => tableauRefs.current[colIdx] = el}
               className="w-16 relative h-full min-h-[200px]"
             >
                 {col.length === 0 && (
                     <div className="w-16 h-24 border-2 border-white/10 rounded-md bg-black/10"></div>
                 )}
                 {col.map((card, cardIdx) => {
                     const isBeingDragged = dragState?.source.type === 'tableau' && 
                                            dragState.source.colIdx === colIdx && 
                                            cardIdx >= dragState.source.cardIdx!;
                     return (
                        <div 
                            key={card.id} 
                            className="absolute w-16"
                            style={{ 
                                top: `${cardIdx * 25}px`, 
                                zIndex: cardIdx,
                                opacity: isBeingDragged ? 0 : 1
                            }}
                        >
                            <CardView 
                                card={card}
                                onMouseDown={(e) => handleMouseDown(e, { type: 'tableau', colIdx, cardIdx }, card)}
                            />
                        </div>
                     );
                 })}
             </div>
         ))}
      </div>

      {/* Dragging Layer */}
      {dragState && (
          <div 
            style={{ 
                position: 'fixed', 
                left: dragState.currentX - dragState.offsetX, 
                top: dragState.currentY - dragState.offsetY,
                zIndex: 9999,
                pointerEvents: 'none', // Critical for mousemove/up to fire on window
            }}
          >
              {dragState.cards.map((card, i) => (
                  <div key={card.id} style={{ position: 'absolute', top: i * 25 }}>
                      <CardView card={card} isDraggingGhost />
                  </div>
              ))}
          </div>
      )}

      <div className="absolute bottom-2 right-2 text-white/50 text-xs font-mono">
          Solitaire v2.0 | Drag & Drop Enabled
      </div>
    </div>
  );
};

export default SolitaireWindowContent;