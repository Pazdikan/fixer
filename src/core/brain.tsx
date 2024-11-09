import { GameContextType } from "./core.types";

export class GameBrain {
  private static tickInterval: number = 500;
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
    console.log("Tick")
      // Generate event and check if it should be executed
      const event = game.generator.event.generate_event(game);
      if (event && event.shouldExecute(game)) {
        event.execute(game);
    }
  }
}
