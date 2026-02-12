import React from 'react';
import { EXPERIENCE } from '../constants';
import { Briefcase } from 'lucide-react';

const ExperienceWindowContent: React.FC = () => {
  return (
    <div className="p-6 md:p-8 bg-white min-h-full">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-black">
         <div className="w-12 h-12 bg-ph-blue border-2 border-black flex items-center justify-center text-white shadow-retro">
            <Briefcase size={24} />
         </div>
         <div>
            <h2 className="text-2xl font-bold">CareerHistory.doc</h2>
            <p className="text-gray-500 text-sm">Last modified: Today</p>
         </div>
      </div>

      <div className="space-y-8 max-w-2xl">
        {EXPERIENCE.map((job, idx) => (
          <div key={job.id} className="relative pl-6 border-l-2 border-dashed border-gray-300">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-ph-yellow border-2 border-black"></div>
            
            <div className="mb-1">
                <h3 className="text-xl font-bold text-black">{job.role}</h3>
                <div className="flex flex-wrap gap-2 items-center text-sm mt-1">
                    <span className="font-bold text-ph-blue px-2 py-0.5 bg-ph-bg border border-black">{job.company}</span>
                    <span className="text-gray-500 font-mono">{job.period}</span>
                </div>
            </div>
            
            <p className="text-gray-700 mt-3 leading-relaxed text-sm md:text-base">
              {job.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceWindowContent;