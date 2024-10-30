import { GameState, initialState } from "../core.types";

export class GameStateManager {
  private static storageKey = "gameState";

  public static load(): GameState {
    const savedState = localStorage.getItem(this.storageKey);
    if (savedState) {
      return JSON.parse(savedState) as GameState;
    }
    return initialState;
  }

  public static save(state: GameState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
}
