import SidebarHeader from "@/components/sidebar-header";
import PlanInfo from "@/features/plans/components/plan-info";

export default function Page() {
  return (
    <section className="flex-1 justify-center items-center h-screen">
      <SidebarHeader title="Plans & Billing" showUploadButton={false} />
      <PlanInfo />
    </section>
  );
}
