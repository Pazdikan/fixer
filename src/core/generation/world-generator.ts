import { Character } from "@/character/character.types";
import { getFullName, getUnemployedCharacters } from "@/common/lib/utils";
import { Company, CompanyPosition, Employee } from "@/company/company.types";
import { GameContextType, GameState } from "../core.types";

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

  generateCompany(unemployed: Character[], game: GameContextType): Company {
    const owner = game.updateGameState((prevState) => prevState).characters[
      Math.floor(
        this.rng() *
          game.updateGameState((prevState) => prevState).characters.length
      )
    ];

    if (this.rng() > 0.9) {
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
        id: game.updateGameState((prevState) => prevState).companies.length,
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
