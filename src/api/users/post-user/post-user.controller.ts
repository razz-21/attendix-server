import { Context } from "hono";
import { PostUser, PostUserSchema } from "../users.model.js";
import { createUser, isUserEmailExists, isUsernameExists } from "../users.services.js";
import { hash } from "bcrypt-ts";
import { ZodError } from "zod";

export async function postUser(c: Context) {
  try {
    const payload = PostUserSchema.parse(await c.req.json<PostUser>());

    if (await isUsernameExists(payload.username)) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (await isUserEmailExists(payload.email)) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const hashedPassword = await hash(payload.password, 12);
    
    const body = {
      ...payload,
      password: hashedPassword,
      ...(payload.id ? { id: payload.id } : { id: crypto.randomUUID() }),
    } satisfies PostUser;

    const result = await createUser(body);
    return c.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return c.json({ error: errorMessage }, 500);
  }
}