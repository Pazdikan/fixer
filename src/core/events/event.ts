import { GameState } from "@/types/game-state";
import { Generator } from "../generation/generator";

export interface Event {
  getName(): string;
  getDescription(): string;
  execute(gameState: GameState, generator: Generator): void;
}
