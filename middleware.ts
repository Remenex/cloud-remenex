import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_URL,
  });

  if (token) {
    if (request.nextUrl.pathname === "/signin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
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
