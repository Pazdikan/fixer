// GameContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { GameStateManager } from './game-state-manager';
import { GameState, GameContextType } from '../../types/game-state';
import { GameBrain } from '@/core/brain';

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return GameStateManager.load();
  });

  const saveGameState = (newState: GameState) => {
    setGameState(newState);
    GameStateManager.save(newState);
  };

  const updateGameState = (updates: ((prevState: GameState) => Partial<GameState>)) => {
    const newState = typeof updates === 'function' ? { ...gameState, ...(updates(gameState) as Partial<GameState>) } : { ...gameState, ...(updates as Partial<GameState>) };
    saveGameState(newState);
  };
  
  useEffect(() => {
    const saveInterval = setInterval(() => {
      GameStateManager.save(gameState);
      console.log("Game saved!")
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [gameState]);

  GameBrain.start(gameState);

  return (
    <GameContext.Provider value={{ gameState, saveGameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  );
};