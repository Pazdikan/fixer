import { GameContextType } from "@/core/core.types";
import { Event } from "./event";
import { NewGigEvent } from "./gig/new-gig-event";
import { NewSocialMediaPostEvent } from "./gig/new-socialmedia-post-event";

export class EventGenerator {
  rng: () => number;
  events: Event[];

  constructor(rng: () => number) {
    this.rng = rng;
    this.events = [new NewGigEvent(), new NewSocialMediaPostEvent()];
  }

  generate_event(game: GameContextType): Event | null {
    const rn = this.rng();
    let event = null;

    if (rn < 0.01) {
      event = new NewGigEvent();
    } else if (rn < 0.5) {
      event = new NewSocialMediaPostEvent();
    }

    return event;
  }
}
