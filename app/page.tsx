import GridBackground from "@/components/grid-background";
import Navigation from "@/features/navigation/components/navigation";
import Upload from "@/features/upload/components/upload";

export default function Home() {
  return (
    <GridBackground>
      <main className="flex justify-center items-center h-screen">
        <Navigation />
        <Upload />
      </main>
    </GridBackground>
  );
}
