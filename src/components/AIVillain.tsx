
import React, { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

type AIVillainProps = {
  className?: string;
};

const AIVillain: React.FC<AIVillainProps> = ({ className }) => {
  const { aiPersonality, stageType, isNewStage } = useGame();
  const [isGlitching, setIsGlitching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // 20% chance to glitch
      if (Math.random() < 0.2) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 350);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 5000 + 3000); // Random interval between 3-8 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Extra glitch on stage change
  useEffect(() => {
    if (isNewStage) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }
  }, [isNewStage]);
  
  return (
    <div className={cn(
      "relative transition-all duration-300",
      isGlitching ? "animate-glitch" : "",
      stageType === 'late' || stageType === 'final' ? "scale-105" : "",
      className
    )}>
      <img 
        src="/lovable-uploads/789a9274-1cb7-4401-a48f-e0481d3e13c9.png"
        alt="AI Villain"
        className={cn(
          "w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-2",
          "transition-all duration-300",
          isBlinking ? "brightness-150" : "brightness-100",
          aiPersonality === 'trickster' ? "border-blue-500 shadow-lg shadow-blue-500/50" : 
          aiPersonality === 'manipulator' ? "border-purple-500 shadow-lg shadow-purple-500/50" : 
          "border-red-500 shadow-lg shadow-red-500/50"
        )}
      />
      
      {/* Digital distortion overlay */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-gradient-to-r",
        "opacity-30 mix-blend-overlay pointer-events-none",
        aiPersonality === 'trickster' ? "from-blue-900/50 to-blue-500/50" : 
        aiPersonality === 'manipulator' ? "from-purple-900/50 to-purple-500/50" : 
        "from-red-900/50 to-red-500/50"
      )}/>
      
      {/* Glitching effect */}
      {isGlitching && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-[2px] bg-cyan-400/80 w-full"
              style={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 20 - 10}%`,
                width: `${80 + Math.random() * 40}%`,
                transform: `translateY(${Math.random() * 2 - 1}px)`,
                opacity: 0.7 + Math.random() * 0.3
              }}
            />
          ))}
        </div>
      )}
      
      {/* Pulsing eyes effect */}
      <div className={cn(
        "absolute top-[38%] left-[30%] w-3 h-3 md:w-4 md:h-4 rounded-full",
        "bg-cyan-400 blur-[2px] animate-pulse",
        aiPersonality === 'psycho' ? "bg-red-500" : "bg-cyan-400"
      )} />
      <div className={cn(
        "absolute top-[38%] right-[30%] w-3 h-3 md:w-4 md:h-4 rounded-full",
        "bg-cyan-400 blur-[2px] animate-pulse",
        aiPersonality === 'psycho' ? "bg-red-500" : "bg-cyan-400"
      )} />
    </div>
  );
};

export default AIVillain;
