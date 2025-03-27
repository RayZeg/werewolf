"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
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
  const myChannel = supabase.channel(game.id);
  const [players, setPlayers] = useState<User[]>(game.players);
  const [roles, setRoles] = useState<string[]>(game.roles);
  const router = useRouter();

  // function leaveGame() {
  //   axios
  //     .patch(`/api/user/${session.id}`, { gameId: null })
  //     .then(() => {
  //       myChannel.send({
  //         type: "broadcast",
  //         event: "refreshGameData",
  //       });
  //     })
  //     .catch((error) => console.log(error))
  //     .finally(() => router.push("/"));
  // }

  useEffect(() => {
    myChannel
      .on("presence", { event: "sync" }, () => {
        const newState = myChannel.presenceState();
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe();

    myChannel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      const presenceTrackStatus = await myChannel.track(session);
      console.log(presenceTrackStatus);
    });

    // myChannel
    //   .on("broadcast", { event: "ownerLeft" }, () => router.push("/"))
    //   .subscribe();

    // myChannel
    //   .on("broadcast", { event: "refreshGameData" }, () =>
    //     axios
    //       .get(`/api/game/${game.id}`)
    //       .then((res) => {
    //         setPlayers(res.data.players);
    //         setRoles(res.data.roles);
    //       })
    //       .catch((error) => console.log(error))
    //   )
    //   .subscribe();
    return () => {
      myChannel.unsubscribe();
    };
  }, [session.id]);

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
          <Button
            variant={"destructive"}
            // onClick={leaveGame}
          >
            Leave Game
          </Button>
        </section>
      </div>
    </main>
  );
}
