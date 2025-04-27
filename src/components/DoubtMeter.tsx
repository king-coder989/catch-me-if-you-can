
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const DoubtMeter: React.FC = () => {
  const { doubtLevel, setDoubtLevel, stageType } = useGame();

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setDoubtLevel(value[0]);
  };

  // Determine text style based on stage
  const getTextStyle = () => {
    switch (stageType) {
      case 'early':
        return 'text-stage-early-text';
      case 'middle':
        return 'text-stage-middle-text';
      case 'late':
      case 'final':
        return 'text-stage-late-text';
    }
  };

  // Apply glitch effect to text in later stages
  const shouldApplyGlitch = stageType === 'late' || stageType === 'final';

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between mb-2">
        <span 
          className={cn(
            "text-sm font-medium",
            getTextStyle(),
            shouldApplyGlitch ? "glitch" : ""
          )}
          data-text="Distrust"
        >
          Distrust
        </span>
        <span 
          className={cn(
            "text-sm font-medium",
            getTextStyle(),
            shouldApplyGlitch ? "glitch" : ""
          )}
          data-text="Trust"
        >
          Trust
        </span>
      </div>
      <Slider
        defaultValue={[50]}
        min={0}
        max={100}
        step={1}
        value={[doubtLevel]}
        onValueChange={handleSliderChange}
        className={cn(
          "w-full",
          stageType === 'early' ? "accent-blue-500" : 
          stageType === 'middle' ? "accent-purple-500" : 
          "accent-red-500"
        )}
      />
    </div>
  );
};

export default DoubtMeter;
