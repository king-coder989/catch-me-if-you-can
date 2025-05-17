
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const AIMessage: React.FC = () => {
  const { message, stageType, aiPersonality } = useGame();
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [initialGreeting, setInitialGreeting] = useState(true);
  
  const getInitialGreeting = () => {
    if (aiPersonality === 'trickster') {
      return "Welcome to Catch Me If You Can... I wonder if your mind is sharp enough?";
    } else if (aiPersonality === 'manipulator') {
      return "The game is simple. Your mind against mine. Choose wisely...";
    } else {
      return "Let's see how long you last before breaking. Choose a door to begin...";
    }
  };
  
  // Typing effect
  useEffect(() => {
    // If there's no message yet, use the initial greeting
    const textToType = message || (initialGreeting ? getInitialGreeting() : "");
    
    if (charIndex < textToType.length) {
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
        setDisplayText(prev => prev + textToType[charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    }
  }, [charIndex, message, stageType, aiPersonality, initialGreeting]);
  
  // Reset when message changes
  useEffect(() => {
    if (message) {
      setInitialGreeting(false);
      setDisplayText('');
      setCharIndex(0);
    }
  }, [message]);
  
  // Determine card style based on stage and personality
  const getMessageStyle = () => {
    // Base stage style
    const stageStyle = 
      stageType === 'early' ? 'bg-blue-900 bg-opacity-90 text-white' :
      stageType === 'middle' ? 'bg-purple-900 bg-opacity-90 text-white' :
      stageType === 'late' ? 'bg-purple-900 bg-opacity-90 text-white' :
      'bg-black text-white border-purple-500';
      
    // Personality style additions
    const personalityStyle =
      aiPersonality === 'trickster' ? 'border-blue-300' :
      aiPersonality === 'manipulator' ? 'border-purple-400' :
      'border-red-500'; // psycho
      
    return cn(stageStyle, personalityStyle, "border-2");
  };
  
  // Apply different effects based on AI personality
  const getTextEffectClass = () => {
    const baseClass = "text-lg text-white text-shadow";
    
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
    <Card className={cn("w-full rounded-lg shadow-lg", getMessageStyle())}>
      <CardContent className="p-4">
        <p 
          className={getTextEffectClass()}
          data-text={displayText}
          style={{
            textShadow: "0 0 5px rgba(255,255,255,0.5)"
          }}
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
