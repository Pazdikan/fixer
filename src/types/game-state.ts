import { Generator } from "@/core/generation/generator";

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
    seed: string;
    seed_state?: any;
}

export const initialState: GameState = {
    player_id: -1,
    characters: [],
    seed: Date.now().toString(),
};


export interface GameContextType {
    gameState: GameState;
    saveGameState: (newState: GameState) => void;
    updateGameState: (updates: Partial<GameState>) => void;
    generator: Generator;
}
