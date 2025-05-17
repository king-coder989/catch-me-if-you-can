
import React from 'react';
import { Instagram, Github, Twitter, Linkedin, Globe } from 'lucide-react';

export const SocialFooter = () => {
  return (
    <footer className="py-6 px-4 bg-black/90 border-t border-purple-900/30">
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-4 text-center">
          <h3 className="text-white font-semibold mb-2">Catch Me If You Can</h3>
          <p className="text-gray-400 text-sm">A psychological game of deception and intuition</p>
        </div>
        
        <div className="flex space-x-6 mb-4">
          <a 
            href="https://www.instagram.com/cm_guptaji/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition"
          >
            <Instagram size={22} />
          </a>
          <a 
            href="https://github.com/king-coder989" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition"
          >
            <Github size={22} />
          </a>
          <a 
            href="https://x.com/gupta_arpit24" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition"
          >
            <Twitter size={22} />
          </a>
          <a 
            href="https://www.linkedin.com/in/arpit-gupta-985720340/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition"
          >
            <Linkedin size={22} />
          </a>
          <a 
            href="https://devfolio.co/@kinglegendery76" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition"
          >
            <Globe size={22} />
          </a>
        </div>
        
        <div className="text-xs text-gray-500">
          © 2025 Catch Me If You Can. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
