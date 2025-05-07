import { Character } from "@/character/character.types";
import { Building } from "@/common/components/map/game-map";
import { Company } from "@/company/company.types";

export interface World {
  bounding_box: number[];
  buildings: Building[];
  player_base_id?: string;
  time: number;
}

export interface GameState {
  debug: DebugState;
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
}

export interface DebugState {
  isDebugEnabled: boolean;
  revealMap: boolean;
  revealCharacters: boolean;
  revealCompanies: boolean;
}

export const initialState: GameState = {
  debug: {
    isDebugEnabled: false,
    revealMap: false,
    revealCharacters: false,
    revealCompanies: false,
  },
  player_id: -1,
  characters: [],
  seed: Date.now().toString(),
  companies: [],
  unlockedAchievements: {},
  world: {
    time: Date.now(),
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
