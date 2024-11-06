import { GameContextType } from "@/core/core.types";
import { Event } from "../event";
import { eventEmitter } from "@/common/lib/event-emitter";

export class NewSocialMediaPostEvent implements Event {
  getID(): string {
    return "new-social-media-post";
  }
  getName(): string {
    return "New Social Media Post";
  }
  getDescription(): string {
    return "Someone has posted something on social media!";
  }
  getChance(): number {
    return 0.1
  }
  shouldExecute(game: GameContextType): boolean {
    return true;
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

    eventEmitter.emit(this.getID(), newPost);
  }
}
