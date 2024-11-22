import { Character, Gender } from "@/character/character.types";
import { Company } from "@/company/company.types";
import { useGame } from "@/core/store/game-store";

export interface ICharacterAPI {
  first_names_male: string[];
  first_names_female: string[];
  last_names: string[];

  /**
   * Adds a list of first names to the generator based on the specified gender.
   *
   * @param {string[]} names - An array of first names to be added.
   * @param {Gender} gender - The gender to which the names should be added.
   *                          It should be either `Gender.MALE` or `Gender.FEMALE`.
   * @returns {void}
   */
  addFirstNamesToGenerator(names: string[], gender: Gender): void;
  /**
   * Returns an array of characters that are currently unemployed.
   *
   * @returns {Character[]} - The array of character objects that are currently unemployed.
   */

  /**
   * Adds a list of first names to the generator based on the specified gender.
   *
   * @param {string[]} names - An array of first names to be added.
   * @param {Gender} gender - The gender to which the names should be added.
   *                          It should be either `Gender.MALE` or `Gender.FEMALE`.
   * @returns {void}
   */
  addLastNamesToGenerator(names: string[]): void;

  /**
   *
   * @param id - The ID of the character to be returned.
   * @returns {Character | undefined} - The character with the specified ID.
   */
  getCharacterById(id: number): Character | undefined;

  /**
   *
   * @param character
   * @returns {Company[]} - The array of companies that the specified character works for and owns.
   */
  getCompaniesByCharacter(character: Character): Company[];

  /**
   * Returns an array of characters that are currently unemployed.
   *
   * @returns {Character[]} - The array of character objects that are currently unemployed.
   */
  getUnemployedCharacters(): Character[];

  /**
   * Returns the initials of the specified character.
   *
   * @param character - The character object for which the initials should be returned.
   * @returns {string} - The initials of the specified character.
   */
  getInitial(character: Character): string;

  /**
   * Returns the full name of the specified character.
   *
   * @param character - The character object for which the full name should be returned.
   * @returns {string} - The full name of the specified character.
   */
  getFullName(character: Character): string;
}

export class CharacterAPI implements ICharacterAPI {
  first_names_male: string[] = [];
  first_names_female: string[] = [];
  last_names: string[] = [];

  addFirstNamesToGenerator(names: string[], gender: Gender) {
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

  getCompaniesByCharacter(character: Character): Company[] {
    const game = useGame.getState();

    return game.gameState.companies.filter((company) =>
      company.employees.some(
        (employee) => employee.characterID === character.id
      )
    );
  }

  getUnemployedCharacters(): Character[] {
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
