
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGame } from '@/contexts/GameContext';

interface AIAvatarProps {
  speaking: boolean;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ speaking }) => {
  const { aiPersonality, currentStage } = useGame();
  const [avatarSrc, setAvatarSrc] = useState('');
  
  useEffect(() => {
    // Determine avatar based on personality and stage
    const stageType = currentStage <= 3 ? 'early' : 
                      currentStage <= 6 ? 'middle' :
                      currentStage <= 9 ? 'late' : 'final';
    
    // In a real implementation, you would have different avatars for each personality and stage
    const avatarPath = `/images/avatars/${aiPersonality}_${stageType}.png`;
    
    // Fallback if avatar doesn't exist
    setAvatarSrc(avatarPath);
  }, [aiPersonality, currentStage]);

  return (
    <div className={`relative ${speaking ? 'animate-pulse' : ''}`}>
      <Avatar className="h-16 w-16 border-2 border-purple-500">
        <AvatarImage src={avatarSrc} alt="AI Grandmother" />
        <AvatarFallback className={
          aiPersonality === 'trickster' ? 'bg-blue-700' :
          aiPersonality === 'manipulator' ? 'bg-purple-700' :
          'bg-red-700'
        }>
          {aiPersonality === 'trickster' ? 'GM' :
           aiPersonality === 'manipulator' ? 'GM' : 'GM'}
        </AvatarFallback>
      </Avatar>
      
      {speaking && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default AIAvatar;
