import { useMap } from "react-leaflet";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/core/store/game-store";
import { Button } from "../ui/button";
import { Building } from "./game-map";
import { useState } from "react";

export function SaveGameplayAreaButton({
  buildings,
}: {
  buildings: Building[];
}) {
  const map = useMap();
  const { toast } = useToast();
  const gameState = useGame((state) => state.gameState);
  const updateGameState = useGame().updateGameState;
  const [isSaved, setIsSaved] = useState(false);

  if (isSaved) {
    return (
      <Button
        disabled
        style={{
          position: "absolute",
          top: "10px",
          right: "50px",
          zIndex: 1000,
        }}
      >
        Gameplay area saved!
      </Button>
    );
  }

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
