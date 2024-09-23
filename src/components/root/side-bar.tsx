import { FlaskConical, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsModal from "@/components/ui/settings-modal";

export default function Sidebar({ isSidebarOpen, toggleSidebar, setCurrentPage, sidebarRef, toggleButtonRef }) {
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
          className={`bg-white shadow-md w-64 p-4 fixed lg:static h-full z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div>
            <h1 className="text-2xl font-bold mb-4">{t('gameName')}</h1>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    onClick={() => setCurrentPage('home')}
                    className="block py-2 px-4 hover:bg-gray-200 rounded"
                  >
                    {t('home')}
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 hover:bg-gray-200 rounded">
                    {t('database')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => setCurrentPage('character-creator')}
                    className="block py-2 px-4 hover:bg-gray-200 rounded"
                  >
                    {t('character-creator')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
  
          <div className="flex justify-center space-x-4 mb-4">
            <button className="p-2 hover:bg-gray-200 rounded-full" aria-label={t('debugMode')}>
              <FlaskConical />
            </button>
            <SettingsModal />
            <button className="p-2 hover:bg-gray-200 rounded-full" aria-label={t('profile')}>
              <User />
            </button>
          </div>
        </aside>
      </>
    );
  }