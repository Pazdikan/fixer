export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  hidden?: boolean;
  unlockedAt?: number;
}

export interface UnlockResult {
  wasUnlocked: boolean;
  achievement: Achievement;
}
