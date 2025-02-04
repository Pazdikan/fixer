export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  hidden?: boolean;
  unlockedAt?: number;
  target?: number;
}

export interface UnlockResult {
  wasUnlocked: boolean;
  achievement: Achievement;
  progress?: number;
}
