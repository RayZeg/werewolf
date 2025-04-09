"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

function GamePanel({ game }: { game: Game }) {
  const router = useRouter();
  function cancelGame() {
    axios.post(`/api/game/${game.id}/end`, { gameId: game.id }).finally(() => {
      router.push(`/lobby/${game.id}`);
    });
  }
  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="h-[80%] w-[80%] grid grid-cols-4">
        <section className="bg-white col-span-3">{game.id}</section>
        <section className="bg-zinc-800">
          <Button variant="destructive" onClick={cancelGame}>
            Cancel Game
          </Button>
        </section>
      </div>
    </main>
  );
}

export default GamePanel;
