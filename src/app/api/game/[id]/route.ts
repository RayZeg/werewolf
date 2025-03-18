import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.game.delete({ where: { id } });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const game: Game | null = await db.game.findUnique({
      where: { id },
      include: {
        players: { select: { id: true, username: true } },
        roles: true,
      },
    });
    if (!game) return new NextResponse(null, { status: 404 });
    return new Response(JSON.stringify(game));
  } catch (error) {
    console.log(error);
  }
}
