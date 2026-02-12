import React, { useState, useEffect } from 'react';
import { Rocket, Coffee, Users, Server, Zap } from 'lucide-react';

const ClickerWindowContent: React.FC = () => {
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [stats, setStats] = useState({
    clickPower: 1,
    autoLinesPerSec: 0,
  });
  
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Coffee', cost: 20, description: '+1 Click Power', type: 'click', value: 1, count: 0, icon: <Coffee size={16} /> },
    { id: 2, name: 'Junior Dev', cost: 100, description: '+5 LOC/sec', type: 'auto', value: 5, count: 0, icon: <Users size={16} /> },
    { id: 3, name: 'Copilot', cost: 500, description: '+25 LOC/sec', type: 'auto', value: 25, count: 0, icon: <Zap size={16} /> },
    { id: 4, name: 'Render Farm', cost: 2000, description: '+100 LOC/sec', type: 'auto', value: 100, count: 0, icon: <Server size={16} /> },
  ]);

  // Auto clicker loop
  useEffect(() => {
    if (stats.autoLinesPerSec === 0) return;
    const interval = setInterval(() => {
      setLinesOfCode(prev => prev + stats.autoLinesPerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [stats.autoLinesPerSec]);

  const handleClick = () => {
    setLinesOfCode(prev => prev + stats.clickPower);
    // Visual feedback could go here
  };

  const buyUpgrade = (id: number) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || linesOfCode < upgrade.cost) return;

    setLinesOfCode(prev => prev - upgrade.cost);
    
    // Update upgrade counts and costs
    setUpgrades(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, count: u.count + 1, cost: Math.floor(u.cost * 1.5) };
      }
      return u;
    }));

    // Update Stats
    if (upgrade.type === 'click') {
        setStats(prev => ({ ...prev, clickPower: prev.clickPower + upgrade.value }));
    } else {
        setStats(prev => ({ ...prev, autoLinesPerSec: prev.autoLinesPerSec + upgrade.value }));
    }
  };

  return (
    <div className="flex h-full bg-ph-bg">
      {/* Left Panel: The Button and Stats */}
      <div className="w-1/2 p-6 flex flex-col items-center justify-center border-r-2 border-black bg-white relative overflow-hidden">
        {/* Falling code effect could go here */}
        
        <div className="text-center mb-8 z-10">
            <h2 className="text-4xl font-extrabold mb-2 text-ph-blue">{Math.floor(linesOfCode).toLocaleString()}</h2>
            <p className="text-sm uppercase font-bold tracking-widest text-gray-500">Lines Shipped</p>
            <div className="text-xs mt-2 text-gray-400">
                {stats.autoLinesPerSec} LOC/sec
            </div>
        </div>

        <button 
            onClick={handleClick}
            className="w-48 h-48 rounded-full bg-ph-orange border-4 border-black shadow-retro-lg active:shadow-none active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group z-10 hover:bg-[#ff8040]"
        >
            <Rocket size={48} className="text-black group-hover:animate-bounce" />
            <span className="font-black text-xl text-black">SHIP IT!</span>
        </button>
      </div>

      {/* Right Panel: Upgrades Shop */}
      <div className="w-1/2 flex flex-col h-full bg-gray-50">
        <div className="p-4 border-b-2 border-black bg-ph-yellow">
            <h3 className="font-bold text-lg flex items-center gap-2">Engineering Budget</h3>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-3">
            {upgrades.map(upgrade => (
                <button
                    key={upgrade.id}
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={linesOfCode < upgrade.cost}
                    className="w-full flex items-center justify-between p-3 bg-white border-2 border-black shadow-retro hover:shadow-retro-hover disabled:opacity-50 disabled:shadow-none disabled:bg-gray-100 transition-all text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ph-bg border border-black flex items-center justify-center">
                            {upgrade.icon}
                        </div>
                        <div>
                            <div className="font-bold text-sm">{upgrade.name}</div>
                            <div className="text-xs text-gray-500">{upgrade.description}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-ph-orange">{upgrade.cost.toLocaleString()} LOC</div>
                        <div className="text-xs text-black font-mono">Lvl {upgrade.count}</div>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClickerWindowContent;