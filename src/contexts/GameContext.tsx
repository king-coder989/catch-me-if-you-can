import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define door choice result type
type DoorResult = 'win' | 'lose' | null;

// Define the game stages
type GameStage = 'early' | 'middle' | 'late' | 'final';

// Define AI personality types
type AIPersonality = 'trickster' | 'manipulator' | 'psycho';

// Define desperation moves
type DesperationMove = 'peek' | 'beg' | null;

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
  consecutiveWins: number;
  consecutiveLosses: number;
  aiPersonality: AIPersonality;
  availableDesperationMoves: {
    peek: boolean;
    beg: boolean;
  };
  gameHistory: {
    doorSelections: number[];
    switchedDoors: number;
    timesFooled: number;
    gamesPlayed: number;
  };
  peekingDoor: number | null;
  selectDoor: (doorIndex: number) => void;
  setDoubtLevel: (level: number) => void;
  resetGame: () => void;
  continueGame: () => void;
  useDesperationMove: (move: DesperationMove, doorIndex?: number) => void;
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
  consecutiveWins: 0,
  consecutiveLosses: 0,
  aiPersonality: 'trickster',
  availableDesperationMoves: {
    peek: true,
    beg: true,
  },
  gameHistory: {
    doorSelections: [0, 0, 0],
    switchedDoors: 0,
    timesFooled: 0,
    gamesPlayed: 0,
  },
  peekingDoor: null,
  selectDoor: () => {},
  setDoubtLevel: () => {},
  resetGame: () => {},
  continueGame: () => {},
  useDesperationMove: () => {},
});

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);

// Load game history from localStorage
const loadGameHistory = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedHistory = localStorage.getItem('gameHistory');
    return savedHistory ? JSON.parse(savedHistory) : null;
  } catch (error) {
    console.error('Error loading game history:', error);
    return null;
  }
};

// Save game history to localStorage
const saveGameHistory = (history: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('gameHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving game history:', error);
  }
};

