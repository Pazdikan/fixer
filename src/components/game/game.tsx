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
      <div>
        <h3>Characters:</h3>
        <ul>
          {gameState.characters.map((character) => (
            <li key={character.id}>
              {character.first_name} {character.last_name} - {character.backstory} - {character.previous_job}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
