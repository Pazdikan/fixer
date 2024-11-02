import { Card, CardContent } from "@/common/components/ui/card";
import { LucideIcon } from "lucide-react";

// Application component
export const Application = ({
  icon: Icon,
  name,
  onClick,
}: {
  icon: LucideIcon;
  name: string;
  onClick: () => void;
}) => (
  <Card
    className="flex flex-col items-center justify-center p-4 h-32 cursor-pointer"
    onClick={onClick}
  >
    <CardContent className="flex flex-col items-center justify-center p-0">
      <Icon className="w-12 h-12 mb-2" />
      <p className="text-sm text-center">{name}</p>
    </CardContent>
  </Card>
);
