import { api } from "@/api/api";
import { Character, CharacterBackstory, Gender, Job } from "./character.types";
import { useGame } from "@/core/store/game-store";

export class CharacterGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  create_character = (object: Character) => {
    if (
      !object.first_name ||
      !object.last_name ||
      !object.gender ||
      !object.backstory ||
      !object.previous_job
    ) {
      console.error(
        "Couldn't create character, object is missing required fields.",
        object
      );
      return;
    }

    const game = useGame.getState();

    object["id"] = game.gameState.characters.length;

    const newCharacters = [...game.gameState.characters, object];

    useGame.getState().updateGameState({
      characters: newCharacters,
      player_id:
        game.gameState.player_id === -1
          ? newCharacters.length - 1
          : game.gameState.player_id,
    });
  };

  generate_character = () => {
    const gender = this.generate_gender();
    const first_name = this.generate_first_name(gender);
    const last_name = this.generate_last_name();
    const backstory = this.generate_backstory();
    const previous_job = this.generate_job();

    return {
      first_name,
      last_name,
      gender,
      backstory,
      previous_job,
    } as Character;
  };

  generate_gender = () => {
    return Object.values(Gender)[
      Math.floor(this.rng() * Object.values(Gender).length)
    ] as Gender;
  };

  generate_first_name = (gender: Gender) => {
    if (gender == Gender.MALE) {
      return api.character.first_names_male[
        Math.floor(this.rng() * api.character.first_names_male.length)
      ];
    } else {
      return api.character.first_names_female[
        Math.floor(this.rng() * api.character.first_names_female.length)
      ];
    }
  };

  generate_last_name = () => {
    return api.character.last_names[
      Math.floor(this.rng() * api.character.last_names.length)
    ];
  };

  generate_backstory = () => {
    const backstories = Object.keys(CharacterBackstory);

    return backstories[
      Math.floor(this.rng() * backstories.length)
    ] as CharacterBackstory;
  };

  generate_job = () => {
    const jobs = Object.keys(Job);

    return jobs[Math.floor(this.rng() * jobs.length)] as Job;
  };
}
