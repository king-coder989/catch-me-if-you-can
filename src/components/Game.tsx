import React, { useEffect, useState } from 'react';   
import { useGame } from '../contexts/GameContext';
import Door from './Door';
import GameStats from './GameStats';
import StageTransition from './StageTransition';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  HandHelping, 
  RefreshCw,
  Book,
  Heart
} from 'lucide-react';
import AIDiary from './AIDiary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getBackgroundImage, getBackgroundStyle } from '@/lib/background-utils';
import { toast } from "sonner";

// Define types for AI integrations
type AIPersonalityType = 'trickster' | 'manipulator' | 'psycho';
type GameStage = 'early' | 'middle' | 'late' | 'final';
type DoorChoiceHistory = string[];
type StreakStats = { winStreak: number; lossStreak: number };

// Session map for conversation persistence
const sessionMap = new Map<string, { role: string, content: string }[]>();
// TTL management for sessions to prevent memory leaks
const sessionTimestamps = new Map<string, number>();
const SESSION_TTL = 1000 * 60 * 30; // 30 minutes
const MAX_SESSIONS = 500;

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, timestamp] of sessionTimestamps.entries()) {
    if (now - timestamp > SESSION_TTL) {
      sessionMap.delete(sessionId);
      sessionTimestamps.delete(sessionId);
    }
  }
}, 60000); // Check every minute

// Get stage-based model parameters
const getStageParams = (stage: number) => {
  return {
    temperature: Math.min(0.65 + (stage * 0.04), 0.9),
    max_tokens: Math.min(80 + (stage * 12), 200),
    top_p: Math.max(0.92 - (stage * 0.03), 0.7),
    frequency_penalty: stage > 5 ? 0.2 : 0
  };
};

/**
 * Fetch a response from the AI based on the current game state
 * With improved error handling and retry logic
 */
const fetchAIResponse = async (
  prompt: string,
  sessionId: string = 'default',
  stage: number = 1,
  playerMetrics = {}
): Promise<string> => {
  // Record session activity time for TTL management
  sessionTimestamps.set(sessionId, Date.now());
  
  // Manage session size - remove oldest if exceeding limit
  if (sessionMap.size > MAX_SESSIONS) {
    let oldestSession = '';
    let oldestTime = Date.now();
    
    for (const [sid, timestamp] of sessionTimestamps.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestSession = sid;
      }
    }
    
    if (oldestSession) {
      sessionMap.delete(oldestSession);
      sessionTimestamps.delete(oldestSession);
    }
  }
  
  // Initialize session if it doesn't exist
  if (!sessionMap.has(sessionId)) {
    sessionMap.set(sessionId, [
      { role: "system", content: buildPrompt(stage, [], { winStreak: 0, lossStreak: 0 }) }
    ]);
  }
  
  // Get session history
  const history = sessionMap.get(sessionId)!;
  
  // Add user message to history
  history.push({ role: "user", content: prompt });
  
  // Get stage-based model parameters
  const modelParams = getStageParams(stage);
  
  // Error handling with retry logic and exponential backoff
  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt <= MAX_RETRIES) {
    try {
      const apiKey = "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";
      
      // Send the full conversation history to maintain context
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: history,
          temperature: modelParams.temperature,
          max_tokens: modelParams.max_tokens,
          top_p: modelParams.top_p,
          frequency_penalty: modelParams.frequency_penalty
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`API request failed with status ${response.status}:`, errorData);
        
        if (response.status === 429) {
          // Rate limit reached, retry with backoff
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limit reached. Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          attempt++;
          continue;
        } else {
          throw new Error(`Failed to get AI response: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        
        // Add AI response to conversation history
        history.push({ role: "assistant", content: aiResponse });
        
        // Keep conversation history manageable (last 10 messages)
        if (history.length > 11) { // System prompt + 5 exchanges
          history.splice(1, 2); // Remove oldest exchange (user + assistant)
        }
        
        return aiResponse;
      } else {
        throw new Error("Invalid response structure from Groq API");
      }
    } catch (error) {
      console.error("AI response error:", error);
      
      // If we've reached max retries, use a fallback
      if (attempt >= MAX_RETRIES) {
        return getFallbackMessage(stage, 'trickster');
      }
      
      // Otherwise backoff and retry
      const backoffTime = Math.pow(2, attempt) * 1000;
      console.log(`Error occurred. Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      attempt++;
    }
  }
  
  return getFallbackMessage(stage, 'trickster');
};

/**
 * Builds a prompt for the AI based on game stage
 */
