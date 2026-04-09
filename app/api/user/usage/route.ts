// app/api/user/usage/route.ts
import { getDataSource } from "@/app/api/connection";
import { UsersService } from "@/app/api/services/user.service";
import { FileService } from "@/app/api/services/file.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const ds = await getDataSource();
    const userService = new UsersService(ds);
    const user = await userService.findById(session.user.id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const fileService = new FileService(ds);
    const usage = await fileService.getUserUsage(user);

    return new Response(JSON.stringify({ usage }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch usage" }), {
      status: 500,
    });
  }
}
