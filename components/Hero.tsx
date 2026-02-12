import React from 'react';
import { Terminal, Zap, Database, Heart, ArrowRight } from 'lucide-react';

const AboutWindowContent: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block mb-4 px-3 py-1 border-2 border-black bg-ph-purple text-black font-bold text-xs transform -rotate-2 shadow-retro">
             READ_ME.TXT
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Software built like a <span className="text-ph-orange">Hedgehog</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
            I'm Alex Builder, a Full-stack engineer specialized in high-performance analytics, brutalist UI, and shipping features that users actually want.
          </p>
        </div>

        <hr className="border-black border-t-2 my-8" />

        {/* Stack Grid */}
        <h2 className="text-2xl font-bold mb-6">System Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-ph-bg border-2 border-black p-4 shadow-retro">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="text-black" size={24} />
              <h3 className="font-bold text-lg">Core</h3>
            </div>
            <p className="text-sm text-gray-700">TypeScript, Rust, Go. Typed languages only.</p>
          </div>

          <div className="bg-ph-yellow border-2 border-black p-4 shadow-retro">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-black" size={24} />
              <h3 className="font-bold text-lg">Performance</h3>
            </div>
            <p className="text-sm text-gray-800">Obsessed with Core Web Vitals & sub-100ms latency.</p>
          </div>

          <div className="bg-ph-blue text-white border-2 border-black p-4 shadow-retro">
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-white" size={24} />
              <h3 className="font-bold text-lg">Data</h3>
            </div>
            <p className="text-sm opacity-90">ClickHouse, Postgres, Redis.</p>
          </div>

          <div className="bg-ph-orange border-2 border-black p-4 shadow-retro">
             <div className="flex items-center gap-3 mb-2">
               <Heart className="text-black fill-black" size={24} />
               <h3 className="font-bold text-lg">Community</h3>
             </div>
             <p className="text-sm text-black">Active Open Source contributor & maintainer.</p>
          </div>

        </div>

        <div className="mt-12 bg-black text-white p-6 border-2 border-gray-800">
           <p className="font-mono text-sm mb-2"> cat status.txt</p>
           <p className="font-mono text-green-400">Current Status: Available for hire</p>
           <p className="font-mono text-gray-400 mt-2">To initiate contact, please open the 'Contact.msg' application from your desktop.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutWindowContent;