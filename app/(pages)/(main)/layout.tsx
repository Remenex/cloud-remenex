import GridBackground from "@/components/grid-background";
import Navigation from "@/features/navigation/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GridBackground />
      <Navigation />
      <main className="px-2">{children}</main>
    </>
  );
}
