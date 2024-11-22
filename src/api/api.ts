import { Generator } from "@/core/generation/generator";
import { CharacterAPI } from "./character";

export interface IAPI {
  character: CharacterAPI;
  generator: Generator | null;
}

class API implements IAPI {
  character = new CharacterAPI();
  generator = null;
}

export const api = new API();
