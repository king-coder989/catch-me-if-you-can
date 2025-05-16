
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About Door of Illusions</h1>
        
        <div className="max-w-3xl mx-auto bg-purple-900/20 p-8 rounded-lg border border-purple-500/30 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">The Game</h2>
          <p className="mb-6">
            Door of Illusions is a psychological game that tests your ability to detect deception and 
            make decisions under uncertainty. You face an AI grandmother who may help or mislead you
            as you choose between doors to progress through increasingly challenging stages.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">How It Works</h2>
          <p className="mb-6">
            Each stage presents you with three doors. Behind one door lies progression to the next stage,
            while the others lead to failure. The AI grandmother will provide hints - some truthful,
            some deceptive. As you advance, the psychological manipulation becomes more intense,
            testing your judgment and intuition.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">The Technology</h2>
          <p className="mb-6">
            We use advanced AI language models to create a dynamic opponent that adapts to your 
            playing style. The game learns from your choices and uses psychological tactics 
            to challenge your decision-making process.
          </p>
          
          <div className="mt-8 text-center">
            <Link to="/game">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
