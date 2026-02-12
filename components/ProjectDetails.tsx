
import React from 'react';
import { ExternalLink, Calendar, Code, Play } from 'lucide-react';
import { PROJECTS } from '../constants';

interface ProjectDetailsWindowContentProps {
  projectId: string;
  onPreview: (url: string, originRect: { x: number, y: number, width: number, height: number }, viewMode: 'mobile' | 'desktop') => void;
}

const ProjectDetailsWindowContent: React.FC<ProjectDetailsWindowContentProps> = ({ projectId, onPreview }) => {
  const project = PROJECTS.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl font-bold mb-4">404</div>
        <p>Project data corrupt or missing.</p>
      </div>
    );
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      onPreview(project.link, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
      }, project.previewMode || 'desktop');
  };

  return (
    <div className="bg-white min-h-full flex flex-col animate-in fade-in duration-300">
       {/* Hero Image */}
       <div className="h-64 md:h-80 w-full bg-gray-100 border-b-2 border-black relative overflow-hidden group">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-4 shadow-lg max-w-lg z-10">
             <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{project.title}</h1>
          </div>
       </div>

       <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar / Meta Info */}
          <div className="md:w-72 bg-ph-bg border-b-2 md:border-b-0 md:border-r-2 border-black p-6 shrink-0 space-y-6">
             
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                    <Calendar size={12} /> Timeline
                </h3>
                <p className="font-mono font-bold text-lg">{project.year}</p>
             </div>

             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                    <Code size={12} /> The Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                   {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white border border-black shadow-sm text-xs font-bold">
                        {tag}
                      </span>
                   ))}
                </div>
             </div>

             <div className="space-y-3 pt-4 border-t-2 border-gray-300">
                <button 
                   onClick={handlePreviewClick}
                   className="flex items-center justify-center gap-2 w-full bg-ph-blue text-white border-2 border-black p-3 font-bold shadow-retro hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                >
                   <Play size={16} className="fill-white group-hover:scale-110 transition-transform" /> Live Preview
                </button>

                <a 
                   href={project.link} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center justify-center gap-2 w-full bg-white border-2 border-black p-3 font-bold shadow-sm hover:bg-gray-50 transition-colors text-sm"
                >
                   Original Link <ExternalLink size={14} />
                </a>
             </div>

          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
             <div className="max-w-3xl">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-black inline-block pb-1">About the Project</h2>
                <div className="prose prose-slate font-sans">
                   <p className="text-lg leading-relaxed text-gray-800 mb-6 font-medium">
                      {project.description}
                   </p>
                   {project.fullDescription ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {project.fullDescription}
                      </p>
                   ) : (
                      <p className="text-gray-500 italic">No extended description available.</p>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProjectDetailsWindowContent;
