import {
  Character,
  CharacterBackstory,
  GameState,
  Job,
  UpdateGameState,
} from "@/types/game-state";

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
    const first_names = [
      "John",
      "Jane",
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Hank",
    ];

    return first_names[Math.floor(this.rng() * first_names.length)];
  };

  generate_last_name = () => {
    const last_names = [
      "Smith",
      "Johnson",
      "Williams",
      "Jones",
      "Brown",
      "Davis",
      "Miller",
      "Wilson",
      "Moore",
      "Taylor",
    ];

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
