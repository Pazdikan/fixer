import { GameContextType, GameState } from "@/types/game-state";
import { Generator } from "../core/generation/generator";
import { Event } from "./event";
import { NewGigEvent } from "./gig/new-gig-event";

export class EventGenerator {
  rng: () => number;
  events: Event[];

  constructor(rng: () => number) {
    this.rng = rng;
    this.events = [new NewGigEvent()];
  }

  generate_event(game: GameContextType): Event | null {
    const rn = this.rng();
    let event = null;

    if (rn < 0.1) {
      event = new NewGigEvent();
    }

    return event;
  }
}
