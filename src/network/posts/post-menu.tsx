import { api } from "@/api/api";
import { Post } from "./post.types";
import { GlobalDropdownMenu } from "@/common/components/ui/global-dropdown-menu";
import { useGame } from "@/core/store/game-store";
import { Message } from "@/core/core.types";

export const PostMenu = ({ post }: { post: Post }) => {
  const { gameState, updateGameState } = useGame();

  return (
    <GlobalDropdownMenu
      options={[
        {
          id: "dm",
          label: "Send a DM",
          description: `Ask about taking the job`,
          condition: () => true,
          disabled: () => false,
          onClick: () => {
            const postAuthor = api.character.getCharacterById(post.author_id);
            if (!postAuthor) return;
            updateGameState({
              characters: gameState.characters.map((char) =>
                char.id === postAuthor.id
                  ? api.util.addTag(postAuthor, "chat")
                  : char
              ),
            });
            const message: Message = {
              id: Date.now(),
              characterId: postAuthor.id,
              content: `Hi, I'm interested in your post!`,
              timestamp: gameState.world.time!,
              isPlayer: true,
            };
            // Add message to chat
            api.character.addChatMessage(postAuthor.id, message);
          },
          separatorBefore: true,
        },
      ]}
      context={post}
      label="Post Actions"
    />
  );
};
