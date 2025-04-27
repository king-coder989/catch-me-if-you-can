
import { groqApiKey } from './config';

// Define types for AI responses
export interface AIResponse {
  message: string;
  success: boolean;
}

/**
 * Fetches AI hint from Groq API based on player history
 * @param playerHistory String containing player's game history
 * @returns Promise with AI response object
 */
export const fetchAIResponse = async (
  playerStage: number, 
  playerDoubtLevel: number, 
  playerPersonality: string,
  playerConsecutiveLosses: number,
  isNewStage: boolean
): Promise<AIResponse> => {
  try {
    // Build a prompt based on game state
    const prompt = `
      You are an AI grandmother in a psychological game where you're testing the player.
      Game details:
      - Current stage: ${playerStage}
      - Player doubt level: ${playerDoubtLevel}/100 (higher = more trusting)
      - Your personality: ${playerPersonality}
      - Player consecutive losses: ${playerConsecutiveLosses}
      - Is this a new stage: ${isNewStage}

      Generate a short message (max 3 sentences) to the player based on these parameters:
      
      ${isNewStage ? "This is a new stage greeting" : "This is a response to their door choice"}
      ${playerPersonality === 'psycho' ? "Be subtly threatening and unsettling" : 
        playerPersonality === 'manipulator' ? "Be manipulative and try to mislead them" :
        "Be playful but somewhat deceptive"}
      
      If they've lost ${playerConsecutiveLosses} times in a row and it's 3 or more, include a small hint.
      
      Format: Just the dialogue text, no quotation marks or character name.
    `;

    // Call the Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("API Error:", response.status);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    console.log("AI Response:", aiMessage);
    
    return {
      message: aiMessage,
      success: true
    };
  } catch (error) {
    console.error("Failed to fetch AI response:", error);
    
    // Fallback messages based on personality
    let fallbackMessage = "";
    if (playerPersonality === 'psycho') {
      fallbackMessage = "I see how you play... interesting choice.";
    } else if (playerPersonality === 'manipulator') {
      fallbackMessage = "Your decisions reveal more than you know.";
    } else {
      fallbackMessage = "Choose wisely, dear... or don't.";
    }
    
    return {
      message: fallbackMessage,
      success: false
    };
  }
};
