
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const AIMessage: React.FC = () => {
  const { message, stageType, aiPersonality } = useGame();
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [initialGreeting, setInitialGreeting] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTyping, setPausedTyping] = useState(false);
  
  // Get dynamic initial greeting based on personality
  const getInitialGreeting = () => {
    // Dynamic greetings for different personalities
    const greetings = {
      trickster: [
        "Trust me, I'm here to help you win...",
        "Welcome! I'll guide you to victory...",
        "Let's play a game of choices...",
        "I know which door leads to success..."
      ],
      manipulator: [
        "Choose wisely. Your mind against mine...",
        "Your success depends on how well you listen...",
        "The right door is always obvious to the observant...",
        "I wonder if you'll make the right choice..."
      ],
      psycho: [
        "Let's see how long you last before breaking...",
        "Your choices amuse me. For now...",
        "Another player to break. How delightful...",
        "Pick a door. Any door. It hardly matters..."
      ]
    };
    
    // Select random greeting based on personality
    const personalityGreetings = greetings[aiPersonality as keyof typeof greetings] || greetings.trickster;
    return personalityGreetings[Math.floor(Math.random() * personalityGreetings.length)];
  };
  
  // Typing effect with variable speed and pauses
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
      
      // Start time tracking if not started
      if (charIndex === 0) {
        setStartTime(Date.now());
      }
      
      // Add dramatic pauses at punctuation
      const currentChar = textToType[charIndex];
      if (['.', '!', '?', ','].includes(currentChar) && !pausedTyping) {
        setPausedTyping(true);
        
        // Longer pause for end of sentences
        const pauseTime = ['!', '.', '?'].includes(currentChar) ? 400 : 200;
        
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + currentChar);
          setCharIndex(charIndex + 1);
          setPausedTyping(false);
        }, pauseTime);
        
        return () => clearTimeout(timer);
      }
                          
      const timer = setTimeout(() => {
        if (!pausedTyping) {
          setDisplayText(prev => prev + textToType[charIndex]);
          setCharIndex(charIndex + 1);
        }
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else if (charIndex === textToType.length && startTime) {
      // Calculate total typing time for analytics
      const typingTime = Date.now() - startTime;
      console.log(`Message typing completed in ${typingTime}ms`);
      setStartTime(null);
    }
  }, [charIndex, message, stageType, aiPersonality, initialGreeting, pausedTyping, startTime]);
  
  // Reset when message changes
  useEffect(() => {
    if (message) {
      setInitialGreeting(false);
      setDisplayText('');
      setCharIndex(0);
      setPausedTyping(false);
    }
  }, [message]);
  
  // Determine card style based on stage and personality
  const getMessageStyle = () => {
    // Base stage style
    const stageStyle = 
      stageType === 'early' ? 'bg-blue-900/90 text-white' :
      stageType === 'middle' ? 'bg-purple-900/90 text-white' :
      stageType === 'late' ? 'bg-purple-900/90 text-white' :
      'bg-black text-white';
      
    // Personality style additions
    const personalityStyle =
      aiPersonality === 'trickster' ? 'border-blue-400 border-2' :
      aiPersonality === 'manipulator' ? 'border-purple-500 border-2' :
      'border-red-600 border-2'; // psycho
      
    return cn(stageStyle, personalityStyle);
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
            textShadow: "0 0 8px rgba(255,255,255,0.5)"
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
