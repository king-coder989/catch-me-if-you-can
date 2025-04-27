
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';
import { DoorClosed, DoorOpen, Check, X } from 'lucide-react';

interface DoorProps {
  index: number;
}

const Door: React.FC<DoorProps> = ({ index }) => {
  const { stageType, doorResults, selectDoor, isProcessing, peekingDoor, aiPersonality } = useGame();
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    if (!isProcessing && doorResults[index] === null) {
      selectDoor(index);
    }
  };
  
  // Determine door appearance based on stage
  const getDoorStyle = () => {
    const baseStyles = "transition-all duration-300 flex flex-col items-center justify-center";
    
    // Door is open and has a result
    if (doorResults[index] !== null) {
      return cn(
        baseStyles,
        "door animate-door-open",
        doorResults[index] === 'win' ? "bg-green-500" : "bg-red-500"
      );
    }
    
    // Door is being peeked at
    if (peekingDoor === index) {
      // Show a "peek" animation - door cracks open slightly
      return cn(
        baseStyles,
        "door animate-door-peek",
        // AI might lie based on personality
        aiPersonality === 'manipulator' && Math.random() < 0.3 ? "bg-red-500" : "bg-green-500"
      );
    }
    
    // Door is closed
    return cn(
      baseStyles,
      "door cursor-pointer",
      isHovering && !isProcessing ? "animate-door-hover" : "",
      stageType === 'early' ? "bg-stage-early-door hover:bg-blue-600" :
      stageType === 'middle' ? "bg-stage-middle-door hover:bg-purple-600" :
      stageType === 'late' ? "bg-stage-late-door hover:bg-purple-800" :
      "bg-stage-final-door hover:bg-purple-900",
    );
  };
  
  // Handle door content (what's shown when door opens)
  const getDoorContent = () => {
    if (doorResults[index] === null) {
      // If peeking, show a glimpse
      if (peekingDoor === index) {
        return (
          <div className="door-content absolute inset-0 flex items-center justify-center opacity-70">
            {aiPersonality === 'manipulator' && Math.random() < 0.3 
              ? <X size={40} className="text-white animate-pulse" /> // AI might lie
              : <Check size={40} className="text-white animate-pulse" />}
          </div>
        );
      }
      return null;
    }
    
    return (
      <div className="door-content absolute inset-0 flex items-center justify-center">
        {doorResults[index] === 'win' 
          ? <Check size={40} className="text-white" /> 
          : <X size={40} className="text-white" />
        }
      </div>
    );
  };
  
  // Apply glitch effect in later stages
  const applyGlitchEffect = stageType === 'late' || stageType === 'final';
  
  return (
    <div 
      className={cn(
        "door-container w-full aspect-[1/2] max-w-[150px] mx-2 md:mx-4",
        applyGlitchEffect ? "hover:animate-glitch" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className={getDoorStyle()}>
        <div className="absolute inset-0 flex items-center justify-center">
          {doorResults[index] === null ? (
            <DoorClosed 
              size={48} 
              className={cn(
                "text-white",
                stageType === 'final' ? "opacity-70" : "opacity-100",
                peekingDoor === index ? "animate-pulse" : ""
              )} 
            />
          ) : (
            <DoorOpen size={48} className="text-white" />
          )}
        </div>
        {getDoorContent()}
      </div>
    </div>
  );
};

export default Door;
