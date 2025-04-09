"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CrownIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddRoleButton from "./AddRoleButton";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

export default function OwnerForm({ game }: { game: Game }) {
  const router = useRouter();
  const [roles, setRoles] = useState(game.roles);
  const [players, setPlayers] = useState<User[]>(game.players);

  function handleAddRole(role: string) {
    axios
      .patch(`/api/game/${game.id}`, {
        name: game.name,
        roles: [...roles, role],
      })
      .then(() => {
        setRoles([...roles, role]);
        socket.emit("refreshData", game.id);
      })
      .catch((error) => console.log(error));
  }

  function handleRemoveRole(targetIndex: number) {
    axios
      .patch(`/api/game/${game.id}`, {
        name: game.name,
        roles: roles.filter((r, index) => index !== targetIndex),
      })
      .then(() => {
        setRoles(roles.filter((r, index) => index !== targetIndex));
        socket.emit("refreshData", game.id);
      })
      .catch((error) => console.log(error));
  }

  function leaveGame() {
    axios
      .delete(`/api/game/${game.id}`)
      .then(() => {
        socket.emit("ownerLeft", game.id);
      })
      .catch((error) => console.log(error))
      .finally(() => router.push("/"));
  }

  async function refreshData() {
    try {
      const { data }: { data: Game } = await axios.get(`/api/game/${game.id}`);
      setPlayers(
        data.players.sort((a, b) => a.username.localeCompare(b.username))
      );
    } catch (error) {
      toast.error("An error occurred while refreshing the data: " + error);
    }
  }

  function startGame() {
    axios
      .post(`/api/game/${game.id}/start`, { gameId: game.id })
      .then(() => {
        socket.emit("startGame", { gameId: game.id, players });
      })
      .catch((error) => console.log(error))
      .finally(() => router.push("/game/" + game.id));
  }

  function kickPlayer(player: User) {
    axios
      .patch(`/api/user/${player.id}`, { ...player, gameId: null })
      .then(() => {
        socket.emit("kickPlayer", { gameId: game.id, playerId: player.id });
      });
  }

  useEffect(() => {
    socket.on("refreshData", refreshData).emit("joinGame", game.id);
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="flex h-[500px]">
        <section className="bg-white p-5 rounded-l-2xl w-[500px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold ">Roles List:</h1>
            <AddRoleButton roles={roles} addFunction={handleAddRole} />
          </div>
          <ul className="flex flex-col gap-2 my-2 ">
            {roles.length === 0 ? (
              <p>No roles yet.</p>
            ) : (
              roles.map((role, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-nowrap disabled:text-black disabled:cursor-not-allowed disabled:bg-red-400 bg-gray-200 w-full text-left p-2 rounded-lg hover:bg-gray-300 transition transform duration-200 ease-in-out cursor-default"
                >
                  <p>{role}</p>
                  <Button
                    variant={"destructive"}
                    className="cursor-pointer"
                    onClick={() => handleRemoveRole(index)}
                  >
                    <X />
                  </Button>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="text-white bg-zinc-800 p-5 rounded-r-2xl w-[300px]">
          <div className="flex justify-between items-center text-nowrap">
            <h1 className="text-2xl font-bold">Player list:</h1>
          </div>
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
          <div className="flex justify-evenly">
            <Button onClick={startGame}>Start Game</Button>
            <Button variant={"destructive"} onClick={leaveGame}>
              Leave Game
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
