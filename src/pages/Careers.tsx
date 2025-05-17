
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="text-purple-400">Our Team</span>
          </h1>
          <p className="text-lg text-purple-300">Door of Illusions</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/60 border-purple-500/30 shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-100 mb-8 text-lg">
                We're a team of hackathon enthusiasts building psychological gaming experiences that challenge the mind. 
                "Catch Me If You Can" started as a weekend project and is growing into something bigger. 
                Whether you're a developer, designer, or have a psychology background, we'd love to explore 
                collaboration opportunities for future hackathons or projects.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Send Resume
                </Button>
                <a 
                  href="https://www.instagram.com/cm_guptaji/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-purple-300 transition"
                >
                  <Instagram size={20} />
                  <span>Connect on Instagram</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Careers;
