import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gameId } = await req.json();

    await db.game.update({
      where: { id: gameId },
      data: { started: false },
    });

    await db.user.updateMany({
      where: { gameId },
      data: { role: null },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(null, { status: 500 });
  }
}
