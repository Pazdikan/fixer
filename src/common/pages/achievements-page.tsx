import { api } from "@/api/api";
import { Achievement } from "@/core/achievement/achievement.types";
import { SingleAchievement } from "@/core/achievement/components/achievement-display";
import { useGame } from "@/core/store/game-store";
import { Card } from "../components/ui/card";
import { Info } from "lucide-react";

export const AchievementsPage = () => {
  const { gameState } = useGame();
  const allAchievements = api.achievement.getAll();

  const [visible, hiddenCount] = allAchievements.reduce(
    ([visible, hidden], achievement) => {
      const isUnlocked =
        !!gameState.unlockedAchievements?.[achievement.id]?.unlockedAt;

      if (achievement.hidden && !isUnlocked) {
        return [visible, hidden + 1];
      }

      return [[...visible, achievement], hidden];
    },
    [[] as Achievement[], 0]
  );

  return (
    <div className="space-y-6 p-4 md:p-6 w-full mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          {visible.length} of {allAchievements.length} achievements unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visible.map((achievement) => (
          <SingleAchievement key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {hiddenCount > 0 && (
        <Card className="p-4 flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">
            There are {hiddenCount} hidden achievements remaining. Keep playing
            to discover them!
          </span>
        </Card>
      )}
    </div>
  );
};
