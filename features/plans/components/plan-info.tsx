import Billing from "./billing";
import CurrentUsage from "./current-usage";

export default function PlanInfo() {
  return (
    <section className="flex-1 p-6">
      <CurrentUsage />
      <Billing />
    </section>
  );
}
