import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { authOptions } from "@/auth";
import { formatBytes } from "@/lib/helpers/format-bytes";
import { getServerSession } from "next-auth";

export default async function Files() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const dataSource = await getDataSource();
  const fileService = new FileService(dataSource);

  const files = await fileService.getUserFiles(session?.user.id);
  console.log(session);

  return (
    <section className="flex h-screen items-center">
      <div className="m-auto bg-border w-full sm:w-3xl py-5 px-8 border border-border max-w-3xl min-h-96 rounded-4xl">
        <h1 className="text-white font-bold text-xl mb-4">My Files</h1>

        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="p-3 bg-black/40 rounded-lg text-white flex justify-between"
            >
              <span>{file.originalName}</span>
              <span className="text-sm opacity-60">
                {formatBytes(file.size)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
