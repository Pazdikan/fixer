import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";
import React from "react";
import { EllipsisVertical } from "lucide-react";

export type MenuOption = {
  id: string;
  label: string;
  description?: string;
  condition?: (context: any) => boolean;
  disabled?: (context: any) => boolean;
  onClick: (context: any) => void;
  separatorBefore?: boolean;
};

export interface GlobalDropdownMenuProps {
  options: MenuOption[];
  context?: any;
  label?: string;
  trigger?: React.ReactNode;
}

export const GlobalDropdownMenu: React.FC<GlobalDropdownMenuProps> = ({
  options,
  context,
  label = "Actions",
  trigger = (
    <Button variant="ghost" size="icon">
      <EllipsisVertical size={24} />
    </Button>
  ),
}) => {
  const visibleOptions = options.filter(
    (option) => !option.condition || option.condition(context)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {visibleOptions.map((option) => (
          <div key={option.id}>
            {option.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={option.disabled?.(context)}
              onClick={() => option.onClick(context)}
              className="flex flex-col items-start cursor-pointer"
            >
              <p>{option.label}</p>
              {option.description && (
                <p className="text-sm text-gray-500 relative">
                  {option.description}
                </p>
              )}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
