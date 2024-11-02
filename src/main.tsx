import "preact/debug";

import { render } from "preact";
import "./index.css";
import "./common/lib/i18n.ts";
import { useGameContext } from "./core/context/use-game-context.ts";
import CharacterCreator from "./common/pages/character-creator.tsx";
import { GameProvider } from "./core/context/game-context.tsx";
import { GameRoot } from "./common/components/root/root.tsx";

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

render(<Root />, document.getElementById("app")!);
