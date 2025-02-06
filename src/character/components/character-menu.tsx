import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Character } from "../character.types";
import { api } from "@/api/api";
import { toast } from "@/hooks/use-toast";

export const CharacterMenu = ({ character }: { character: Character }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"} size={"icon"}>
          <EllipsisVertical size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {api.character.getFullName(character)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (api.character.willAcceptReqruitment(character)) {
              toast({
                title: "Character has accepted your offer!",
                description: "Character has been recruited to your team.",
              });

              api.achievement.incrementProgress("recruit_people", 1);
            } else {
              toast({
                title: "Character has rejected your offer!",
                description: "Character has not been recruited to your team.",
              });
            }
          }}
        >
          Recruit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
