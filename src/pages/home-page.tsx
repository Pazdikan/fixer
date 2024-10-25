import { useState, useRef, useEffect } from "preact/hooks";
import CharacterCreator from "./character-creator";
import Sidebar from "@/components/root/side-bar";
import TopBar from "@/components/root/top-bar";
import { useGameContext } from "@/hooks/use-game-context";
import { DatabasePage } from "./database-page";

export default function GameRoot() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const { gameState } = useGameContext();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  if (gameState.player_id == -1) {
    setCurrentPage("character-creator");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full">
      <div className="flex-1 h-full w-full">
        <div className="flex h-full">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            setCurrentPage={setCurrentPage}
            sidebarRef={sidebarRef}
            toggleButtonRef={toggleButtonRef}
          />

          <div className="flex flex-col flex-1">
            <TopBar
              toggleSidebar={toggleSidebar}
              toggleButtonRef={toggleButtonRef}
            />

            <main className="flex-1 p-6 overflow-y-auto">
              {currentPage === "home" && <div></div>}
              {currentPage === "database" && <DatabasePage />}
              {currentPage === "character-creator" &&
                gameState.player_id == -1 && <CharacterCreator />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
