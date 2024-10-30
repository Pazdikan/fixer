export interface Character {
  id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  backstory: CharacterBackstory;
  previous_job: Job;
}

export enum CharacterBackstory {
  STREET_KID = "street_kid",
  NOMAD = "nomad",
  CORPO = "corpo",
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
