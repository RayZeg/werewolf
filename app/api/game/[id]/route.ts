import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, roles } = await req.json();
    const game: Game = await db.game.update({
      where: { id },
      data: { name, roles },
      include: { players: true },
    });
    return new NextResponse(JSON.stringify(game));
  } catch (error) {
    console.log(error);
  }
}

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
      },
    });
    return new Response(JSON.stringify(game));
  } catch (error) {
    console.log(error);
  }
}
