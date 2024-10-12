import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGameState } from "@/hooks/use-game-state";
import { getFullName } from "@/lib/utils";
import { Company, CompanyPosition } from "@/types/game-state";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface CompanyHoverProps {
  company: Company;
}

export const CompanyHover: FC<CompanyHoverProps> = ({ company }) => {
  const { gameState } = useGameState();

  const getEmployeeDetails = (characterID: number) => {
    return gameState.characters.find((char) => char.id === characterID);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className="cursor-pointer underline decoration-dotted decoration-1 hover:decoration-solid w-max">
          {company.name}
        </p>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0">
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription>
                {company.employees.length} employee
                {company.employees.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Employees:</h4>
              {company.employees.map((employee) => {
                const character = getEmployeeDetails(employee.characterID);
                return (
                  <div
                    key={employee.characterID}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {character
                        ? getFullName(character)
                        : `Employee ${employee.characterID}`}
                    </span>
                    <Badge
                      variant={
                        employee.position === CompanyPosition.OWNER
                          ? "default"
                          : "outline"
                      }
                    >
                      {employee.position === CompanyPosition.OWNER
                        ? "OWNER"
                        : "EMPLOYEE"}
                    </Badge>
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
