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
import { getUnemployedCharacters } from "@/common/lib/utils";

export default function DebugModal() {
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
          <h1>Debug Menu</h1>
          <Button onClick={clear_localstorage}>
            Clear localStorage (reset all data!)
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
            Generate character
          </Button>
          <p id="generated-character-text"></p>
          <Button
            className={"min-w-max"}
            onClick={() => {
              const company = useGame
                .getState()
                .generator.company.generateCompany(getUnemployedCharacters());
              document.getElementById("generated-company-text")!.innerText =
                JSON.stringify(company, null, 2);
            }}
          >
            Generate company
          </Button>
          <p id="generated-company-text"></p>
          <Label htmlFor={"seed"}>Seed</Label>
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
