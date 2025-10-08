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
import { MessageKind } from "@/core/core.types";
import { toast } from "@/hooks/use-toast";
import { useGame } from "@/core/store/game-store";

type MenuOption = {
  id: string;
  label: string;
  condition?: (character: Character) => boolean;
  disabled?: (character: Character) => boolean;
  onClick: (character: Character) => void;
  separatorBefore?: boolean;
};

export const CharacterMenu = ({ character }: { character: Character }) => {
  const menuOptions: MenuOption[] = [
    {
      id: "recruit",
      label: "Recruit",
      condition: (char) => !api.character.isPlayer(char),
      disabled: (char) => false,
      onClick: (char) => {
        // Send a recruit request via chat; addons/NPC logic will reply and perform accept/reject
        toast({
          title: "Offer sent",
          description:
            "You've sent a recruitment request. Waiting for their reply...",
        });

        const now = Date.now();
        const initialMessage = {
          id: now,
          characterId: char.id,
          content: "Hi — would you like to join my team?",
          timestamp: now,
          isPlayer: true,
          kind: MessageKind.RECRUIT_REQUEST,
        };

        api.character.addChatMessage(char.id, initialMessage);
      },
      separatorBefore: true,
    },
  ];

  const visibleOptions = menuOptions.filter(
    (option) => !option.condition || option.condition(character)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {api.character.getFullName(character)}
        </DropdownMenuLabel>

        {visibleOptions.map((option) => (
          <div key={option.id}>
            {option.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={option.disabled?.(character)}
              onClick={() => option.onClick(character)}
            >
              {option.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
