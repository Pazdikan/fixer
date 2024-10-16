import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/use-game-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DebugModal() {
  const { generator, gameState } = useGameState();

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
              const character = generator.character.generate_character();
              document.getElementById("generated-character-text").innerText =
                JSON.stringify(character, null, 2);
            }}
          >
            Generate character
          </Button>
          <p id="generated-character-text"></p>
          <Button
            className={"min-w-max"}
            onClick={() => {
              const company = generator.world.generateCompany(gameState);
              document.getElementById("generated-company-text").innerText =
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
            value={gameState.seed}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
