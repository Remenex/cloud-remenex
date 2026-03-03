import Navigation from "@/features/navigation/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="px-2">{children}</main>
    </>
  );
}
