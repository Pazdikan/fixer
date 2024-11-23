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
import { api } from "@/api/api";

export function NewGamePage() {
  const { t } = useTranslation();
  const game = useGame((state) => state);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const [seed, setSeed] = useState(game.gameState.seed);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [backstory, setBackstory] = useState<CharacterBackstory | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);

  const handleSetSeed = () => {
    game.updateGameState({
      seed: seed,
      seed_state: null,
    });
    game.saveGameState();
    toast({
      title: t("seed.set"),
      description: `${t("seed.saved-toast")} ${seed}`,
    });
  };

  const handleGenerateAll = () => {
    setGender(api.generator.character.generate_gender());
    setFirstName(api.generator.character.generate_first_name(gender as Gender));
    setLastName(api.generator.character.generate_last_name());
    setBackstory(api.generator.character.generate_backstory());
    setPreviousJob(api.generator.character.generate_job());
  };

  const handleCreateCharacter = () => {
    if (!gender || !backstory || !previousJob) {
      toast({
        title: t("new-game.incomplete-character"),
        description: t("new-game.please-fill-all-fields"),
        variant: "destructive",
      });
      return;
    }

    api.generator.character.create_character({
      id: game.gameState.characters.length,
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      backstory: backstory,
      previous_job: previousJob,
    });

    api.generator.company.populateWorld();
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("new-game.title")}</CardTitle>
          {/* <CardDescription>{t("new-game-notice")}</CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("game-settings")}</h2>
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                placeholder="Enter game seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
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

          <h2 className="text-2xl font-semibold">{t("new-game.settings")}</h2>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {t("new-game.section.character-creator")}
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
                  <Label htmlFor="gender">{t("character.gender")}</Label>
                  <Select
                    value={gender ?? undefined}
                    onValueChange={(value) => setGender(value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("character.gender")} />
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
                  <Label htmlFor="firstName">{t("character.first-name")}</Label>
                  <Input
                    id="firstName"
                    placeholder={t("character.first-name")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("character.last-name")}</Label>
                  <Input
                    id="lastName"
                    placeholder={t("character.last-name")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {t("character.background")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backstory">
                      {t("character.backstory")}
                    </Label>
                    <Select
                      value={backstory ?? undefined}
                      onValueChange={(value) =>
                        setBackstory(value as CharacterBackstory)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("character.backstory")} />
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
                    <Label htmlFor="previousJob">
                      {t("character.previous-job")}
                    </Label>
                    <Select
                      value={previousJob ?? undefined}
                      onValueChange={(value) => setPreviousJob(value as Job)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("character.previous-job")}
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
            {t("new-game.start")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
