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

/**
 * A class to generate family units rather than individual random characters
 */
export class FamilyGenerator {
  rng: () => number;

  constructor(rng: () => number) {
    this.rng = rng;
  }

  /**
   * Generates a family with parents and children
   * @returns An object containing all family members and the family object
   */
  generateFamily = (): { family: Family; members: Character[] } => {
    // Generate family surname and shared backstory
    const lastName = api.character.last_names[
      Math.floor(this.rng() * api.character.last_names.length)
    ];
    
    const backstories = Object.keys(CharacterBackstory);
    const familyBackstory = backstories[
      Math.floor(this.rng() * backstories.length)
    ] as CharacterBackstory;

    // Create the family object
    const family: Family = {
      id: useGame.getState().gameState.families?.length || 0,
      name: lastName,
      parent_ids: [],
      child_ids: [],
      backstory: familyBackstory
    };

    const members: Character[] = [];
    
    // Generate parents (1-2)
    const parentCount = Math.random() > 0.2 ? 2 : 1; // 80% chance of two parents
    
    // First parent
    const parent1Gender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
    const parent1 = this.generateFamilyMember({
      gender: parent1Gender,
      lastName,
      backstory: familyBackstory,
      age: 25 + Math.floor(this.rng() * 30), // Age 25-55
      isParent: true
    });
    
    members.push(parent1);
    family.parent_ids.push(parent1.id);
    
    // Second parent (if needed)
    if (parentCount > 1) {
      const parent2Gender = parent1Gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      const parent2 = this.generateFamilyMember({
        gender: parent2Gender,
        lastName,
        backstory: familyBackstory,
        age: 25 + Math.floor(this.rng() * 30), // Age 25-55
        isParent: true
      });
      
      // Set spouse relationships
      parent1.spouse_id = parent2.id;
      parent2.spouse_id = parent1.id;
      
      members.push(parent2);
      family.parent_ids.push(parent2.id);
    }

    // Generate children (0-4)
    const childCount = Math.floor(this.rng() * 5); // 0-4 children
    
    for (let i = 0; i < childCount; i++) {
      const childGender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
      const child = this.generateFamilyMember({
        gender: childGender,
        lastName,
        backstory: familyBackstory,
        age: 5 + Math.floor(this.rng() * 20), // Age 5-25
        isParent: false
      });
      
      // Set parent-child relationships
      child.parent_ids = [...family.parent_ids];
      
      // Update parents' child_ids
      for (const parent of members.filter(m => family.parent_ids.includes(m.id))) {
        if (!parent.child_ids) {
          parent.child_ids = [];
        }
        parent.child_ids.push(child.id);
      }
      
      members.push(child);
      family.child_ids.push(child.id);
    }
    
    // Set sibling relationships
    for (const child of members.filter(m => family.child_ids.includes(m.id))) {
      child.sibling_ids = family.child_ids.filter(id => id !== child.id);
    }
    
    // Set family_id for all members
    for (const member of members) {
      member.family_id = family.id;
    }
    
    return { family, members };
  };

  /**
   * Generate multiple families
   * @param count Number of families to generate
   * @returns Array of generated families and their members
   */
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

  /**
   * Creates a single family member character
   */
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
    // Generate a first name based on gender
    const firstName = gender === Gender.MALE
      ? api.character.first_names_male[Math.floor(this.rng() * api.character.first_names_male.length)]
      : api.character.first_names_female[Math.floor(this.rng() * api.character.first_names_female.length)];
    
    // Determine appropriate job based on age and role
    let job: Job;
    if (age < 18) {
      job = Job.UNEMPLOYED;
    } else if (isParent) {
      // Parents have weighted job distribution
      const jobs = Object.keys(Job);
      const jobIndex = Math.floor(this.rng() * jobs.length);
      job = jobs[jobIndex] as Job;
    } else {
      // Young adults are more likely to be unemployed
      job = this.rng() < 0.4 ? Job.UNEMPLOYED : Object.keys(Job)[Math.floor(this.rng() * Object.keys(Job).length)] as Job;
    }
    
    // Generate traits influenced by family
    const traits: Trait[] = [];
    const traitsCount = Math.floor(this.rng() * 4) + 1; // 1-4 traits
    
    for (let i = 0; i < traitsCount; i++) {
      const trait = api.generator.character.generate_trait(traits);
      
      if (traits.some(t => t.name === trait.name)) {
        i--;
        continue;
      }
      
      traits.push(trait);
    }
    
    // Create the character
    const character: Character = {
      id: useGame.getState().gameState.characters.length + Math.floor(Math.random() * 100000), // Temporary ID, will be updated later
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      backstory: backstory,
      previous_job: job,
      traits: traits,
      age: age,
      tags: ["family"],
      parent_ids: [],
      child_ids: [],
      sibling_ids: []
    };
    
    return character;
  };
}