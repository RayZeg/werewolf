import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { gameId } = await req.json();
    const user = await db.user.update({
      where: { id },
      data: { gameId },
    });
    if (!user) return new NextResponse(null, { status: 404 });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
