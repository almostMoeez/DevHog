import React from 'react';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

const ContactWindowContent: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-full p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full border-2 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            <Mail size={48} className="mx-auto mb-6 text-ph-yellow" />
            <h2 className="text-3xl font-bold mb-4">Inbox Zero? Never.</h2>
            <p className="text-gray-400 mb-8">
              Currently open to new opportunities. Reach out if you need high-performance web apps or just want to argue about CSS frameworks.
            </p>
            
            <a 
              href="mailto:alex@example.com"
              className="block w-full bg-white text-black font-bold py-3 px-4 border-2 border-transparent hover:bg-ph-yellow transition-colors mb-6 text-lg"
            >
              alex@example.com
            </a>

            <div className="flex justify-center space-x-6 border-t border-gray-800 pt-6">
                <a href="#" className="hover:text-ph-purple transition-colors"><Github size={24} /></a>
                <a href="#" className="hover:text-ph-blue transition-colors"><Linkedin size={24} /></a>
                <a href="#" className="hover:text-ph-orange transition-colors"><Twitter size={24} /></a>
            </div>
        </div>
    </div>
  );
};

export default ContactWindowContent;