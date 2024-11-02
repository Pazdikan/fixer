import { GameContextType } from "./core.types";

export class GameBrain {
  private static tickInterval: number = 1000 / 2; // 10 ticks per second
  private static intervalId: number | null = null;

  public static start(game: GameContextType) {
    if (game.gameState.player_id == -1) {
      return;
    }

    if (this.intervalId === null) {
      this.intervalId = window.setInterval(this.tick, this.tickInterval, game);
    }
  }

  public static stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private static tick(game: GameContextType) {
    const event = game.generator.event.generate_event(game);

    if (event) {
      console.log(event.getName());
      event.execute(game);
    }
  }
}
