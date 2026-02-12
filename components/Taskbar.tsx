import React, { useState, useEffect, useRef } from 'react';
import { Menu, FileText, Folder, Briefcase, Activity, Terminal, Palette, Gamepad2, Bomb, Mail, User, Heart } from 'lucide-react';
import { WindowId } from '../types';

interface TaskbarProps {
  onStartClick: () => void;
  openWindows: Array<{ id: string; title: string; isMinimized: boolean }>;
  onWindowClick: (id: string) => void;
  onOpenApp: (id: WindowId, title: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onWindowClick, onOpenApp }) => {
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Check if the start button was clicked, if so, let the toggle handler handle it
        const startBtn = document.getElementById('start-button');
        if (startBtn && startBtn.contains(event.target as Node)) {
           return;
        }
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleAppClick = (id: WindowId, title: string) => {
    onOpenApp(id, title);
    setIsMenuOpen(false);
  };

  const apps = [
    { id: 'about', title: 'ReadMe.txt', icon: <FileText size={16} />, color: 'bg-ph-yellow' },
    { id: 'projects', title: 'Projects', icon: <Folder size={16} />, color: 'bg-ph-purple' },
    { id: 'experience', title: 'Career', icon: <Briefcase size={16} />, color: 'bg-ph-blue text-white' },
    { id: 'skills', title: 'Skills', icon: <Activity size={16} />, color: 'bg-white' },
    { id: 'chat', title: 'HogBot.exe', icon: <Terminal size={16} />, color: 'bg-ph-orange' },
    { id: 'paint', title: 'HogPaint', icon: <Palette size={16} />, color: 'bg-pink-300' },
    { id: 'snake', title: 'Snake', icon: <Gamepad2 size={16} />, color: 'bg-[#9BBC0F]' },
    { id: 'minesweeper', title: 'Minesweeper', icon: <Bomb size={16} />, color: 'bg-gray-300' },
    { id: 'pet', title: 'HogGotchi', icon: <Heart size={16} />, color: 'bg-red-300' },
    { id: 'contact', title: 'Contact', icon: <Mail size={16} />, color: 'bg-ph-dark text-white' },
  ];

  return (
    <>
      {/* Start Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed bottom-12 left-0 w-64 bg-ph-bg border-2 border-black shadow-retro-lg z-[10000] flex flex-col animate-in slide-in-from-bottom-2 duration-200 origin-bottom-left"
        >
          {/* Menu Header */}
          <div className="bg-black text-white p-2 flex items-center gap-2 border-b-2 border-black">
             <div className="w-8 h-8 bg-ph-orange border-2 border-white flex items-center justify-center text-black font-bold text-xs shadow-sm transform -rotate-3">
                DH
             </div>
             <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">DevHog OS 98</span>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1 bg-white">
             {apps.map((app) => (
               <button
                 key={app.id}
                 onClick={() => handleAppClick(app.id as WindowId, app.title)}
                 className="w-full text-left px-3 py-2 hover:bg-ph-blue hover:text-white transition-colors flex items-center gap-3 border border-transparent hover:border-black group"
               >
                  <div className={`w-6 h-6 border border-black flex items-center justify-center ${app.color} shadow-sm group-hover:shadow-none transition-shadow text-black rounded-sm`}>
                    {app.icon}
                  </div>
                  <span className="font-bold text-sm">{app.title}</span>
               </button>
             ))}
          </div>

          {/* Empty footer for border aesthetics, or just remove it if cleaner. We'll keep a small border strip */}
          <div className="border-t-2 border-black bg-ph-bg h-2"></div>
        </div>
      )}

      {/* Taskbar */}
      <div className="h-12 bg-ph-bg border-t-2 border-black fixed bottom-0 left-0 right-0 z-[9999] flex items-center px-2 justify-between select-none shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] gap-2">
        
        {/* Start Button Area */}
        <div className="flex items-center gap-2 h-full py-1.5 shrink-0">
          <button 
            id="start-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-full px-3 border-2 border-black font-bold text-sm shadow-retro-hover transition-all flex items-center gap-2
              ${isMenuOpen ? 'bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-ph-orange hover:bg-black hover:text-white'}
            `}
          >
            <div className={`w-4 h-4 border-2 ${isMenuOpen ? 'bg-white border-black' : 'bg-black border-white'}`}></div>
            Start
          </button>
          <div className="h-full w-0.5 bg-black mx-1 opacity-20"></div>
        </div>

        {/* Running Apps - Flexible Container */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto h-full py-1.5 min-w-0 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {openWindows.map((win) => (
              <button
                key={win.id}
                onClick={() => onWindowClick(win.id)}
                className={`h-full px-3 border-2 border-black font-bold text-xs flex items-center gap-2 min-w-[120px] max-w-[200px] transition-all shrink-0
                  ${win.isMinimized 
                    ? 'bg-white text-gray-500 shadow-none hover:bg-gray-100' 
                    : 'bg-ph-yellow shadow-retro-hover active:shadow-none active:translate-x-[1px] active:translate-y-[1px]'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${win.isMinimized ? 'bg-gray-300' : 'bg-black'}`}></div>
                <span className="truncate">{win.title}</span>
              </button>
            ))}
        </div>

        {/* Clock Area */}
        <div className="hidden md:flex items-center px-4 h-8 bg-white border-2 border-black shadow-retro-hover gap-2 shrink-0">
          <Activity size={14} className="animate-pulse text-green-600" />
          <span className="font-mono font-bold text-sm">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </>
  );
};

export default Taskbar;