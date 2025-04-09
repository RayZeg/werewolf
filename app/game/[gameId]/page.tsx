import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import GamePanel from "./components/GamePanel";

async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const session: User = await getSession();

  const game: Game | null = await db.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (game === null) return <div>Game not found</div>;

  if (game.players.find((p) => p.id === session.id) === undefined) {
    redirect("/");
  }

  return <GamePanel game={game} />;
}

export default page;
