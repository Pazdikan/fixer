import { BaseEvent } from "../event";

export interface HireEvent extends BaseEvent {
  type: "hire";
  characterId: string;
}
