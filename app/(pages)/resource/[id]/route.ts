import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { UsersService } from "@/app/api/services/user.service";

import { FileVisibility } from "@/lib/types/file";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { verifyVideoToken } from "@/lib/helpers/video-token";

const FREE_BANDWIDTH_LIMIT = 50 * 1024 * 1024 * 1024;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const ds = await getDataSource();
  const fileService = new FileService(ds);
  const userService = new UsersService(ds);

  const file = await fileService.getFileById(id);
  if (!file) return notFound("File not found");

  const session = await getServerSession(authOptions);
  if (!hasAccess(file, session)) {
    return new Response("Forbidden", { status: 403 });
  }

  const filePath = path.resolve(file.path);
  if (!fs.existsSync(filePath)) {
    return notFound("File missing");
  }

  const isFree = file.user?.plan === "FREE";

  console.log(file.user?.bandwidthUsed);
  console.log(FREE_BANDWIDTH_LIMIT);

  if (isFree && (file.user?.bandwidthUsed || 0) >= FREE_BANDWIDTH_LIMIT) {
    return NextResponse.json(
      {
        error: "Bandwidth limit exceeded",
        upgradeRequired: true,
      },
      { status: 403 },
    );
  }

  const token = req.nextUrl.searchParams.get("token");

  let context: "embed" | "dashboard" = "embed";

  if (token) {
    const payload = verifyVideoToken(token);

    if (!payload || payload.fileId !== id) {
      return new Response("Invalid token", { status: 403 });
    }

    context = payload.context;
  }

  const ffmpeg = createFFmpegStream({
    filePath,
    isFree,
  });

  let bytesSent = 0;
  let flushed = false;

  const flushBandwidth = async () => {
    if (flushed) return;
    flushed = true;

    try {
      if (context === "embed") {
        await userService.updateBandwidth(file.userId, bytesSent);
        console.log("Bandwidth flushed:", bytesSent);
      }
    } catch (err) {
      console.error("Failed to flush bandwidth", err);
    }
  };

  const stream = new ReadableStream({
    start(controller) {
      ffmpeg.stdout.on("data", (chunk) => {
        bytesSent += chunk.length;
        controller.enqueue(chunk);
      });

      ffmpeg.stdout.on("end", async () => {
        controller.close();
        if (file.user?.plan === "FREE") await flushBandwidth();
      });

      ffmpeg.stdout.on("error", (err) => {
        controller.error(err);
      });
    },

    cancel() {
      ffmpeg.kill("SIGKILL");
      if (file.user?.plan === "FREE") flushBandwidth();
    },
  });

  req.signal.addEventListener("abort", () => {
    ffmpeg.kill("SIGKILL");
    flushBandwidth();
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
      "Accept-Ranges": "none",
    },
  });
}

function hasAccess(file: any, session: any) {
  if (file.visibility === FileVisibility.PUBLIC) return true;
  if (!session?.user) return false;
  return session.user.id === file.userId;
}

function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}

function createFFmpegStream({
  filePath,
  isFree,
}: {
  filePath: string;
  isFree: boolean;
}) {
  const watermarkPath = path.resolve("storage/assets/watermark.svg");

  const args: string[] = ["-i", filePath];

  if (isFree) {
    args.push(
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
    );
  } else {
    args.push("-c:v", "copy", "-c:a", "copy");
  }

  args.push(
    "-f",
    "mp4",
    "-movflags",
    "frag_keyframe+empty_moov+default_base_moof",
    "pipe:1",
  );

  return spawn("ffmpeg", args);
}
