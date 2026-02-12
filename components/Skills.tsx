import React from 'react';
import { SKILLS } from '../constants';
import { Activity, Cpu, HardDrive } from 'lucide-react';

const SkillsWindowContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-100 font-mono text-sm">
      {/* Graphs Section */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b-2 border-black bg-ph-bg">
        <div className="bg-white border-2 border-black p-2 h-24 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-xs font-bold flex items-center gap-1">
            <Cpu size={14} /> CPU Usage
          </div>
          <div className="flex items-end h-full w-full gap-1 pt-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 bg-green-500" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
            ))}
          </div>
        </div>
        <div className="bg-white border-2 border-black p-2 h-24 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-xs font-bold flex items-center gap-1">
             <HardDrive size={14} /> Memory
          </div>
          <div className="flex items-end h-full w-full gap-1 pt-6">
             <div className="w-full bg-ph-yellow h-3/4 border-t-2 border-black relative">
                 <div className="absolute inset-0 opacity-20 bg-stripes"></div>
             </div>
          </div>
        </div>
        <div className="bg-white border-2 border-black p-2 h-24 relative overflow-hidden">
           <div className="absolute top-2 left-2 text-xs font-bold flex items-center gap-1">
             <Activity size={14} /> Network
          </div>
          <svg className="h-full w-full pt-6" viewBox="0 0 100 40" preserveAspectRatio="none">
             <path d="M0 40 L 10 30 L 20 35 L 30 10 L 40 25 L 50 20 L 60 30 L 70 5 L 80 20 L 90 15 L 100 40" fill="none" stroke="blue" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-auto bg-white p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-xs uppercase text-gray-500">
              <th className="p-2">Process Name (Skill)</th>
              <th className="p-2">Category</th>
              <th className="p-2">Proficiency</th>
              <th className="p-2 w-32">Usage</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((skill, idx) => (
              <tr key={idx} className="hover:bg-ph-yellow/20 border-b border-gray-200">
                <td className="p-2 font-bold">{skill.name}.exe</td>
                <td className="p-2 text-gray-600">{skill.category}</td>
                <td className="p-2">{skill.level}%</td>
                <td className="p-2">
                  <div className="h-4 w-full bg-gray-200 border border-black relative">
                    <div 
                      className={`h-full border-r border-black ${
                        skill.level > 90 ? 'bg-ph-orange' : 
                        skill.level > 80 ? 'bg-ph-yellow' : 
                        skill.level > 70 ? 'bg-green-400' : 'bg-ph-blue'
                      }`} 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-ph-bg border-t-2 border-black p-1 text-xs flex justify-between px-4">
         <span>Processes: {SKILLS.length}</span>
         <span>Uptime: 99.99%</span>
         <span>Mem: 64TB</span>
      </div>
    </div>
  );
};

export default SkillsWindowContent;