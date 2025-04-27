
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIDiaryProps {
  onClose: () => void;
}

const AIDiary: React.FC<AIDiaryProps> = ({ onClose }) => {
  const { gameHistory, stageType } = useGame();
  
  // Calculate statistics for display
  const totalDoorSelections = gameHistory.doorSelections.reduce((a, b) => a + b, 0);
  const doorPercentages = gameHistory.doorSelections.map(count => 
    totalDoorSelections > 0 ? Math.round((count / totalDoorSelections) * 100) : 0
  );
  
  // Determine which door is chosen most often
  const favoriteDoorIndex = gameHistory.doorSelections.indexOf(Math.max(...gameHistory.doorSelections));
  const favoritePercentage = doorPercentages[favoriteDoorIndex];
  
  // Calculate average selections per game
  const averageSelectionsPerGame = totalDoorSelections / (gameHistory.gamesPlayed || 1);
  
  // Get background style based on stage
  const getBackgroundStyle = () => {
    switch (stageType) {
      case 'early':
        return 'bg-blue-50 text-blue-900';
      case 'middle':
        return 'bg-purple-50 text-purple-900';
      case 'late':
        return 'bg-gray-900 text-gray-100';
      case 'final':
        return 'bg-black text-purple-300';
      default:
        return 'bg-white text-gray-900';
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <Card className={cn(
        "w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto p-6",
        getBackgroundStyle()
      )}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif italic">Granny's Notebook</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="space-y-6 font-serif">
          {/* Door selection preferences */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Your Door Preferences</h3>
            <p className="italic mb-2">
              You pick Door {favoriteDoorIndex + 1} first {favoritePercentage}% of the time.
            </p>
            
            <div className="flex w-full h-6 rounded-md overflow-hidden mb-1">
              {doorPercentages.map((percent, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${percent}%` }}
                  className={cn(
                    idx === 0 ? "bg-blue-500" :
                    idx === 1 ? "bg-purple-500" : 
                    "bg-green-500"
                  )}
                ></div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Door 1: {doorPercentages[0]}%</span>
              <span>Door 2: {doorPercentages[1]}%</span>
              <span>Door 3: {doorPercentages[2]}%</span>
            </div>
          </div>
          
          {/* Pattern observations */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Your Behavioral Patterns</h3>
            <div className="space-y-2">
              <p className="italic">
                "You make {Math.round(averageSelectionsPerGame * 10) / 10} selections per game on average."
              </p>
              {gameHistory.switchedDoors > 0 && (
                <p className="italic">
                  "You've switched your strategy {gameHistory.switchedDoors} times."
                </p>
              )}
              {gameHistory.gamesPlayed > 1 && (
                <p className="italic">
                  "You've reset the game {gameHistory.gamesPlayed} times, thinking it would help..."
                </p>
              )}
              {gameHistory.timesFooled > 0 && (
                <p className="italic text-red-600 dark:text-red-400">
                  "I've successfully fooled you {gameHistory.timesFooled} times."
                </p>
              )}
            </div>
          </div>
          
          {/* AI observations */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Granny's Thoughts</h3>
            <div className="space-y-2 italic">
              {favoriteDoorIndex === 1 && (
                <p>"You favor the middle path. So predictable, always seeking balance."</p>
              )}
              {favoriteDoorIndex === 0 && (
                <p>"You lean left. The first choice, the obvious one."</p>
              )}
              {favoriteDoorIndex === 2 && (
                <p>"The right door calls to you. Always reaching for what seems just out of reach."</p>
              )}
              
              {gameHistory.timesFooled > 3 && (
                <p className="text-red-600 dark:text-red-400">
                  "Your trust is so easily manipulated. It's almost too easy."
                </p>
              )}
              
              {totalDoorSelections > 10 && (
                <p>
                  "After {totalDoorSelections} choices, I can predict your next move with 73% accuracy."
                </p>
              )}
              
              <p className="mt-4 font-bold">
                "Every choice you make teaches me how to control you better."
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onClose}
          className="mt-6 w-full"
        >
          Close Notebook
        </Button>
      </Card>
    </div>
  );
};

export default AIDiary;
