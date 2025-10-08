import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";

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
import { useAddonEnabled } from "@/hooks/use-addon-enabled";
import { api } from "@/api/api";
import { GameMap } from "../components/map/game-map";
import debugBuildings from "@/common/components/map/debug-world.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/common/components/ui/dialog";
export function NewGamePage() {
  const debugEnabled = useAddonEnabled("debug");

  const { t } = useTranslation();
  const game = useGame((state) => state);
  const updateGameState = useGame((state) => state.updateGameState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const [seed, setSeed] = useState(game.gameState.seed);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [backstory, setBackstory] = useState<CharacterBackstory | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);

  const [skipDebugAutoNewGame, setSkipDebugAutoNewGame] = useState(false);

  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(3);

  useEffect(() => {
    if (!debugEnabled || skipDebugAutoNewGame) return;

    setSecondsLeft(3);
    setShowDebugDialog(true);

    const interval = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // last tick: stop and create
          clearInterval(interval);
          setShowDebugDialog(false);
          setIsOpen(false);
          // ensure we still respect skip flag
          if (!skipDebugAutoNewGame) handleCreateCharacter();
          return 0;
        }

        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [debugEnabled, skipDebugAutoNewGame]);

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
    const newGender = api.generator.character.generate_gender(); // Get new gender first
    setGender(newGender); // Update state
    setFirstName(api.generator.character.generate_first_name(newGender)); // Use newGender directly
    setLastName(api.generator.character.generate_last_name());
    setBackstory(api.generator.character.generate_backstory());
    setPreviousJob(api.generator.character.generate_job());
  };

  const handleCreateCharacter = async () => {
    console.log("debug", debugEnabled);

    if (debugEnabled) {
      updateGameState({
        world: {
          buildings: debugBuildings,
          player_base_id: "way-174392753",
          bounding_box: [
            35.100318965433445, -106.60197257995605, 35.13542244271511,
            -106.40962600708009,
          ],
        },
      });

      handleGenerateAll();
    } else {
      performCharacterChecks();
    }
  };

  useEffect(() => {
    if (debugEnabled && gender && backstory && previousJob) {
      performCharacterChecks();
    }
  }, [gender, backstory, previousJob, debugEnabled]);

  const performCharacterChecks = async () => {
    if (!gender || !backstory || !previousJob) {
      toast({
        title: t("new-game.incomplete-character"),
        description: t("new-game.please-fill-all-fields"),
        variant: "destructive",
      });
      return;
    }

    if (
      !game.gameState.world?.buildings ||
      game.gameState.world?.buildings.length === 0
    ) {
      toast({
        title: "No buildings",
        description:
          'Please select an area you want to play in, then click "Save gameplay araa".',
        variant: "destructive",
      });
      return;
    }

    if (!game.gameState.world?.player_base_id) {
      toast({
        title: "No player base",
        description:
          'Please select a building to be your player base, then click "Save player base".',
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
      traits: [],
      tags: ["known:character"],
    });

    await api.generator.company.populateWorld();

    api.achievement.unlock("create_character");
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skipping character creation</DialogTitle>
          </DialogHeader>
          <div>
            {secondsLeft > 0
              ? `New game will automatically generate in ${secondsLeft}s...`
              : `Creating game...`}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setSkipDebugAutoNewGame(true);
                setShowDebugDialog(false);
              }}
            >
              Prevent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <GameMap isNewGameCreator={true} />

          <Button className="w-full" onClick={handleCreateCharacter}>
            {t("new-game.start")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