const buildPrompt = (
  stage: number,
  history: DoorChoiceHistory,
  stats: StreakStats
): string => {
  // Scale manipulation intensity based on stage
  const manipulationIntensity = Math.min(20 + (stage * 15), 100);
  
  // Base personality by stage
  let personality = "helpful";
  if (stage > 3) personality = "slightly manipulative";
  if (stage > 7) personality = "deceptive";
  if (stage > 12) personality = "malevolent";
  
  // Build stage-appropriate tactics
  const tactics = stage >= 5 
    ? "Gaslighting | False Concern | Strategic Misdirection" 
    : "Subtle Doubt | Framed Positivity";
  
  // Build the prompt with player history
  let prompt = `
  You are a mentor in a psychological game. Current stage: ${stage}.
  Your manipulation intensity: ${manipulationIntensity}%.
  Your personality is ${personality}.
  
  Player history: ${history.length > 0 ? history.join(', ') : 'No history yet'}
  Player win streak: ${stats.winStreak}
  Player loss streak: ${stats.lossStreak}
  
  Use these manipulation tactics: ${tactics}
  
  Your goal is to guide the player to choose doors, but with increasing deception as stages progress.
  In early stages (1-3), be mostly helpful but occasionally misleading.
  In middle stages (4-7), be ambiguous and subtly manipulative.
  In late stages (8-12), actively mislead while maintaining trust.
  In final stages (13+), be overtly threatening and deceptive.
  
  Respond with a short message (2-3 sentences maximum) giving advice about which door to choose.
  Use subtle manipulation based on the stage level.
  Never break character or reveal you are being manipulative.
  `;
  
  return prompt;
};

/**
 * Generates a fallback message if AI API call fails
 */
