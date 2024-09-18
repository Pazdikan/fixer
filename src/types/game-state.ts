export interface Character {
    id: string;
    name: string;
    level: number;
}

export interface GameState {
    level: number;
    score: number;
    items: string[];
    characters: Character[];
}

export const initialState: GameState = {
    level: 1,
    score: 0,
    items: [],
    characters: [],
};


export interface GameContextType {
    gameState: GameState;
    saveGameState: (newState: GameState) => void;
    updateGameState: (newState: Partial<GameState>) => void;
}
