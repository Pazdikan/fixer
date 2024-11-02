import { GameContextType } from "@/core/core.types";
import { Event } from "../event";
import { eventEmitter } from "@/common/lib/event-emitter";

export class NewSocialMediaPostEvent implements Event {
  getName(): string {
    return "New Social Media Post";
  }
  getDescription(): string {
    return "Someone has posted something on social media!";
  }
  execute(game: GameContextType): void {
    const character =
      game.gameState.characters[
        Math.floor(game.generator.rng() * game.gameState.characters.length)
      ];

    const newPost = {
      id: `${new Date().toISOString()}_${character.id}`,
      content: `This is a post by ${character.first_name} ${character.last_name}`,
      timestamp: new Date().toISOString(),
      author_id: character.id,
    };

    eventEmitter.emit("newPost", newPost);
  }
}
