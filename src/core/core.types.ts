import { Character } from "@/character/character.types";
import { Company } from "@/company/company.types";
import { Generator } from "./generation/generator";

export interface World {
  name: string;
}

export interface GameState {
  player_id: number;
  characters: Character[];
  world?: World;
  seed: string;
  seed_state?: string;
  companies: Company[];
}

export const initialState: GameState = {
  player_id: -1,
  characters: [],
  seed: Date.now().toString(),
  companies: [],
};

export interface GameContextType {
  gameState: GameState;
  saveGameState: (newState: GameState) => void;
  updateGameState: UpdateGameState;
  generator: Generator;
}

export type UpdateGameState = (
  update: (prevState: GameState) => Partial<GameState>
) => GameState;
