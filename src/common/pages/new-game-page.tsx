import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Slider } from "@/common/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";

// Assuming these types are defined elsewhere in your project
import { Gender, CharacterBackstory, Job } from "@/character/character.types";
import { useGame } from "@/core/store/game-store";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { AddonSelect } from "@/addon/components/addon-select";

export function NewGamePage() {
  const { t } = useTranslation();
  const game = useGame((state) => state);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [backstory, setBackstory] = useState<CharacterBackstory | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);

  const handleSetSeed = () => {
    game.updateGameState({
      seed: (document.getElementById("seed") as HTMLInputElement).value,
      seed_state: null,
    });
    game.saveGameState();
    toast({
      title: "Seed set",
      description: `Game seed has been set to: ${
        (document.getElementById("seed") as HTMLInputElement).value
      }`,
    });
  };

  const handleGenerateAll = () => {
    setGender(game.generator.character.generate_gender());
    setFirstName(
      game.generator.character.generate_first_name(gender as Gender)
    );
    setLastName(game.generator.character.generate_last_name());
    setBackstory(game.generator.character.generate_backstory());
    setPreviousJob(game.generator.character.generate_job());

    toast({
      title: "Character generated",
      description: "All fields have been randomly generated.",
    });
  };

  const handleCreateCharacter = () => {
    if (!gender || !backstory || !previousJob) {
      toast({
        title: "Incomplete character",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    game.generator.character.create_character({
      id: game.gameState.characters.length,
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      backstory: backstory,
      previous_job: previousJob,
    });

    game.generator.company.populateWorld();

    toast({
      title: "Character created",
      description:
        "Your character has been created and the world has been populated.",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("new-game")}</CardTitle>
          <CardDescription>{t("new-game-notice")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("game-settings")}</h2>
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                placeholder="Enter game seed"
                value={game.gameState.seed}
              />
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleSetSeed}>
                  Set Seed
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleGenerateAll}
                >
                  Generate All Fields
                </Button>
              </div>
            </div>
          </div>

          <AddonSelect />

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {t("new-game-character-creator")}
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                  <span className="sr-only">Toggle section</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gender">{t("gender")}</Label>
                  <Select
                    value={gender ?? undefined}
                    onValueChange={(value) => setGender(value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select-gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Gender).map((genderOption, index) => (
                        <SelectItem
                          key={index}
                          value={Object.values(Gender)[index] as Gender}
                        >
                          {genderOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="firstName">{t("first-name")}</Label>
                  <Input
                    id="firstName"
                    placeholder={t("enter-first-name")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("last-name")}</Label>
                  <Input
                    id="lastName"
                    placeholder={t("enter-last-name")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{t("background")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backstory">{t("backstory")}</Label>
                    <Select
                      value={backstory ?? undefined}
                      onValueChange={(value) =>
                        setBackstory(value as CharacterBackstory)
                      }
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
                      value={previousJob ?? undefined}
                      onValueChange={(value) => setPreviousJob(value as Job)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("select-your-previous-job")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Job).map((jobOption, index) => (
                          <SelectItem
                            key={index}
                            value={Object.keys(Job)[index]}
                          >
                            {jobOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button className="w-full" onClick={handleCreateCharacter}>
            {t("start-new-game")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
