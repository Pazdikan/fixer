import { Generator } from "./generator";
import { Character } from "@/types/game-state.ts";

export class WorldGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld(generator: Generator, updateGameState) {
    for (let i = 0; i < 100; i++) {
      generator.character.create_character(
        generator.character.generate_character(),
        updateGameState,
      );
    }
  }

  generateCompany(generator: Generator, updateGameState) {
    if (generator.rng() > 0.9) {
      // Generate company with initials or something and suffix like Industries or Corporation
    } else {
      // Generate company with first + last name and suffix indicating business like cleaning, groceries, autoworks etc
      updateGameState((prevState: Character) => ({
        ...prevState,
        companies: [
          ...prevState.companies,
          {
            id: prevState.companies.length,
            name: `${getInitial(generator.character.generate_character())} ${generator.character.generate_character().last_name} ${generator.company.generate_suffix()}`,
            employees: [],
          },
        ],
      }));
    }
  }
}

function getInitial(character: Character) {
  return `${character.first_name.slice()} ${character.last_name.slice()}`;
}
