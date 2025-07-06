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
import { Users, UserRound, Baby, User } from "lucide-react";

interface CharacterPopoverProps {
  character: Character;
}

export const CharacterMiniInfo: FC<CharacterPopoverProps> = ({ character }) => {
  const game = useGame();
  const { t } = useTranslation();

  // Get family relationships
  const spouse =
    character.spouse_id !== undefined
      ? api.character.getCharacterById(character.spouse_id)
      : undefined;

  const parents = character.parent_ids?.length
    ? character.parent_ids
        .map((id) => api.character.getCharacterById(id))
        .filter(Boolean)
    : [];

  const children = character.child_ids?.length
    ? character.child_ids
        .map((id) => api.character.getCharacterById(id))
        .filter(Boolean)
    : [];

  const siblings = character.sibling_ids?.length
    ? character.sibling_ids
        .map((id) => api.character.getCharacterById(id))
        .filter(Boolean)
    : [];

  const hasFamily =
    spouse || parents.length > 0 || children.length > 0 || siblings.length > 0;

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
                {character.age ? ` • ${character.age} years old` : ""}
              </CardDescription>
            </div>
            <WikiLink wikiPage={WikiLinks.CHARACTER} />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Family Section */}
            {hasFamily && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {t("character.family")}:
                </h4>

                {spouse && (
                  <div className="flex items-center gap-1 text-sm">
                    <UserRound className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Spouse:</span>
                    <span className="font-medium">
                      <CharacterMiniInfo character={spouse} />
                    </span>
                  </div>
                )}

                {parents.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {parents.length === 1 ? "Parent" : "Parents"}:
                      </span>
                    </div>
                    <div className="ml-4">
                      {parents.map((parent) => (
                        <div key={parent.id} className="text-sm">
                          <CharacterMiniInfo character={parent} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {children.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Baby className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {children.length === 1 ? "Child" : "Children"}:
                      </span>
                    </div>
                    <div className="ml-4">
                      {children.map((child) => (
                        <div key={child.id} className="text-sm">
                          <CharacterMiniInfo character={child} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {siblings.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {siblings.length === 1 ? "Sibling" : "Siblings"}:
                      </span>
                    </div>
                    <div className="ml-4">
                      {siblings.map((sibling) => (
                        <div key={sibling.id} className="text-sm">
                          <CharacterMiniInfo character={sibling} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Company Affiliations */}
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
