import { GameState, initialState } from "@/core/core.types";
import { create } from "zustand";
import seedrandom from "seedrandom";
import { Generator } from "@/core/generation/generator";
import { api } from "@/api/api";
import { debounce, merge, throttle } from "lodash";

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
    if (state.player_id == -1) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
}

const saveSeed = (
  set: (fn: (state: GameStore) => Partial<GameStore>) => void,
  get: () => GameStore,
  seed: string
): void => {
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
  console.log("Seed saved!");

  const seed = initialGameState.seed;
  let rng = seedrandom(seed, { state: true });

  if (initialGameState.seed_state) {
    rng = seedrandom("", { state: initialGameState.seed_state });
  }

  api.generator = new Generator(rng);

  const throttledSave = throttle(() => {
    const currentState = get().gameState;
    GameStateManager.save(currentState);
  }, 2000);

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
        let nextState: GameState;

        // If update touches nested stuff (characters/companies), deep merge
        if (updates.characters || updates.companies) {
          nextState = merge({}, state.gameState, updates);
        } else {
          // For simple top-level updates, shallow copy
          nextState = {
            ...state.gameState,
            ...updates,
          };
        }

        // Handle RNG seed if updated
        if (updates.seed) {
          const newRng = seedrandom(updates.seed, { state: true });
          nextState.seed_state = newRng.state();
          api.generator = new Generator(newRng);
        }

        // Save latest game state (don't pass big objects into throttle)
        throttledSave();

        return { gameState: nextState };
      });
    },

    saveSeed: (seed: string) => saveSeed(set, get, seed),
  };
});
