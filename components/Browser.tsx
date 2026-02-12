
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, X, Home, Lock, Globe, Smartphone, Monitor } from 'lucide-react';

interface BrowserWindowContentProps {
  initialUrl: string;
  viewMode?: 'mobile' | 'desktop';
}

const BrowserWindowContent: React.FC<BrowserWindowContentProps> = ({ initialUrl, viewMode: initialViewMode = 'desktop' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputValue, setInputValue] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(initialViewMode);

  useEffect(() => {
    setInputValue(url);
    setIsLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [url]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue !== url) {
        setUrl(inputValue);
        const newHistory = [...history.slice(0, historyIndex + 1), inputValue];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleRefresh = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
  };

  // Safe check for valid URLs vs dummy '#' links
  const isValidUrl = url && url !== '#' && !url.startsWith('javascript');

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      {/* Browser Toolbar */}
      <div className="border-b-2 border-white p-1">
        <div className="flex items-center gap-2 mb-1 justify-between">
            <span className="text-xs text-gray-600 ml-1">DevHog Navigator 4.0</span>
            <div className="flex gap-1">
                <button 
                  onClick={() => setViewMode('mobile')}
                  className={`p-0.5 border-2 ${viewMode === 'mobile' ? 'border-black bg-gray-200' : 'border-transparent'}`}
                  title="Mobile View"
                >
                   <Smartphone size={12} />
                </button>
                <button 
                  onClick={() => setViewMode('desktop')}
                  className={`p-0.5 border-2 ${viewMode === 'desktop' ? 'border-black bg-gray-200' : 'border-transparent'}`}
                  title="Desktop View"
                >
                   <Monitor size={12} />
                </button>
            </div>
        </div>
        
        <div className="flex gap-2 mb-2">
            <button className="p-1 border-2 border-white border-b-gray-500 border-r-gray-500 active:border-gray-500 active:border-b-white active:border-r-white bg-[#c0c0c0]" disabled={historyIndex <= 0}>
                <ArrowLeft size={16} className={historyIndex <= 0 ? "text-gray-400" : "text-black"} />
            </button>
            <button className="p-1 border-2 border-white border-b-gray-500 border-r-gray-500 active:border-gray-500 active:border-b-white active:border-r-white bg-[#c0c0c0]" disabled={historyIndex >= history.length - 1}>
                <ArrowRight size={16} className={historyIndex >= history.length - 1 ? "text-gray-400" : "text-black"} />
            </button>
            <button onClick={handleRefresh} className="p-1 border-2 border-white border-b-gray-500 border-r-gray-500 active:border-gray-500 active:border-b-white active:border-r-white bg-[#c0c0c0]">
                <RotateCcw size={16} />
            </button>
            <button className="p-1 border-2 border-white border-b-gray-500 border-r-gray-500 active:border-gray-500 active:border-b-white active:border-r-white bg-[#c0c0c0]">
                <Home size={16} />
            </button>
            
            {/* Address Bar */}
            <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white border-2 border-gray-500 border-b-white border-r-white px-2 shadow-inner">
                <Globe size={14} className="text-gray-500 mr-2" />
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full outline-none text-sm font-mono py-1 bg-white text-black"
                />
            </form>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-gray-200 border-2 border-gray-500 border-b-white border-r-white m-1 relative overflow-hidden flex justify-center">
         
         <div 
            className={`relative bg-white transition-all duration-300 shadow-xl ${
              viewMode === 'mobile' 
                ? 'w-[375px] h-[667px] my-4 border-8 border-black rounded-3xl overflow-hidden ring-4 ring-gray-400' 
                : 'w-full h-full'
            }`}
         >
            {/* Mobile Notch emulation if mobile */}
            {viewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-ph-blue border-t-ph-orange rounded-full animate-spin"></div>
                    <div className="font-mono text-sm animate-pulse">Connecting to host...</div>
                </div>
            )}
            
            {isValidUrl ? (
                <iframe 
                    src={url} 
                    className="w-full h-full border-0" 
                    title="Browser Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onError={() => setIsLoading(false)}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5E5E5] text-center p-8">
                    <div className="w-24 h-24 bg-gray-300 border-4 border-gray-400 flex items-center justify-center mb-6">
                        <X size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif mb-2 text-black">404 - Server Not Found</h1>
                    <p className="max-w-md text-gray-600 mb-6 font-serif">
                        The requested URL could not be retrieved.
                    </p>
                    <div className="text-left bg-white p-4 border border-gray-400 shadow-sm font-mono text-xs max-w-lg text-black">
                        <p>DNS_PROBE_FINISHED_NXDOMAIN</p>
                    </div>
                </div>
            )}
         </div>

      </div>
      
      {/* Status Bar */}
      <div className="border-t-2 border-white p-1 text-xs font-mono text-gray-600 flex justify-between">
          <span>{isLoading ? "Transferring data..." : "Done"}</span>
          <span className="flex items-center gap-1">{isValidUrl ? <Lock size={10} /> : null} Secure</span>
      </div>
    </div>
  );
};

export default BrowserWindowContent;
