import { GameState } from "@/types/game-state";

export class GameBrain {
  private static tickInterval: number = 1000 / 2; // 10 ticks per second
  private static intervalId: number | null = null;

  public static start(gameState: GameState) {
    if (gameState.player_id == -1) {
      return;
    }

    if (this.intervalId === null) {
      this.intervalId = window.setInterval(this.tick, this.tickInterval);
    }
  }

  public static stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private static tick(gameState: GameState) {
    console.log('Tick');
  }
}