import { getFullName, getUnemployedCharacters } from "@/lib/utils";
import {
  Character,
  Company,
  CompanyPosition,
  Employee,
  GameContextType,
  GameState,
} from "@/types/game-state.ts";

export class WorldGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld(game: GameContextType) {
    for (let i = 0; i < 5000; i++) {
      game.generator.character.create_character(
        game.generator.character.generate_character(),
        game
      );
    }

    const unemployed = getUnemployedCharacters(
      game.updateGameState((prevState) => prevState)
    );

    for (let i = 0; i < 500; i++) {
      game.generator.world.create_company(
        game.generator.world.generateCompany(unemployed, game),
        game
      );
    }
  }

  create_company = (object: Company, game: GameContextType) => {
    game.updateGameState((prevState: GameState) => {
      return {
        companies: [
          ...prevState.companies,
          {
            ...object,
            id: prevState.companies.length, // Ensure id is based on latest state
          },
        ],
      };
    });
  };

  generateCompany(unemployed: Character[], game: GameContextType) {
    if (this.rng() > 0.9 && game.gameState.characters.length > 0) {
      const numb = Math.floor(this.rng() * game.gameState.characters.length);
      const owner: Character = game.gameState.characters[numb];

      return {
        name: `${getInitial(owner)} Industries`,
        employees: [
          {
            characterID: owner.id,
            position: CompanyPosition.OWNER,
          },
        ],
      } as Company;
    } else {
      const owner =
        game.gameState.characters[
          Math.floor(this.rng() * game.gameState.characters.length)
        ];
      let employees: Employee[] = [];

      for (let i = 0; i < Math.floor(this.rng() * 3); i++) {
        if (unemployed.length > 0) {
          const numb = Math.floor(this.rng() * unemployed.length);
          const employee: Character = unemployed[numb];

          employees.push({
            characterID: employee.id,
            position: CompanyPosition.EMPLOYEE,
          });

          unemployed.splice(numb, 1);
        }
      }

      return {
        name: `${getFullName(owner)} ${generateCompanySuffix(this.rng)}`,
        employees: [
          {
            characterID: owner.id,
            position: CompanyPosition.OWNER,
          },
          ...employees,
        ],
      };
    }
  }
}

function getInitial(character: Character) {
  return `${character.first_name.split("")[0]}${
    character.last_name.split("")[0]
  }`;
}

function generateCompanySuffix(rng: () => number) {
  const suffixes = ["LLC", "Studios", "Company", "Logistics"];

  return suffixes[Math.floor(rng() * suffixes.length)];
}
