import { AppSidebar } from "@/components/app-sidebar";
import GridBackground from "@/components/grid-background";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navigation from "@/features/navigation/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return (
  //   <>
  //     {/* <GridBackground /> */}
  //     <Navigation />
  //     <main className="px-2">{children}</main>
  //   </>
  // );

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
