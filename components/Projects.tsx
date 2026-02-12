
import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink, FolderOpen, Archive, Star } from 'lucide-react';

interface ProjectsWindowContentProps {
  onOpenProject: (id: string, e: React.MouseEvent) => void;
}

const ProjectsWindowContent: React.FC<ProjectsWindowContentProps> = ({ onOpenProject }) => {
  const featuredProjects = PROJECTS.filter(p => p.featured);
  const archivedProjects = PROJECTS.filter(p => !p.featured);

  return (
    <div className="bg-ph-bg min-h-full flex flex-col">
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Featured Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
             <Star className="text-ph-orange fill-ph-orange" size={20} />
             <h2 className="text-xl font-bold uppercase tracking-wider">Featured Work</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <button 
                key={project.id} 
                onClick={(e) => onOpenProject(project.id, e)}
                className="bg-white border-2 border-black shadow-retro hover:shadow-retro-lg hover:-translate-y-1 transition-all flex flex-col group text-left h-full"
              >
                <div className="h-48 border-b-2 border-black overflow-hidden relative bg-gray-100 w-full">
                  <div className="absolute inset-0 bg-ph-purple/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-white border border-black px-2 py-1 text-xs font-bold z-20 shadow-sm">
                    {project.year}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col w-full">
                  <div className="flex items-start justify-between mb-2 w-full">
                      <h3 className="text-xl font-bold leading-tight group-hover:text-ph-blue transition-colors">{project.title}</h3>
                      <FolderOpen size={18} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-ph-bg border border-black text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 border border-black text-[10px] font-bold uppercase tracking-wider">+{project.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Archive Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
             <Archive className="text-gray-600" size={20} />
             <h2 className="text-xl font-bold uppercase tracking-wider">Project Archive</h2>
          </div>

          <div className="bg-white border-2 border-black shadow-retro overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-sm">
                   <thead>
                      <tr className="bg-ph-yellow border-b-2 border-black text-xs uppercase">
                         <th className="p-3 border-r border-black w-20">Year</th>
                         <th className="p-3 border-r border-black">Project</th>
                         <th className="p-3 border-r border-black hidden md:table-cell">Built With</th>
                         <th className="p-3 w-24">Link</th>
                      </tr>
                   </thead>
                   <tbody>
                      {archivedProjects.map((project, idx) => (
                         <tr 
                            key={project.id} 
                            onClick={(e) => onOpenProject(project.id, e)}
                            className="hover:bg-ph-bg cursor-pointer border-b border-gray-200 last:border-0 group"
                         >
                            <td className="p-3 border-r border-black text-gray-500">{project.year}</td>
                            <td className="p-3 border-r border-black font-bold group-hover:text-ph-blue">
                               {project.title}
                               <div className="md:hidden text-xs text-gray-500 font-normal mt-1 truncate">{project.tags.join(', ')}</div>
                            </td>
                            <td className="p-3 border-r border-black hidden md:table-cell text-xs">
                               <div className="flex gap-2">
                                  {project.tags.map(tag => <span key={tag} className="bg-gray-100 px-1 border border-gray-300">{tag}</span>)}
                               </div>
                            </td>
                            <td className="p-3">
                               <span className="flex items-center gap-1 text-xs font-bold hover:underline">
                                  View <ExternalLink size={10} />
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectsWindowContent;
