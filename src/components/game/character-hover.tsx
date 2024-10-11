import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGameState } from "@/hooks/use-game-state";
import { getFullName } from "@/lib/utils";
import { Character, CompanyPosition } from "@/types/game-state";

import { FC } from "react";

interface CharacterHoverProps {
  character: Character;
}

export const CharacterHover: FC<CharacterHoverProps> = ({ character }) => {
  const { gameState } = useGameState();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className={"underline font-medium cursor-pointer"}>
          {getFullName(character)}
        </p>
      </HoverCardTrigger>
      <HoverCardContent className={"w-80 space-y-2"}>
        <div className="flex justify-between space-x-4">
          <h3>{getFullName(character)}</h3>
          <p>{character.backstory}</p>
          <p>{character.previous_job}</p>
        </div>
        <div>
          <div>
            {gameState.companies
              .filter((company) =>
                company.employees.some(
                  (employee) => employee.characterID === character.id
                )
              )
              .map((company) => {
                const isOwner = company.employees.some(
                  (employee) =>
                    employee.characterID === character.id &&
                    employee.position === CompanyPosition.OWNER
                );
                return (
                  <div key={company.id}>
                    {isOwner ? "Owner of" : "Works at"} {company.name}
                  </div>
                );
              })}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
