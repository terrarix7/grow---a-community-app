import React from "react";

import { Hash, HelpCircle, Smile, Bot, Link } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "~/components/ui/sidebar";
import SignOut from "~/components/sign-out";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="h-screen bg-white">
        <AppSidebar>{children}</AppSidebar>
      </div>
    </div>
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
    title: "Team",
    icon: HelpCircle,
    id: "team",
    href: "/team",
  },
  {
    title: "Friends",
    icon: Smile,
    id: "friends",
    href: "/friends",
  },
  {
    title: "AI Friend",
    icon: Bot,
    id: "ai-friend",
    href: "/ai",
  },
];

function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-white">
      <SidebarProvider className="h-full">
        <Sidebar
          className="h-full w-64 border-r border-gray-200"
          collapsible="none"
        >
          <SidebarContent className="flex flex-col bg-white">
            <SidebarGroup className="flex-1">
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
            <div className="border-t border-gray-200 p-4">
              <SignOut />
            </div>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
