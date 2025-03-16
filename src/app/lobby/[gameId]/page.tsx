import { db } from "@/lib/db";
import GameForm from "./components/GameForm";

async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game: Game | null = await db.game.findUnique({
    where: { id: gameId },
    include: { owner: true },
  });

  if (!game) return <div>Game not found</div>;

  return <GameForm />;
}

export default page;
