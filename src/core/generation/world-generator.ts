import { Generator } from "./generator";

export class WorldGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld(generator: Generator, updateGameState) {
    for (let i = 0; i < 100; i++) {
      generator.character.create_character(
        generator.character.generate_character(),
        updateGameState
      );
    }
  }
}
