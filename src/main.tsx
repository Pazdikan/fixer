import { render } from 'preact'
import { App } from './components/game/game.tsx'
import './index.css'
import './lib/i18n.ts'
import { GameProvider } from './components/game/game-context.tsx'
import GameHomePage from '@/components/pages/GameHomePage.tsx'

render(<GameProvider>
    <GameHomePage />
</GameProvider>, document.getElementById('app')!)
