import { HireEvent } from "./events/hire";
import { NewGameEvent } from "./events/new-game";
import { TickEvent } from "./events/tick";

type GameEvent = TickEvent | NewGameEvent | HireEvent;

export class EventManager {
  private listeners: {
    [K in GameEvent["type"]]?: Array<
      (event: Extract<GameEvent, { type: K }>) => void
    >;
  } = {};

  on<K extends GameEvent["type"]>(
    eventType: K,
    callback: (event: Extract<GameEvent, { type: K }>) => void
  ) {
    if (!this.listeners[eventType]) this.listeners[eventType] = [];
    this.listeners[eventType]!.push(callback);
  }

  trigger(event: GameEvent) {
    const listeners = this.listeners[event.type];
    if (listeners) {
      // Clone array to avoid iteration issues if listeners are removed mid-trigger
      listeners.slice().forEach((callback) => callback(event as any));
    }
  }
}
