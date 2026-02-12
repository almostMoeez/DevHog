import React, { useState, useEffect } from 'react';
import { Heart, Utensils, Moon, Cloud } from 'lucide-react';

const VirtualPetWindowContent: React.FC = () => {
  const [stats, setStats] = useState({
    hunger: 100, // 100 = full
    happiness: 100, // 100 = happy
    energy: 100, // 100 = awake
  });
  const [petState, setPetState] = useState<'IDLE' | 'EATING' | 'SLEEPING' | 'PLAYING' | 'DEAD'>('IDLE');
  const [message, setMessage] = useState("HogGotchi is chilling.");

  useEffect(() => {
    if (petState === 'DEAD') return;

    const interval = setInterval(() => {
      setStats(prev => {
        // Decay
        const newHunger = Math.max(0, prev.hunger - 2); // Hungry fast
        const newHappiness = Math.max(0, prev.happiness - 1);
        const newEnergy = petState === 'SLEEPING' ? Math.min(100, prev.energy + 5) : Math.max(0, prev.energy - 1);

        if (newHunger === 0) {
            setPetState('DEAD');
            setMessage("HogGotchi has fainted from hunger! Reset to revive.");
        } else if (newEnergy === 0 && petState !== 'SLEEPING') {
            setPetState('SLEEPING');
            setMessage("HogGotchi passed out from exhaustion.");
        }

        return { hunger: newHunger, happiness: newHappiness, energy: newEnergy };
      });

      // Reset animation states back to idle
      if (petState === 'EATING' || petState === 'PLAYING') {
          setPetState('IDLE');
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [petState]);

  const feed = () => {
      if (petState === 'DEAD' || petState === 'SLEEPING') return;
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 30) }));
      setPetState('EATING');
      setMessage("Nom nom nom! Tacos are great.");
  };

  const play = () => {
      if (petState === 'DEAD' || petState === 'SLEEPING') return;
      if (stats.energy < 20) {
          setMessage("Too tired to play...");
          return;
      }
      setStats(prev => ({ 
          ...prev, 
          happiness: Math.min(100, prev.happiness + 20),
          energy: Math.max(0, prev.energy - 15) 
      }));
      setPetState('PLAYING');
      setMessage("Wheee! Zoomies!");
  };

  const toggleSleep = () => {
      if (petState === 'DEAD') return;
      if (petState === 'SLEEPING') {
          setPetState('IDLE');
          setMessage("Good morning!");
      } else {
          setPetState('SLEEPING');
          setMessage("Zzz... dreaming of bugs.");
      }
  };

  const reset = () => {
      setStats({ hunger: 100, happiness: 100, energy: 100 });
      setPetState('IDLE');
      setMessage("HogGotchi is reborn!");
  };

  // ASCII Art Render
  const renderPet = () => {
      if (petState === 'DEAD') return <pre className="text-4xl text-gray-500">( x _ x )</pre>;
      if (petState === 'SLEEPING') return <pre className="text-4xl text-blue-500">( - . - ) zZz</pre>;
      if (petState === 'EATING') return <pre className="text-4xl text-orange-500">( 0 o 0 ) &lt;🌮</pre>;
      if (petState === 'PLAYING') return <pre className="text-4xl text-pink-500">\ ( ^ o ^ ) /</pre>;
      
      // Idle states based on happiness
      if (stats.happiness < 30) return <pre className="text-4xl text-blue-800">( T _ T )</pre>;
      if (stats.hunger < 30) return <pre className="text-4xl text-red-500">( @ _ @ )</pre>; // Dizzy
      return <pre className="text-4xl text-black">( • ᴥ • )</pre>;
  };

  const getBarColor = (val: number) => {
      if (val > 60) return 'bg-green-500';
      if (val > 30) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-full bg-ph-bg">
        <div className="flex-1 flex flex-col items-center justify-center bg-sky-100 m-4 border-4 border-black shadow-retro relative overflow-hidden group">
            {/* Moving Clouds */}
            <div className="absolute top-8 left-0 opacity-80 animate-float-slow pointer-events-none w-full">
                <Cloud size={48} className="text-white fill-white drop-shadow-sm" />
            </div>
            <div className="absolute top-24 left-0 opacity-60 animate-float-fast pointer-events-none delay-1000 w-full">
                <Cloud size={32} className="text-white fill-white drop-shadow-sm" />
            </div>
            <div className="absolute top-12 left-0 opacity-70 animate-float-medium pointer-events-none delay-2000 w-full">
                <Cloud size={40} className="text-white fill-white drop-shadow-sm" />
            </div>
            
            <div className="z-10 mb-8 font-mono font-bold animate-bounce duration-1000 transform scale-125">{renderPet()}</div>
            
            <div className="text-center font-bold font-mono bg-white/80 p-2 rounded w-3/4 border-2 border-dashed border-gray-400 z-10 backdrop-blur-sm">
                "{message}"
            </div>

            {petState === 'DEAD' && (
                <button onClick={reset} className="mt-4 px-4 py-2 bg-red-500 text-white font-bold border-2 border-black shadow-retro hover:translate-y-1 hover:shadow-none z-10">
                    REVIVE
                </button>
            )}
        </div>

        {/* Stats & Controls */}
        <div className="p-4 bg-gray-100 border-t-2 border-black grid grid-cols-3 gap-4">
            {/* Hunger */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold"><span>HUNGER</span> <span>{Math.round(stats.hunger)}%</span></div>
                <div className="h-4 bg-white border-2 border-black"><div className={`h-full ${getBarColor(stats.hunger)}`} style={{width: `${stats.hunger}%`}}></div></div>
                <button onClick={feed} disabled={petState === 'DEAD'} className="mt-1 flex items-center justify-center gap-1 bg-white border-2 border-black hover:bg-orange-100 py-2 disabled:opacity-50">
                    <Utensils size={14} /> Feed
                </button>
            </div>

            {/* Happiness */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold"><span>HAPPY</span> <span>{Math.round(stats.happiness)}%</span></div>
                <div className="h-4 bg-white border-2 border-black"><div className={`h-full ${getBarColor(stats.happiness)}`} style={{width: `${stats.happiness}%`}}></div></div>
                <button onClick={play} disabled={petState === 'DEAD'} className="mt-1 flex items-center justify-center gap-1 bg-white border-2 border-black hover:bg-pink-100 py-2 disabled:opacity-50">
                    <Heart size={14} /> Play
                </button>
            </div>

            {/* Energy */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold"><span>ENERGY</span> <span>{Math.round(stats.energy)}%</span></div>
                <div className="h-4 bg-white border-2 border-black"><div className={`h-full ${getBarColor(stats.energy)}`} style={{width: `${stats.energy}%`}}></div></div>
                <button onClick={toggleSleep} disabled={petState === 'DEAD'} className="mt-1 flex items-center justify-center gap-1 bg-white border-2 border-black hover:bg-blue-100 py-2 disabled:opacity-50">
                    <Moon size={14} /> {petState === 'SLEEPING' ? 'Wake' : 'Sleep'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default VirtualPetWindowContent;