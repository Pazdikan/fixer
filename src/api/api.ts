import { Generator } from "@/core/generation/generator";
import { CharacterAPI } from "./character";
import { AchievementsManager } from "@/core/achievement/achievement-manager";
import seedrandom from "seedrandom";

export interface IAPI {
  character: CharacterAPI;
  generator: Generator;
  achievement: AchievementsManager;
}

class API implements IAPI {
  character = new CharacterAPI();
  achievement = new AchievementsManager();
  private _generator: Generator | null = null;

  public get generator() {
    if (!this._generator) {
      // Since the generator type must be null, in order to be set later in the code,
      // this is here to satisfy the language server. In reality this should never trigger
      console.error(
        "Generator's RNG is not initialized! Returning an RNG default seed."
      );

      return new Generator(seedrandom("default"));
    }

    return this._generator;
  }

  public set generator(value) {
    this._generator = value;
  }
}

export const api = new API();

// Expose API to browser console
window.api = api;
