import { GameContextType, GameState } from "@/types/game-state";
import { Event } from "../event";
import { Generator } from "@/core/generation/generator";

export class NewGigEvent implements Event {
  getName(): string {
    return "New Gig";
  }
  getDescription(): string {
    return "You have a new gig!";
  }
  execute(game: GameContextType): void {
    throw new Error("Method not implemented.");
  }
}
