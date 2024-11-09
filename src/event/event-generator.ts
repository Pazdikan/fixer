import { GameContextType } from "@/core/core.types";
import { Event } from "./event";
import { NewGigEvent } from "./gig/new-gig-event";
import { NewSocialMediaPostEvent } from "./network/new-socialmedia-post-event";

export class EventGenerator {
  rng: () => number;
  events: Event[];

  constructor(rng: () => number) {
    this.rng = rng;
    this.events = [new NewGigEvent(), new NewSocialMediaPostEvent()];
  }

  generate_event(game: GameContextType): Event | null {
    const rn = this.rng(); // Get a random number between 0 and 1
    let event = null;

    // Loop through the events and check their chances
    for (const potentialEvent of this.events) {
      if (rn < potentialEvent.getChance()) {
        event = potentialEvent;
    console.log(`Generating Event - RN: ${rn} - Event: ${event?.getName()}`)

        break; // Stop once an event is triggered
      }
    }


    return event;
  }
}
