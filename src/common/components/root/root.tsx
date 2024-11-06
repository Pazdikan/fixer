import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
import { Separator } from "@/common/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/common/components/ui/sidebar";
import { useState } from "react";
import { useGameContext } from "@/core/context/use-game-context";
import CharacterCreator from "@/common/pages/character-creator";
import { DatabasePage } from "@/common/pages/database-page";
import { NetworkPage } from "@/network/network-page";
import { SocialMediaNetworkPage } from "@/network/posts/posts-page";
import { getCharacterById, getFullName, getInitial } from "@/common/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import DebugModal from "./debug-modal";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Database",
          url: "#",
          page: "database",
        },
        {
          title: "Network",
          url: "#",
          page: "network",
        },
      ],
    },
  ],
};

export function GameRoot() {
  const [currentPage, setCurrentPage] = useState("home");
  const game = useGameContext();

  const [openCategories, setOpenCategories] = React.useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) =>
      prev.includes(title)
        ? prev.filter((cat) => cat !== title)
        : [...prev, title]
    );
  };

  const breadcrumbItems = data.navMain.flatMap((navItem) =>
    navItem.items.map((item) => {
      if (item.page === currentPage) {
        return (
          <React.Fragment key={item.page}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.url}>{navItem.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        );
      }
      return null;
    })
  );

  const player = getCharacterById(game.gameState, game.gameState.player_id);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="floating">
        {player && (
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="#">
                    <Avatar>
                      <AvatarFallback>{getInitial(player)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">
                        {getFullName(player)}
                      </span>
                      <span className="">you</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
        )}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  open={openCategories.includes(item.title)}
                  onOpenChange={() => toggleCategory(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between font-medium">
                      {item.title}
                      {item.items?.length > 0 && (
                        <span className="ml-auto">
                          {openCategories.includes(item.title) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              onClick={() => setCurrentPage(subItem.page)}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className={"flex"}>
            <DebugModal />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className={"h-screen bg-sidebar"}>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
          {currentPage === "character-creator" &&
            game.gameState.player_id == -1 && <CharacterCreator />}

          {currentPage === "home" && <div></div>}
          {currentPage === "database" && <DatabasePage />}
          {currentPage === "network" && (
            <NetworkPage setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "network-posts" && <SocialMediaNetworkPage />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
