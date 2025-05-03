import { GameState, initialState } from "@/core/core.types";
import { create } from "zustand";
import seedrandom from "seedrandom";
import { Generator } from "@/core/generation/generator";
import { api } from "@/api/api";
import { debounce, merge, throttle } from "lodash";
import { set as idbSet, get as idbGet } from "idb-keyval";

interface GameStore {
  gameState: GameState;
  saveGameState: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
}

class GameStateManager {
  private static storageKey = "gameState";

  public static async load(): Promise<GameState> {
    const savedState = await idbGet(this.storageKey);
    if (savedState) {
      return savedState as GameState;
    }
    return initialState;
  }

  public static async save(state: GameState): Promise<void> {
    if (state.player_id == -1) {
      return;
    }
    await idbSet(this.storageKey, state);
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
  let initialGameState = initialState;
  GameStateManager.load().then((loadedState) => {
    initialGameState = loadedState;
    set({ gameState: initialGameState });
  });
  console.log("Game state loaded!");

  const seed = initialGameState.seed;
  let rng = seedrandom(seed, { state: true });

  if (initialGameState.seed_state) {
    rng = seedrandom("", { state: initialGameState.seed_state });
  }

  api.generator = new Generator(rng);

  const throttledSave = throttle(async () => {
    const currentState = get().gameState;
    await GameStateManager.save(currentState);
  }, 2000);

  return {
    gameState: initialGameState,
    saveGameState: async () => {
      const currentState = get().gameState;
      await GameStateManager.save(currentState);
      console.log("Game saved!");
    },
    updateGameState: (updates) => {
      set((state) => {
        let nextState: GameState;
        if (updates.characters || updates.companies) {
          nextState = merge({}, state.gameState, updates);
        } else {
          nextState = {
            ...state.gameState,
            ...updates,
          };
        }
        if (updates.seed) {
          const newRng = seedrandom(updates.seed, { state: true });
          nextState.seed_state = newRng.state();
          api.generator = new Generator(newRng);
        }
        throttledSave();
        return { gameState: nextState };
      });
    },
    saveSeed: async (seed: string) => {
      const rng = seedrandom(seed, { state: true });
      set((state: GameStore) => ({
        gameState: {
          ...state.gameState,
          seed: seed,
          seed_state: rng.state(),
        },
      }));
      const currentState = get().gameState;
      await GameStateManager.save(currentState);
      console.log("Seed saved!");
    },
  };
});
