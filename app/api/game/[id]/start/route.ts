import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import rolesData from "@/data/Roles.json";

export async function POST(req: NextRequest) {
  try {
    const { gameId } = await req.json();
    console.log("distributing roles");
    const game: Game | null = await db.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });
    if (game === null) return new NextResponse(null, { status: 404 });
    let { players, roles } = game;
    while (players.length > 0) {
      console.log(roles.length, players.length);
      if (roles.length === 0 && players.length > 0) {
        await db.user.update({
          where: { id: players[players.length - 1].id },
          data: { role: rolesData.Villagers[0].name },
        });
        players.pop();
        console.log("assigned role Villager to", {
          ...players[players.length - 1],
          role: rolesData.Villagers[0].name,
        });
      } else {
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomPlayer =
          players[Math.floor(Math.random() * players.length)];
        await db.user.update({
          where: { id: randomPlayer.id },
          data: { role: randomRole },
          select: { id: true, username: true, role: true },
        });
        console.log("assigned role", randomRole, "to", {
          ...randomPlayer,
          role: randomRole,
        });
        players = players.filter((player) => player.id !== randomPlayer.id);
        roles = roles.filter((role) => role !== randomRole);
      }
    }
    console.log("Distributed roles");
    await db.game.update({
      where: { id: gameId },
      data: { started: true },
    });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(null, { status: 500 });
  }
}
