import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const ds = await getDataSource();
  const fileService = new FileService(ds);

  const { id } = await context.params;

  const file = await fileService.getFileById(id);
  if (!file)
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  const filePath = path.resolve(file.path);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "File missing" }, { status: 404 });

  const videoStream = fs.readFileSync(filePath);
  return new Response(videoStream, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": file.size.toString(),
      "Content-Disposition": `inline; filename="${file.originalName}"`,
    },
  });
}
