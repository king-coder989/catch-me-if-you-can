
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const apiKey = "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";

  // Create audio when text changes
  useEffect(() => {
    if (text && text.trim() !== '') {
      generateSpeech();
    }
    
    return () => {
      // Cleanup URL when component unmounts
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [text]);

  // Auto-play when requested and audio is available
  useEffect(() => {
    if (autoPlay && audioUrl && !isMuted) {
      playAudio();
    }
  }, [audioUrl, autoPlay]);

  const generateSpeech = async () => {
    if (!text || text.trim() === '') return;
    
    try {
      const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "whisper-1",
          input: text,
          voice: "fable", // Using a female voice for the AI grandmother
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate speech");
      }

      const audioBlob = await response.blob();
      
      // Clean up old audio URL if it exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
      }
      
      audioRef.current.src = url;
      
      if (autoPlay && !isMuted) {
        playAudio();
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Could not generate speech audio");
    }
  };

  const playAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Could not play audio");
      });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      if (!isMuted) {
        pauseAudio();
      }
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMute} 
        className="hover:bg-purple-900/30"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      
      {!isMuted && audioUrl && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={togglePlayPause}
          className="text-sm border-purple-500/30 hover:bg-purple-900/30"
          disabled={!audioUrl}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      )}
    </div>
  );
};

export default AudioPlayer;
