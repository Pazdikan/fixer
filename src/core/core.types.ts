import { Character } from "@/character/character.types";
import { Building } from "@/common/components/map/game-map";
import { Company } from "@/company/company.types";

export interface World {
  bounding_box: number[];
  buildings: Building[];
  player_base_id?: string;
}

export interface KnownFields {
  characters: Record<string, string[]>;
  companies: Record<string, string[]>;
  world: Record<string, string[]>;
}

export interface GameState {
  player_id: number;
  characters: Character[];
  world?: World;
  seed: string;
  seed_state?: any;
  companies: Company[];
  unlockedAchievements: Record<
    string,
    {
      unlockedAt?: number;
      progress?: number;
    }
  >;
  knownFields?: KnownFields;
}

export const initialState: GameState = {
  player_id: -1,
  characters: [],
  seed: Date.now().toString(),
  companies: [],
  unlockedAchievements: {},
  knownFields: {
    characters: {},
    companies: {},
    world: {},
  },
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
