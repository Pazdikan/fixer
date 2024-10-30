import "./index.css";
import "./common/lib/i18n.ts";
import GameRoot from "@/common/pages/home-page.tsx";
import { useGameContext } from "./core/context/use-game-context.ts";
import CharacterCreator from "./common/pages/character-creator.tsx";
import { GameProvider } from "./core/context/game-context.tsx";
import { createRoot } from "react-dom/client";

const Root = () => {
  return (
    <GameProvider>
      <RootContent />
    </GameProvider>
  );
};

const RootContent = () => {
  const game = useGameContext();

  return (
    <>{game.gameState.player_id === -1 ? <CharacterCreator /> : <GameRoot />}</>
  );
};

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(<Root />);
