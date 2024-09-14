import { render } from 'preact'
import { App } from './game.tsx'
import './index.css'
import './lib/i18n.ts'

render(<App />, document.getElementById('app')!)
 