import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!api|auth/signin|auth/signup|reset-password|_next/static|_next/image|favicon.ico|starter).*)",
};
