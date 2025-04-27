const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

import React from 'react';
import Game from '@/components/Game';
import { GameProvider } from '@/contexts/GameContext';

// 🔥 Add Groq fetch function here
const fetchGroqHint = async (playerHistory: string) => {
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
          content: `Based on this history: ${playerHistory}, generate a tricky hint to mislead the player.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const hint = data.choices[0].message.content;
  return hint;
};

const Index = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default Index;
