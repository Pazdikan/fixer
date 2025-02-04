// src/core/achievements/achievements-manager.ts
import { useGame } from "../store/game-store";
import { toast } from "@/hooks/use-toast";
import { Achievement, UnlockResult } from "./achievement.types";

export class AchievementsManager {
  private achievements: Map<string, Achievement> = new Map();

  register(achievement: Achievement): void {
    if (this.achievements.has(achievement.id)) {
      throw new Error(`Achievement with ID ${achievement.id} already exists`);
    }
    this.achievements.set(achievement.id, achievement);
  }

  unlock(achievementId: string): UnlockResult {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) {
      throw new Error(`Achievement ${achievementId} not found`);
    }

    const game = useGame.getState();
    const unlockedAchievements = game.gameState.unlockedAchievements || {};

    // Check if already unlocked
    if (unlockedAchievements[achievementId]) {
      return {
        wasUnlocked: false,
        achievement,
      };
    }

    // Unlock the achievement
    const now = Date.now();
    game.updateGameState({
      unlockedAchievements: {
        ...unlockedAchievements,
        [achievementId]: now,
      },
    });

    // Show toast notification
    toast({
      title: "Achievement Unlocked!",
      description: `${achievement.name}\n${achievement.description}`,
      variant: "default",
    });

    return {
      wasUnlocked: true,
      achievement: {
        ...achievement,
        unlockedAt: now,
      },
    };
  }

  isUnlocked(achievementId: string): boolean {
    const game = useGame.getState();
    return !!game.gameState.unlockedAchievements?.[achievementId];
  }

  getAll(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlocked(): Achievement[] {
    const game = useGame.getState();
    const unlockedAchievements = game.gameState.unlockedAchievements || {};

    return this.getAll()
      .filter((achievement) => unlockedAchievements[achievement.id])
      .map((achievement) => ({
        ...achievement,
        unlockedAt: unlockedAchievements[achievement.id],
      }));
  }
}
