"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, RotateCw } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { signup, verifySession } from "../auth-action";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface User {
  username: string;
  password: string;
}

const defaultUser: User = {
  username: "",
  password: "",
};

function page() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [user, setUser] = useState<User>(defaultUser);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className="flex items-center justify-center h-dvh">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Werewolf.io
          </CardTitle>
          <CardDescription>Sign Up</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="JohnDoe"
                  value={user.username}
                  onChange={handleChange}
                />
              </div>
              {state?.errors?.username && (
                <p className="text-sm text-red-500">{state.errors.username}</p>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className=""
                    placeholder="password"
                    type={showPassword ? "text" : "password"}
                  />
                  {showPassword ? (
                    <Eye
                      className="w-4 h-4 mr-2 absolute top-0 right-0 mt-3 bg-transparent z-10"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeOff
                      className="w-4 h-4 mr-2 absolute top-0 right-0 mt-3 bg-transparent z-10"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {state?.errors?.password && (
                  <div className="text-sm text-red-500">
                    <p>Password must:</p>
                    <ul>
                      {state.errors.password.map((error) => (
                        <li key={error}>- {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="flex-1 w-full mt-3"
              //   onClick={handleSignIn}
              disabled={pending}
              type="submit"
            >
              {pending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm">
          Already have an account?{" "}
          <Link
            href={"/auth/signin"}
            className={`font-semibold hover:underline px-2`}
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page;
