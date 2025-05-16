
const TEMPLATES = {
  friendly: `You are CatchMaster, a supportive coach. Stage {stage}. Player history: {history}. Provide an encouraging hint under 20 words.`,
  playful: `You are CatchMaster, a playful trickster. Stage {stage}. Player history: {history}. Provide a subtle misleading hint under 20 words.`,
  villain: `You are CatchMaster, a ruthless villain. Stage {stage}. Player history: {history}. Provide an aggressive deceptive hint under 20 words.`,
  panic: `You are CatchMaster, the mischievous AI. Stage {stage}. Player history: {history}. Create a sense of urgency in under 20 words.`,
  reward: `You are CatchMaster, the mocking victor. Stage {stage}. Player history: {history}. Give a condescending congratulation hint under 20 words.`,
};

const PSYCH_TRICKS = {
  1: "Appeal to their fear of loss.",
  2: "Make your hint sound like expert advice.",
  3: "Refer to recent success deceptively.",
  4: "Flatter them to trigger overconfidence.",
  5: "Use misleading framing to confuse logic.",
  6: "Give them the illusion of control.",
  7: "Trigger scarcity. Make it feel like a rare chance.",
  8: "Confirm what they already believe — wrongly.",
  9: "Introduce a decoy idea to shift attention.",
 10: "Trigger fear-based decision making.",
 11: "Cause mental fatigue by overloading decisions.",
 12: "Gaslight them. Contradict previous hints subtly.",
 13: "Make uncertainty feel dangerous.",
 14: "Break their hope. Make them doubt effort matters.",
 15: "Tell them they never had control. Break their sense of reality."
};

/**
 * Builds the system prompt for Groq based on game state.
 * @param {number} stage - Current game stage (1-15).
 * @param {string[]} history - Array of player's past choices.
 * @param {object} stats - Object with winStreak and lossStreak.
 * @returns {string} - Full system prompt for the AI.
 */
export function buildPrompt(
  stage: number, 
  history: string[] = [], 
  stats = { winStreak: 0, lossStreak: 0 }
): string {
  // Determine base behavior
  let templateKey: keyof typeof TEMPLATES;
  if (stage <= 3) templateKey = 'friendly';
  else if (stage <= 6) templateKey = 'playful';
  else if (stage <= 9) templateKey = 'villain';
  else if (stage <= 12) templateKey = 'panic';
  else templateKey = 'villain';

  let prompt = TEMPLATES[templateKey]
    .replace('{stage}', stage.toString())
    .replace('{history}', history.join(', ') || 'none');

  // Inject streak modifiers
  if (stats.winStreak >= 2) {
    prompt += ' Player feels confident; bait them into overconfidence.';
  }
  if (stats.lossStreak >= 2) {
    prompt += ' Player is frustrated; tease them lightly.';
  }

  // Inject psychological tactic
  if (PSYCH_TRICKS[stage as keyof typeof PSYCH_TRICKS]) {
    prompt += ` Psychological tactic: ${PSYCH_TRICKS[stage as keyof typeof PSYCH_TRICKS]}`;
  }

  // Append global rules
  prompt += `\nRules:\n- Never reveal the correct door.\n- Keep under 20 words.`;
  prompt += `\nSystem: Provide the hint now.`;

  return prompt;
}
