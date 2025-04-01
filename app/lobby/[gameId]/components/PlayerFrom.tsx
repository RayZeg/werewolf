"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { CrownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerFrom({
  session,
  game,
}: {
  session: { id: string; username: string };
  game: Game;
}) {
  const [players, setPlayers] = useState<User[]>(game.players);
  const [roles, setRoles] = useState<string[]>(game.roles);
  const router = useRouter();

  function leaveGame() {
    axios
      .patch(`/api/user/${session.id}`, { gameId: null })
      .then(() => {
        supabase.channel(game.id).send({
          type: "broadcast",
          event: "refreshGameData",
        });
      })
      // .catch((error) => console.log(error))
      .finally(() => router.push("/"));
  }

  useEffect(() => {}, []);

  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="flex h-fit min-h-[500px]">
        <section className="bg-white p-5 rounded-l-2xl w-[500px]">
          <h1 className="text-2xl font-bold ">Roles List:</h1>
          <ul>
            {game.roles.length === 0 ? (
              <p>No roles yet.</p>
            ) : (
              roles.map((role, index) => (
                <li key={index} className="text-nowrap">
                  <p>- {role}</p>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="text-white bg-zinc-800 p-5 rounded-r-2xl w-[250px]">
          <h1 className="text-2xl font-bold">Player list:</h1>
          <ul className="mb-2">
            {players.map((player) => (
              <li key={player.id} className="text-nowrap">
                {player.id === game.ownerId ? (
                  <p className="flex items-center gap-2 text-yellow-300">
                    - {player.username} <CrownIcon />
                  </p>
                ) : (
                  <p>- {player.username}</p>
                )}
              </li>
            ))}
          </ul>
          <Button variant={"destructive"} onClick={leaveGame}>
            Leave Game
          </Button>
        </section>
      </div>
    </main>
  );
}