const getFallbackMessage = (stage: number, personality: AIPersonalityType): string => {
  // Early stages - friendly and misleading
  if (stage <= 3) {
    const messages = [
      "Trust me, I'm here to help you win. Choose wisely!",
      "Your instincts are right. Follow what feels lucky.",
      "The pattern is becoming clear. Can you see it?",
      "I believe in you. The right door is waiting."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } 
  // Middle stages - more manipulative
  else if (stage <= 7) {
    const messages = [
      "The middle door seems lucky today. Or is it? Hehe...",
      "Your last choice was... interesting. Let me guide you better.",
      "I wouldn't choose that one if I were you...",
      "Are you sure you want to trust my advice? Wise choice."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  // Late stages - more deceptive and aggressive
  else if (stage <= 12) {
    const messages = [
      "I can smell your fear. Choose wisely... or don't.",
      "After all this time, do you still trust me? Let's find out...",
      "We're so deep in the game now. No turning back.",
      "Your brain patterns are... predictable. Try to surprise me."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  // Final stages - overtly threatening
  else {
    const messages = [
      "So close to the end. Do you really think you'll make it?",
      "Your mind belongs to me now. Choose as I command.",
      "Even if you win, you've already lost something precious.",
      "The door of your nightmares awaits. Can you feel it?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
};

// The AIMessage component directly inside Game.tsx
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
        0.6; // psycho
      
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
    <div className={cn("w-full rounded-lg shadow-lg p-4", getMessageStyle())}>
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
    </div>
  );
};

const Game: React.FC = () => {
  const { 
    stage, 
    stageType, 
    doorResults, 
    isNewStage, 
    isGameOver, 
    resetGame,
    availableDesperationMoves,
    useDesperationMove,
    gameHistory,
    aiPersonality,
    doubtLevel,
    consecutiveLosses,
    updateAIMessage,
    lives
  } = useGame();
  
  const [showDiary, setShowDiary] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: '90%', left: '80%' });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>("/images/backgrounds/stage1.png");
  const [floatingPeekEnabled, setFloatingPeekEnabled] = useState(false);
  const [peekPosition, setPeekPosition] = useState({ x: 0, y: 0 });
  const [selectedPeekDoor, setSelectedPeekDoor] = useState<number | null>(null);

  // Update background image when stage changes
  useEffect(() => {
    setBackgroundImage(getBackgroundImage(stage));
  }, [stage]);

  // Randomly enable floating peek ability
  useEffect(() => {
    if (availableDesperationMoves.peek && Math.random() < 0.3 && !floatingPeekEnabled) {
      setTimeout(() => {
        setFloatingPeekEnabled(true);
        
        // Random position
        const x = Math.floor(Math.random() * 70) + 10; // 10-80% of viewport width
        const y = Math.floor(Math.random() * 50) + 20; // 20-70% of viewport height
        setPeekPosition({ x, y });
        
        // Auto-disable after a while if not used
        setTimeout(() => {
          setFloatingPeekEnabled(false);
        }, 15000); // 15 seconds
      }, Math.random() * 10000 + 5000); // Random delay between 5-15 seconds after stage loads
    }
  }, [stage, isNewStage, availableDesperationMoves.peek]);

  // 🚀 Fetch Groq AI response when needed
  useEffect(() => {
    const fetchAndUpdateAI = async () => {
      // Only fetch AI response for new stages or when a door is selected
      if (isNewStage || doorResults.some(door => door !== null)) {
        // Build the prompt with current game state
        const doorChoiceHistory = gameHistory.doorSelections
          .map((count, index) => count > 0 ? `Door ${index + 1}: ${count}` : null)
          .filter(Boolean) as string[];
          
        const stats = {
          winStreak: gameHistory.currentWinStreak || 0,
          lossStreak: gameHistory.currentLossStreak || consecutiveLosses
        };
        
        const prompt = buildPrompt(stage, doorChoiceHistory, stats);
        
        try {
          // Fetch response from AI using our util function
          const aiResponseText = await fetchAIResponse(prompt, 'game-session', stage, {
            doubtLevel,
            doorHistory: gameHistory.doorSelections
          });
          updateAIMessage(aiResponseText);
        } catch (error) {
          console.error("Error fetching AI response:", error);
        }
      }
    };

    fetchAndUpdateAI();
  }, [isNewStage, doorResults, stage, doubtLevel, aiPersonality, consecutiveLosses, updateAIMessage, gameHistory]);

  // Move the floating "Try Again" button randomly when hovered
  useEffect(() => {
    if (isButtonHovered) {
      const moveButton = () => {
        const newTop = Math.floor(Math.random() * 80) + 10; // 10% to 90% of viewport
        const newLeft = Math.floor(Math.random() * 80) + 10; // 10% to 90% of viewport
        setButtonPosition({ top: `${newTop}%`, left: `${newLeft}%` });
      };

      const interval = setInterval(moveButton, 800);
      return () => clearInterval(interval);
    }
  }, [isButtonHovered]);

  // Handle the glitchy reset
  const handleGlitchyReset = () => {
    // 30% chance to trigger a fake crash
    if (Math.random() < 0.3) {
      // Create a full-screen glitch effect
      const glitchOverlay = document.createElement('div');
      glitchOverlay.className = 'fixed inset-0 bg-black z-50 animate-glitch';
      document.body.appendChild(glitchOverlay);
      
      // Add some static noise
      for (let i = 0; i < 50; i++) {
        const staticLine = document.createElement('div');
        const top = Math.random() * 100;
        staticLine.className = 'absolute h-px bg-white opacity-70';
        staticLine.style.top = `${top}%`;
        staticLine.style.left = '0';
        staticLine.style.right = '0';
        glitchOverlay.appendChild(staticLine);
      }
      
      // Show a fake error message
      setTimeout(() => {
        const errorText = document.createElement('div');
        errorText.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-mono text-2xl';
        errorText.textContent = 'SYSTEM FAILURE';
        glitchOverlay.appendChild(errorText);
      }, 500);
      
      // Remove the overlay and reset the game
      setTimeout(() => {
        document.body.removeChild(glitchOverlay);
        resetGame();
      }, 2000);
    } else {
      // Normal reset
      resetGame();
    }
  };

  // Handle floating peek ability
  const handleFloatingPeek = (doorIndex: number) => {
    setSelectedPeekDoor(doorIndex);
    useDesperationMove('peek', doorIndex);
    setFloatingPeekEnabled(false);
  };

  // Determine if a door has been selected
  const isDoorSelected = doorResults.some(door => door !== null);
  
  // Show diary after 5 games
  const shouldShowDiaryOption = gameHistory.gamesPlayed >= 5;

  return (
    <div 
      className={cn("min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000 relative", getBackgroundStyle(stageType))}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Stage transition screen */}
      {isNewStage && <StageTransition />}

      {/* Game container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Game stats */}
        <GameStats />

        {/* Lives Display */}
        <div className="flex items-center gap-1 mb-3">
          {Array(3).fill(0).map((_, idx) => (
            <Heart 
              key={idx} 
              size={24}
              className={idx < lives ? "text-red-500 fill-red-500" : "text-gray-500"}
            />
          ))}
        </div>

        {/* AI Personality Indicator */}
        <div className={cn(
          "text-xs mb-2 px-2 py-1 rounded",
          aiPersonality === 'trickster' ? "bg-blue-200 text-blue-800" :
          aiPersonality === 'manipulator' ? "bg-purple-200 text-purple-800" :
          "bg-red-200 text-red-800"
        )}>
          {aiPersonality === 'trickster' ? "Mind Engineer" :
           aiPersonality === 'manipulator' ? "Mind Manipulator" :
           "Mind Reaper"}
        </div>

        {/* AI Message with Avatar and Villain */}
        <div className="flex items-start w-full gap-3 mb-4">
          <Avatar className="w-12 h-12 mt-2">
            <AvatarImage src={`/images/ai-${aiPersonality}.png`} alt="AI Personality" />
            <AvatarFallback className={cn(
              aiPersonality === 'trickster' ? "bg-blue-300" :
              aiPersonality === 'manipulator' ? "bg-purple-300" :
              "bg-red-300"
            )}>
              {aiPersonality === 'trickster' ? "T" :
               aiPersonality === 'manipulator' ? "M" :
               "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <AIMessage />
          </div>
        </div>

        {/* Floating peek ability */}
        {floatingPeekEnabled && (
          <div 
            className="fixed z-20 animate-floating"
            style={{
              top: `${peekPosition.y}%`,
              left: `${peekPosition.x}%`
            }}
          >
            <div className="bg-purple-800/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500 shadow-lg animate-pulse">
              <div className="text-white text-center mb-2 text-sm">
                Peek Opportunity!
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((doorIdx) => (
                  <Button
                    key={doorIdx}
                    size="sm"
                    onClick={() => handleFloatingPeek(doorIdx)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye className="w-3 h-3 mr-1" /> Door {doorIdx + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Doors */}
        <div className="flex justify-center items-center my-10 w-full">
          <Door index={0} />
          <Door index={1} />
          <Door index={2} />
        </div>

        {/* Desperation moves - only show when the AI randomly decides to give them */}
        {(availableDesperationMoves.peek || availableDesperationMoves.beg) && (
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            {availableDesperationMoves.peek && (
              <>
                <Button
                  onClick={() => useDesperationMove('peek', 0)}
                  disabled={isDoorSelected}
                  className={cn(
                    "relative",
                    stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
                    stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
                    stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
                    "bg-purple-800 hover:bg-purple-900"
                  )}
                >
                  <Eye className="mr-2" size={16} />
                  Peek Door 1
                </Button>
                
                <Button
                  onClick={() => useDesperationMove('peek', 1)}
                  disabled={isDoorSelected}
                  className={cn(
                    "relative",
                    stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
                    stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
                    stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
                    "bg-purple-800 hover:bg-purple-900"
                  )}
                >
                  <Eye className="mr-2" size={16} />
                  Peek Door 2
                </Button>
                
                <Button
                  onClick={() => useDesperationMove('peek', 2)}
                  disabled={isDoorSelected}
                  className={cn(
                    "relative",
                    stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
                    stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
                    stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
                    "bg-purple-800 hover:bg-purple-900"
                  )}
                >
                  <Eye className="mr-2" size={16} />
                  Peek Door 3
                </Button>
              </>
            )}
            
            {availableDesperationMoves.beg && (
              <Button
                onClick={() => useDesperationMove('beg')}
                disabled={isDoorSelected}
                className={cn(
                  "relative",
                  stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
                  stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
                  stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
                  "bg-purple-800 hover:bg-purple-900"
                )}
              >
                <HandHelping className="mr-2" size={16} />
                Beg For Mercy
              </Button>
            )}
          </div>
        )}

        {/* Diary Button (shows after 5 games) */}
        {shouldShowDiaryOption && (
          <Button 
            variant="outline" 
            onClick={() => setShowDiary(true)}
            className={cn(
              "mt-4", 
              stageType === 'early' ? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" : 
              stageType === 'middle' ? "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white" : 
              stageType === 'late' ? "border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white" :
              "border-purple-500 text-purple-500 hover:bg-purple-800 hover:text-white"
            )}
          >
            <Book size={16} className="mr-2" />
            Mind-Engineer's Notes
          </Button>
        )}
      </div>

      {/* Mobile AI Villain (only visible on small screens) */}
      <div className="md:hidden absolute bottom-20 right-4 z-10">
      </div>

      {/* Floating "Try Again" button */}
      <Button 
        variant="outline" 
        onClick={handleGlitchyReset}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        className={cn(
          "fixed z-10 transition-all duration-300",
          isButtonHovered ? "animate-glitch" : "",
          stageType === 'late' || stageType === 'final' ? "border-red-500 text-red-300" : "border-purple-500 text-purple-500"
        )}
        style={{
          top: buttonPosition.top,
          left: buttonPosition.left
        }}
      >
        <RefreshCw size={16} className={`mr-2 ${isButtonHovered ? 'animate-spin' : ''}`} />
        Try Again?
      </Button>

      {/* AI Diary Modal */}
      {showDiary && <AIDiary onClose={() => setShowDiary(false)} />}
    </div>
  );
};

export default Game;
