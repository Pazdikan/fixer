import { Character, GameState } from "@/types/game-state";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName(character: Character) {
  return `${character.first_name} ${character.last_name}`;
}

export const getCharacterById = (gameState: GameState, id: number) => {
  return gameState.characters.find((character) => character.id === id);
};

export const getCompanyByCharacter = (
  gameState: GameState,
  character: Character
) => {
  return gameState.companies.find((company) =>
    company.employees.some((employee) => employee.characterID === character.id)
  );
};

export const getUnemployedCharacters = (gameState: GameState) => {
  return gameState.characters.filter(
    (character) =>
      !gameState.companies.some((company) =>
        company.employees.some(
          (employee) => employee.characterID === character.id
        )
      )
  );
};
