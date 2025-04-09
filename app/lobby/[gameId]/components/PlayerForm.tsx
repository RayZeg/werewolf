"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import axios from "axios";
import { CircleHelp, CrownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import rolesData from "@/data/Roles.json";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function PlayerForm({
  session,
  game,
}: {
  session: { id: string; username: string };
  game: Game;
}) {
  const router = useRouter();

  const [players, setPlayers] = useState<User[]>(
    game.players.sort((a, b) => a.username.localeCompare(b.username))
  );
  const [roles, setRoles] = useState<string[]>(game.roles);

  function leaveGame() {
    axios
      .patch(`/api/user/${session.id}`, { gameId: null })
      .then(() => {
        socket.emit("refreshData", game.id);
      })
      // .catch((error) => console.log(error))
      .finally(() => router.push("/"));
  }

  async function refreshData() {
    try {
      const { data }: { data: Game } = await axios.get(`/api/game/${game.id}`);
      console.log(data);
      setPlayers(
        data.players.sort((a, b) => a.username.localeCompare(b.username))
      );
      setRoles(data.roles);
    } catch (error) {
      toast.error("An error occurred while refreshing the data: " + error);
    }
  }

  useEffect(() => {
    socket
      .on("refreshData", refreshData)
      .on("ownerLeft", leaveGame)
      .on("startGame", () => router.push(`/game/${game.id}`))
      .on("kickPlayer", () => {
        socket.emit("refreshData", game.id);
        router.push(`/lobby/${game.id}`);
      })
      .emit("joinGame", game.id);
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="flex h-fit min-h-[500px]">
        <section className="bg-white p-5 rounded-l-2xl w-[500px]">
          <h1 className="text-2xl font-bold ">Roles List:</h1>
          <ul className="flex flex-col gap-2 my-2">
            {game.roles.length === 0 ? (
              <p>No roles yet.</p>
            ) : (
              roles.map((role, index) => (
                <li key={index} className="text-nowrap">
                  <Collapsible className="bg-gray-200 flex flex-col gap-2 w-full text-left p-2 rounded-lg">
                    <div className="flex justify-between items-center text-nowrap cursor-default">
                      <p>{role}</p>
                      <CollapsibleTrigger
                        className={buttonVariants({ variant: "default" })}
                      >
                        <CircleHelp />
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="text-wrap bg-zinc-800 rounded-sm p-2 text-white">
                      Description: <br />
                      {rolesData.Villagers.find((r) => r.name === role)
                        ?.description ||
                        rolesData.Werewolves.find((r) => r.name === role)
                          ?.description ||
                        rolesData["Special Roles"].find((r) => r.name === role)
                          ?.description ||
                        "No description yet."}
                    </CollapsibleContent>
                  </Collapsible>
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
          <div className="flex justify-center">
            <Button variant={"destructive"} onClick={leaveGame}>
              Leave Game
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
