import { GameState, initialState } from "@/core/core.types";
import { create } from "zustand";
import seedrandom from "seedrandom";
import { Generator } from "@/core/generation/generator";
import { api } from "@/api/api";

interface GameStore {
  gameState: GameState;
  saveGameState: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
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

const saveSeed = (set: any, get: any, seed: string) => {
  const rng = seedrandom(seed, { state: true });
  set((state: GameStore) => ({
    gameState: {
      ...state.gameState,
      seed: seed,
      seed_state: rng.state(),
    },
  }));
  const currentState = get().gameState;
  GameStateManager.save(currentState);
  console.log("Seed saved!");
};

// Create the store
export const useGame = create<GameStore>((set, get) => {
  // Initialize game state
  const initialGameState = GameStateManager.load();

  const seed = initialGameState.seed;
  let rng = seedrandom(seed, { state: true });

  if (initialGameState.seed_state) {
    rng = seedrandom("", { state: initialGameState.seed_state });
  }

  api.generator = new Generator(rng);

  return {
    gameState: initialGameState,
    // Save game state to persistent storage
    saveGameState: () => {
      const currentState = get().gameState;

      GameStateManager.save(currentState);
      console.log("Game saved!");
    },
    // Update the game state
    updateGameState: (updates) => {
      set((state) => {
        const newState = {
          gameState: {
            ...state.gameState,
            ...updates,
          },
        };

        // Re-initialize RNG if seed is updated
        if (updates.seed) {
          const newRng = seedrandom(updates.seed, { state: true });
          newState.gameState.seed_state = newRng.state();
          api.generator = new Generator(newRng);
        }

        console.log("Game state updated:", newState);
        return newState;
      });
    },
    saveSeed: (seed: string) => saveSeed(set, get, seed),
  };
});
