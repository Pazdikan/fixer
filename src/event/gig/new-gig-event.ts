import { GameContextType } from "@/core/core.types";
import { Event } from "../event";

export class NewGigEvent implements Event {
  getID(): string {
    return "new-gig";
  }
  getName(): string {
    return "New Gig";
  }
  getDescription(): string {
    return "You have a new gig!";
  }
  shouldExecute(game: GameContextType): boolean {
    return true;
  }
  execute(game: GameContextType): void {
    throw new Error("Method not implemented.");
  }
}
