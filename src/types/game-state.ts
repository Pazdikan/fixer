export interface Character {
    id: number;
    first_name: string;
    last_name: string;
    backstory: CharacterBackstory;
    previous_job: Job;
}

export enum CharacterBackstory {
    STREET_KID = 'street_kid',
    NOMAD = 'nomad',
    CORPO = 'corpo',
}

export enum Job {
    UNEMPLOYED = 'unemployed',
    CELEBRITY = 'celebrity',
    MERCENARY = 'mercenary',
}

export interface World {
    name: string;
}

export interface GameState {
    player_id: number;
    characters: Character[];
    world?: World;
}

export const initialState: GameState = {
    player_id: -1,
    characters: [],
};


export interface GameContextType {
    gameState: GameState;
    saveGameState: (newState: GameState) => void;
    updateGameState: (newState: Partial<GameState>) => void;
}
