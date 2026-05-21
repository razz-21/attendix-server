import { Context } from "hono";
import { PostGroup, PostGroupSchema } from "../groups.model.js";
import { createGroup } from "../groups.service.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function postGroup(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }
    const payload = PostGroupSchema.parse(await c.req.json<PostGroup>());
  
    const group = await createGroup(payload);
    return c.json(group, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create group';
    return c.json({ error: errorMessage }, 500);
  }
}