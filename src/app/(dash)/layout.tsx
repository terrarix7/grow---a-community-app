import React from "react";

import { ImageIcon, PenLine } from "lucide-react";
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
} from "~/components/ui/sidebar";
import SignOut from "~/components/sign-out";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}

const menuItems = [
  {
    title: "Journal",
    icon: PenLine,
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
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOut />
      </SidebarFooter>
    </Sidebar>
  );
}

export default Layout;
