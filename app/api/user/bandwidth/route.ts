import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { UsersService } from "../../services/user.service";
import { getDataSource } from "../../connection";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ds = await getDataSource();
    const userService = new UsersService(ds);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { newBandwidth } = body;

    if (!newBandwidth) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const updatedUser = await userService.updateBandwidth(session.user.id, newBandwidth);

    return NextResponse.json({ success: true});
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 },
    );
  }
}
