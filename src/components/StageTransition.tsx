
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const StageTransition: React.FC = () => {
  const { stage, stageType, continueGame, resetGame, isGameOver } = useGame();
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-continue after a delay if not game over
    if (!isGameOver && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, isGameOver]);
  
  // Get background style based on stage
  const getBackgroundStyle = () => {
    switch (stageType) {
      case 'early':
        return 'bg-gradient-to-b from-blue-300 to-blue-500 text-white';
      case 'middle':
        return 'bg-gradient-to-b from-purple-300 to-purple-600 text-white';
      case 'late':
        return 'bg-gradient-to-b from-gray-700 to-gray-900 text-white';
      case 'final':
        return 'bg-gradient-to-b from-black to-purple-900 text-purple-300';
    }
  };
  
  // Get title message based on stage progress
  const getTitleMessage = () => {
    if (isGameOver) {
      return "Game Complete";
    }
    
    if (stage <= 3) {
      return "The Journey Begins";
    } else if (stage <= 7) {
      return "Patterns Emerge";
    } else if (stage <= 12) {
      return "The System Learns";
    } else {
      return "Final Revelations";
    }
  };
  
  // Get body message based on stage progress
  const getBodyMessage = () => {
    if (isGameOver) {
      return "You've completed all stages. The AI has mapped your decision patterns completely.";
    }
    
    if (stage <= 3) {
      return "Trust your instincts. The doors await your choice.";
    } else if (stage <= 7) {
      return "Are you noticing patterns? Or is it all in your head?";
    } else if (stage <= 12) {
      return "Your choices reveal more than you know. The AI is watching.";
    } else {
      return "Your decisions are no longer your own. They never were.";
    }
  };
  
  // Apply glitch effect in later stages
  const shouldApplyGlitch = stageType === 'late' || stageType === 'final';
  
  if (!visible && !isGameOver) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={cn("w-full h-full absolute", getBackgroundStyle())}></div>
      
      <div className="relative z-10 text-center p-6 max-w-md animate-fade-in">
        <h2 
          className={cn("text-4xl font-bold mb-4", shouldApplyGlitch ? "glitch" : "")}
          data-text={`Stage ${stage}: ${getTitleMessage()}`}
        >
          Stage {stage}: {getTitleMessage()}
        </h2>
        
        <p 
          className={cn("text-xl mb-8", shouldApplyGlitch ? "glitch" : "")}
          data-text={getBodyMessage()}
        >
          {getBodyMessage()}
        </p>
        
        {isGameOver ? (
          <Button 
            variant="outline" 
            className="border-2 border-white hover:bg-white hover:text-black transition-all"
            onClick={resetGame}
          >
            Play Again
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="border-2 border-white hover:bg-white hover:text-black transition-all"
            onClick={() => {
              setVisible(false);
            }}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default StageTransition;
