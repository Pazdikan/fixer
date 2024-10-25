import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGameContext } from "@/hooks/use-game-context";
import { CharacterBackstory, Job } from "@/types/game-state";
import { useTranslation } from "react-i18next";

export default function CharacterCreator() {
  const { t } = useTranslation();
  const { gameState, updateGameState, generator } = useGameContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [backstory, setBackstory] = useState<CharacterBackstory | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);

  const personalityTraits = [
    { name: "Peaceful - Aggressive", min: -10, max: 10 },
    { name: "Reckless - Caucious", min: -10, max: 10 },
    { name: "Treacherous - Loyal", min: -10, max: 10 },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("character-creator")}
      </h1>

      <p class={"text-center"}>{t("create-character-notice")} </p>

      <div className="items-center">
        <Label htmlFor="seed">Seed</Label>
        <div className={"space-y-2"}>
          <Input
            type="text"
            id="seed"
            placeholder="Seed"
            value={gameState.seed}
          />
          <Button
            className={"min-w-full"}
            onClick={() =>
              updateGameState({
                seed: (document.getElementById("seed") as HTMLInputElement)
                  .value,
                seed_state: null,
              })
            }
          >
            Set Seed
          </Button>
          <Button
            variant={"outline"}
            className={"min-w-full"}
            onClick={() => {
              setFirstName(generator.character.generate_first_name());
              setLastName(generator.character.generate_last_name());
              setBackstory(generator.character.generate_backstory());
              setPreviousJob(generator.character.generate_job());
            }}
          >
            Generate all fields
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("personal-information")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t("first-name")}</Label>
            <Input
              autocomplete="off"
              id="fn"
              placeholder={t("enter-first-name")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t("last-name")}</Label>
            <Input
              id="ln"
              placeholder={t("enter-last-name")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("background")}</h2>
        <div>
          <Label htmlFor="backstory">{t("backstory")}</Label>
          <Select
            value={backstory ?? undefined} // Pass the selected backstory value
            onValueChange={(value) => setBackstory(value as CharacterBackstory)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select-your-backstory")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CharacterBackstory).map(
                (backstoryOption, index) => (
                  <SelectItem
                    key={index}
                    value={Object.keys(CharacterBackstory)[index]}
                  >
                    {backstoryOption}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="previousJob">{t("previous-job")}</Label>
          <Select
            value={previousJob ?? undefined} // Pass the selected backstory value
            onValueChange={(value) => setPreviousJob(value as Job)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select-your-previous-job")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Job).map((jobOption, index) => (
                <SelectItem key={index} value={Object.keys(Job)[index]}>
                  {jobOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("personality-traits")}</h2>
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

      <Button
        className="w-full"
        onClick={() => {
          generator.character.create_character(
            {
              id: gameState.characters.length,
              first_name: firstName,
              last_name: lastName,
              backstory: backstory!,
              previous_job: previousJob!,
            },
            updateGameState
          );

          generator.world.populateWorld(generator, updateGameState);
        }}
      >
        {t("create-character")}
      </Button>
    </div>
  );
}
