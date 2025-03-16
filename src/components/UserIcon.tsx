"use client";

import { signout } from "@/app/auth/auth-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/session";
import { LogOut, User } from "lucide-react";

export default function UserIcon({
  session,
}: {
  session: { userId: string; username: string };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-0 right-0 m-2 bg-white rounded-full p-1 border-2 border-gray-200">
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={signout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
