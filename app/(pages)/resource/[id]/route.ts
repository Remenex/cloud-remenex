import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { spawn } from "child_process";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const ds = await getDataSource();
  const fileService = new FileService(ds);

  const { id } = await context.params;

  const file = await fileService.getFileById(id);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const filePath = path.resolve(file.path);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const isFree = file.user?.plan === "FREE";

  const watermarkPath = path.resolve("storage/assets/watermark.svg");

  let ffmpeg;

  if (isFree) {
    ffmpeg = spawn("ffmpeg", [
      "-i",
      filePath,
      "-i",
      watermarkPath,
      "-filter_complex",
      "overlay=10:10",

      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",

      "-c:a",
      "aac",

      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov+default_base_moof",

      "pipe:1",
    ]);
  } else {
    ffmpeg = spawn("ffmpeg", [
      "-i",
      filePath,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",

      "-c:a",
      "aac",

      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov+default_base_moof",

      "pipe:1",
    ]);
  }

  ffmpeg.stderr.on("data", (data) => {
    console.log("FFmpeg:", data.toString());
  });

  return new Response(ffmpeg.stdout as any, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
      "Accept-Ranges": "none",
    },
  });
}
