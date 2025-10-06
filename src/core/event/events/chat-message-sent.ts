import { BaseEvent } from "../event";
import { Message } from "@/core/core.types";

export interface ChatMessageSentEvent extends BaseEvent {
  type: "chat/messageSent";
  message: Message;
  characterId: number;
}
