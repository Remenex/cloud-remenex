import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const ds = await getDataSource();
  const fileService = new FileService(ds);

  const file = await fileService.getFileById(params.id);
  if (!file) return new NextResponse("Not found", { status: 404 });

  const thumbnailPath = file.path.replace(/\.\w+$/, ".png");

  const buffer = await readFile(thumbnailPath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
