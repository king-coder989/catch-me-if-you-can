
import React, { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import AudioPlayer from './AudioPlayer';
import { buildPrompt } from '@/lib/PromptComposer';
import { GROQ_API_KEY } from '@/lib/api-config';

const EnhancedAIMessage = () => {
  const { 
    aiMessage, 
    setAIMessage, 
    currentStage, 
    aiPersonality, 
    gameHistory,
    consecutiveWins,
    consecutiveLosses
  } = useGame();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate AI message using our utility and API key
  useEffect(() => {
    const apiKey = GROQ_API_KEY;
    let isMounted = true;
    
    const generateMessage = async () => {
      try {
        setIsLoading(true);
        
        // Build the prompt using our PromptComposer utility
        const doorSelections = gameHistory.doorSelections; 
        const doorChoices = doorSelections.map((count, index) => {
          return count > 0 ? `Door ${index + 1}: ${count} times` : null;
        }).filter(Boolean) as string[];
        
        const stats = {
          winStreak: consecutiveWins || 0,
          lossStreak: consecutiveLosses || 0
        };
        
        const prompt = buildPrompt(
          currentStage || 1, 
          doorChoices, 
          stats
        );
        
        console.log("Sending prompt to Groq API:", prompt);
        
        const response = await fetch("https://api.groq.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [
              {
                role: "system",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 80
          }),
        });
        
        if (!response.ok) {
          console.error(`API request failed with status ${response.status}`);
          const errorText = await response.text();
          console.error("Error details:", errorText);
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Groq API response:", data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const message = data.choices[0].message.content.trim();
          
          if (isMounted) {
            setAIMessage(message);
          }
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error generating AI message:", error);
        
        // Fallback messages based on stage and personality
        let fallbackMessage = "Hmm, which door will you choose?";
        
        if (currentStage <= 3) {
          fallbackMessage = "I'm here to help you choose. Trust me...";
        } else if (currentStage <= 7) {
          fallbackMessage = "The middle door looks promising today.";
        } else if (currentStage <= 12) {
          fallbackMessage = "Your patterns are... interesting. Try door 3.";
        } else {
          fallbackMessage = "You've come so far. Would be a shame to lose now.";
        }
        
        if (isMounted) {
          setAIMessage(fallbackMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (currentStage && !aiMessage) {
      generateMessage();
    }
    
    return () => { isMounted = false; };
  }, [currentStage, setAIMessage, aiPersonality, aiMessage, gameHistory, consecutiveWins, consecutiveLosses]);
  
  if (isLoading) {
    return (
      <Card className="p-4 bg-purple-900/10 border-purple-500/30">
        <p className="text-sm italic text-gray-400">AI grandmother is thinking...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-purple-900/10 border-purple-500/30 relative">
      <div className="flex justify-between items-start">
        <p className="text-md text-white">{aiMessage || "Choose a door..."}</p>
        <div className="ml-2">
          <AudioPlayer text={aiMessage || "Choose a door..."} autoPlay={true} />
        </div>
      </div>
    </Card>
  );
};

export default EnhancedAIMessage;
