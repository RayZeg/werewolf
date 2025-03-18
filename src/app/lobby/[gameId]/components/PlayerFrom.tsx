"use client";

import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
import axios from "axios";
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
    <div className="text-white">
      {players.map((player) => (
        <p key={player.id}>{player.username}</p>
      ))}
      <Button
        onClick={() => {
          console.log("emitting message");
          socket.emit("privateMessage", game.id);
        }}
      >
        send
      </Button>
      <Button variant={"destructive"} onClick={leaveGame}>
        Leave Game
      </Button>
    </div>
  );
}
