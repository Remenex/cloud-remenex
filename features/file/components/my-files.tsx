import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import MyFilesClient from "./my-files-client";

export default async function MyFiles() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const dataSource = await getDataSource();
  const fileService = new FileService(dataSource);

  const files = await fileService.getUserFiles(session.user.id);

  const plainFiles = files.map((file) => ({
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
    duration: file.duration,
    thumbnail: file.thumbnail,
    status: file.status,
  }));

  return (
    <div className="flex-1 p-6">
      <MyFilesClient files={plainFiles} />
    </div>
  );
}
