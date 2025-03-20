import { db } from "@/lib/db";
import OwnerForm from "./components/OwnerForm";
import { getSession } from "@/lib/session";
import PlayerFrom from "./components/PlayerFrom";
import { revalidatePath } from "next/cache";

async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const session = await getSession();
  const { gameId } = await params;

  let game: Game | null = await db.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) return <div>Game not found</div>;

  //check if the user is already in the game
  if (!game.players.find((player) => player.id === session.id)) {
    await db.user.update({ where: { id: session.id }, data: { gameId } });
  }

  game = await db.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) return <div>Game not found</div>;

  if (game.ownerId === session.id)
    return <OwnerForm session={session} game={game} />;

  return <PlayerFrom session={session} game={game} />;
}

export default page;
