import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { generateVideoToken } from "@/lib/helpers/video-token";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const contextParam = req.nextUrl.searchParams.get("context");

  const context =
    contextParam === "embed" || contextParam === "dashboard"
      ? contextParam
      : "dashboard";

  const token = generateVideoToken({
    fileId: id,
    userId: session.user.id,
    context,
  });

  return Response.json({ token });
}

