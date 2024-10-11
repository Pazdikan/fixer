import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGameState } from "@/hooks/use-game-state";
import { getFullName } from "@/lib/utils";
import { Character, CompanyPosition } from "@/types/game-state";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface CharacterHoverProps {
  character: Character;
}

export const CharacterHover: FC<CharacterHoverProps> = ({ character }) => {
  const { gameState } = useGameState();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className={"font-medium cursor-pointer decoration-dotted"}>
          {getFullName(character)}
        </p>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0">
        <Card className={"border-none"}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {character.first_name[0]}
                {character.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{getFullName(character)}</CardTitle>
              <CardDescription>
                {character.previous_job} • {character.backstory}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"></p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Affiliations:</h4>
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
                      {company.name}{" "}
                      {isOwner ? (
                        <Badge variant={"default"}>OWNER</Badge>
                      ) : (
                        <Badge variant={"outline"}>EMPLOYEE</Badge>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

// <HoverCard>
//   <HoverCardTrigger asChild>
//     <p className={"underline font-medium cursor-pointer"}>
//       {getFullName(character)}
//     </p>
//   </HoverCardTrigger>
//   <HoverCardContent className={"w-80 space-y-2"}>
//     <div className="flex justify-between space-x-4">
//       <h3>{getFullName(character)}</h3>
//       <p>{character.backstory}</p>
//       <p>{character.previous_job}</p>
//     </div>
//     <div>
//       <div>

//       </div>
//     </div>
//   </HoverCardContent>
// </HoverCard>;