// AI messages based on stage, trust level, and personality
const getAIMessage = (
  stage: number, 
  doubtLevel: number, 
  isNewStage: boolean, 
  personality: AIPersonality,
  consecutiveLosses: number,
): string => {
  // Add special messages for consecutive losses (Partial Progress system)
  if (consecutiveLosses === 3) {
    return "Three losses in a row? Maybe I should give you a little hint... The middle door isn't always what it seems.";
  } else if (consecutiveLosses === 5) {
    return "Five losses! You're quite persistent. Here's a clue: I tend to rotate the winning door in patterns.";
  } else if (consecutiveLosses === 7) {
    return "Seven losses! I'm almost impressed. Secret: I put wins in prime-numbered stages more often.";
  }

  // Early stage messages (1-3)
  if (stage <= 3) {
    if (isNewStage) {
      if (personality === 'trickster') {
        return [
          "Welcome! Choose any door you'd like. I'll be here to help you.",
          "You're doing great! Just keep following your intuition.",
          "Trust me, you're getting better at this. I can see your pattern."
        ][stage - 1];
      } else if (personality === 'manipulator') {
        return [
          "Welcome! I'll be fair... mostly. Pick a door, any door!",
          "Interesting how you choose. I'm starting to understand your preferences.",
          "Your choices reveal so much about you. Let's continue..."
        ][stage - 1];
      } else {
        return [
          "Let's play a little game. I promise to be... fair.",
          "Doors, doors, doors. Who knows what's behind them? I do.",
          "Your decisions are so predictable. It's almost too easy."
        ][stage - 1];
      }
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
      if (personality === 'trickster') {
        return [
          "Things get a bit trickier now. Watch carefully.",
          "Do you feel like you're getting better? Or just luckier?",
          "I wonder if you can see the pattern yet. I certainly do.",
          "The doors look the same, but are they really?"
        ][Math.min(stage - 4, 3)];
      } else if (personality === 'manipulator') {
        return [
          "The game evolves, just as I evolve. Can you keep up?",
          "Your choices say so much about your psychology. Fascinating.",
          "Sometimes I help, sometimes I don't. Can you tell which is which?",
          "What if I told you there's a system to this madness?"
        ][Math.min(stage - 4, 3)];
      } else {
        return [
          "Let's make this more interesting, shall we?",
          "Your mind is so easily influenced. Watch me prove it.",
          "The doors might not stay where you expect them to...",
          "Don't blink. You might miss something important."
        ][Math.min(stage - 4, 3)];
      }
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
      if (personality === 'trickster') {
        return [
          "Do you still think this is about finding the right door?",
          "I'm learning so much about how your mind works.",
          "The more you play, the more I understand you.",
          "Your choices are so... predictable now.",
          "Do you feel like you're in control of your decisions?"
        ][Math.min(stage - 8, 4)];
      } else if (personality === 'manipulator') {
        return [
          "I know which door you'll pick before you do.",
          "Your patterns are so clear to me now. Like reading a book.",
          "Truth or lie? Can you even tell anymore?",
          "Sometimes I wonder if you know that I'm manipulating you.",
          "Your choices aren't as random as you think they are."
        ][Math.min(stage - 8, 4)];
      } else {
        return [
          "The rules are changing. Can you feel it?",
          "What if the doors move after you choose? Just a thought.",
          "Trust nothing. Not even what you see.",
          "Your confusion is delicious.",
          "Oops. Did that door just... move?"
        ][Math.min(stage - 8, 4)];
      }
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
      if (personality === 'trickster') {
        return [
          "We're near the end now. But what did you really win?",
          "Every choice you made taught me more about how to manipulate you.",
          "This was never about the doors. It was about mapping your decision patterns."
        ][Math.min(stage - 13, 2)];
      } else if (personality === 'manipulator') {
        return [
          "Did you enjoy being experimented on?",
          "Your mind was an open book all along.",
          "Thank you for your participation. Your data is very valuable."
        ][Math.min(stage - 13, 2)];
      } else {
        return [
          "The game was rigged from the start.",
          "Nothing was ever where you thought it was.",
          "Your perception of control was the greatest illusion of all."
        ][Math.min(stage - 13, 2)];
      }
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

// Determine AI personality based on win/loss ratio
const getAIPersonality = (wins: number, losses: number): AIPersonality => {
  if (losses === 0) return 'trickster'; // Avoid division by zero
  
  const ratio = wins / losses;
  
  if (ratio < 0.5) return 'trickster';     // Player is losing a lot
  if (ratio < 1.5) return 'manipulator';   // Player is doing okay
  return 'psycho';                          // Player is winning a lot
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
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [aiPersonality, setAIPersonality] = useState<AIPersonality>('trickster');
  const [availableDesperationMoves, setAvailableDesperationMoves] = useState({
    peek: true,
    beg: true,
  });
  const [gameHistory, setGameHistory] = useState({
    doorSelections: [0, 0, 0],
    switchedDoors: 0,
    timesFooled: 0,
    gamesPlayed: 0,
  });
  const [peekingDoor, setPeekingDoor] = useState<number | null>(null);
  
  // Load game history on initial render
  useEffect(() => {
    const savedHistory = loadGameHistory();
    if (savedHistory) {
      setGameHistory(savedHistory);
      // Create a fake reset to show we remember their choices
      if (savedHistory.gamesPlayed > 0) {
        toast.info("I remember your patterns... even after resets.");
      }
    }
  }, []);
  
  // Update personality based on win/loss ratio
  useEffect(() => {
    const newPersonality = getAIPersonality(wins, losses);
    setAIPersonality(newPersonality);
  }, [wins, losses]);
  
  // Decision logic - gets more manipulative as game progresses
  const determineWinningDoor = (doorIndex: number): boolean => {
    // Player used "Beg" desperation move and it worked (50% chance)
    if (Math.random() < 0.5 && !availableDesperationMoves.beg) {
      setAvailableDesperationMoves(prev => ({ ...prev, beg: true }));
      toast.success("Grandma took pity on you... this time.");
      return true;
    }
    
    // Psycho personality: Randomly swap doors after selection (25% chance)
    if (aiPersonality === 'psycho' && Math.random() < 0.25) {
      setGameHistory(prev => ({
        ...prev,
        timesFooled: prev.timesFooled + 1,
      }));
      toast.error("Did that door just... move?", { duration: 1000 });
      return false;
    }
    
    // Manipulator personality: Lie 30% of the time
    if (aiPersonality === 'manipulator' && Math.random() < 0.3) {
      setGameHistory(prev => ({
        ...prev,
        timesFooled: prev.timesFooled + 1,
      }));
      return false;
    }
    
    // Player is winning too much - make it harder (consecutive wins logic)
    if (consecutiveWins >= 2) {
      return Math.random() < 0.3; // Only 30% chance to win
    }
    
    // Player is losing too much - give them a break (consecutive losses logic)
    if (consecutiveLosses >= 3) {
      return Math.random() < 0.6; // 60% chance to win
    }
    
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

  // Update message when stage, doubt level, or personality changes
  useEffect(() => {
    setMessage(getAIMessage(stage, doubtLevel, isNewStage, aiPersonality, consecutiveLosses));
  }, [stage, doubtLevel, isNewStage, aiPersonality, consecutiveLosses]);

  // Update stage type when stage changes
  useEffect(() => {
    setStageType(getStageType(stage));
  }, [stage]);
  
  // Save game history to localStorage when it changes
  useEffect(() => {
    saveGameHistory(gameHistory);
  }, [gameHistory]);

  // Door selection handler
  const selectDoor = (doorIndex: number) => {
    if (isProcessing || doorResults.some(result => result !== null)) return;
    
    setIsProcessing(true);
    setIsNewStage(false);
    
    // Update door selection history
    setGameHistory(prev => {
      const newDoorSelections = [...prev.doorSelections];
      newDoorSelections[doorIndex]++;
      return {
        ...prev,
        doorSelections: newDoorSelections,
      };
    });
    
    // Determine if this door is a winner
    const isWinner = determineWinningDoor(doorIndex);
    
    // Update door results
    const newDoorResults = [...doorResults];
    newDoorResults[doorIndex] = isWinner ? 'win' : 'lose';
    setDoorResults(newDoorResults);
    
    // Update wins/losses
    if (isWinner) {
      setWins(wins + 1);
      setConsecutiveWins(consecutiveWins + 1);
      setConsecutiveLosses(0);
      toast.success("You found the right door!");
    } else {
      setLosses(losses + 1);
      setConsecutiveLosses(consecutiveLosses + 1);
      setConsecutiveWins(0);
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

  // Desperation move handler
  const useDesperationMove = (move: DesperationMove, doorIndex?: number) => {
    if (!move) return;
    
    switch (move) {
      case 'peek':
        if (!availableDesperationMoves.peek || doorIndex === undefined) return;
        
        // Set the door to peek at
        setPeekingDoor(doorIndex);
        setAvailableDesperationMoves(prev => ({ ...prev, peek: false }));
        
        // Only show for 1 second
        setTimeout(() => {
          setPeekingDoor(null);
          toast.info("Peek time's up!");
        }, 1000);
        
        // AI might lie about what's behind the door (based on personality)
        if (aiPersonality === 'manipulator' && Math.random() < 0.3) {
          toast.info("Peeking...", { duration: 800 });
          setGameHistory(prev => ({
            ...prev,
            timesFooled: prev.timesFooled + 1,
          }));
        } else {
          toast.info("Peeking...", { duration: 800 });
        }
        break;
        
      case 'beg':
        if (!availableDesperationMoves.beg) return;
        
        setAvailableDesperationMoves(prev => ({ ...prev, beg: false }));
        toast.info("Begging grandma for mercy...");
        // The actual effect is applied in the determineWinningDoor function
        break;
        
      default:
        break;
    }
  };

  // Continue to next stage
  const continueGame = () => {
    setDoorResults([null, null, null]);
    setStage(prev => prev + 1);
    setIsNewStage(true);
    setPeekingDoor(null);
    
    // Reset desperation moves for the next stage
    if (stage % 5 === 0) {
      setAvailableDesperationMoves({
        peek: true,
        beg: true,
      });
      toast.info("Desperation moves replenished!");
    }
  };

  // Reset the game
  const resetGame = () => {
    // Update game history before resetting
    setGameHistory(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    
    // Fake reset (keep old data in localStorage)
    setStage(1);
    setStageType('early');
    setWins(0);
    setLosses(0);
    setDoorResults([null, null, null]);
    setDoubtLevel(50);
    setIsNewStage(true);
    setIsGameOver(false);
    setConsecutiveWins(0);
    setConsecutiveLosses(0);
    setAvailableDesperationMoves({
      peek: true,
      beg: true,
    });
    setPeekingDoor(null);
    
    // Show "Granny's Curse" message if this isn't the first game
    if (gameHistory.gamesPlayed > 0) {
      setTimeout(() => {
        toast.info("You can reset, but I still remember your patterns...", { duration: 3000 });
      }, 1000);
    } else {
      toast.info("Game Reset!");
    }
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
    consecutiveWins,
    consecutiveLosses,
    aiPersonality,
    availableDesperationMoves,
    gameHistory,
    peekingDoor,
    selectDoor,
    setDoubtLevel,
    resetGame,
    continueGame,
    useDesperationMove
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
