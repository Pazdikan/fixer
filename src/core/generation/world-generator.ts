import { getFullName, getUnemployedCharacters } from "@/lib/utils";
import { Generator } from "./generator";
import {
  Character,
  Company,
  CompanyPosition,
  Employee,
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

    const unemployed = getUnemployedCharacters(
      updateGameState((prevState) => prevState)
    );

    for (let i = 0; i < 50; i++) {
      generator.world.create_company(
        generator.world.generateCompany(
          updateGameState((prevState) => prevState),
          unemployed
        ),
        updateGameState
      );
    }
  }

  create_company = (object: Company, updateGameState: UpdateGameState) => {
    updateGameState((prevState: GameState) => {
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

  generateCompany(gameState: GameState, unemployed: Character[]) {
    if (this.rng() > 0.9 && gameState.characters.length > 0) {
      const numb = Math.floor(this.rng() * gameState.characters.length);
      const owner: Character = gameState.characters[numb];

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
        gameState.characters[
          Math.floor(this.rng() * gameState.characters.length)
        ];
      let employees: Employee[] = [];

      for (let i = 0; i < Math.floor(this.rng() * 3); i++) {
        if (unemployed.length > 0) {
          const numb = Math.floor(this.rng() * unemployed.length);
          const employee: Character = unemployed[numb];

          console.log(employee);

          employees.push({
            characterID: employee.id,
            position: CompanyPosition.EMPLOYEE,
          });

          unemployed.splice(numb, 1);
        }
      }

      const final = {
        name: `${getFullName(owner)} ${generateCompanySuffix(this.rng)}`,
        employees: [
          {
            characterID: owner.id,
            position: CompanyPosition.OWNER,
          },
          ...employees,
        ],
      } as Company;

      console.log(final);

      return final;
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
