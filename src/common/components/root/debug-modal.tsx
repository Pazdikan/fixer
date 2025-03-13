"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/common/components/ui/dialog";
import { Label } from "@/common/components/ui/label";
import { FlaskConical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useGame } from "@/core/store/game-store";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Badge } from "@/common/components/ui/badge";

/**
 * Debug modal component providing developer tools and game state inspection.
 */
export default function DebugModal() {
  const { t } = useTranslation();
  const { gameState, updateGameState } = useGame.getState();
  const [generatedCharacter, setGeneratedCharacter] = useState<string | null>(
    null
  );
  const [generatedCompany, setGeneratedCompany] = useState<string | null>(null);

  function clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
  }

  function generateCharacter() {
    const character = api.generator.character.generate_character();
    setGeneratedCharacter(JSON.stringify(character, null, 2));
  }

  function generateCompany() {
    const company = api.generator.company.generateCompany(
      api.character.getUnemployedCharacters()
    );
    setGeneratedCompany(JSON.stringify(company, null, 2));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <FlaskConical className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            D
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold mb-4">{t("debug.menu-title")}</h1>

          <Tabs
            defaultValue="general"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="generation">Generation</TabsTrigger>
              <TabsTrigger value="settings">Game Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="general" className="h-full overflow-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Game Information</CardTitle>
                    <CardDescription>
                      Basic game information and controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seed">{t("seed.title")}</Label>
                      <Input
                        id="seed"
                        className="font-mono"
                        disabled={true}
                        value={useGame.getState().gameState.seed}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="destructive"
                        onClick={clearLocalStorage}
                        className="w-full"
                      >
                        {t("debug.clear-localstorage")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generation" className="h-full overflow-auto">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Character Generation</CardTitle>
                    <CardDescription>
                      Generate random characters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={generateCharacter}>
                      {t("debug.generate-character")}
                    </Button>

                    {generatedCharacter && (
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <pre className="text-xs font-mono">
                          {generatedCharacter}
                        </pre>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Generation</CardTitle>
                    <CardDescription>Generate random companies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={generateCompany}>
                      {t("debug.generate-company")}
                    </Button>

                    {generatedCompany && (
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <pre className="text-xs font-mono">
                          {generatedCompany}
                        </pre>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="h-full overflow-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Debug Settings</CardTitle>
                    <CardDescription>Toggle game debug options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <DebugOption
                        title="Reveal Map"
                        description={
                          'Reveal the entire map, ignoring "is-known" tag.'
                        }
                        checked={gameState.debug.revealMap}
                        onChange={(value) => {
                          updateGameState({
                            debug: {
                              ...gameState.debug,
                              revealMap: value,
                            },
                          });
                        }}
                      />

                      {/* You can add more debug options here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type DebugOptionProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (s: boolean) => void;
};

const DebugOption = ({
  title,
  description,
  checked,
  onChange,
}: DebugOptionProps) => {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id={title.toLowerCase().replace(/\s/g, "-")}
        onCheckedChange={(s) => onChange(s as boolean)}
        checked={checked}
        className="mt-1"
      />
      <div className="space-y-1">
        <label
          htmlFor={title.toLowerCase().replace(/\s/g, "-")}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {title}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
