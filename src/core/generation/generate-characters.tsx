import { useGameState } from '@/hooks/use-game-state';
import React from 'react';

const GenerateCharacters: React.FC = () => {
    const { updateGameState } = useGameState();

    const generateCharacter = () => {
        const newCharacter = {
            id: Date.now().toString(),
            name: 'Ben',
            surname: 'Dover ' + new Date().getMilliseconds(),
        };
        updateGameState({ characters: [newCharacter] });
    };

    for (let i = 0; i < 10; i++) {
        generateCharacter();
    }
    
    return (
        <>
<div>
<button onClick={generateCharacter}>Generate Character</button>
</div>        </>
    );
};

export default GenerateCharacters;