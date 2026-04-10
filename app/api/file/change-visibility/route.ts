import { authOptions } from "@/auth";
import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, visible } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const ds = await getDataSource();
    const fileService = new FileService(ds);

    const updatedFile = await fileService.updateVisibility(id, visible);

    return NextResponse.json({ success: true, file: updatedFile });
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 },
    );
  }
}
