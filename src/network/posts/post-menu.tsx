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
import { Post } from "./post.types";

type MenuOption = {
  id: string;
  label: string;
  description?: string;
  condition?: (post: Post) => boolean;
  disabled?: (post: Post) => boolean;
  onClick: (post: Post) => void;
  separatorBefore?: boolean;
};

export const PostMenu = ({ post }: { post: Post }) => {
  const menuOptions: MenuOption[] = [
    {
      id: "dm",
      label: "Send a DM",
      description: `Ask about taking the job\nPost type: ${post.type}`,
      condition: (post) => true,
      disabled: (post) => false,
      onClick: (post) => {},
      separatorBefore: true,
    },
  ];

  const visibleOptions = menuOptions.filter(
    (option) => !option.condition || option.condition(post)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>

        {visibleOptions.map((option) => (
          <div key={option.id}>
            {option.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={option.disabled?.(post)}
              onClick={() => option.onClick(post)}
            >
              <p>{option.label}</p>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
