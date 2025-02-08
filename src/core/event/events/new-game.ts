import { BaseEvent } from "../event";

export interface NewGameEvent extends BaseEvent {
  type: "newGame";
  initialSeed: string;
}
