import { Application } from "../components/root/network-application";
import { MessageSquareText } from "lucide-react";
import { SidebarProps } from "../components/root/side-bar";

const applications = [
  { icon: MessageSquareText, name: "Twitter", redirect: "database" },
];

export function NetworkPage({ setCurrentPage }: Partial<SidebarProps>) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Network Applications</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {applications.map((app, index) => (
          <Application
            key={index}
            icon={app.icon}
            name={app.name}
            onClick={() =>
              setCurrentPage ? setCurrentPage("database") : () => {}
            }
          />
        ))}
      </div>
    </div>
  );
}
