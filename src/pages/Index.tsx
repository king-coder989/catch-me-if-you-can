
import React from 'react';
import Game from '@/components/Game';
import { GameProvider } from '@/contexts/GameContext';

const Index = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default Index;
