import { render } from 'preact';
import './index.css';
import './lib/i18n.ts';
import { GameProvider } from './components/game/game-context.tsx';
import GameRoot from '@/components/pages/home-page.tsx';
import { useGameState } from './hooks/use-game-state.ts';
import CharacterCreator from './components/pages/character-creator.tsx';

const Root = () => {
  return (
    <GameProvider>
      <RootContent />
    </GameProvider>
  );
};

const RootContent = () => {
  const { gameState } = useGameState();
  
  return (
    <>
      {gameState.player_id === -1 ? <CharacterCreator /> : <GameRoot />}
    </>
  );
};

render(<Root />, document.getElementById('app')!);
