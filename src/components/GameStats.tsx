
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { Trophy, Award } from 'lucide-react';

const GameStats: React.FC = () => {
  const { stage, wins, losses, stageType } = useGame();
  
  // Different styles based on game stage
  const getStatsStyle = () => {
    switch (stageType) {
      case 'early':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'middle':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'late':
        return 'bg-gray-800 text-white border-gray-600';
      case 'final':
        return 'bg-black text-purple-300 border-purple-500';
    }
  };

  // Apply glitch effect in later stages
  const shouldApplyGlitch = stageType === 'late' || stageType === 'final';
  
  return (
    <div 
      className={cn(
        "flex justify-between items-center p-3 rounded-lg mb-4 border",
        getStatsStyle()
      )}
    >
      <div className="flex items-center">
        <Award size={20} className="mr-1" />
        <span 
          className={cn("font-medium", shouldApplyGlitch ? "glitch" : "")}
          data-text={`Stage ${stage}`}
        >
          Stage {stage}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Trophy size={20} className="mr-1 text-green-500" />
          <span 
            className={cn("font-medium", shouldApplyGlitch ? "glitch" : "")}
            data-text={`${wins}`}
          >
            {wins}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="mr-1 text-red-500">✗</span>
          <span 
            className={cn("font-medium", shouldApplyGlitch ? "glitch" : "")}
            data-text={`${losses}`}
          >
            {losses}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
