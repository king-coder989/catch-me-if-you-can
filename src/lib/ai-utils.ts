
import { AIPersonality } from '@/contexts/GameContext';

/**
 * Get the appropriate avatar image for the AI based on personality and stage
 */
export const getAIAvatar = (
  personality: AIPersonality, 
  stageType: 'early' | 'middle' | 'late' | 'final'
): string => {
  // Default images
  const defaultImages = {
    trickster: '/images/ai-trickster.png',
    manipulator: '/images/ai-manipulator.png',
    psycho: '/images/ai-psycho.png'
  };
  
  // Return the appropriate image based on personality
  return defaultImages[personality] || defaultImages.trickster;
};
