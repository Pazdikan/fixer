import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/common/components/ui/card";

import { SocialMediaPostProps } from "./post.types";
import { api } from "@/api/api";
import { PostMenu } from "./post-menu";

export const SocialMediaPost: React.FC<SocialMediaPostProps> = ({ post }) => {
  const character = api.character.getCharacterById(post.author_id);

  return (
    <Card className="mb-4 relative">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2 pr-10">
        <Avatar>
          <AvatarFallback>
            {character && character.first_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">
            {character && api.character.getFullName(character)}
          </p>
          <p className="text-sm text-gray-500">
            @
            {`${character?.first_name}_${character?.last_name[0]}${character?.id}`}
          </p>
        </div>
      </CardHeader>
      <div className="absolute top-3 right-3">
        <PostMenu post={post} />
      </div>
      <CardContent>
        <p>{post.content}</p>
        <p className="text-sm text-gray-500 mt-2">{post.timestamp}</p>
      </CardContent>
    </Card>
  );
};
