"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame() {
  const owner: User = await getSession();
  if (await db.game.findFirst({ where: { ownerId: owner.id } })) {
    await db.game.deleteMany({ where: { ownerId: owner.id } });
    return {
      error: "Your previous game was deleted you can now create a new one",
    };
  }
  const { id } = await db.game.create({
    data: { name: `Werewolf Game by ${owner.username}`, ownerId: owner.id },
    select: { id: true },
  });
  redirect(`/lobby/${id}`);
}

export async function refreshPath(path: string) {
  revalidatePath(path);
}
