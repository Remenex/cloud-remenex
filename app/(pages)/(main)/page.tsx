import SidebarHeader from "@/components/sidebar-header";
import MyFiles from "@/features/file/components/my-files";

export default function Home() {
  return (
    <section className="flex-1 justify-center items-center h-screen">
      <SidebarHeader />
      <MyFiles />
    </section>
  );
}
