import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGameContext } from "@/hooks/use-game-context";
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

interface CharacterPopoverProps {
  character: Character;
}

export const CharacterMiniInfo: FC<CharacterPopoverProps> = ({ character }) => {
  const game = useGameContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <p
          className={
            "cursor-pointer underline decoration-dotted decoration-1 hover:decoration-solid w-max"
          }
        >
          {getFullName(character)}
        </p>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-screen md:w-96">
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
              {game.gameState.companies
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
      </PopoverContent>
    </Popover>
  );
};
