import { Character } from "@/character/character.types";
import { GameState } from "@/core/core.types";
import { useGame } from "@/core/store/game-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName(character: Character) {
  return `${character.first_name} ${character.last_name}`;
}

export const getCharacterById = (id: number) => {
  const game = useGame.getState();

  return game.gameState.characters.find((character) => character.id === id);
};

export const getCompanyByCharacter = (character: Character) => {
  const game = useGame.getState();

  return game.gameState.companies.find((company) =>
    company.employees.some((employee) => employee.characterID === character.id)
  );
};

export const getUnemployedCharacters = () => {
  const game = useGame.getState();

  return game.gameState.characters.filter(
    (character) =>
      !game.gameState.companies.some((company) =>
        company.employees.some(
          (employee) => employee.characterID === character.id
        )
      )
  );
};

export function getInitial(character: Character) {
  return `${character.first_name.split("")[0]}${
    character.last_name.split("")[0]
  }`;
}
