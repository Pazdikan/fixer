import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/card";
import { Avatar, AvatarFallback } from "../../common/components/ui/avatar";
import { Badge } from "../../common/components/ui/badge";
import { WikiLink, WikiLinks } from "../../common/components/ui/wiki-link";
import { Character } from "../character.types";
import { CompanyPosition } from "@/company/company.types";
import { useGame } from "@/core/store/game-store";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";

interface CharacterPopoverProps {
  character: Character;
}

export const CharacterMiniInfo: FC<CharacterPopoverProps> = ({ character }) => {
  const game = useGame();
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <p
          className={
            "cursor-pointer underline decoration-dotted decoration-1 hover:decoration-solid w-max"
          }
        >
          {api.character.getFullName(character)}
        </p>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-screen md:w-96">
        <Card className={"border-none"}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {api.character.getInitial(character)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{api.character.getFullName(character)}</CardTitle>
              <CardDescription>
                {character.previous_job} • {character.backstory}
              </CardDescription>
            </div>
            <WikiLink wikiPage={WikiLinks.CHARACTER} />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"></p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">
                {t("character.affiliations")}:
              </h4>
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
                        <Badge variant={"default"}>
                          {t("company.position.owner")}
                        </Badge>
                      ) : (
                        <Badge variant={"outline"}>
                          {t("company.position.employee")}
                        </Badge>
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
