import { BaseEvent } from "../event";

export interface TickEvent extends BaseEvent {
  type: "tick";
}
