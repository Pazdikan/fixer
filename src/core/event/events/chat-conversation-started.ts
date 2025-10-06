import { BaseEvent } from "../event";

export interface ChatConversationStartedEvent extends BaseEvent {
  type: "chat/conversationStarted";
  characterId: number;
}
