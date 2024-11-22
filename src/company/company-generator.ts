import { api } from "@/api/api";
import { Character } from "@/character/character.types";
import { Company, CompanyPosition, Employee } from "@/company/company.types";
import { GameContextType, GameState } from "@/core/core.types";
import { useGame } from "@/core/store/game-store";

export class CompanyGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld() {
    const game = useGame.getState();

    for (let i = 0; i < 5000; i++) {
      game.generator.character.create_character(
        game.generator.character.generate_character()
      );
    }

    const unemployed = api.character.getUnemployedCharacters();

    for (let i = 0; i < 500; i++) {
      game.generator.company.create_company(
        game.generator.company.generateCompany(unemployed)
      );
    }
  }

  create_company = (object: Company) => {
    const game = useGame.getState();

    game.updateGameState({
      companies: [
        ...game.gameState.companies,
        {
          ...object,
          id: game.gameState.companies.length,
        },
      ],
    });
  };

  generateCompany(unemployed: Character[]): Company {
    const game = useGame.getState();

    const owner =
      game.gameState.characters[
        Math.floor(this.rng() * game.gameState.characters.length)
      ];

    if (this.rng() > 0.9) {
      return {
        name: `${api.character.getInitial(owner)} Industries`,
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
        id: game.gameState.companies.length,
        name: `${api.character.getFullName(owner)} ${generateCompanySuffix(
          this.rng
        )}`,
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

function generateCompanySuffix(rng: () => number) {
  const suffixes = ["LLC", "Studios", "Company", "Logistics"];

  return suffixes[Math.floor(rng() * suffixes.length)];
}
