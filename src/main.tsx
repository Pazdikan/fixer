import { createRoot, Root } from "react-dom/client";

import "./index.css";
import "@/common/lib/i18n";
import { useGame } from "./core/store/game-store";
import { GameRoot } from "./common/components/root/root";
import { addonManager } from "./addon/addon";
import { coreAddon } from "./addon/addons/base";
import { Toaster } from "@/common/components/ui/toaster";
import { NewGamePage } from "./common/pages/new-game-page";
import { useEffect } from "react";
import { testAddon } from "./addon/addons/test";
import { ThemeProvider } from "./common/components/ui/theme-provider";

function AutoSave() {
  const saveGame = useGame((state) => state.saveGameState);

  useEffect(() => {
    const interval = setInterval(() => {
      saveGame();
      console.log("Auto-saved game");
    }, 10000);

    return () => clearInterval(interval);
  }, [saveGame]);

  return null;
}

const RootContent = () => {
  const player_id = useGame((state) => state.gameState.player_id);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {player_id === -1 ? <NewGamePage /> : <GameRoot />}
      <Toaster />
      <AutoSave />
    </ThemeProvider>
  );
};

let root: Root | null = null;
const container = document.getElementById("game")!;

if (container) {
  if (!root) {
    root = createRoot(container);
  }

  addonManager.register(coreAddon);
  addonManager.register(testAddon);
  addonManager.getRegisteredAddons().forEach((addon) => {
    addonManager.enable(addon.id);
  });

  root.render(<RootContent />);
}
