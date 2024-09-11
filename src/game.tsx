import InfoBanner from './components/InfoBanner';
import GameHomePage from './pages/GameHomePage';
import WelcomeScreen from './pages/WelcomePage'

export function App() {
  const isPlayerNew: boolean = JSON.parse(window.localStorage.getItem("isPlayerNew") || "true");

  return (
    <>
       {
        isPlayerNew ? WelcomeScreen() : (
          <>
            {InfoBanner()}
            {GameHomePage()}
          </>
          
        )
       }
    </>
  )
}
 