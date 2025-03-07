export interface Character {
  tags: string[];
  id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  backstory: CharacterBackstory;
  previous_job: Job;
  traits: Trait[];
}

export enum CharacterBackstory {
  ORPHAN = "orphan",
  RICH = "rich",
  POOR = "poor",
  MIDDLE_CLASS = "middle_class",
  NOBLE = "noble",
  CRIMINAL = "criminal",
  SOLDIER = "soldier",
  MERCENARY = "mercenary",
  CELEBRITY = "celebrity",
}

export enum Job {
  UNEMPLOYED = "unemployed",
  CELEBRITY = "celebrity",
  MERCENARY = "mercenary",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export type TraitLevel = "slightly" | "moderately" | "very";
export type TraitType = "personality" | "behavior";
export interface Trait {
  name: string;
  type: TraitType;
  description: string;
  level?: TraitLevel;
  isNegative?: boolean;
}
