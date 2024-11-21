import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { FC } from "react";

import { Badge, Building2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/common/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Company, CompanyPosition } from "../company.types";
import { useGame } from "@/core/store/game-store";
import { api } from "@/api/api";

interface CompanyPopoverProps {
  company: Company;
}

export const CompanyMiniInfo: FC<CompanyPopoverProps> = ({ company }) => {
  const game = useGame();

  const getEmployeeDetails = (characterID: number) => {
    return game.gameState.characters.find((char) => char.id === characterID);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <p className="cursor-pointer underline decoration-dotted decoration-1 hover:decoration-solid w-max">
          {company.name}
        </p>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-screen md:w-96">
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
                        ? api.character.getFullName(character)
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
      </PopoverContent>
    </Popover>
  );
};
