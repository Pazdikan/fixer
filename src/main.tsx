import { createRoot } from "react-dom/client";

import "./index.css";
import { useGame } from "./core/store/game-store";

// const RootContent = () => {
//   useEffect(() => {
//     game.updateGenerator(new Generator(game.rng));
//   }, []);

//   return <>{game.player_id === -1 ? <CharacterCreator /> : <GameRoot />}</>;
// };

const Test = () => {
  const player_id = useGame((state) => state.gameState.player_id);
  return <p>{player_id}</p>;
};

const container = document.getElementById("game")!;
if (container) {
  const root = createRoot(container);
  root.render(<Test />);
}
