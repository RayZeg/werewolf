"use client";

import { useEffect, useState } from "react";

function GameForm({ username, gameId }: { username: string; gameId: string }) {
  const [players, setPlayers] = useState<string[]>([username]);

  useEffect(() => {}, []);

  return (
    <div className="text-white">
      GameForm: {username}
      {players.map((player, index) => (
        <div key={index}>{player}</div>
      ))}
    </div>
  );
}

export default GameForm;
