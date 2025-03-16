import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "./definitions";
import { redirect } from "next/navigation";

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as "lax",
    path: "/",
  },
  maxAge: 24 * 60 * 60 * 1000,
};

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function createSession(userId: string, username: string) {
  const expires = new Date(Date.now() + cookie.maxAge);
  const session = await encrypt({ userId, username, expires });

  (await cookies()).set(cookie.name, session, {
    ...cookie.options,
    expires,
  });

  redirect("/");
}

export async function getSession() {
  const cookie = await (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return {
    id: session?.userId as string,
    username: session?.username as string,
  };
}

export async function deleteSession() {
  (await cookies()).delete("session");
  redirect("/auth/signin");
}
