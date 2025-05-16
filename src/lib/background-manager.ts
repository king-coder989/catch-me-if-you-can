
/**
 * Manages the game backgrounds based on the current stage
 */
export interface BackgroundData {
  imagePath: string;
  className: string;
  doorColor: string;
  textColor: string;
}

/**
 * Get background data for a specific stage
 * @param stage Current game stage (1-15)
 * @returns Background data object
 */
export function getBackgroundData(stage: number): BackgroundData {
  // Determine stage type for styling
  let stageType = 'early'; 
  if (stage > 3 && stage <= 6) stageType = 'middle';
  else if (stage > 6 && stage <= 9) stageType = 'late';
  else if (stage > 9) stageType = 'final';
  
  // Background image path
  const imagePath = `/images/backgrounds/stage${stage}.jpg`;
  
  // Default background class if image fails to load
  let bgClass = '';
  switch(stageType) {
    case 'early':
      bgClass = 'bg-stage-early-bg text-stage-early-text';
      break;
    case 'middle':
      bgClass = 'bg-stage-middle-bg text-stage-middle-text';
      break;
    case 'late':
      bgClass = 'bg-stage-late-bg text-white';
      break;
    case 'final':
      bgClass = 'bg-black text-stage-final-text';
      break;
  }
  
  // Door color based on stage
  let doorColor = '';
  switch(stageType) {
    case 'early':
      doorColor = 'bg-stage-early-door';
      break;
    case 'middle':
      doorColor = 'bg-stage-middle-door';
      break;
    case 'late':
      doorColor = 'bg-stage-late-door';
      break;
    case 'final':
      doorColor = 'bg-stage-final-door';
      break;
  }
  
  // Text color based on stage
  let textColor = '';
  switch(stageType) {
    case 'early':
      textColor = 'text-stage-early-text';
      break;
    case 'middle':
      textColor = 'text-stage-middle-text';
      break;
    case 'late':
      textColor = 'text-white';
      break;
    case 'final':
      textColor = 'text-stage-final-text';
      break;
  }
  
  return {
    imagePath,
    className: bgClass,
    doorColor,
    textColor
  };
}

/**
 * Preload background images for smoother transitions
 * @param currentStage Current game stage
 */
export function preloadBackgrounds(currentStage: number): void {
  // Preload current and next stage backgrounds
  for (let i = currentStage; i <= Math.min(currentStage + 2, 15); i++) {
    const img = new Image();
    img.src = `/images/backgrounds/stage${i}.jpg`;
  }
}
