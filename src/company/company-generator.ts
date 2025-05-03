import { api } from "@/api/api";
import { Character } from "@/character/character.types";
import { Company, CompanyPosition, Employee } from "@/company/company.types";
import { GameContextType, GameState } from "@/core/core.types";
import { useGame } from "@/core/store/game-store";

type CompanyType =
  | "professional"
  | "creative"
  | "industrial"
  | "retail"
  | "food"
  | "law";

export class CompanyGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  populateWorld() {
    let nextCharacterId = useGame.getState().gameState.characters.length;
    const generatedCharacters = [];
    for (let i = 0; i < 5000; i++) {
      const character = api.generator.character.generate_character();
      character.id = nextCharacterId++;
      generatedCharacters.push(character);
    }

    // 1. Update state with all characters first
    useGame.getState().updateGameState({
      characters: [
        ...useGame.getState().gameState.characters,
        ...generatedCharacters,
      ],
    });

    // 2. Now get the updated list of unemployed characters
    const unemployed = api.character.getUnemployedCharacters();

    // 3. Generate companies using the updated character list
    const generatedCompanies = [];
    let nextCompanyId = useGame.getState().gameState.companies.length;
    for (let i = 0; i < 500; i++) {
      const company = this.generateCompany(unemployed);
      company.id = nextCompanyId;
      generatedCompanies.push(company);
      nextCompanyId++;
    }

    // 4. Update state with the new companies
    useGame.getState().updateGameState({
      companies: [
        ...useGame.getState().gameState.companies,
        ...generatedCompanies,
      ],
    });
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

    // 10% chance for law firm
    const isLawFirm = this.rng() > 0.9;
    const companyType: CompanyType = isLawFirm
      ? "law"
      : this.weightedRandom(
          ["professional", "creative", "industrial", "retail", "food"],
          [2, 2, 2, 3, 2]
        );

    const employees: Employee[] = [];

    // Law firms always get 2 employees
    const employeeCount = isLawFirm ? 2 : Math.floor(this.rng() * 3);

    for (let i = 0; i < employeeCount; i++) {
      if (unemployed.length > 0) {
        const numb = Math.floor(this.rng() * unemployed.length);
        const employee = unemployed[numb];

        employees.push({
          characterID: employee.id,
          position: CompanyPosition.EMPLOYEE,
        });
        unemployed.splice(numb, 1);
      }
    }

    return {
      id: game.gameState.companies.length,
      name: this.generateCompanyName(owner, companyType),
      type: companyType,
      employees: [
        {
          characterID: owner.id,
          position: CompanyPosition.OWNER,
        },
        ...employees,
      ],
    };
  }

  private generateCompanyName(owner: Character, type: CompanyType): string {
    const firstName = owner.first_name;
    const lastName = owner.last_name;
    const initial = api.character.getInitial(owner);

    // Special handling for law firms
    if (type === "law") {
      const patterns = [
        `${lastName} & ${lastName}`,
        `${lastName}, ${lastName} & ${lastName}`,
        `${lastName} & Associates`,
        `${lastName} Law Group`,
        `The ${lastName} Firm`,
      ];
      return patterns[Math.floor(this.rng() * patterns.length)];
    }

    // Generic company patterns
    const patterns = [
      // Personal name patterns
      {
        weight: 3,
        generator: () => `${lastName} ${this.generateLegalStructure()}`,
      },
      {
        weight: 2,
        generator: () => `${firstName}'s ${this.generateIndustryTerm(type)}`,
      },
      {
        weight: 2,
        generator: () => `${lastName} ${this.generateIndustryTerm(type)}`,
      },
      {
        weight: 1,
        generator: () => `${initial} ${this.generateIndustryTerm(type)}`,
      },

      // Descriptive patterns
      {
        weight: 2,
        generator: () =>
          `${this.generateAdjective()} ${this.generateIndustryTerm(type)}`,
      },

      // Creative/abstract patterns
      {
        weight: 1,
        generator: () =>
          `${this.generateCreativeWord()} ${this.generateTechSuffix()}`,
      },
    ];

    return this.weightedRandomPattern(patterns).generator();
  }

  private generateLegalStructure(): string {
    const structures = [
      "LLC",
      "Inc",
      "Corp",
      "Group",
      "Enterprises",
      "Holdings",
      "Partners",
      "& Associates",
      "& Sons",
      "& Co",
    ];
    return structures[Math.floor(this.rng() * structures.length)];
  }

  private generateIndustryTerm(type: CompanyType): string {
    const industries = {
      professional: ["Law", "Medical", "Dental", "Accounting", "Consulting"],
      creative: ["Studios", "Design", "Media", "Productions", "Creative"],
      industrial: ["Manufacturing", "Logistics", "Construction", "Contracting"],
      retail: ["Store", "Shop", "Market", "Boutique", "Emporium"],
      food: ["Diner", "Cafe", "Bakery", "Grill", "Pizzeria"],
      generic: ["Services", "Solutions", "Systems", "Technologies", "Ventures"],
    };

    const options = [...(industries[type] || []), ...industries.generic];
    return options[Math.floor(this.rng() * options.length)];
  }

  private generateAdjective(): string {
    const adjectives = [
      "Golden",
      "Elite",
      "Premier",
      "First",
      "Advanced",
      "Metro",
      "Urban",
      "National",
      "Global",
      "United",
    ];
    return adjectives[Math.floor(this.rng() * adjectives.length)];
  }

  private generateCreativeWord(): string {
    const words = [
      "Nova",
      "Vertex",
      "Apex",
      "Nimbus",
      "Vortex",
      "Zenith",
      "Orion",
      "Pinnacle",
      "Infinity",
      "Horizon",
    ];
    return words[Math.floor(this.rng() * words.length)];
  }

  private generateTechSuffix(): string {
    const suffixes = [
      "Tech",
      "Technologies",
      "Systems",
      "Solutions",
      "Labs",
      "Networks",
      "Digital",
      "Innovations",
      "Dynamics",
      "Software",
    ];
    return suffixes[Math.floor(this.rng() * suffixes.length)];
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = this.rng() * totalWeight;
    let weightSum = 0;

    for (let i = 0; i < items.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) return items[i];
    }

    return items[0];
  }

  private weightedRandomPattern<T extends { weight: number }>(
    patterns: T[]
  ): T {
    const totalWeight = patterns.reduce(
      (sum, pattern) => sum + pattern.weight,
      0
    );
    let random = this.rng() * totalWeight;
    let weightSum = 0;

    for (const pattern of patterns) {
      weightSum += pattern.weight;
      if (random <= weightSum) return pattern;
    }

    return patterns[0];
  }
}
