
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const AIMessage: React.FC = () => {
  const { message, stageType } = useGame();
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  // Typing effect
  useEffect(() => {
    if (charIndex < message.length) {
      // Speed varies by stage
      const typingSpeed = stageType === 'early' ? 30 : 
                          stageType === 'middle' ? 40 :
                          stageType === 'late' ? 50 : 20;
                          
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    }
  }, [charIndex, message, stageType]);
  
  // Reset when message changes
  useEffect(() => {
    setDisplayText('');
    setCharIndex(0);
  }, [message]);
  
  // Determine text style based on stage
  const getMessageStyle = () => {
    switch (stageType) {
      case 'early':
        return 'bg-stage-early-bg text-stage-early-text';
      case 'middle':
        return 'bg-stage-middle-bg text-stage-middle-text';
      case 'late':
        return 'bg-stage-late-bg text-white';
      case 'final':
        return 'bg-black text-stage-final-text border-purple-500';
    }
  };
  
  // Apply glitch effect in later stages
  const shouldApplyGlitch = stageType === 'late' || stageType === 'final';
  
  return (
    <Card className={cn("w-full mb-4", getMessageStyle(), shouldApplyGlitch ? "border-red-500" : "")}>
      <CardContent className="p-4">
        <p 
          className={cn("text-lg", shouldApplyGlitch ? "glitch" : "")}
          data-text={displayText}
        >
          {displayText}
          <span className="animate-pulse">_</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default AIMessage;
