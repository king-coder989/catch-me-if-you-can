
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { generateAIHint } from '@/lib/ai-integration';
import AIAvatar from './AIAvatar';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const EnhancedAIMessage = () => {
  const { 
    aiMessage, 
    setAIMessage, 
    currentStage, 
    doorResults, 
    isNewStage, 
    gameHistory
  } = useGame();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate a new AI message when necessary
  useEffect(() => {
    const fetchAIMessage = async () => {
      // Only fetch when needed (new stage or door selected)
      if (isNewStage || doorResults.some(result => result !== null)) {
        setIsLoading(true);
        
        try {
          // Convert door results to history format
          const history = doorResults.map((result, index) => 
            result !== null ? `Door ${index + 1}: ${result ? 'Win' : 'Loss'}` : ''
          ).filter(Boolean);
          
          // Get player stats
          const stats = {
            winStreak: gameHistory.currentWinStreak,
            lossStreak: gameHistory.currentLossStreak
          };
          
          // Generate AI hint with audio if enabled
          const response = await generateAIHint(
            currentStage,
            history,
            stats,
            audioEnabled
          );
          
          setAIMessage(response.message);
          
          // Play audio if available
          if (response.audio && audioEnabled) {
            playAudio(response.audio);
          }
        } catch (error) {
          console.error("Failed to get AI message:", error);
          setAIMessage("I'm watching your choices carefully...");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAIMessage();
  }, [isNewStage, doorResults, currentStage, setAIMessage]);

  // Function to play audio
  const playAudio = (audioContent: string) => {
    if (!audioEnabled) return;
    
    setIsSpeaking(true);
    
    // In a real implementation, you would play the audio from the API
    // For now, we'll use the browser's speech synthesis
    const speech = new SpeechSynthesisUtterance(aiMessage);
    speech.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(speech);
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setAudioEnabled(!audioEnabled);
  };
  
  // Play current message
  const speakCurrentMessage = () => {
    if (!aiMessage || isSpeaking) return;
    playAudio(aiMessage);
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-start space-x-4 bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-purple-500/30">
        <AIAvatar speaking={isSpeaking} />
        
        <div className="flex-1">
          <div className="min-h-[80px] relative">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              </div>
            ) : (
              <p className="italic text-lg">{aiMessage}</p>
            )}
          </div>
          
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudio}
              className="text-gray-400 hover:text-white"
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            
            {audioEnabled && !isSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={speakCurrentMessage}
                className="text-gray-400 hover:text-white"
              >
                Play
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIMessage;
