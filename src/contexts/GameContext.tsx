import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define door choice result type
type DoorResult = 'win' | 'lose' | null;

// Define the game stages
type GameStage = 'early' | 'middle' | 'late' | 'final';

// Define AI personality types
export type AIPersonality = 'trickster' | 'manipulator' | 'psycho';

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
  aiMessage: string;
  currentStage: number;
  isNewStage: boolean;
  isProcessing: boolean;
  isGameOver: boolean;
  consecutiveWins: number;
  consecutiveLosses: number;
  aiPersonality: AIPersonality;
  lives: number; // Added lives property
  availableDesperationMoves: {
    peek: boolean;
    beg: boolean;
  };
  gameHistory: {
    doorSelections: number[];
    switchedDoors: number;
    timesFooled: number;
    gamesPlayed: number;
    currentWinStreak: number;
    currentLossStreak: number;
  };
  peekingDoor: number | null;
  selectDoor: (doorIndex: number) => void;
  setDoubtLevel: (level: number) => void;
  resetGame: () => void;
  continueGame: () => void;
  useDesperationMove: (move: DesperationMove, doorIndex?: number) => void;
  updateAIMessage: (message: string) => void;
  setAIMessage: (message: string) => void;
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
  aiMessage: '',
  currentStage: 1,
  isNewStage: true,
  isProcessing: false,
  isGameOver: false,
  consecutiveWins: 0,
  consecutiveLosses: 0,
  aiPersonality: 'trickster',
  lives: 3, // Starting with 3 lives
  availableDesperationMoves: {
    peek: false, // Start with no desperation moves (will be randomly enabled)
    beg: false,
  },
  gameHistory: {
    doorSelections: [0, 0, 0],
    switchedDoors: 0,
    timesFooled: 0,
    gamesPlayed: 0,
    currentWinStreak: 0,
    currentLossStreak: 0,
  },
  peekingDoor: null,
  selectDoor: () => {},
  setDoubtLevel: () => {},
  resetGame: () => {},
  continueGame: () => {},
  useDesperationMove: () => {},
  updateAIMessage: () => {},
  setAIMessage: () => {},
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
  const [doubtLevel, setDoubtLevel] = useState<number>(50);
  const [message, setMessage] = useState<string>('');
  const [aiMessage, setAIMessage] = useState<string>('');
  const [isNewStage, setIsNewStage] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [aiPersonality, setAIPersonality] = useState<AIPersonality>('trickster');
  const [lives, setLives] = useState<number>(3); // Player starts with 3 lives
  const [availableDesperationMoves, setAvailableDesperationMoves] = useState({
    peek: false, // Start with abilities disabled (will be randomly enabled)
    beg: false,
  });
  const [gameHistory, setGameHistory] = useState({
    doorSelections: [0, 0, 0],
    switchedDoors: 0,
    timesFooled: 0,
    gamesPlayed: 0,
    currentWinStreak: 0,
    currentLossStreak: 0,
  });
  const [peekingDoor, setPeekingDoor] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<boolean>(false);
  const currentStage = stage;
  
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
  
  // Auto-progress to next stage after a win (with delay)
  useEffect(() => {
    if (lastWin) {
      const timer = setTimeout(() => {
        continueGame();
        setLastWin(false);
      }, 2000); // 2 second delay before auto-advancing
      return () => clearTimeout(timer);
    }
  }, [lastWin]);

  // Randomly enable desperation moves
  useEffect(() => {
    // Each stage has a chance to enable peek or beg
    if (isNewStage && !isGameOver) {
      // Peek has a 30% chance per stage
      if (Math.random() < 0.3) {
        setAvailableDesperationMoves(prev => ({ ...prev, peek: true }));
        setTimeout(() => {
          toast.info("You sense a weakness... Peek is now available.", { duration: 3000 });
        }, 1500);
      }
      
      // Beg has a 20% chance per stage
      if (Math.random() < 0.2) {
        setAvailableDesperationMoves(prev => ({ ...prev, beg: true }));
        setTimeout(() => {
          toast.info("The AI seems sympathetic... Beg for Mercy is now available.", { duration: 3000 });
        }, 2500);
      }
    }
  }, [isNewStage, stage, isGameOver]);
  
  // Update message when AI provides a new one
  const updateAIMessage = (newMessage: string) => {
    setMessage(newMessage);
    setAIMessage(newMessage);
  };
  
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
    
    // Update wins/losses and lives
    if (isWinner) {
      setWins(wins + 1);
      setConsecutiveWins(consecutiveWins + 1);
      setConsecutiveLosses(0);
      toast.success("You found the right door!");
      setLastWin(true); // Mark for auto-progression
      
      // Replenish peek ability when winning (as a reward)
      if (!availableDesperationMoves.peek && Math.random() < 0.4) {
        setAvailableDesperationMoves(prev => ({ ...prev, peek: true }));
        toast.info("You've earned a peek ability!");
      }
      
      // Randomly restore a life (20% chance)
      if (lives < 3 && Math.random() < 0.2) {
        setLives(lives + 1);
        toast.success("You gained a life!");
      }
    } else {
      setLosses(losses + 1);
      setConsecutiveLosses(consecutiveLosses + 1);
      setConsecutiveWins(0);
      toast.error("Wrong door!");
      
      // Lose a life when selecting the wrong door
      if (lives > 0) {
        setLives(lives - 1);
        if (lives === 1) {
          toast.error("This is your last life!");
        }
      }
      
      // Game over when out of lives
      if (lives <= 1) {
        setTimeout(() => {
          toast.error("Game Over - You're out of lives!");
          resetGame();
        }, 1500);
      }
    }
    
    // Update win/loss streaks in gameHistory
    if (isWinner) {
      setGameHistory(prev => ({
        ...prev,
        currentWinStreak: prev.currentWinStreak + 1,
        currentLossStreak: 0,
      }));
    } else {
      setGameHistory(prev => ({
        ...prev,
        currentLossStreak: prev.currentLossStreak + 1,
        currentWinStreak: 0,
      }));
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
    
    // Reset desperation moves for the next stage (now handled by random chance each stage)
    setAvailableDesperationMoves({
      peek: false,
      beg: false,
    });
  };

  // Reset the game
  const resetGame = () => {
    // Update game history before resetting
    setGameHistory(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      currentWinStreak: 0,
      currentLossStreak: 0,
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
    setLives(3); // Reset lives to 3
    setAvailableDesperationMoves({
      peek: false,
      beg: false,
    });
    setPeekingDoor(null);
    setLastWin(false);
    
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
    aiMessage,
    currentStage,
    isNewStage,
    isProcessing,
    isGameOver,
    consecutiveWins,
    consecutiveLosses,
    aiPersonality,
    lives, // Added to the value object
    availableDesperationMoves,
    gameHistory,
    peekingDoor,
    selectDoor,
    setDoubtLevel,
    resetGame,
    continueGame,
    useDesperationMove,
    updateAIMessage,
    setAIMessage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
