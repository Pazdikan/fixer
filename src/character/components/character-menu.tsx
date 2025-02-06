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
        <DropdownMenuItem>Recruit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
