import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!api|auth/signin|auth/signup|reset-password|_next/static|_next/image|favicon.ico|starter).*)",
};
