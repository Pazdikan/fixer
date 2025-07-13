import { api } from "@/api/api";
import {
  Character,
  CharacterBackstory,
  Family,
  Gender,
  Job,
  Trait
} from "./character.types";
import { useGame } from "@/core/store/game-store";

export class FamilyGenerator {
  generateFamily = (): { family: Family; members: Character[] } => {
    const lastName = api.character.last_names[
      Math.floor(api.generator.rng() * api.character.last_names.length)
    ];
    
    const backstories = Object.keys(CharacterBackstory);
    const familyBackstory = backstories[
      Math.floor(api.generator.rng() * backstories.length)
    ] as CharacterBackstory;

    const family: Family = {
      id: useGame.getState().gameState.families?.length || 0,
      name: lastName,
      parent_ids: [],
      child_ids: [],
      backstory: familyBackstory
    };

    const members: Character[] = [];
    
    const parentCount = api.generator.rng() > 0.2 ? 2 : 1;
    
    const parent1Gender = api.generator.rng() > 0.5 ? Gender.MALE : Gender.FEMALE;
    const parent1 = this.generateFamilyMember({
      gender: parent1Gender,
      lastName,
      backstory: familyBackstory,
      age: 25 + Math.floor(api.generator.rng() * 30),
      isParent: true
    });
    
    members.push(parent1);
    family.parent_ids.push(parent1.id);
    
    if (parentCount > 1) {
      const parent2Gender = parent1Gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      const parent2 = this.generateFamilyMember({
        gender: parent2Gender,
        lastName,
        backstory: familyBackstory,
        age: 25 + Math.floor(api.generator.rng() * 30),
        isParent: true
      });
      
      parent1.spouse_id = parent2.id;
      parent2.spouse_id = parent1.id;
      
      members.push(parent2);
      family.parent_ids.push(parent2.id);
    }

    const childCount = Math.floor(api.generator.rng() * 5);
    
    for (let i = 0; i < childCount; i++) {
      const childGender = api.generator.rng() > 0.5 ? Gender.MALE : Gender.FEMALE;
      const child = this.generateFamilyMember({
        gender: childGender,
        lastName,
        backstory: familyBackstory,
        age: 5 + Math.floor(api.generator.rng() * 20),
        isParent: false
      });
      
      child.parent_ids = [...family.parent_ids];
      
      for (const parent of members.filter(m => family.parent_ids.includes(m.id))) {
        if (!parent.child_ids) {
          parent.child_ids = [];
        }
        parent.child_ids.push(child.id);
      }
      
      members.push(child);
      family.child_ids.push(child.id);
    }
    
    for (const child of members.filter(m => family.child_ids.includes(m.id))) {
      child.sibling_ids = family.child_ids.filter(id => id !== child.id);
    }
    
    for (const member of members) {
      member.family_id = family.id;
    }
    
    return { family, members };
  };

  generateFamilies = (count: number): { families: Family[]; members: Character[] } => {
    const families: Family[] = [];
    const allMembers: Character[] = [];
    
    for (let i = 0; i < count; i++) {
      const { family, members } = this.generateFamily();
      families.push(family);
      allMembers.push(...members);
    }
    
    return { families, members: allMembers };
  };

  private generateFamilyMember = ({
    gender,
    lastName,
    backstory,
    age,
    isParent
  }: {
    gender: Gender;
    lastName: string;
    backstory: CharacterBackstory;
    age: number;
    isParent: boolean;
  }): Character => {
    const currentTime = useGame.getState().gameState.world.time || 0;
    const bornAt = currentTime - (age * 365 * 24 * 60 * 60 * 1000);
    
    const firstName = gender === Gender.MALE
      ? api.character.first_names_male[Math.floor(api.generator.rng() * api.character.first_names_male.length)]
      : api.character.first_names_female[Math.floor(api.generator.rng() * api.character.first_names_female.length)];
    
    let job: Job;
    if (age < 18) {
      job = Job.UNEMPLOYED;
    } else if (isParent) {
      const jobs = Object.keys(Job);
      const jobIndex = Math.floor(api.generator.rng() * jobs.length);
      job = jobs[jobIndex] as Job;
    } else {
      job = api.generator.rng() < 0.4 ? Job.UNEMPLOYED : Object.keys(Job)[Math.floor(api.generator.rng() * Object.keys(Job).length)] as Job;
    }
    
    const traits: Trait[] = [];
    const traitsCount = Math.floor(api.generator.rng() * 4) + 1;
    
    for (let i = 0; i < traitsCount; i++) {
      const trait = api.generator.character.generate_trait(traits);
      
      if (traits.some(t => t.name === trait.name)) {
        i--;
        continue;
      }
      
      traits.push(trait);
    }
    
    const character: Character = {
      id: useGame.getState().gameState.characters.length + Math.floor(api.generator.rng() * 100000),
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      backstory: backstory,
      previous_job: job,
      traits: traits,
      bornAt: bornAt,
      tags: ["family"],
      parent_ids: [],
      child_ids: [],
      sibling_ids: []
    };
    
    return character;
  };
}