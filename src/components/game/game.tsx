// Game.tsx
import React from 'react';
import { useGameState } from '../../hooks/use-game-state';
import { generateCharacter } from '@/lib/utils';

export const App: React.FC = () => {
  const { gameState, updateGameState } = useGameState();

  const handleScoreIncrease = () => {
    updateGameState({ score: gameState.score + 1 });
  };

  return (
    <div>
      <h2>Score: {gameState.score}</h2>
      <button onClick={handleScoreIncrease}>Increase Score</button>
      <div>
        <h3>Characters:</h3>
        <ul>
          {gameState.characters.map((character) => (
            <li key={character.id}>
              {character.name} {character.surname}
            </li>
          ))}
        </ul>
        <button onClick={() => {
          updateGameState(
            {
              characters: [
                ...gameState.characters,
                generateCharacter(
                
                )
              ]
            }
          )
        }}>
          Add Character
        </button>
      </div>
    </div>
  );
};
