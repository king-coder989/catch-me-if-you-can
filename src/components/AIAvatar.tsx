
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAIAvatar } from '@/lib/ai-utils';

interface AIAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

const AIAvatar: React.FC<AIAvatarProps> = ({ size = 'md' }) => {
  const { aiPersonality, stageType, currentStage } = useGame();
  
  // Get avatar image path from the utility function
  const avatarSrc = getAIAvatar(aiPersonality, stageType);
  
  // Determine size class
  const sizeClass = {
    'sm': 'h-10 w-10',
    'md': 'h-16 w-16',
    'lg': 'h-24 w-24'
  }[size];
  
  // Create fallback initials from the personality type
  const fallbackInitials = aiPersonality.substring(0, 2).toUpperCase();
  
  // Style based on personality
  const fallbackStyle = {
    'trickster': 'bg-blue-900',
    'manipulator': 'bg-purple-900',
    'psycho': 'bg-red-900',
  }[aiPersonality];
  
  return (
    <div className="relative">
      <Avatar className={`${sizeClass} border-2 border-purple-500/50`}>
        <AvatarImage src={avatarSrc} alt={`AI Grandmother (${aiPersonality})`} />
        <AvatarFallback className={fallbackStyle}>
          {fallbackInitials}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-1 -right-1 bg-black px-1.5 rounded-full text-xs border border-purple-500/50">
        {currentStage}
      </div>
    </div>
  );
};

export default AIAvatar;
