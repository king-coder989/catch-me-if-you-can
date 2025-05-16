
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Careers = () => {
  // Sample open positions
  const openPositions = [
    { title: "AI Engineer", department: "Engineering", location: "Remote" },
    { title: "Game Designer", department: "Creative", location: "Remote" },
    { title: "UX Designer", department: "Design", location: "Remote" },
    { title: "Frontend Developer", department: "Engineering", location: "Remote" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Join Our Team</h1>
        
        <div className="max-w-3xl mx-auto bg-purple-900/20 p-8 rounded-lg border border-purple-500/30 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Work With Us</h2>
          <p className="mb-6">
            We're building the next generation of AI-powered games that challenge the boundaries 
            of human-computer interaction. Join our team of creative technologists, AI specialists,
            and game designers to help shape the future of interactive entertainment.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Our Values</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Innovation at the intersection of AI and human psychology</li>
            <li>Creating meaningful experiences that challenge and engage</li>
            <li>Inclusive design and accessibility for all players</li>
            <li>Continuous learning and experimentation</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div key={index} className="border border-purple-500/30 p-4 rounded-lg hover:bg-purple-900/40 transition">
                <h3 className="font-semibold text-lg text-purple-300">{position.title}</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>{position.department}</span>
                  <span>{position.location}</span>
                </div>
                <Button variant="ghost" className="text-purple-400 mt-2 p-0 h-auto hover:text-purple-300 hover:bg-transparent">
                  View Details <ExternalLink className="ml-1" size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
