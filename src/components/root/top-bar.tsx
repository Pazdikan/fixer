import { useGameState } from "@/hooks/use-game-state";
import { useTranslation } from "react-i18next";

export default function TopBar({ toggleSidebar, toggleButtonRef }) {
    const { t } = useTranslation();
    const { gameState } = useGameState()
  
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 class={""}>Playing as {gameState.player_id == -1 ? "" : gameState.characters.at(gameState.player_id)?.first_name + " " + gameState.characters.at(gameState.player_id)?.last_name}</h1>
        <div className="flex items-center">
          <button
            ref={toggleButtonRef}
            onClick={toggleSidebar}
            className="lg:hidden mr-4"
            aria-label={t('toggleSidebar')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
    );
  }