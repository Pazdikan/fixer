import { createRoot, Root } from "react-dom/client";

import "./index.css";
import { useGame } from "./core/store/game-store";
import CharacterCreator from "./common/pages/character-creator";
import { GameRoot } from "./common/components/root/root";

const RootContent = () => {
  const player_id = useGame((state) => state.gameState.player_id);
  console.log("Player ID: ", player_id);

  return <>{player_id === -1 ? <CharacterCreator /> : <GameRoot />}</>;
};

let root: Root | null = null;
const container = document.getElementById("game")!;

if (container) {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<RootContent />);
}
