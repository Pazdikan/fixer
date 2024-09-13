import { Bolt, FlaskConical, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'preact/hooks';

export default function TextGameLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-64 bg-gray-800 text-white p-4 fixed lg:static h-full z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div>
          <h1 className="text-2xl font-bold mb-4">Fixer Simulator</h1>
          <nav>
            <ul className="space-y-2">
              <li><a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">Home</a></li>
              <li><a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">Database</a></li>
            </ul>
          </nav>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button className="p-2 hover:bg-gray-700 rounded-full" aria-label="Debug Mode">
            <FlaskConical />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full" aria-label="Settings">
            <Bolt />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full" aria-label="Account">
            <User />
          </button>
        </div>
      </aside>


      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Home</h1>
          <div className="flex items-center">
            <button
              ref={toggleButtonRef}
              onClick={toggleSidebar}
              className="lg:hidden mr-4"
              aria-label="Toggle Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Welcome to the Fixer Simulator</h3>
            <p className="text-gray-600">
              This is where the game will be bruh
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}