import { Character } from "@/character/character.types";
import { Building } from "@/common/components/map/game-map";
import { Company } from "@/company/company.types";
import { Family } from "@/character/character.types";

export interface World {
  time?: number;
  bounding_box?: number[];
  buildings?: Building[];
  player_base_id?: string;
}

export interface GameState {
  debug: DebugState;
  player_id: number;
  characters: Character[];
  seed: string;
  seed_state?: any;
  companies: Company[];
  families: Family[]; // Add families array
  unlockedAchievements: {
    [id: string]: {
      progress?: number;
      achieved?: boolean;
      timestamp?: number;
    };
  };
  world: World;
  chats: Record<string, Message[]>;
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
  families: [], // Initialize empty families array
  unlockedAchievements: {},
  world: {
    time: Date.now(),
  },
  chats: {},
};

export interface Message {
  id: number;
  characterId: number;
  content: string;
  timestamp: number;
  isPlayer: boolean;
  /**
   * Optional message kind for structured interactions (eg. recruit requests/replies)
   */
  kind?: MessageKind;
}

export enum MessageKind {
  TEXT = "text",
  RECRUIT_REQUEST = "recruit_request",
  RECRUIT_ACCEPT = "recruit_accept",
  RECRUIT_REJECT = "recruit_reject",
}

export interface GameContextType {
  gameState: GameState;
  updateGameState: (update: Partial<GameState>) => void;
  saveGameState: () => void;
}

export type UpdateGameState = (
  update: (prevState: GameState) => Partial<GameState>
) => GameState;
