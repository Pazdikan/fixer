import { createRoot, Root } from "react-dom/client";

import "./index.css";
import "leaflet/dist/leaflet.css";
import "@/common/lib/i18n";
import { useGame } from "./core/store/game-store";
import { GameRoot } from "./common/components/root/root";
import { addonManager } from "./addon/addon";
import { coreAddon } from "./addon/addons/base";
import { Toaster } from "@/common/components/ui/toaster";
import { NewGamePage } from "./common/pages/new-game-page";
import { debugAddon } from "./addon/addons/debug";
import { ThemeProvider } from "./common/components/ui/theme-provider";
import useGlobalKeybindings from "./common/lib/mousetrap";

/**
 * Root component that manages game state and provides theme context.
 * Renders either NewGamePage or GameRoot, depends on game save existance.
 */
const RootContent = () => {
  useGlobalKeybindings();

  const player_id = useGame((state) => state.gameState.player_id);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {player_id === -1 ? <NewGamePage /> : <GameRoot />}
      <Toaster />
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
  addonManager.register(debugAddon);

  // Always enable core addon(s)
  addonManager.enable(coreAddon.id);

  // Enable debug addon automatically for beta builds (or localhost)
  try {
    const href = window?.location?.href ?? "";
    const isBeta = href.includes("/beta") || href.includes("localhost");
    if (isBeta) {
      addonManager.enable(debugAddon.id);
    }
  } catch (e) {
    // ignore (server-side rendering or unavailable window)
  }

  root.render(<RootContent />);
}
