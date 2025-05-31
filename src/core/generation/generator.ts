import { CharacterGenerator } from "@/character/character-generator";
import { FamilyGenerator } from "@/character/family-generator";
import { CompanyGenerator } from "@/company/company-generator";

export class Generator {
  rng: () => number;

  character: CharacterGenerator;
  family: FamilyGenerator;
  company: CompanyGenerator;

  constructor(rng: () => number) {
    this.rng = rng;
    this.character = new CharacterGenerator(rng);
    this.family = new FamilyGenerator(rng);
    this.company = new CompanyGenerator(rng);
  }
}
