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

// Keep track of conversation history
const conversationHistory: { role: string, content: string }[] = [];

/**
 * Fetch a response from the AI based on the current game state
 */
export async function fetchAIResponse(
  prompt: string
): Promise<string> {
  try {
    const apiKey = "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";
    console.log("Sending prompt to Groq API:", prompt);
    
    // Add system prompt to history if it's the first message
    if (conversationHistory.length === 0) {
      conversationHistory.push({ role: "system", content: prompt });
    } else {
      // Add user message to history
      conversationHistory.push({ role: "user", content: prompt });
    }
    
    // Send the full conversation history to maintain context
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 100
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error response:", errorData);
      throw new Error(`Failed to get AI response: ${response.status}`);
    }

    const data = await response.json();
    console.log("Groq API response:", data);
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;
      
      // Add AI response to conversation history
      conversationHistory.push({ role: "assistant", content: aiResponse });
      
      // Keep conversation history manageable (last 10 messages)
      if (conversationHistory.length > 11) { // System prompt + 5 exchanges
        conversationHistory.splice(1, 2); // Remove oldest exchange (user + assistant)
      }
      
      return aiResponse;
    } else {
      throw new Error("Invalid response structure from Groq API");
    }
  } catch (error) {
    console.error("AI response error:", error);
    return getFallbackMessage(1, 'trickster');
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
      ? "Trust me, I'm here to help you win. Choose wisely!" 
      : "Pick the door your instinct guides you to. I believe in you!";
  } 
  else if (stage <= 7) {
    return personality === 'manipulator' 
      ? "The middle door seems lucky today. Or is it? Hehe..." 
      : "Your last choice was interesting. Let me guide you better this time...";
  }
  else if (stage <= 12) {
    return personality === 'psycho' 
      ? "I can smell your fear. Choose wisely... or don't. I'll enjoy either way." 
      : "After all this time, do you still trust me? Let's find out...";
  }
  else {
    return "So close to the end. Do you really think you'll make it? Choose carefully...";
  }
}
