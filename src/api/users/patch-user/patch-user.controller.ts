import { Context } from "hono";
import { PatchUser, PatchUserSchema } from "../users.model.js";
import { isUserEmailExists, isUsernameExists, updateUser } from "../users.services.js";
import { ZodError } from "zod";



export async function patchUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    
    const payload = PatchUserSchema.parse(await c.req.json<PatchUser>());

    if (payload.username && await isUsernameExists(payload.username)) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (payload.email && await isUserEmailExists(payload.email)) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const body = {
      ...payload,
      updated_at: new Date().toISOString(),
    };
    const result = await updateUser(id, body);
    return c.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    return c.json({ error: errorMessage }, 500);
  }
}