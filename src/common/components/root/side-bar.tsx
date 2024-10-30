import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsModal from "@/common/components/root/settings-modal";
import DebugModal from "./debug-modal";
import { RefObject } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  sidebarRef: RefObject<HTMLElement>;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  setCurrentPage,
  sidebarRef,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`bg-white shadow-md w-64 p-4 fixed lg:static h-full z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className={"space-y-2"}>
          <h1 className="text-2xl font-bold text-center">{t("gameName")}</h1>
          <nav>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={() => setCurrentPage("home")}
                  className="block py-2 px-4 hover:bg-gray-200 rounded"
                >
                  {t("home")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-200 rounded"
                  onClick={() => setCurrentPage("database")}
                >
                  {t("database")}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <DebugModal />
          <SettingsModal />
          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            aria-label={t("profile")}
          >
            <User />
          </button>
        </div>
      </aside>
    </>
  );
}
