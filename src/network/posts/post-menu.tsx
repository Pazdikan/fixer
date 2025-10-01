import { EllipsisVertical } from "lucide-react";
import { Post } from "./post.types";
import { GlobalDropdownMenu } from "@/common/components/ui/global-dropdown-menu";

export const PostMenu = ({ post }: { post: Post }) => {
  return (
    <GlobalDropdownMenu
      options={[
        {
          id: "dm",
          label: "Send a DM",
          description: `Ask about taking the job : Post type: ${post.type}`,
          condition: () => true,
          disabled: () => false,
          onClick: () => {},
          separatorBefore: true,
        },
      ]}
      context={post}
      label="Post Actions"
    />
  );
};
