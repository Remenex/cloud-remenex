import MyFiles from "@/features/file/components/my-files";

export default async function Files() {
  return (
    <section className="flex h-screen items-center">
      <div className="m-auto w-full sm:w-3xl py-5 px-8 bg-border border border-border max-w-3xl min-h-96 rounded-4xl">
        <h1 className="text-white font-bold text-xl mb-4">My Files</h1>
        <MyFiles />
      </div>
    </section>
  );
}
