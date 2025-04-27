
import React, { useEffect, useState } from 'react';   
import { useGame } from '../contexts/GameContext';
import Door from './Door';
import AIMessage from './AIMessage';
import DoubtMeter from './DoubtMeter';
import GameStats from './GameStats';
import StageTransition from './StageTransition';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchAIResponse } from '@/lib/ai-utils';
import { getBackgroundImage, getBackgroundStyle } from '@/lib/background-utils';
import { 
  Eye, 
  HandHelping, 
  RefreshCw,
  Book
} from 'lucide-react';
import AIDiary from './AIDiary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    updateAIMessage
  } = useGame();
  
  const [showDiary, setShowDiary] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: '90%', left: '80%' });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>("/images/backgrounds/stage1.png");

  // Update background image when stage changes
  useEffect(() => {
    setBackgroundImage(getBackgroundImage(stage));
  }, [stage]);

  // 🚀 Fetch Groq AI response when needed
  useEffect(() => {
    const fetchAndUpdateAI = async () => {
      // Only fetch AI response for new stages or when a door is selected
      if (isNewStage || doorResults.some(door => door !== null)) {   
        const aiResponse = await fetchAIResponse(
          stage,
          doubtLevel,
          aiPersonality,
          consecutiveLosses,
          isNewStage
        );
        
        updateAIMessage(aiResponse.message);
      }
    };

    fetchAndUpdateAI();
  }, [isNewStage, doorResults, stage, doubtLevel, aiPersonality, consecutiveLosses, updateAIMessage]);

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

        {/* AI Personality Indicator */}
        <div className={cn(
          "text-xs mb-2 px-2 py-1 rounded",
          aiPersonality === 'trickster' ? "bg-blue-200 text-blue-800" :
          aiPersonality === 'manipulator' ? "bg-purple-200 text-purple-800" :
          "bg-red-200 text-red-800"
        )}>
          {aiPersonality === 'trickster' ? "Trickster Mode" :
           aiPersonality === 'manipulator' ? "Manipulator Mode" :
           "Psycho Mode"}
        </div>

        {/* Doubt meter */}
        <DoubtMeter />

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

        {/* Doors */}
        <div className="flex justify-center items-center my-10 w-full">
          <Door index={0} />
          <Door index={1} />
          <Door index={2} />
        </div>

        {/* Desperation moves */}
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={() => useDesperationMove('peek', 0)}
            disabled={!availableDesperationMoves.peek || isDoorSelected}
            className={cn(
              "relative",
              availableDesperationMoves.peek ? "opacity-100" : "opacity-50",
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
            disabled={!availableDesperationMoves.peek || isDoorSelected}
            className={cn(
              "relative",
              availableDesperationMoves.peek ? "opacity-100" : "opacity-50",
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
            disabled={!availableDesperationMoves.peek || isDoorSelected}
            className={cn(
              "relative",
              availableDesperationMoves.peek ? "opacity-100" : "opacity-50",
              stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
              stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
              stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
              "bg-purple-800 hover:bg-purple-900"
            )}
          >
            <Eye className="mr-2" size={16} />
            Peek Door 3
          </Button>
          
          <Button
            onClick={() => useDesperationMove('beg')}
            disabled={!availableDesperationMoves.beg || isDoorSelected}
            className={cn(
              "relative",
              availableDesperationMoves.beg ? "opacity-100" : "opacity-50",
              stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
              stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
              stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
              "bg-purple-800 hover:bg-purple-900"
            )}
          >
            <HandHelping className="mr-2" size={16} />
            Beg For Mercy
          </Button>
        </div>

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
            Granny's Notebook
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
