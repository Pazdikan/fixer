export interface Character {
    id: string;
    name: string;
    surname: string;
}

export interface World {
    name: string;
}

export interface GameState {
    level: number;
    score: number;
    characters: Character[];
    world?: World;  
}

export const initialState: GameState = {
    level: 1,
    score: 0,
    characters: [],
};


export interface GameContextType {
    gameState: GameState;
    saveGameState: (newState: GameState) => void;
    updateGameState: (newState: Partial<GameState>) => void;
}
