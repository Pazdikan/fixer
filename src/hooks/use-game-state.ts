import { useContext } from "preact/compat";
import { GameContext } from "@/components/game/game-context"

export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context) {
      throw new Error('useGameState must be used within a GameProvider');
    }
    return context;
  };
  