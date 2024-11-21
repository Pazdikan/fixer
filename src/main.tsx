import { createRoot, Root } from "react-dom/client";

import "./index.css";
import { useGame } from "./core/store/game-store";
import CharacterCreator from "./common/pages/character-creator";
import { GameRoot } from "./common/components/root/root";
import { addonManager } from "./addon/addon";
import { coreAddon } from "./addon/addons/base";

const RootContent = () => {
  const player_id = useGame((state) => state.gameState.player_id);

  return <>{player_id === -1 ? <CharacterCreator /> : <GameRoot />}</>;
};

let root: Root | null = null;
const container = document.getElementById("game")!;

if (container) {
  if (!root) {
    root = createRoot(container);
  }

  addonManager.register(coreAddon);
  addonManager.getRegisteredAddons().forEach((addon) => {
    addonManager.enable(addon.id);
  });

  root.render(<RootContent />);
}
