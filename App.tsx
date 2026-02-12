
import React, { useState, useEffect } from 'react';
import { FileText, Folder, Briefcase, Mail, Terminal, Bot, Activity, Palette, Gamepad2, Bomb, Heart, FolderOpen, Globe } from 'lucide-react';

import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';

// Content Components
import AboutWindowContent from './components/Hero'; 
import ProjectsWindowContent from './components/Projects';
import ExperienceWindowContent from './components/Experience';
import ChatWindowContent from './components/ChatWidget';
import ContactWindowContent from './components/Footer';
import SkillsWindowContent from './components/Skills';
import PaintWindowContent from './components/Paint';
import SnakeWindowContent from './components/Snake';
import MinesweeperWindowContent from './components/Minesweeper';
import VirtualPetWindowContent from './components/VirtualPet';
import ProjectDetailsWindowContent from './components/ProjectDetails';
import BrowserWindowContent from './components/Browser';

import { WindowId, WindowState } from './types';
import { PROJECTS } from './constants';

function App() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'about', title: 'ReadMe.txt', isOpen: true, zIndex: 1, isMinimized: false, position: { x: 40, y: 40 } }
  ]);
  const [activeId, setActiveId] = useState<WindowId | null>('about');
  const [nextZIndex, setNextZIndex] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  // Boot sequence effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const openWindow = (id: WindowId, title: string, defaultPos: {x:number, y:number} = {x: 50, y: 50}, originRect?: {x:number, y:number, width:number, height:number}, metadata?: any) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        // If restoring from minimized, update origin if provided, otherwise keep existing
        // Also update metadata if provided (e.g. browsing a new link)
        return prev.map(w => w.id === id ? { 
            ...w, 
            isOpen: true, 
            isMinimized: false, 
            zIndex: nextZIndex, 
            originRect: originRect || w.originRect,
            metadata: metadata || w.metadata
        } : w);
      }
      return [...prev, { id, title, isOpen: true, zIndex: nextZIndex, isMinimized: false, position: defaultPos, originRect, metadata }];
    });
    setNextZIndex(n => n + 1);
    setActiveId(id);
  };

  const closeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveId(null);
  };

  const focusWindow = (id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setNextZIndex(n => n + 1);
    setActiveId(id);
  };

  const toggleWindowFromTaskbar = (id: WindowId) => {
     const win = windows.find(w => w.id === id);
     if (win?.isMinimized || activeId !== id) {
        focusWindow(id);
     } else {
        minimizeWindow(id);
     }
  };

  const handleOpenApp = (id: WindowId, title: string, e?: React.MouseEvent) => {
      // Capture origin rect from event target (the icon)
      let originRect;
      if (e) {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          originRect = {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
          };
      }

      // Default positions
      const positions: Record<string, {x:number, y:number}> = {
          about: { x: 40, y: 40 },
          projects: { x: 80, y: 80 },
          experience: { x: 120, y: 120 },
          skills: { x: 160, y: 160 },
          chat: { x: 600, y: 80 },
          paint: { x: 200, y: 100 },
          snake: { x: 300, y: 150 },
          minesweeper: { x: 350, y: 180 },
          pet: { x: 450, y: 100 },
          contact: { x: 200, y: 200 }
      };
      
      // Dynamic positioning for project windows to cascade them
      const isDynamic = id.startsWith('project-') || id.startsWith('browser-');
      const pos = positions[id] || (isDynamic ? { x: 60 + (windows.length * 20), y: 60 + (windows.length * 20) } : {x: 50, y: 50});
      
      openWindow(id, title, pos, originRect);
  };

  // Modified to accept Event for originRect calculation
  const handleOpenProject = (projectId: string, e?: React.MouseEvent) => {
     const project = PROJECTS.find(p => p.id === projectId);
     if (project) {
        handleOpenApp(`project-${projectId}`, `Project: ${project.title}`, e);
     }
  };

  const handleOpenBrowser = (url: string, originRect: {x:number, y:number, width:number, height:number}, viewMode: 'mobile' | 'desktop' = 'desktop') => {
      const browserId = `browser-${Date.now()}`;
      // Use metadata to pass specific props to the browser component
      const metadata = { initialUrl: url, viewMode };
      openWindow(browserId, `Netscape Navigator`, { x: 100, y: 50 }, originRect, metadata);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-black text-green-500 font-mono p-8 flex flex-col justify-start select-none cursor-wait">
         <div className="mb-4 text-xl font-bold">DEVHOG BIOS v1.02.44</div>
         <div className="mb-2">CPU:  INTEL 80486 DX2-66</div>
         <div className="mb-8">RAM:  64,000 KB OK</div>
         
         <div className="mb-2 uppercase">Loading Operating System...</div>
         
         <div className="w-80 max-w-full h-6 border-2 border-green-700 p-0.5 mt-2">
            <div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards]" style={{ width: '0%' }}></div>
         </div>
  
         <div className="mt-auto text-green-800 text-xs">
            Hit DEL to enter SETUP
         </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-ph-bg font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Desktop Icons - Left Side (Technical) */}
      <div className="absolute top-0 left-0 bottom-12 p-6 flex flex-col gap-6 z-0">
        <DesktopIcon 
          label="ReadMe.txt" 
          icon={<FileText size={32} />} 
          color="bg-ph-yellow"
          onClick={(e) => handleOpenApp('about', 'ReadMe.txt', e)}
        />
        <DesktopIcon 
          label="Projects" 
          icon={<Folder size={32} />} 
          color="bg-ph-purple"
          onClick={(e) => handleOpenApp('projects', 'Projects', e)}
        />
        <DesktopIcon 
          label="Career" 
          icon={<Briefcase size={32} />} 
          color="bg-ph-blue text-white"
          onClick={(e) => handleOpenApp('experience', 'Experience', e)}
        />
        <DesktopIcon 
          label="Skills" 
          icon={<Activity size={32} />} 
          color="bg-white"
          onClick={(e) => handleOpenApp('skills', 'System_Monitor.exe', e)}
        />
        <DesktopIcon 
          label="HogBot.exe" 
          icon={<Terminal size={32} />} 
          color="bg-ph-orange"
          onClick={(e) => handleOpenApp('chat', 'HogBot.exe', e)}
        />
        <DesktopIcon 
          label="Contact" 
          icon={<Mail size={32} />} 
          color="bg-ph-dark text-white"
          onClick={(e) => handleOpenApp('contact', 'Contact.msg', e)}
        />
      </div>

      {/* Desktop Icons - Right Side (Fun) */}
      <div className="absolute top-0 right-0 bottom-12 p-6 flex flex-col gap-6 z-0 items-end">
        <DesktopIcon 
          label="HogPaint" 
          icon={<Palette size={32} />} 
          color="bg-pink-300"
          onClick={(e) => handleOpenApp('paint', 'HogPaint.exe', e)}
        />
        <DesktopIcon 
          label="Snake" 
          icon={<Gamepad2 size={32} />} 
          color="bg-[#9BBC0F]"
          onClick={(e) => handleOpenApp('snake', 'Snake.exe', e)}
        />
        <DesktopIcon 
          label="Minesweeper" 
          icon={<Bomb size={32} />} 
          color="bg-gray-300"
          onClick={(e) => handleOpenApp('minesweeper', 'Minesweeper.exe', e)}
        />
        <DesktopIcon 
          label="HogGotchi" 
          icon={<Heart size={32} />} 
          color="bg-red-300"
          onClick={(e) => handleOpenApp('pet', 'Pet.exe', e)}
        />
      </div>

      {/* Windows Layer */}
      {windows.map(win => (
        // Render if isOpen is true, regardless of minimized state, to allow animation
        win.isOpen && (
            <Window
            key={win.id}
            title={win.title}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            originRect={win.originRect}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            zIndex={win.zIndex}
            defaultPosition={win.position}
            icon={
                win.id === 'chat' ? <Bot size={16}/> : 
                win.id === 'paint' ? <Palette size={16}/> :
                win.id === 'snake' ? <Gamepad2 size={16}/> :
                win.id === 'minesweeper' ? <Bomb size={16}/> :
                win.id === 'pet' ? <Heart size={16}/> :
                win.id.startsWith('project-') ? <FolderOpen size={16} /> :
                win.id.startsWith('browser-') ? <Globe size={16} /> :
                undefined
            }
            bgColor={
                win.id === 'contact' ? 'bg-black' : 
                win.id === 'snake' ? 'bg-[#9BBC0F]' : 
                win.id === 'minesweeper' ? 'bg-[#c0c0c0]' :
                'bg-white'
            }
            >
            {win.id === 'about' && <AboutWindowContent />}
            {win.id === 'projects' && <ProjectsWindowContent onOpenProject={handleOpenProject} />}
            {win.id === 'experience' && <ExperienceWindowContent />}
            {win.id === 'skills' && <SkillsWindowContent />}
            {win.id === 'chat' && <ChatWindowContent />}
            {win.id === 'paint' && <PaintWindowContent />}
            {win.id === 'snake' && <SnakeWindowContent />}
            {win.id === 'minesweeper' && <MinesweeperWindowContent />}
            {win.id === 'pet' && <VirtualPetWindowContent />}
            {win.id === 'contact' && <ContactWindowContent />}
            
            {win.id.startsWith('project-') && (
                <ProjectDetailsWindowContent 
                    projectId={win.id.replace('project-', '')} 
                    onPreview={handleOpenBrowser}
                />
            )}
            
            {win.id.startsWith('browser-') && (
                <BrowserWindowContent 
                    initialUrl={win.metadata?.initialUrl || '#'}
                    viewMode={win.metadata?.viewMode || 'desktop'} 
                />
            )}
            </Window>
        )
      ))}

      {/* Taskbar */}
      <Taskbar 
        onStartClick={() => openWindow('about', 'ReadMe.txt')}
        onOpenApp={(id, title) => handleOpenApp(id, title)}
        openWindows={windows.filter(w => w.isOpen)}
        onWindowClick={(id) => toggleWindowFromTaskbar(id as WindowId)}
      />
    </div>
  );
}

export default App;
