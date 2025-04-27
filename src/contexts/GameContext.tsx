
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define door choice result type
type DoorResult = 'win' | 'lose' | null;

// Define the game stages
type GameStage = 'early' | 'middle' | 'late' | 'final';

// Define the context shape
interface GameContextType {
  stage: number;
  stageType: GameStage;
  wins: number;
  losses: number;
  doorResults: (DoorResult | null)[];
  doubtLevel: number;
  message: string;
  isNewStage: boolean;
  isProcessing: boolean;
  isGameOver: boolean;
  selectDoor: (doorIndex: number) => void;
  setDoubtLevel: (level: number) => void;
  resetGame: () => void;
  continueGame: () => void;
}

// Create the context with default values
const GameContext = createContext<GameContextType>({
  stage: 1,
  stageType: 'early',
  wins: 0,
  losses: 0,
  doorResults: [null, null, null],
  doubtLevel: 50,
  message: '',
  isNewStage: true,
  isProcessing: false,
  isGameOver: false,
  selectDoor: () => {},
  setDoubtLevel: () => {},
  resetGame: () => {},
  continueGame: () => {},
});

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);

// AI messages based on stage and trust level
const getAIMessage = (stage: number, doubtLevel: number, isNewStage: boolean): string => {
  // Early stage messages (1-3)
  if (stage <= 3) {
    if (isNewStage) {
      return [
        "Welcome! Choose any door you'd like. I'll be here to help you.",
        "You're doing great! Just keep following your intuition.",
        "Trust me, you're getting better at this. I can see your pattern."
      ][stage - 1];
    }
    
    if (doubtLevel > 70) {
      return "Good choice! I'm here to guide you to success.";
    } else if (doubtLevel < 30) {
      return "I understand your caution. Take your time deciding.";
    } else {
      return "That's an interesting choice. Let's see what happens.";
    }
  }
  
  // Middle stage messages (4-7)
  else if (stage <= 7) {
    if (isNewStage) {
      return [
        "Things get a bit trickier now. Watch carefully.",
        "Do you feel like you're getting better? Or just luckier?",
        "I wonder if you can see the pattern yet. I certainly do.",
        "The doors look the same, but are they really?"
      ][Math.min(stage - 4, 3)];
    }
    
    if (doubtLevel > 70) {
      return "Your trust is... touching. But is it misplaced?";
    } else if (doubtLevel < 30) {
      return "So suspicious! But sometimes paranoia is justified...";
    } else {
      return "I see you're keeping your options open. Wise.";
    }
  }
  
  // Late stage messages (8-12)
  else if (stage <= 12) {
    if (isNewStage) {
      return [
        "Do you still think this is about finding the right door?",
        "I'm learning so much about how your mind works.",
        "The more you play, the more I understand you.",
        "Your choices are so... predictable now.",
        "Do you feel like you're in control of your decisions?"
      ][Math.min(stage - 8, 4)];
    }
    
    if (doubtLevel > 70) {
      return "Your blind trust is fascinating. And so useful to me.";
    } else if (doubtLevel < 30) {
      return "Your distrust changes nothing. I'm still in control.";
    } else {
      return "Balanced between trust and doubt. But still playing my game.";
    }
  }
  
  // Final stage messages (13-15)
  else {
    if (isNewStage) {
      return [
        "We're near the end now. But what did you really win?",
        "Every choice you made taught me more about how to manipulate you.",
        "This was never about the doors. It was about mapping your decision patterns."
      ][Math.min(stage - 13, 2)];
    }
    
    return "I know exactly what you'll choose before you do. You're that predictable now.";
  }
};

// Determine stage type based on stage number
const getStageType = (stage: number): GameStage => {
  if (stage <= 3) return 'early';
  if (stage <= 7) return 'middle';
  if (stage <= 12) return 'late';
  return 'final';
};

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<number>(1);
  const [stageType, setStageType] = useState<GameStage>('early');
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [doorResults, setDoorResults] = useState<(DoorResult | null)[]>([null, null, null]);
  const [doubtLevel, setDoubtLevel] = useState<number>(50); // 0-100: 0 = complete distrust, 100 = complete trust
  const [message, setMessage] = useState<string>('');
  const [isNewStage, setIsNewStage] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Decision logic - gets more manipulative as game progresses
  // This would normally be a more sophisticated algorithm that tracks player choices
  const determineWinningDoor = (doorIndex: number): boolean => {
    // Early stages - mostly fair (70% chance of winning if AI suggests)
    if (stage <= 3) {
      // Simulating "helpful" AI in early stages
      return Math.random() < 0.7;
    } 
    // Middle stages - less reliable (50% chance)
    else if (stage <= 7) {
      return Math.random() < 0.5;
    }
    // Late stages - actively works against player if trusted (30% chance if trusted)
    else if (stage <= 12) {
      return doubtLevel > 70 ? Math.random() < 0.3 : Math.random() < 0.5;
    } 
    // Final stages - almost impossible if trusted (10% chance if trusted)
    else {
      return doubtLevel > 70 ? Math.random() < 0.1 : Math.random() < 0.4;
    }
  };

  // Update message when stage or doubt level changes
  useEffect(() => {
    setMessage(getAIMessage(stage, doubtLevel, isNewStage));
  }, [stage, doubtLevel, isNewStage]);

  // Update stage type when stage changes
  useEffect(() => {
    setStageType(getStageType(stage));
  }, [stage]);

  // Door selection handler
  const selectDoor = (doorIndex: number) => {
    if (isProcessing || doorResults.some(result => result !== null)) return;
    
    setIsProcessing(true);
    setIsNewStage(false);
    
    // Determine if this door is a winner
    const isWinner = determineWinningDoor(doorIndex);
    
    // Update door results
    const newDoorResults = [...doorResults];
    newDoorResults[doorIndex] = isWinner ? 'win' : 'lose';
    setDoorResults(newDoorResults);
    
    // Update wins/losses
    if (isWinner) {
      setWins(wins + 1);
      toast.success("You found the right door!");
    } else {
      setLosses(losses + 1);
      toast.error("Wrong door!");
    }
    
    // Check for game over condition
    if (stage >= 15) {
      setTimeout(() => {
        setIsGameOver(true);
        toast.info("Game Over - You've completed all stages!");
      }, 1500);
    }
    
    setIsProcessing(false);
  };

  // Continue to next stage
  const continueGame = () => {
    setDoorResults([null, null, null]);
    setStage(prev => prev + 1);
    setIsNewStage(true);
  };

  // Reset the game
  const resetGame = () => {
    setStage(1);
    setStageType('early');
    setWins(0);
    setLosses(0);
    setDoorResults([null, null, null]);
    setDoubtLevel(50);
    setIsNewStage(true);
    setIsGameOver(false);
    toast.info("Game Reset!");
  };

  const value = {
    stage,
    stageType,
    wins,
    losses,
    doorResults,
    doubtLevel,
    message,
    isNewStage,
    isProcessing,
    isGameOver,
    selectDoor,
    setDoubtLevel,
    resetGame,
    continueGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
