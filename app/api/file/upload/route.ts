import { authOptions } from "@/auth";
import { FileVisibility } from "@/lib/types/file";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getDataSource } from "../../connection";
import { FileService } from "../../services/file.service";
import { UsersService } from "../../services/user.service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ds = await getDataSource();

    const fileService = new FileService(ds);
    const userService = new UsersService(ds);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const video = formData.get("file") as File;

    if (!video) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    try {
      const savedFile = await fileService.uploadAndCreate(
        video,
        user,
        FileVisibility.PUBLIC,
      );

      return NextResponse.json({
        success: true,
        file: savedFile,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
