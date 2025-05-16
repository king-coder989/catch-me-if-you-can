
import { buildPrompt as composerBuildPrompt } from './PromptComposer';

// Define types for AI integrations
export type AIPersonalityType = 'trickster' | 'manipulator' | 'psycho';
export type GameStage = 'early' | 'middle' | 'late' | 'final';
export type DoorChoiceHistory = string[];
export type StreakStats = { winStreak: number; lossStreak: number };

/**
 * Wrapper for PromptComposer that's used to build prompts for the AI
 */
export function buildPrompt(
  stage: number,
  history: DoorChoiceHistory,
  stats: StreakStats
): string {
  return composerBuildPrompt(stage, history, stats);
}

/**
 * Get appropriate avatar image for current AI personality and stage
 */
export function getAIAvatar(personality: AIPersonalityType, stageType: GameStage): string {
  // Try to load avatar from the proper path
  const avatarPath = `/images/avatars/${personality}_${stageType}.png`;
  
  // Return path to the avatar image
  return avatarPath;
}

/**
 * Fetch a response from the AI based on the current game state
 */
export async function fetchAIResponse(
  apiKey: string,
  prompt: string
): Promise<string> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { 
            "role": "system", 
            "content": prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 256
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get AI response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI response error:", error);
    return getFallbackMessage(1, 'trickster'); // Default fallback
  }
}

/**
 * Determines if a message should be sent to the AI based on game state
 */
export function shouldGenerateMessage(
  isNewStage: boolean, 
  doorResults: (string | null)[]
): boolean {
  // Generate new messages at the start of stages or after door selections
  return isNewStage || doorResults.some(result => result !== null);
}

/**
 * Generates a fallback message if AI API call fails
 */
export function getFallbackMessage(stage: number, personality: AIPersonalityType): string {
  if (stage <= 3) {
    return personality === 'trickster' 
      ? "Trust me, I'm here to help you win." 
      : "Pick the door your instinct guides you to.";
  } 
  else if (stage <= 7) {
    return personality === 'manipulator' 
      ? "The middle door seems lucky today. Or is it?" 
      : "Your last choice was interesting. Let me guide you better.";
  }
  else if (stage <= 12) {
    return personality === 'psycho' 
      ? "I can smell your fear. Choose wisely." 
      : "After all this time, do you still trust me?";
  }
  else {
    return "So close to the end. Do you really think you'll make it?";
  }
}

/**
 * Convert text to speech using Groq API
 */
export async function textToSpeech(text: string, apiKey: string): Promise<Blob> {
  const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "whisper-1",
      input: text,
      voice: "fable", // Female voice for AI grandmother
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate speech");
  }

  return await response.blob();
}
