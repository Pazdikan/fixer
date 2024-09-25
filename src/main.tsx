import { render } from 'preact';
import './index.css';
import './lib/i18n.ts';
import { GameProvider } from './components/game/game-context.tsx';
import GameHomePage from '@/components/pages/home-page.tsx';

const App = () => {
  return (
    <GameProvider>
      <GameHomePage />
    </GameProvider>
  );
};

render(<App />, document.getElementById('app')!);