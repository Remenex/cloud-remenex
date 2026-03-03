import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { authOptions } from "@/auth";
import Button from "@/components/button";
import { formatBytes } from "@/lib/helpers/format-bytes";
import { PlainFile } from "@/lib/types/file";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FileDropdown } from "./file-dropdown";

export default async function MyFiles() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const dataSource = await getDataSource();
  const fileService = new FileService(dataSource);

  const files = await fileService.getUserFiles(session.user.id);

  const plainFiles: PlainFile[] = files.map((file) => ({
    id: file.id,
    originalName: file.originalName,
    filename: file.filename,
    path: file.path,
    mimeType: file.mimeType,
    size: file.size,
    visibility: file.visibility,
    userId: file.userId,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  }));

  if (!plainFiles || plainFiles.length === 0) {
    return (
      <div>
        <div className="text-white/60 text-center py-4">
          You don’t have any files yet.
        </div>
        <Link href="/" className="block max-w-40 m-auto">
          <Button
            text="Upload"
            variant={"secondary"}
            size={"medium"}
            className="w-full"
          />
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {plainFiles.map((file) => (
        <li
          key={file.id}
          className="py-3 px-4 border-b border-border-grey text-white flex justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="truncate max-w-50 sm:max-w-full">
              {file.originalName}
            </span>
            <div className="flex gap-6">
              <span className="text-sm opacity-60">
                {formatBytes(file.size)}
              </span>
              {/* <span className="text-sm opacity-60">
                {format(file.createdAt, "dd MMM yyyy")}
              </span> */}
            </div>
          </div>
          <div className="cursor-pointer">
            <FileDropdown file={file} />
          </div>
        </li>
      ))}
    </ul>
  );
}
