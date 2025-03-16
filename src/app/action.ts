"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { error } from "console";
import { redirect } from "next/navigation";

export async function createGame() {
  const owner: User = await getSession();
  if (await db.game.findFirst({ where: { ownerId: owner.id } })) {
    return { error: "You already have a game" };
  }
  const { id } = await db.game.create({
    data: { name: `Werewolf Game by ${owner.username}`, ownerId: owner.id },
    select: { id: true },
  });
  redirect(`/lobby/${id}`);
}
