import {
  Character,
  CharacterBackstory,
  Job,
  UpdateGameState,
} from "@/types/game-state";

import first_names from "@/data/first_names.json";
import last_names from "@/data/last_names.json";

export class CharacterGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  create_character = (object: Character, updateGameState: UpdateGameState) => {
    if (
      !object.first_name ||
      !object.last_name ||
      !object.backstory ||
      !object.previous_job
    ) {
      console.error(
        "Couldn't create character, object is missing required fields.",
        object
      );
      return;
    }

    object["id"] = updateGameState((prevState) => prevState).characters.length;

    updateGameState((prevState) => {
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
    const first_name = this.generate_first_name();
    const last_name = this.generate_last_name();
    const backstory = this.generate_backstory();
    const previous_job = this.generate_job();

    return { first_name, last_name, backstory, previous_job } as Character;
  };

  generate_first_name = () => {
    return first_names[Math.floor(this.rng() * first_names.length)];
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
