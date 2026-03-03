// app/api/files/my/route.ts
import { getDataSource } from "@/app/api/connection";
import { FileService } from "@/app/api/services/file.service";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { UsersService } from "../../services/user.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const ds = await getDataSource();
  const fileService = new FileService(ds);
  const userService = new UsersService(ds);

  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await userService.getUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await fileService.getUserFiles(user.id);

  const host = req.nextUrl.origin;

  const filesWithLinks = files.map((f) => ({
    id: f.id,
    name: f.originalName,
    size: f.size,
    url: `${host}/resource/${f.id}`,
  }));

  return NextResponse.json(filesWithLinks);
}
