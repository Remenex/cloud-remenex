"use client";
import { Play, LayoutDashboard, CreditCard } from "lucide-react";

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
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

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

        <SidebarGroup className="mt-3">
          <SidebarGroupContent>
            <SidebarMenu className="mb-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className={`rounded-lg px-3 py-2 text-sm transition-colors
                    ${
                      isActive("/")
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50"
                    }
                  `}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && (
                      <span className="font-semibold">Dashboard</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/plans"
                    className={`rounded-lg px-3 py-2 text-sm transition-colors
                    ${
                      isActive("/plans")
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50"
                    }
                  `}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {!collapsed && (
                      <span className="font-semibold">Plans & Billing</span>
                    )}
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
