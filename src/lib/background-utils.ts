
/**
 * Get the background image URL for the current stage
 * @param stage Current game stage (1-15)
 * @returns Path to background image
 */
export const getBackgroundImage = (stage: number): string => {
  // Ensure stage is within valid range
  const validStage = Math.max(1, Math.min(15, stage));
  return `/images/backgrounds/stage${validStage}.png`;
};

/**
 * Get CSS classes for text based on stage type
 * @param stageType Type of current stage
 * @returns CSS classes for text styling
 */
export const getTextStyleForStage = (stageType: 'early' | 'middle' | 'late' | 'final'): string => {
  switch (stageType) {
    case 'early':
      return 'text-stage-early-text';
    case 'middle':
      return 'text-stage-middle-text';
    case 'late':
      return 'text-white';
    case 'final':
      return 'text-stage-final-text';
    default:
      return 'text-white';
  }
};

/**
 * Get CSS classes for background based on stage type
 * @param stageType Type of current stage
 * @returns CSS classes for background styling
 */
export const getBackgroundStyle = (stageType: 'early' | 'middle' | 'late' | 'final'): string => {
  switch (stageType) {
    case 'early':
      return 'bg-stage-early-bg';
    case 'middle':
      return 'bg-stage-middle-bg';
    case 'late':
      return 'bg-stage-late-bg';
    case 'final':
      return 'bg-black';
    default:
      return 'bg-black';
  }
};
