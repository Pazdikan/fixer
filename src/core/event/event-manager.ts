import { HireEvent } from "./events/hire";
import { NetworkPostEvent } from "./events/network-post";
import { NewGameEvent } from "./events/new-game";
import { TickEvent } from "./events/tick";
import { ChatMessageSentEvent } from "./events/chat-message-sent";
import { ChatConversationStartedEvent } from "./events/chat-conversation-started";

type GameEvent =
  | TickEvent
  | NewGameEvent
  | HireEvent
  | NetworkPostEvent
  | ChatMessageSentEvent
  | ChatConversationStartedEvent;

interface IEventManager {
  /**
   * Registers a callback to be invoked when a specific event type is triggered.
   * @param eventType - The type of event to listen for.
   * @param callback - The function to call when the event is triggered.
   */
  on<K extends GameEvent["type"]>(
    eventType: K,
    callback: (event: Extract<GameEvent, { type: K }>) => void
  ): void;

  /**
   * Triggers an event, invoking all registered listeners for the event's type.
   * @param event - The event object to trigger.
   */
  trigger(event: GameEvent): void;
}

export class EventManager implements IEventManager {
  private listeners: {
    [K in GameEvent["type"]]?: Array<
      (event: Extract<GameEvent, { type: K }>) => void
    >;
  } = {};

  /**
   * Removes a callback for a specific event type.
   * @param eventType - The type of event to stop listening for.
   * @param callback - The function to remove.
   */
  off<K extends GameEvent["type"]>(
    eventType: K,
    callback: (event: Extract<GameEvent, { type: K }>) => void
  ) {
    const arr = this.listeners[eventType];
    if (!arr) return;
    this.listeners[eventType] = arr.filter(
      (cb) => cb !== callback
    ) as typeof arr;
  }

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
