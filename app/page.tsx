import Navigation from "@/features/navigation/components/navigation";
import Upload from "@/features/upload/components/upload";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen px-2">
      <Navigation />
      <Upload />
    </main>
  );
}
