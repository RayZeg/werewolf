"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import rolesData from "@/data/Roles.json";

import { Separator } from "@/components/ui/separator";
import { socket } from "@/socket";
import axios from "axios";
import { CrownIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OwnerForm({
  session,
  game,
}: {
  session: { id: string; username: string };
  game: Game;
}) {
  const [roles, setRoles] = useState(game.roles);
  const [players, setPlayers] = useState<User[]>(game.players);
  const router = useRouter();

  function handleAddRole(role: string) {
    axios
      .patch(`/api/game/${game.id}`, {
        name: game.name,
        roles: [...roles, role],
      })
      .then(() => {
        setRoles([...roles, role]);
      })
      .catch((error) => console.log(error))
      .finally(() => socket.emit("refreshGameData", game.id));
  }

  function handleRemoveRole(targetIndex: number) {
    axios
      .patch(`/api/game/${game.id}`, {
        name: game.name,
        roles: roles.filter((r, index) => index !== targetIndex),
      })
      .then(() => {
        setRoles(roles.filter((r, index) => index !== targetIndex));
      })
      .catch((error) => console.log(error))
      .finally(() => socket.emit("refreshGameData", game.id));
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
  useEffect(() => {
    socket.on("refreshGameData", () =>
      axios
        .get(`/api/game/${game.id}`)
        .then((res) => {
          console.log(res);
          setPlayers(res.data.players);
        })
        .catch((error) => console.log(error))
    );
    socket.emit("refreshGameData", game.id);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex justify-center items-center h-dvh">
      <div className="flex h-fit min-h-[500px]">
        <section className="bg-white p-5 rounded-l-2xl w-[500px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold ">Roles List:</h1>
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "default" })}>
                Add role
              </SheetTrigger>
              <SheetContent className="overflow-scroll">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">
                    Roles list:
                  </SheetTitle>
                </SheetHeader>
                <div className="mx-5">
                  <p className="font-semibold">Villager roles</p>
                  <Separator />
                  <ul className="flex flex-col gap-2 my-2">
                    {[
                      ...rolesData.Villagers.filter(
                        (r) => r.name !== "Villager"
                      ),
                    ].map((role, index) => (
                      <li key={index}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              disabled={
                                roles.find((r) => r === role.name)
                                  ? true
                                  : false
                              }
                              onClick={() => handleAddRole(role.name)}
                              className="disabled:text-black disabled:cursor-not-allowed disabled:bg-red-400 bg-gray-200 w-full text-left p-2 rounded-lg hover:bg-gray-300 transition transform duration-200 ease-in-out cursor-pointer"
                            >
                              {role.name}
                            </TooltipTrigger>
                            <TooltipContent className="w-52">
                              <p className="font-semibold">The {role.name} :</p>
                              <p>{role.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold">Werewolves</p>
                  <Separator />
                  <ul className="flex flex-col gap-2 my-2">
                    {rolesData.Werewolves.map((role, index) => (
                      <li key={index}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              disabled={
                                roles.find((r) => r === role.name)
                                  ? role.name === "Werewolf" &&
                                    roles.filter((r) => r === role.name)
                                      .length <= 2
                                    ? false
                                    : true
                                  : false
                              }
                              onClick={() => handleAddRole(role.name)}
                              className="disabled:text-black disabled:cursor-not-allowed disabled:bg-red-400 bg-gray-200 w-full text-left p-2 rounded-lg hover:bg-gray-300 transition transform duration-200 ease-in-out cursor-pointer"
                            >
                              {role.name}
                            </TooltipTrigger>
                            <TooltipContent className="w-52">
                              <p className="font-semibold">The {role.name} :</p>
                              <p>{role.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold">Special Roles</p>
                  <Separator />
                  <ul className="flex flex-col gap-2 my-2">
                    {rolesData["Special Roles"].map((role, index) => (
                      <li key={index}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              disabled={
                                roles.find((r) => r === role.name)
                                  ? true
                                  : false
                              }
                              onClick={() => handleAddRole(role.name)}
                              className="disabled:text-black disabled:cursor-not-allowed disabled:bg-red-400 bg-gray-200 w-full text-left p-2 rounded-lg hover:bg-gray-300 transition transform duration-200 ease-in-out cursor-pointer"
                            >
                              {role.name}
                            </TooltipTrigger>
                            <TooltipContent className="w-52">
                              <p className="font-semibold">The {role.name} :</p>
                              <p>{role.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <ul className="flex flex-col gap-2 my-2">
            {roles.length === 0 ? (
              <p>No roles yet.</p>
            ) : (
              roles.map((role, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-nowrap disabled:text-black disabled:cursor-not-allowed disabled:bg-red-400 bg-gray-200 w-full text-left p-2 rounded-lg hover:bg-gray-300 transition transform duration-200 ease-in-out cursor-pointer"
                >
                  <p>- {role}</p>
                  <Button
                    variant={"destructive"}
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
            <Button variant={"destructive"} className="" onClick={leaveGame}>
              Leave Game
            </Button>
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
        </section>
      </div>
    </main>
  );
}
