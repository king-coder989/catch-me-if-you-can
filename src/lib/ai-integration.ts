
import { buildPrompt } from '../../PromptComposer';

// AI API configuration
const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Interface for AI response
 */
export interface AIHintResponse {
  message: string;
  success: boolean;
  audio?: string; // Base64 encoded audio
}

/**
 * Generate an AI hint using the PromptComposer and Groq API
 * @param stage Current game stage
 * @param history Array of player's previous choices
 * @param stats Object with player statistics
 * @param includeAudio Whether to include audio with the response
 */
export async function generateAIHint(
  stage: number, 
  history: string[] = [], 
  stats = { winStreak: 0, lossStreak: 0 },
  includeAudio = false
): Promise<AIHintResponse> {
  try {
    // Build prompt using the PromptComposer
    const systemPrompt = buildPrompt(stage, history, stats);
    
    console.log("Sending prompt to Groq API:", systemPrompt);

    // Call the Groq API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const hint = data.choices[0].message.content;
    
    console.log("Received AI hint:", hint);

    // If audio is requested, generate it
    let audioContent = null;
    if (includeAudio) {
      audioContent = await textToSpeech(hint);
    }

    return {
      message: hint,
      success: true,
      audio: audioContent
    };
  } catch (error) {
    console.error("Error generating AI hint:", error);
    
    // Return a fallback message
    return {
      message: determineStageBasedFallback(stage),
      success: false,
    };
  }
}

/**
 * Convert text to speech
 * @param text Text to convert to speech
 * @returns Base64 encoded audio string
 */
async function textToSpeech(text: string): Promise<string | undefined> {
  try {
    // Simple implementation for text-to-speech using browser's built-in API
    // In a production environment, you might want to use a dedicated TTS API
    const audio = new SpeechSynthesisUtterance(text);
    
    // Wait for speech to be synthesized
    const speechPromise = new Promise<string>((resolve) => {
      // This is a placeholder - in a real implementation, you would return the audio data
      // For now, we'll just simulate this by returning after the speech is done
      audio.onend = () => resolve("audio-data-placeholder");
      window.speechSynthesis.speak(audio);
    });

    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Speech synthesis timed out")), 5000);
    });

    return await Promise.race([speechPromise, timeoutPromise]);
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return undefined;
  }
}

/**
 * Get a fallback message based on the stage if API fails
 * @param stage Current game stage
 * @returns Fallback message
 */
function determineStageBasedFallback(stage: number): string {
  if (stage <= 3) {
    return "Choose wisely, dear. One of these doors leads to progress...";
  } else if (stage <= 6) {
    return "Hmm, I wonder which door feels right to you? Trust your instincts...";
  } else if (stage <= 9) {
    return "These doors hold secrets. Can you tell which one is lying?";
  } else if (stage <= 12) {
    return "Time is running out. The wrong choice could be... unfortunate.";
  } else {
    return "So close to the end. Would I help or hurt you? That's the real question.";
  }
}
