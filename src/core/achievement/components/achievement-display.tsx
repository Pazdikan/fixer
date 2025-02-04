import { useGame } from "@/core/store/game-store";
import { Achievement } from "../achievement.types";
import { Card } from "@/common/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import { Progress } from "@/common/components/ui/progress";

export const SingleAchievement = ({
  achievement,
}: {
  achievement: Achievement;
}) => {
  const { gameState } = useGame();
  const unlockedData = gameState.unlockedAchievements?.[achievement.id] || {};
  const isUnlocked = !!unlockedData.unlockedAt;
  const currentProgress = unlockedData.progress || 0;
  const isProgress = typeof achievement.target === "number";

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          {isUnlocked ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-medium">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </div>

          {isProgress && (
            <div className="space-y-2">
              <Progress
                value={
                  (Math.min(currentProgress, achievement.target!) /
                    achievement.target!) *
                  100
                }
                className="h-2"
                indicatorColor={isUnlocked ? "bg-green-500" : "bg-primary"}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {currentProgress}/{achievement.target}
                </span>
                {isUnlocked && <span className="text-green-500">Achieved</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
