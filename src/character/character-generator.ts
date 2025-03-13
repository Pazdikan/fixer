import { api } from "@/api/api";
import {
  Character,
  CharacterBackstory,
  Gender,
  Job,
  Trait,
  TraitLevel,
} from "./character.types";
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
    const traits: Trait[] = [];

    const traits_to_generate = Math.floor(api.generator.rng() * 5) + 1;

    for (let i = 0; i < traits_to_generate; i++) {
      const trait = this.generate_trait(traits);

      if (traits.some((t) => t.name === trait.name)) {
        i--;
        continue;
      }

      traits.push(trait);
    }

    return {
      first_name,
      last_name,
      gender,
      backstory,
      previous_job,
      traits,
    } as Character;
  };

  generate_trait = (characterTraits: Trait[]): Trait => {
    const personalityTraits = {
      introverted: ["introverted", "extroverted"],
      conscientiousness: ["conscientious", "unconscientious"],
      openness: ["open-minded", "closed-minded"],
      agreeableness: ["agreeable", "disagreeable"],
      neuroticism: ["calm", "anxious"],
      adventurousness: ["adventurous", "cautious"],
      assertiveness: ["assertive", "submissive"],
      empathy: ["empathetic", "unempathetic"],
      curiosity: ["curious", "indifferent"],
      optimism: ["optimistic", "pessimistic"],
    };

    function getRandomLevel(): TraitLevel {
      const levels: TraitLevel[] = ["slightly", "moderately", "very"];
      return levels[Math.floor(Math.random() * levels.length)];
    }

    // Get all trait names already assigned to the character
    const assignedTraitNames = characterTraits.map((trait) => trait.name);

    // Filter out categories where either the positive or negative trait is already assigned
    const availableCategories = (
      Object.keys(personalityTraits) as (keyof typeof personalityTraits)[]
    ).filter((category) => {
      const [positive, negative] = personalityTraits[category];
      return (
        !assignedTraitNames.includes(positive) &&
        !assignedTraitNames.includes(negative)
      );
    });

    // If no categories are left, return a default trait (or handle it as you see fit)
    if (availableCategories.length === 0) {
      return {
        name: "neutral",
        type: "personality",
        description: "Is neutral",
        level: "slightly",
        isNegative: false,
      };
    }

    // Randomly select a category from the available ones
    const category =
      availableCategories[
        Math.floor(Math.random() * availableCategories.length)
      ];
    const [positive, negative] = personalityTraits[category];
    const isNegative = Math.random() > 0.5;
    const level = getRandomLevel();

    return {
      name: isNegative ? negative : positive,
      type: "personality",
      description: `Is ${level} ${isNegative ? negative : positive}`,
      level,
      isNegative,
    };
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
