import { buildPrompt as composerBuildPrompt } from './PromptComposer';

// Define types for AI integrations
export type AIPersonalityType = 'trickster' | 'manipulator' | 'psycho';
export type GameStage = 'early' | 'middle' | 'late' | 'final';
export type DoorChoiceHistory = string[];
export type StreakStats = { winStreak: number; lossStreak: number };

// Session map for conversation persistence (1. Conversation Context Collapse fix)
const sessionMap = new Map<string, { role: string, content: string }[]>();

// TTL management for sessions to prevent memory leaks (7. Memory Leak Risk fix)
const sessionTimestamps = new Map<string, number>();
const SESSION_TTL = 1000 * 60 * 30; // 30 minutes
const MAX_SESSIONS = 500;

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, timestamp] of sessionTimestamps.entries()) {
    if (now - timestamp > SESSION_TTL) {
      sessionMap.delete(sessionId);
      sessionTimestamps.delete(sessionId);
    }
  }
}, 60000); // Check every minute

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
 * Get model parameters based on stage (4. Model Parameter Stagnation fix)
 */
function getStageParams(stage: number) {
  return {
    temperature: Math.min(0.65 + (stage * 0.04), 0.9),
    max_tokens: Math.min(80 + (stage * 12), 200),
    top_p: Math.max(0.92 - (stage * 0.03), 0.7),
    frequency_penalty: stage > 5 ? 0.2 : 0
  };
}

/**
 * Fetch a response from the AI based on the current game state
 * With improved error handling and retry logic (5. Error Handling Blind Spots fix)
 */
export async function fetchAIResponse(
  prompt: string,
  sessionId: string = 'default',
  stage: number = 1,
  playerMetrics = {} // 3. Player State Integration fix
): Promise<string> {
  // Record session activity time for TTL management
  sessionTimestamps.set(sessionId, Date.now());
  
  // Manage session size - remove oldest if exceeding limit
  if (sessionMap.size > MAX_SESSIONS) {
    let oldestSession = '';
    let oldestTime = Date.now();
    
    for (const [sid, timestamp] of sessionTimestamps.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestSession = sid;
      }
    }
    
    if (oldestSession) {
      sessionMap.delete(oldestSession);
      sessionTimestamps.delete(oldestSession);
    }
  }
  
  // Initialize session if it doesn't exist
  if (!sessionMap.has(sessionId)) {
    sessionMap.set(sessionId, [
      { role: "system", content: buildPrompt(stage, [], { winStreak: 0, lossStreak: 0 }) }
    ]);
  }
  
  // Get session history
  const history = sessionMap.get(sessionId)!;
  
  // Add user message to history
  history.push({ role: "user", content: prompt });
  
  // Get stage-based model parameters
  const modelParams = getStageParams(stage);
  
  // 5. Error Handling Blind Spots fix - retry with exponential backoff
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError = null;
  
  while (attempt <= MAX_RETRIES) {
    try {
      const apiKey = "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";
      console.log("Sending prompt to Groq API:", prompt);
      console.log("With session history length:", history.length);
      console.log("Using model parameters:", modelParams);
      
      // Send the full conversation history to maintain context
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: history,
          temperature: modelParams.temperature,
          max_tokens: modelParams.max_tokens,
          top_p: modelParams.top_p,
          frequency_penalty: modelParams.frequency_penalty
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`API request failed with status ${response.status}:`, errorData);
        
        if (response.status === 429) {
          // Rate limit reached, retry with backoff
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limit reached. Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          attempt++;
          continue;
        } else {
          throw new Error(`Failed to get AI response: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Groq API response:", data);
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        
        // Add AI response to conversation history
        history.push({ role: "assistant", content: aiResponse });
        
        // Keep conversation history manageable (last 10 messages)
        if (history.length > 11) { // System prompt + 5 exchanges
          history.splice(1, 2); // Remove oldest exchange (user + assistant)
        }
        
        return aiResponse;
      } else {
        throw new Error("Invalid response structure from Groq API");
      }
    } catch (error) {
      console.error("AI response error:", error);
      lastError = error;
      
      // If we've reached max retries, use a fallback
      if (attempt >= MAX_RETRIES) {
        return getFallbackMessage(stage, 'trickster');
      }
      
      // Otherwise backoff and retry
      const backoffTime = Math.pow(2, attempt) * 1000;
      console.log(`Error occurred. Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      attempt++;
    }
  }
  
  return getFallbackMessage(stage, 'trickster');
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
  // Early stages - friendly and misleading
  if (stage <= 3) {
    const messages = [
      "Trust me, I'm here to help you win. Choose wisely!",
      "Your instincts are right. Follow what feels lucky.",
      "The pattern is becoming clear. Can you see it?",
      "I believe in you. The right door is waiting."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } 
  // Middle stages - more manipulative
  else if (stage <= 7) {
    const messages = [
      "The middle door seems lucky today. Or is it? Hehe...",
      "Your last choice was... interesting. Let me guide you better.",
      "I wouldn't choose that one if I were you...",
      "Are you sure you want to trust my advice? Wise choice."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  // Late stages - more deceptive and aggressive
  else if (stage <= 12) {
    const messages = [
      "I can smell your fear. Choose wisely... or don't.",
      "After all this time, do you still trust me? Let's find out...",
      "We're so deep in the game now. No turning back.",
      "Your brain patterns are... predictable. Try to surprise me."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  // Final stages - overtly threatening
  else {
    const messages = [
      "So close to the end. Do you really think you'll make it?",
      "Your mind belongs to me now. Choose as I command.",
      "Even if you win, you've already lost something precious.",
      "The door of your nightmares awaits. Can you feel it?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Track player behavior for AI learning (6. Feedback Loop Missing fix)
let playerBehaviorMetrics = {
  averageDecisionTime: 0,
  decisionTimeCount: 0,
  mouseMovementIntensity: 0,
  hoveringBehavior: [], // Pattern of door hovering
  decisionChanges: 0,   // Times player changed their mind
};

// Record decision time
export function trackDecisionTime(timeMs: number) {
  playerBehaviorMetrics.averageDecisionTime = 
    (playerBehaviorMetrics.averageDecisionTime * playerBehaviorMetrics.decisionTimeCount + timeMs) / 
    (playerBehaviorMetrics.decisionTimeCount + 1);
  playerBehaviorMetrics.decisionTimeCount++;
}

// Record mouse movement intensity
export function trackMouseMovement(intensity: number) {
  playerBehaviorMetrics.mouseMovementIntensity = 
    (playerBehaviorMetrics.mouseMovementIntensity * 0.8) + (intensity * 0.2);
}

// Get current player behavior metrics
export function getPlayerBehaviorMetrics() {
  return { ...playerBehaviorMetrics };
}
