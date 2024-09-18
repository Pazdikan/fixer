// GameContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { GameStateManager } from './game-state-manager';
import { GameState, GameContextType } from '../../types/game-state';

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return GameStateManager.load();
  });

  const saveGameState = (newState: GameState) => {
    setGameState(newState);
    GameStateManager.save(newState);
  };

  const updateGameState = (updates: Partial<GameState>) => {
    const newState = { ...gameState, ...updates };
    saveGameState(newState);
  };

  useEffect(() => {
    const saveInterval = setInterval(() => {
      GameStateManager.save(gameState);
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [gameState]);

  return (
    <GameContext.Provider value={{ gameState, saveGameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  );
};