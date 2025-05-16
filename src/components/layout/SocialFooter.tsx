
import React from 'react';
import { Instagram, Github, Linkedin, Youtube, Twitter } from 'lucide-react';

export const SocialFooter = () => {
  return (
    <footer className="bg-black/90 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              <span className="text-purple-400">Door</span> of <span className="text-purple-400">Illusions</span>
            </h3>
            <p className="text-sm text-gray-400">©2025 All rights reserved</p>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition" aria-label="YouTube">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition" aria-label="Twitter/X">
              <Twitter size={20} />
            </a>
          </div>
          
          <div className="space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-purple-400 transition">Terms</a>
            <a href="#" className="hover:text-purple-400 transition">Privacy</a>
            <a href="#" className="hover:text-purple-400 transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
