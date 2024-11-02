import { GameContextType } from "@/core/core.types";

export interface Event {
  getID(): string;
  getName(): string;
  getDescription(): string;
  shouldExecute(game: GameContextType): boolean;
  execute(game: GameContextType): void;
}
