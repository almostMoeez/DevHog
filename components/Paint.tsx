import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Download, Trash2, Palette } from 'lucide-react';

const COLORS = ['#000000', '#FFFFFF', '#FF9058', '#F5D90A', '#354052', '#D8B4FE', '#FF0000', '#00FF00', '#0000FF'];
const SIZES = [2, 4, 8, 16];

const PaintWindowContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    if (!context) return;
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context) return;
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (context) context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col h-full bg-ph-bg">
      {/* Toolbar */}
      <div className="bg-white border-b-2 border-black p-2 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
            {/* Colors */}
            <div className="flex gap-1 bg-gray-100 p-1 border-2 border-gray-300">
            {COLORS.map(c => (
                <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 border-2 ${color === c ? 'border-black scale-110 z-10' : 'border-gray-400'} shadow-sm`}
                style={{ backgroundColor: c }}
                />
            ))}
            </div>

            {/* Sizes */}
            <div className="flex items-end gap-1 bg-gray-100 p-1 border-2 border-gray-300 h-9">
            {SIZES.map(s => (
                <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-6 flex justify-center items-center hover:bg-gray-200 ${size === s ? 'bg-gray-300' : ''}`}
                >
                <div className="rounded-full bg-black" style={{ width: s, height: s }}></div>
                </button>
            ))}
            </div>
        </div>

        <div className="flex gap-2">
            <button onClick={() => setColor('#FFFFFF')} className={`p-2 border-2 border-black ${color === '#FFFFFF' ? 'bg-ph-yellow' : 'bg-white'}`} title="Eraser">
                <Eraser size={18} />
            </button>
            <button onClick={clearCanvas} className="p-2 border-2 border-black bg-white hover:bg-red-100" title="Clear">
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-200 overflow-hidden relative cursor-crosshair flex items-center justify-center p-4">
        <div className="shadow-retro-lg border-2 border-black bg-white">
            <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="touch-none w-full h-auto max-w-full"
            />
        </div>
      </div>
    </div>
  );
};

export default PaintWindowContent;