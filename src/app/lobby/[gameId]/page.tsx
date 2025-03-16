import { db } from "@/lib/db";
import GameForm from "./components/GameForm";
import { getSession } from "@/lib/session";

async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game: Game | null = await db.game.findUnique({
    where: { id: gameId },
    include: { owner: true },
  });
  const session = await getSession();

  if (!game) return <div>Game not found</div>;

  return <GameForm username={session.username} gameId={gameId} />;
}

export default page;
