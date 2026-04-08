"use client";
import { Play, LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DropdownMenuAvatar } from "./dropdown-menu-avatar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  //   const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="px-2 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Play className="w-3.5 h-3.5 text-blue-700 fill-current" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-foreground tracking-tight">
              RemenexCloud
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className="hover:bg-accent/50 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <DropdownMenuAvatar expanded={!collapsed} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
