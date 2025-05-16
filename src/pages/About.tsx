
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          About <span className="text-purple-400">Door of Illusions</span>
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/60 border-purple-500/30 mb-8 p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">The Game</h2>
            <p className="mb-4">
              Door of Illusions is a psychological game that tests your ability to detect deception and make decisions 
              under pressure. You face an AI-powered opponent that adapts to your gameplay style and attempts to 
              manipulate your choices.
            </p>
            <p className="mb-4">
              The game is inspired by cognitive science research on decision-making, the psychology of deception, 
              and game theory. As you progress through the 15 increasingly challenging stages, you'll encounter an 
              AI grandmother character who evolves from a helpful guide to a manipulative adversary.
            </p>
            <p>
              Your objective is to select the correct door while learning to interpret the AI's increasingly deceptive hints. 
              The game tracks your trust level, win/loss ratio, and other metrics to create a personalized experience that 
              adapts to your play style.
            </p>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-black/60 border-purple-500/30 p-6">
              <h2 className="text-xl font-bold mb-4 text-purple-400">How to Play</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Select one of three doors in each stage</li>
                <li>Interpret the AI grandmother's hints (which may be truthful or deceptive)</li>
                <li>Adjust your trust level based on the AI's behavior</li>
                <li>Use special abilities like "Peek" and "Beg" strategically</li>
                <li>Progress through all 15 stages to complete the game</li>
              </ul>
            </Card>
            
            <Card className="bg-black/60 border-purple-500/30 p-6">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Game Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Adaptive AI that evolves based on your play style</li>
                <li>Three distinct AI personalities: Trickster, Manipulator, and Psycho</li>
                <li>Progressive difficulty across 15 unique stages</li>
                <li>Trust meter that affects gameplay dynamics</li>
                <li>Special abilities that can be used strategically</li>
                <li>Achievements and leaderboard rankings</li>
                <li>Blockchain integration for verified achievements</li>
              </ul>
            </Card>
          </div>
          
          <Card className="bg-black/60 border-purple-500/30 mb-8 p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">The Psychology</h2>
            <p className="mb-4">
              Door of Illusions leverages several psychological principles to create a compelling gaming experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Trust and Deception</h3>
                <p className="text-sm">
                  The game explores how quickly players form trust relationships and how they respond 
                  when that trust is betrayed. The AI adapts its deception tactics based on your trust level.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Decision Making Under Uncertainty</h3>
                <p className="text-sm">
                  Players must make choices with incomplete or potentially misleading information, 
                  simulating real-world decision scenarios where perfect information is rarely available.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Pattern Recognition</h3>
                <p className="text-sm">
                  The game tests your ability to identify patterns in the AI's behavior while simultaneously 
                  using your patterns against you, creating a dynamic cat-and-mouse psychological experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Risk Assessment</h3>
                <p className="text-sm">
                  Players must constantly weigh the risks and rewards of trusting the AI's advice versus 
                  following their own instincts, particularly as the stakes increase in later stages.
                </p>
              </div>
            </div>
          </Card>
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">Ready to test your psychological resilience?</h2>
            <Link to="/game">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Play Now <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">Door of Illusions © 2025 - All Rights Reserved</p>
            <p>
              A psychological game of deception and intuition. The game contains themes related to manipulation 
              and psychological deception. Recommended for players age 16+.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
