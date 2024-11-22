import { CharacterGenerator } from "@/character/character-generator";
import { CompanyGenerator } from "@/company/company-generator";

export class Generator {
  rng: () => number;

  character: CharacterGenerator;
  company: CompanyGenerator;

  constructor(rng: () => number) {
    this.rng = rng;
    this.character = new CharacterGenerator(rng);
    this.company = new CompanyGenerator(rng);
  }
}
