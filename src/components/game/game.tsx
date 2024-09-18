// Game.tsx
import React from 'react';
import { useGameState } from '../../hooks/use-game-state';
import { Character } from '../../types/game-state';

export const App: React.FC = () => {
  const { gameState, updateGameState } = useGameState();

  const handleScoreIncrease = () => {
    updateGameState({ score: gameState.score + 1 });
  };

  const addCharacter = (name: string) => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name,
      level: 1,
    };
    updateGameState({ characters: [...gameState.characters, newCharacter] });
  };

  return (
    <div>
      <h1>Level: {gameState.level}</h1>
      <h2>Score: {gameState.score}</h2>
      <button onClick={handleScoreIncrease}>Increase Score</button>
      <div>
        <h3>Items:</h3>
        <ul>
          {gameState.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Characters:</h3>
        <ul>
          {gameState.characters.map((character) => (
            <li key={character.id}>
              {character.name} (Level: {character.level})
            </li>
          ))}
        </ul>
        <button onClick={() => addCharacter(`Character ${gameState.characters.length + 1}`)}>
          Add Character
        </button>
      </div>
    </div>
  );
};
