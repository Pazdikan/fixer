import { useContext } from "preact/compat";
import { GameContext } from "./game-context";

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};
