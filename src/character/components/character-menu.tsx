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
        if (api.character.willAcceptReqruitment(char)) {
          toast({
            title: "Character has accepted your offer!",
            description: "Character has been recruited to your team.",
          });
          api.achievement.incrementProgress("recruit_people", 1);

          const updatedCharacter = api.util.addTag(char, "chat")
          useGame.getState().updateGameState({
            characters: useGame.getState().gameState.characters.map((c) =>
              c.id === updatedCharacter.id ? updatedCharacter : c
            ),
          })
        } else {
          toast({
            title: "Character has rejected your offer!",
            description: "Character has not been recruited to your team.",
          });
        }
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
