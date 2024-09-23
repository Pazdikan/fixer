import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGameState } from "@/hooks/use-game-state";
import { Character, CharacterBackstory, GameState, Job } from "@/types/game-state";
import { useTranslation } from "react-i18next";

export default function CharacterCreator() {
  const { t } = useTranslation();
  const { gameState, updateGameState } = useGameState();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [backstory, setBackstory] = useState<CharacterBackstory | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);

  const personalityTraits = [
    { name: "Peaceful - Aggressive", min: -10, max: 10 },
    { name: "Reckless - Caucious", min: -10, max: 10 },
    { name: "Treacherous - Loyal", min: -10, max: 10 },
  ];

  const create_character = (object: Character, gameState: GameState, updateGameState: (newState: Object) => void) => {
    if (!object.first_name || !object.last_name || !object.backstory || !object.previous_job) {
      console.error("All fields are required");
      return;
    }
    updateGameState({
      characters: [...gameState.characters, object]
    });
    console.log(`updated: ${JSON.stringify(gameState)}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8">Character Creator</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Background</h2>
        <div>
          <Label htmlFor="backstory">Backstory</Label>
          <Select onValueChange={(value) => setBackstory(value as CharacterBackstory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your backstory" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CharacterBackstory).map((backstory, index) => (
                <SelectItem key={index} value={backstory}>{backstory}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="previousJob">Previous Job</Label>
          <Select onValueChange={(value) => setPreviousJob(value as Job)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your previous job" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Job).map((job, index) => (
                <SelectItem key={index} value={job}>{job}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Personality Traits</h2>
        {personalityTraits.map((trait, index) => (
          <div key={index} className="space-y-2">
            <Slider
              defaultValue={[0]}
              max={trait.max}
              min={trait.min}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>{trait.name.split(" - ")[0]}</span>
              <span>{trait.name.split(" - ")[1]}</span>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full" onClick={() => create_character(
        {
          id: gameState.characters.length,
          first_name: firstName,
          last_name: lastName,
          backstory: backstory!,
          previous_job: previousJob!,
        },
        gameState,
        updateGameState
      )}>Create Character</Button>
    </div>
  );
}