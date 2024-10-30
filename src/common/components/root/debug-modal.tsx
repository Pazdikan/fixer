import { useGameContext } from "@/core/context/use-game-context";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { FlaskConical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function DebugModal() {
  const game = useGameContext();

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
              const character = game.generator.character.generate_character();
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
              const company = game.generator.world.generateCompany([], game);
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
            value={game.gameState.seed}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
