import { render } from 'preact'
import './index.css'
import './lib/i18n.ts'
import { GameProvider } from './components/game/game-context.tsx'
import GameHomePage from '@/components/pages/GameHomePage.tsx'

import { GameBrain } from '@/core/brain';

render(<GameProvider>
    <GameHomePage />
</GameProvider>, document.getElementById('app')!)

GameBrain.start();
