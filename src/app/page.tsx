import CreateGameButton from "@/components/CreateGameButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const games: Game[] = await db.game.findMany({
    include: { players: true, roles: true },
  });
  return (
    <>
      <div className="flex justify-between mr-[50px] py-2">
        <p className="text-3xl text-white">Werewolf.io</p>
        <CreateGameButton />
      </div>
      <Table>
        <TableCaption>Werewolf.io games.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ref</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Player Count</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-white">
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
                <TableCell className="text-right">
                  {game.players.length}
                </TableCell>
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
        </TableBody>
      </Table>
    </>
  );
}
