import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const { id } = params;

  const ds = await getDataSource();
  const fileService = new FileService(ds);

  const file = await fileService.getFileById(id);
  if (!file) return new NextResponse("Not found", { status: 404 });

  const thumbnailPath = file.path.replace(/\.\w+$/, ".png");
  const buffer = await readFile(thumbnailPath);

  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } },
) {
  const ds = await getDataSource();
  const fileService = new FileService(ds);
  const { id } = context.params;

  try {
    const result = await fileService.deleteFileById(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to delete file:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
