import WelcomeScreen from './pages/WelcomePage'

export function App() {
  const isPlayerNew: boolean = true;

  return (
    <>
       {
        isPlayerNew ? WelcomeScreen() : <p>Game</p>
       }
    </>
  )
}
 