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

export default function DebugModal() {
  const { t } = useTranslation();

  function clear_localstorage() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <FlaskConical />
        </DialogTrigger>
        <DialogContent>
          <h1>{t("debug.menu-title")}</h1>
          <Button onClick={clear_localstorage}>
            {t("debug.clear-localstorage")}
          </Button>
          <Button
            className={"min-w-max"}
            onClick={() => {
              const character = useGame
                .getState()
                .generator.character.generate_character();
              document.getElementById("generated-character-text")!.innerText =
                JSON.stringify(character, null, 2);
            }}
          >
            {t("debug.generate-character")}
          </Button>
          <p id="generated-character-text"></p>
          <Button
            className={"min-w-max"}
            onClick={() => {
              const company = useGame
                .getState()
                .generator.company.generateCompany(
                  api.character.getUnemployedCharacters()
                );
              document.getElementById("generated-company-text")!.innerText =
                JSON.stringify(company, null, 2);
            }}
          >
            {t("debug.generate-company")}
          </Button>
          <p id="generated-company-text"></p>
          <Label htmlFor={"seed"}>{t("seed.title")}</Label>
          <Input
            className={"min-w-max"}
            disabled={true}
            value={useGame.getState().gameState.seed}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
