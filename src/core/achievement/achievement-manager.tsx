import { useGame } from "../store/game-store";
import { toast } from "@/hooks/use-toast";
import { Achievement, UnlockResult } from "./achievement.types";
import { SingleAchievement } from "./components/achievement-display";

export class AchievementsManager {
  private achievements: Map<string, Achievement> = new Map();

  private unlock_toast(achievement: Achievement): void {
    toast({
      title: "Achievement Unlocked!",
      description: (
        <div className="mt-4 w-full">
          <SingleAchievement achievement={achievement} />
        </div>
      ),
    });
  }

  register(achievement: Achievement): void {
    if (this.achievements.has(achievement.id)) {
      throw new Error(`Achievement with ID ${achievement.id} already exists`);
    }
    this.achievements.set(achievement.id, achievement);
  }

  unlock(achievementId: string): UnlockResult {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) throw new Error(`Achievement ${achievementId} not found`);
    if (achievement.target !== undefined)
      throw new Error(`Use incrementProgress for progress achievements`);

    const game = useGame.getState();
    const unlocked = game.gameState.unlockedAchievements || {};
    const current = unlocked[achievementId] || {};

    if (current.unlockedAt) {
      return {
        wasUnlocked: false,
        achievement: { ...achievement, unlockedAt: current.unlockedAt },
      };
    }

    const now = Date.now();
    game.updateGameState({
      unlockedAchievements: {
        ...unlocked,
        [achievementId]: { ...current, unlockedAt: now },
      },
    });

    this.unlock_toast(achievement);

    return {
      wasUnlocked: true,
      achievement: { ...achievement, unlockedAt: now },
    };
  }

  incrementProgress(achievementId: string, amount: number = 1): UnlockResult {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) throw new Error(`Achievement ${achievementId} not found`);
    if (achievement.target === undefined)
      throw new Error(`Not a progress achievement`);

    const game = useGame.getState();
    const unlocked = game.gameState.unlockedAchievements || {};
    const current = unlocked[achievementId] || {};

    if (current.unlockedAt) {
      return {
        wasUnlocked: false,
        achievement: { ...achievement, unlockedAt: current.unlockedAt },
        progress: current.progress,
      };
    }

    const newProgress = (current.progress || 0) + amount;
    const isUnlocked = newProgress >= achievement.target;
    const now = isUnlocked ? Date.now() : undefined;

    game.updateGameState({
      unlockedAchievements: {
        ...unlocked,
        [achievementId]: { ...current, progress: newProgress, unlockedAt: now },
      },
    });

    if (isUnlocked) {
      this.unlock_toast(achievement);

      return {
        wasUnlocked: true,
        achievement: { ...achievement, unlockedAt: now },
        progress: newProgress,
      };
    } else {
      return {
        wasUnlocked: false,
        achievement: achievement,
        progress: newProgress,
      };
    }
  }

  getAll(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlocked(): Achievement[] {
    const game = useGame.getState();
    const unlockedAchievements = game.gameState.unlockedAchievements || {};

    return this.getAll().filter(
      (achievement) => !!unlockedAchievements[achievement.id]
    );
  }
}
