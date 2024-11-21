import { Character, Gender } from "@/character/character.types";
import { Company } from "@/company/company.types";
import { useGame } from "@/core/store/game-store";

export interface ICharacterAPI {
  first_names_male: string[];
  first_names_female: string[];
  last_names: string[];

  getCharacterById(id: number): Character | undefined;
  getCompanyByCharacter(character: Character): Company | undefined;
  getUnemployedCharacters(): Character[];
  getInitial(character: Character): string;
  getFullName(character: Character): string;
}

export class CharacterAPI implements ICharacterAPI {
  first_names_male: string[] = [];
  first_names_female: string[] = [];
  last_names: string[] = [];

  addFirstNamesToGenerator(names: string[], gender: Gender): void {
    if (gender == Gender.MALE) {
      this.first_names_male.push(...names);
    } else {
      this.first_names_female.push(...names);
    }
  }

  addLastNamesToGenerator(names: string[]): void {
    this.last_names.push(...names);
  }

  getCharacterById(id: number) {
    const game = useGame.getState();

    return game.gameState.characters.find((character) => character.id === id);
  }

  getCompanyByCharacter(character: Character) {
    const game = useGame.getState();

    return game.gameState.companies.find((company) =>
      company.employees.some(
        (employee) => employee.characterID === character.id
      )
    );
  }

  getUnemployedCharacters() {
    const game = useGame.getState();

    return game.gameState.characters.filter(
      (character) =>
        !game.gameState.companies.some((company) =>
          company.employees.some(
            (employee) => employee.characterID === character.id
          )
        )
    );
  }

  getInitial(character: Character) {
    return `${character.first_name.split("")[0]}${
      character.last_name.split("")[0]
    }`;
  }

  getFullName(character: Character) {
    return `${character.first_name} ${character.last_name}`;
  }
}
