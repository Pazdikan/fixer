import { useMap } from "react-leaflet";
import { Building } from "./game-map";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/core/store/game-store";
import { Button } from "../ui/button";

export function SaveGameplayAreaButton({
  buildings,
  setIsSaved,
}: {
  buildings: Building[];
  setIsSaved: (value: boolean) => void;
}) {
  const map = useMap();
  const { toast } = useToast();
  const gameState = useGame((state) => state.gameState);
  const updateGameState = useGame().updateGameState;

  return (
    buildings.length > 0 && (
      <Button
        style={{
          position: "absolute",
          top: "10px",
          right: "50px",
          zIndex: 1000,
        }}
        onClick={() => {
          if (buildings.length === 0) {
            toast({
              title: "No buildings selected",
              description: "Please select a gameplay area with buildings.",
              variant: "destructive",
            });
            return;
          }

          if (buildings.length < 500) {
            toast({
              title: "Too few buildings",
              description: "Please select a larger gameplay area.",
              variant: "destructive",
            });
            return;
          }

          const bounds = map.getBounds();

          updateGameState({
            world: {
              ...gameState.world,
              bounding_box: [
                bounds.getSouth(),
                bounds.getWest(),
                bounds.getNorth(),
                bounds.getEast(),
              ],
              buildings: buildings,
            },
          });

          setIsSaved(true);
        }}
      >
        Save gameplay araa
      </Button>
    )
  );
}
