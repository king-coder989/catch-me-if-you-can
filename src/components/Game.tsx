
import React, { useEffect, useState } from 'react';   
import { useGame } from '../contexts/GameContext';
import Door from './Door';
import AIMessage from './AIMessage';
import GameStats from './GameStats';
import StageTransition from './StageTransition';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchAIResponse, buildPrompt } from '@/lib/ai-utils';
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
          const aiResponseText = await fetchAIResponse(prompt);
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
          {[...Array(3)].map((_, idx) => (
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

        {/* AI Message with Avatar */}
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
        {availableDesperationMoves.peek || availableDesperationMoves.beg ? (
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
        ) : null}

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
