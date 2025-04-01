"use client";

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
import { buttonVariants } from "@/components/ui/button";
export default function AddRoleButton({
  roles,
  addFunction,
}: {
  roles: string[];
  addFunction: (role: string) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "default" })}>
        Add role
      </SheetTrigger>
      <SheetContent className="overflow-scroll">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Roles list:</SheetTitle>
        </SheetHeader>
        <div className="mx-5">
          <p className="font-semibold">Villager roles</p>
          <Separator />
          <ul className="flex flex-col gap-2 my-2">
            {[...rolesData.Villagers.filter((r) => r.name !== "Villager")].map(
              (role, index) => (
                <li key={index}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        disabled={
                          roles.find((r) => r === role.name) ? true : false
                        }
                        onClick={() => addFunction(role.name)}
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
              )
            )}
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
                            roles.filter((r) => r === role.name).length <= 2
                            ? false
                            : true
                          : false
                      }
                      onClick={() => addFunction(role.name)}
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
                        roles.find((r) => r === role.name) ? true : false
                      }
                      onClick={() => addFunction(role.name)}
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
  );
}
