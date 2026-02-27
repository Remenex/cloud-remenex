import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    if (request.nextUrl.pathname === "/signin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (request.nextUrl.pathname === "/signin") {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname !== "/signin") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/signin"],
};
