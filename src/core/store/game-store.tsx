import { GameState, initialState } from "@/core/core.types";
import { create } from "zustand";
import seedrandom from "seedrandom";
import { Generator } from "@/core/generation/generator";
import { api } from "@/api/api";

interface GameStore {
  gameState: GameState;
  saveGameState: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  generator: Generator;
}

class GameStateManager {
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

// Create the store
export const useGame = create<GameStore>((set, get) => {
  // Initialize game state
  const initialGameState = GameStateManager.load();
  const seed = initialGameState.seed;
  let rng = seedrandom(seed, { state: initialGameState.seed_state ?? true });
  api.generator = new Generator(rng);

  return {
    gameState: initialGameState,
    generator: api.generator,
    // Save game state to persistent storage
    saveGameState: () => {
      const currentState = get().gameState;
      GameStateManager.save(currentState);
      console.log("Game saved!");
    },
    // Update the game state
    updateGameState: (updates) => {
      set((state) => ({
        gameState: {
          ...state.gameState,
          ...updates,
        },
      }));
    },
  };
});
