import { Generator } from "./generator";
import {
  Character,
  Company,
  CompanyPosition,
  GameState,
  UpdateGameState,
} from "@/types/game-state.ts";

export class WorldGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld(generator: Generator, updateGameState: UpdateGameState) {
    for (let i = 0; i < 100; i++) {
      generator.character.create_character(
        generator.character.generate_character(),
        updateGameState
      );
    }

    for (let i = 0; i < 50; i++) {
      generator.world.create_company(
        generator.world.generateCompany(
          updateGameState((prevState) => prevState)
        ),
        updateGameState
      );
    }
  }

  create_company = (object: Company, updateGameState: UpdateGameState) => {
    updateGameState((prevState: GameState) => {
      const newCompany = this.generateCompany(prevState); // Use the latest state

      return {
        ...prevState,
        companies: [
          ...prevState.companies,
          {
            ...newCompany,
            id: prevState.companies.length, // Ensure id is based on latest state
          },
        ],
      };
    });
  };

  generateCompany(gameState: GameState) {
    if (this.rng() > 0.9 && gameState.characters.length > 0) {
      const numb = Math.floor(this.rng() * gameState.characters.length);
      const owner: Character = gameState.characters[numb];

      return {
        name: `${getInitial(owner)} Industries`,
        employees: [
          {
            character: owner,
            position: CompanyPosition.OWNER,
          },
        ],
      } as Company;
    } else {
      return {
        name: `${generateCompanySuffix(this.rng)}`,
        employees: [
          {
            character:
              gameState.characters[
                Math.floor(this.rng() * gameState.characters.length)
              ],
            position: CompanyPosition.OWNER,
          },
        ],
      } as Company;
    }
  }
}

function getInitial(character: Character) {
  return `${character.first_name.split("")[0]}${
    character.last_name.split("")[0]
  }`;
}

function generateCompanySuffix(rng) {
  const suffixes = ["LLC", "Studios", "Company", "Logistics"];

  return suffixes[Math.floor(rng() * suffixes.length)];
}
