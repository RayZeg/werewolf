"use server";

import { db } from "@/lib/db";
import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from "@/lib/definitions";
import { createSession, decrypt, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      errors: {
        username: ["Username already exists."],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  await createSession(user.id, user.username);
}

export async function signin(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      errors: {
        username: ["Username does not exists."],
      },
    };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return {
      errors: {
        password: ["Incorrect password."],
      },
    };
  }

  await createSession(user.id, user.username);
}

export async function signout() {
  await deleteSession();
}

export async function verifySession() {
  const cookie = await (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return {
    id: session?.userId as string,
    username: session?.username as string,
  };
}
