import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  isOpen: boolean;
  isMinimized?: boolean;
  originRect?: { x: number; y: number; width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  bgColor?: string;
  icon?: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  title,
  isOpen,
  isMinimized = false,
  originRect,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  children,
  defaultPosition = { x: 20, y: 20 },
  bgColor = 'bg-white',
  icon
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // We use this state to apply transient transform styles for animations.
  // When idle, it should be empty or 'none' to allow drag/layout to work normally.
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({
      transform: 'scale(1)',
      opacity: 1
  });
  
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const isMounting = useRef(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  }, []);

  const currentX = isMaximized ? 0 : position.x;
  const currentY = isMaximized ? 0 : position.y;

  // Animation Logic
  useEffect(() => {
    if (!isOpen) return;

    // 1. Handle Initial Mount (Open Animation)
    if (isMounting.current) {
        isMounting.current = false;
        
        if (originRect && !isMinimized) {
            // Calculate delta from Icon (origin) to Window Position (current)
            const deltaX = originRect.x - currentX;
            const deltaY = originRect.y - currentY;

            // Instant: Set to Origin
            setAnimStyle({
                transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`,
                opacity: 0,
                transition: 'none'
            });

            // Frame 2: Animate to Window Position
            requestAnimationFrame(() => {
                // Force reflow
                // windowRef.current?.getBoundingClientRect(); 
                
                requestAnimationFrame(() => {
                    setAnimStyle({
                        transform: `translate(0px, 0px) scale(1)`,
                        opacity: 1,
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out'
                    });
                });
            });
        }
        return; 
    }

    // 2. Handle Updates (Minimize/Restore)
    if (isMinimized) {
        // Animate TO Origin
        if (originRect) {
            const deltaX = originRect.x - currentX;
            const deltaY = originRect.y - currentY;
            
            setAnimStyle({
                transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`,
                opacity: 0,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in'
            });
        } else {
             // Fallback: Drop down
             setAnimStyle({
                transform: `translate(0px, 200px) scale(0.8)`,
                opacity: 0,
                transition: 'all 0.3s ease-in'
             });
        }
    } else {
        // Restore FROM Origin (or Fallback)
        setAnimStyle({
            transform: `translate(0px, 0px) scale(1)`,
            opacity: 1,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out'
        });
    }

  }, [isMinimized, isOpen, originRect, currentX, currentY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
        dragStartRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition({ x: newX, y: newY });
        
        // Ensure animation transform doesn't fight the drag
        setAnimStyle({
            transform: `translate(0px, 0px) scale(1)`,
            opacity: 1,
            transition: 'none'
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      className={`fixed flex flex-col border-2 border-black shadow-retro-lg overflow-hidden ${bgColor} ${isMinimized ? 'pointer-events-none' : ''}`}
      style={{
        left: currentX,
        top: currentY,
        width: isMaximized ? '100%' : 'min(800px, 90vw)',
        height: isMaximized ? 'calc(100% - 48px)' : 'min(600px, 80vh)',
        zIndex: zIndex,
        borderRadius: isMaximized ? 0 : '2px',
        transformOrigin: 'top left',
        ...animStyle 
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className={`h-10 border-b-2 border-black flex items-center justify-between px-2 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} bg-ph-bg`}
      >
        <div className="flex items-center gap-2">
            {icon}
            <span className="font-bold text-sm uppercase tracking-wide truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="p-1 hover:bg-ph-yellow border-2 border-transparent hover:border-black rounded-sm transition-colors group"
            title="Minimize"
          >
            <Minus size={14} className="group-active:scale-90" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="p-1 hover:bg-ph-blue hover:text-white border-2 border-transparent hover:border-black rounded-sm transition-colors hidden md:block group"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
                <Minimize2 size={14} className="group-active:scale-90" />
            ) : (
                <Maximize2 size={14} className="group-active:scale-90" />
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black rounded-sm transition-colors group"
            title="Close"
          >
            <X size={14} className="group-active:scale-90" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-0 bg-white relative">
        {children}
      </div>
    </div>
  );
};

export default Window;