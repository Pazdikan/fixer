import { render } from "preact";
import "./index.css";
import "./lib/i18n.ts";
import { GameProvider } from "./components/game/game-context.tsx";
import GameRoot from "@/pages/home-page.tsx";
import { useGameContext } from "./hooks/use-game-context.ts";
import CharacterCreator from "./pages/character-creator.tsx";

const Root = () => {
  return (
    <GameProvider>
      <RootContent />
    </GameProvider>
  );
};

const RootContent = () => {
  const { gameState } = useGameContext();

  return (
    <>{gameState.player_id === -1 ? <CharacterCreator /> : <GameRoot />}</>
  );
};

render(<Root />, document.getElementById("app")!);
