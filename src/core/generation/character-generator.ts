import { Character, CharacterBackstory, GameState, Job } from "@/types/game-state";

export class CharacterGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  create_character = (object: Character, updateGameState) => {
    if (!object.first_name || !object.last_name || !object.backstory || !object.previous_job) {
      console.error("Couldn't create character, object is missing required fields.", object);
      return;
    }

    updateGameState((prevState) => {
      const newCharacters = [...prevState.characters, object];
      return {
        characters: newCharacters,
        player_id: prevState.player_id === -1 ? newCharacters.length - 1 : prevState.player_id
      } as Partial<GameState>;
    });
    
  };

  generate_character = () => {
    const first_name = this.generate_name().first_name;
    const last_name = this.generate_name().last_name;
    const backstory = this.generate_backstory();
    const previous_job = this.generate_job();

    return { first_name, last_name, backstory, previous_job } as Character;
  }

  generate_name = () => {
    const first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hank"];
    const last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
    
    const first_name = first_names[Math.floor(this.rng() * first_names.length)];
    const last_name = last_names[Math.floor(this.rng() * last_names.length)];

    return { first_name, last_name };
  }

  generate_backstory = () => {
    const backstories = Object.keys(CharacterBackstory);
    
    return backstories[Math.floor(this.rng() * backstories.length)];
  }

  generate_job = () => {
    const jobs = Object.keys(Job);
    
    return jobs[Math.floor(this.rng() * jobs.length)];
  }
}