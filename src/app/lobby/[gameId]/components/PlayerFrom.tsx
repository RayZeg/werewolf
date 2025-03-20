"use client";

import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
import axios from "axios";
import { CrownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
        socket.emit("fetchPlayers", game.id);
      })
      .catch((error) => console.log(error))
      .finally(() => router.push("/"));
  }

  useEffect(() => {
    socket.on("privateMessage", () => console.log("hello"));
    socket.on("ownerLeft", () => router.push("/"));
    socket.on("fetchPlayers", () =>
      axios
        .get(`/api/game/${game.id}`)
        .then((res) => {
          console.log(res);
          setRoles(res.data.roles);
          setPlayers(res.data.players);
        })
        .catch((error) => console.log(error))
    );
    socket.emit("fetchPlayers", game.id);
    return () => {
      socket.disconnect();
    };
  }, []);

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
