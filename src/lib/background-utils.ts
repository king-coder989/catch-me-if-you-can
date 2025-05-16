
/**
 * Gets the appropriate background image based on game stage
 * @param stage Current game stage number (1-15)
 * @returns URL path to the background image
 */
export function getBackgroundImage(stage: number): string {
  return `/images/backgrounds/stage${stage}.jpg`;
}

/**
 * Creates a CSS style object for a stage background
 * @param stage Current game stage number (1-15)
 * @returns CSS style object for React components
 */
export function getBackgroundStyle(stage: number): React.CSSProperties {
  const imagePath = getBackgroundImage(stage);
  
  // Return the style object with the background image
  return {
    backgroundImage: `url(${imagePath}), linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay',
  };
}

/**
 * Creates a fallback background gradient for when images aren't available
 * @param stage Current game stage number (1-15)
 * @returns CSS style object with gradient background
 */
export function getFallbackBackground(stage: number): React.CSSProperties {
  // Different gradient styles based on game stages
  if (stage <= 3) {
    // Early stages - softer, less threatening
    return {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    };
  }
  else if (stage <= 7) {
    // Middle stages - slightly more intense
    return {
      background: 'linear-gradient(135deg, #0f0f1a 0%, #331755 100%)'
    };
  }
  else if (stage <= 12) {
    // Late stages - darker, more ominous
    return {
      background: 'linear-gradient(135deg, #0a0a12 0%, #420d3b 100%)'
    };
  }
  else {
    // Final stages - very dark, menacing
    return {
      background: 'linear-gradient(135deg, #050508 0%, #3a0823 100%)'
    };
  }
}
