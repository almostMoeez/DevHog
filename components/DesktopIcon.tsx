import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  color: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick, color }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center gap-2 w-24 p-2 focus:outline-none"
    >
      <div 
        className={`w-14 h-14 ${color} border-2 border-black shadow-retro group-hover:shadow-retro-hover group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all flex items-center justify-center text-black`}
      >
        {icon}
      </div>
      <span className="font-bold text-sm text-black bg-ph-bg px-1 border border-transparent group-hover:border-black group-focus:border-black truncate max-w-full">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;