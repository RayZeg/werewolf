import GamesList from "@/components/GamesList";
import { db } from "@/lib/db";

export default async function Home() {
  const games: Game[] = await db.game.findMany({ include: { owner: true } });
  return <GamesList games={games} />;
}
