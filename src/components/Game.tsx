import React, { useEffect } from 'react';   // ⬅️ Add useEffect
import { useGame } from '../contexts/GameContext';
import Door from './Door';
import AIMessage from './AIMessage';
import DoubtMeter from './DoubtMeter';
import GameStats from './GameStats';
import StageTransition from './StageTransition';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchGroqHint } from '@/pages';    // ⬅️ Import Groq hint fetcher

const Game: React.FC = () => {
  const { stageType, doorResults, isNewStage, isGameOver, continueGame, resetGame } = useGame();

  // 🚀 Fetch Groq hint after player selects a door
  useEffect(() => {
    const handleGroqHint = async () => {
      if (doorResults.some(door => door !== null)) {   // ⬅️ Player clicked a door
        const playerHistory = `Doors clicked: ${JSON.stringify(doorResults)}`;
        const hint = await fetchGroqHint(playerHistory);
        console.log("Groq Hint:", hint);  // 🔥 Now hint will show up in console
        // Later: Display hint in AIMessage component if you want
      }
    };

    handleGroqHint();
  }, [doorResults]);   // ⬅️ Dependency: whenever player clicks door

  // ⬇️ Your original background style function
  const getBackgroundStyle = () => {
    switch (stageType) {
      case 'early':
        return 'bg-stage-early-bg text-stage-early-text';
      case 'middle':
        return 'bg-stage-middle-bg text-stage-middle-text';
      case 'late':
        return 'bg-stage-late-bg text-white';
      case 'final':
        return 'bg-black text-stage-final-text';
    }
  };

  // Determine if a door has been selected
  const isDoorSelected = doorResults.some(door => door !== null);

  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000", getBackgroundStyle())}>
      {/* Stage transition screen */}
      {isNewStage && <StageTransition />}

      {/* Game container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Game stats */}
        <GameStats />

        {/* Doubt meter */}
        <DoubtMeter />

        {/* AI message */}
        <AIMessage />

        {/* Doors */}
        <div className="flex justify-center items-center my-10 w-full">
          <Door index={0} />
          <Door index={1} />
          <Door index={2} />
        </div>

        {/* Continue or reset buttons */}
        {isDoorSelected && !isGameOver && (
          <Button 
            onClick={continueGame}
            className={cn(
              "mt-4 px-8",
              stageType === 'early' ? "bg-blue-500 hover:bg-blue-600" : 
              stageType === 'middle' ? "bg-purple-500 hover:bg-purple-600" : 
              stageType === 'late' ? "bg-gray-700 hover:bg-gray-800" :
              "bg-purple-800 hover:bg-purple-900"
            )}
          >
            Continue to Next Stage
          </Button>
        )}

        <Button 
          variant="outline" 
          onClick={resetGame}
          className={cn(
            "mt-4", 
            stageType === 'early' ? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" : 
            stageType === 'middle' ? "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white" : 
            stageType === 'late' ? "border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white" :
            "border-purple-500 text-purple-500 hover:bg-purple-800 hover:text-white"
          )}
        >
          Reset Game
        </Button>
      </div>
    </div>
  );
};

export default Game;
