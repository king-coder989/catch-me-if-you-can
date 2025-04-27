
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const AIMessage: React.FC = () => {
  const { message, stageType, aiPersonality } = useGame();
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  // Typing effect
  useEffect(() => {
    if (charIndex < message.length) {
      // Speed varies by stage and personality
      const baseTypingSpeed = 
        stageType === 'early' ? 30 : 
        stageType === 'middle' ? 40 :
        stageType === 'late' ? 50 : 20;
      
      // Adjust for personality
      const personalityFactor = 
        aiPersonality === 'trickster' ? 1 :
        aiPersonality === 'manipulator' ? 0.8 : // faster typing
        0.6; // psycho types very fast
      
      const typingSpeed = baseTypingSpeed * personalityFactor;
                          
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    }
  }, [charIndex, message, stageType, aiPersonality]);
  
  // Reset when message changes
  useEffect(() => {
    setDisplayText('');
    setCharIndex(0);
  }, [message]);
  
  // Determine text style based on stage and personality
  const getMessageStyle = () => {
    // Base stage style
    const stageStyle = 
      stageType === 'early' ? 'bg-stage-early-bg text-stage-early-text' :
      stageType === 'middle' ? 'bg-stage-middle-bg text-stage-middle-text' :
      stageType === 'late' ? 'bg-stage-late-bg text-white' :
      'bg-black text-stage-final-text border-purple-500';
      
    // Personality style additions
    const personalityStyle =
      aiPersonality === 'trickster' ? 'border-blue-300' :
      aiPersonality === 'manipulator' ? 'border-purple-400' :
      'border-red-500'; // psycho
      
    return cn(stageStyle, personalityStyle);
  };
  
  // Apply different effects based on AI personality
  const getTextEffectClass = () => {
    const baseClass = "text-lg";
    
    if (stageType === 'late' || stageType === 'final') {
      return cn(baseClass, "glitch");
    }
    
    if (aiPersonality === 'manipulator') {
      return cn(baseClass, "italic");
    }
    
    if (aiPersonality === 'psycho') {
      return cn(baseClass, "font-bold");
    }
    
    return baseClass;
  };
  
  return (
    <Card className={cn("w-full mb-4", getMessageStyle())}>
      <CardContent className="p-4">
        <p 
          className={getTextEffectClass()}
          data-text={displayText}
        >
          {displayText}
          <span className={cn(
            "animate-pulse",
            aiPersonality === 'psycho' ? "text-red-500" : ""
          )}>_</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default AIMessage;
