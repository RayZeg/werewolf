import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import OwnerForm from "./components/OwnerForm";
import PlayerForm from "./components/PlayerForm";
import { redirect } from "next/navigation";

async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const session = await getSession();
  const { gameId } = await params;

  const game: Game | null = await db.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) return <div>Game not found</div>;

  if (game.players.find((player) => player.id === session.id && game.started)) {
    redirect(`/game/${game.id}`);
  }

  if (game.started) return <div>Game already started</div>;

  if (!game.players.find((player) => player.id === session.id)) {
    //check if the user is already in the game
    await db.user.update({ where: { id: session.id }, data: { gameId } });
    game.players = [...game.players, session];
  }

  if (game.ownerId === session.id) return <OwnerForm game={game} />;

  return <PlayerForm session={session} game={game} />;
}

export default page;
