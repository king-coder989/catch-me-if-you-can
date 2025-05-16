
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-purple-400">Door</span> of <span className="text-purple-400">Illusions</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in text-white">
            A psychological game of deception and intuition. Can you outsmart the AI grandmother?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/game">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Play Now <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-900/30">
                Sign Up
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-900/30">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Psychological Challenge</h3>
            <p className="text-white/90">Test your ability to read deception and make decisions under pressure.</p>
          </div>
          <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 text-purple-400">AI Opponent</h3>
            <p className="text-white/90">Face off against an advanced AI that adapts to your playing style.</p>
          </div>
          <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 text-purple-400">Earn Rewards</h3>
            <p className="text-white/90">Win badges and climb the leaderboard as you progress through the stages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
