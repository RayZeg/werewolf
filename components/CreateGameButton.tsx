"use client";

import { createGame } from "@/app/action";
import { Button, buttonVariants } from "@/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateGameButton() {
  const [state, action, pending] = useActionState(createGame, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(`An error occurred while creating the game: ${state.error}`);
    }
  }, [state?.error]);

  return (
    <Button
      onClick={() => startTransition(action)}
      className={buttonVariants({ variant: "secondary" })}
    >
      {pending ? "Creating..." : "Create a Game"}
    </Button>
  );
}
