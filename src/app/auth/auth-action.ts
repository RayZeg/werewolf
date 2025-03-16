"use server";

import { db } from "@/lib/db";
import { FormState, SignupFormSchema } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";

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
