import React from "react";

import { Hash, HelpCircle, Smile, Bot, Image, ImageIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import SignOut from "~/components/sign-out";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}

const menuItems = [
  {
    title: "Journal",
    icon: Hash,
    id: "journal",
    href: "/journal",
  },
  {
    title: "Gallery",
    icon: ImageIcon,
    id: "gallery",
    href: "/gallery",
  },
  // {
  //   title: "Team",
  //   icon: HelpCircle,
  //   id: "team",
  //   href: "/team",
  // },
  // {
  //   title: "Team",
  //   icon: HelpCircle,
  //   id: "team",
  //   href: "/team",
  // },
  // {
  //   title: "Friends",
  //   icon: Smile,
  //   id: "friends",
  //   href: "/friends",
  // },
  // {
  //   title: "AI Friend",
  //   icon: Bot,
  //   id: "ai-friend",
  //   href: "/ai",
  // },
];

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Hash className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Grow</span>
            <span className="truncate text-xs">Personal Growth</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <SignOut />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Layout;
