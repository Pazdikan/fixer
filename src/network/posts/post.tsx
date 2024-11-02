import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/common/components/ui/card";

import { SocialMediaPostProps } from "./post.types";
import { getCharacterById, getFullName } from "@/common/lib/utils";
import { useGameContext } from "@/core/context/use-game-context";

export const SocialMediaPost: React.FC<SocialMediaPostProps> = ({ post }) => {
  const game = useGameContext();
  const character = getCharacterById(game.gameState, post.author_id);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar>
          <AvatarFallback>
            {character && character.first_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{character && getFullName(character)}</p>
          <p className="text-sm text-gray-500">
            @
            {`${character?.first_name}_${character?.last_name[0]}${character?.id}`}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
        <p className="text-sm text-gray-500 mt-2">{post.timestamp}</p>
      </CardContent>
    </Card>
  );
};
