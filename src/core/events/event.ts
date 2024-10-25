import { GameContextType } from "@/types/game-state";

export interface Event {
  getName(): string;
  getDescription(): string;
  execute(game: GameContextType): void;
}
