import {
  Character,
  CharacterBackstory,
  GameContextType,
  Gender,
  Job,
} from "@/types/game-state";

import first_names_male from "@/data/first_names_male.json";
import first_names_female from "@/data/first_names_female.json";
import last_names from "@/data/last_names.json";

export class CharacterGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  create_character = (object: Character, game: GameContextType) => {
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

    object["id"] = game.updateGameState(
      (prevState) => prevState
    ).characters.length;

    game.updateGameState((prevState) => {
      const newCharacters = [...prevState.characters, object];

      return {
        characters: newCharacters,
        player_id:
          prevState.player_id === -1
            ? newCharacters.length - 1
            : prevState.player_id,
      };
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
      return first_names_male[Math.floor(this.rng() * first_names_male.length)];
    } else {
      return first_names_female[
        Math.floor(this.rng() * first_names_female.length)
      ];
    }
  };

  generate_last_name = () => {
    return last_names[Math.floor(this.rng() * last_names.length)];
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
