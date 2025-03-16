"use client";

import { createGame } from "@/app/action";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { startTransition, Suspense, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function GamesList({ games }: { games: Game[] }) {
  const [state, action, pending] = useActionState(createGame, undefined);

  useEffect(() => {
    if (state?.error) {
      console.log(state.error);
      toast.error(`An error occurred while creating the game: ${state.error}`);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 5000);
    }
  }, [state?.error]);

  return (
    <>
      <div className="flex justify-between mr-[50px] py-2">
        <p className="text-3xl text-white">Werewolf.io</p>
        <Button
          onClick={() => startTransition(action)}
          className={buttonVariants({ variant: "secondary" })}
        >
          {pending ? "Creating..." : "Create a Game"}
        </Button>
      </div>
      <Table>
        <TableCaption>Werewolf.io games.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ref</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[200px]">Owner</TableHead>
            <TableHead className="w-[100px]">Player Count</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-white">
          <Suspense fallback={<div>Loading...</div>}>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No games found
                </TableCell>
              </TableRow>
            ) : (
              games.map((game, index) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>{game.owner.username}</TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="flex justify-center">
                    <Link
                      href={`/lobby/${game.id}`}
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      Join
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Suspense>
        </TableBody>
      </Table>
    </>
  );
}
