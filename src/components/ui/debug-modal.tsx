import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical } from "lucide-react";
import { Button } from "./button";
import { useGameState } from "@/hooks/use-game-state";
import { Input } from "./input";

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
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <FlaskConical />
          </button>
        </DialogTrigger>
        <DialogContent>
          <h1>Debug Menu</h1>
          <Button onClick={clear_localstorage}>
            Clear localStorage (reset all data!)
          </Button>
          <div>
            <Button
              onClick={() => {
                const character = generator.character.generate_character();
                document.getElementById("generated-character-text").innerText =
                  JSON.stringify(character, null, 2);
              }}
            >
              Generate character:
            </Button>
            <p id="generated-character-text"></p>
          </div>
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
