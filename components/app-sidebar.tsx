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
import { DropdownMenuAvatar } from "../features/user/components/dropdown-menu-avatar";
import Image from "next/image";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  //   const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background"
    >
      <SidebarContent>
        {collapsed ? (
          <div className="px-2 py-8 w-full h-8 relative flex justify-center">
            <Image
              src={"/images/RemenexCloud Favicon Black.svg"}
              fill
              alt="Remenex Cloud"
            />
          </div>
        ) : (
          <div className="px-2 py-8 flex items-center gap-2.5 relative w-2/3 h-10">
            <Image
              src={"/images/RemenexCloud Black.svg"}
              fill
              alt="Remenex Cloud"
            />
          </div>
        )}

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
