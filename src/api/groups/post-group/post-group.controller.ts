import { Context } from "hono";
import { PostGroup, PostGroupSchema } from "../groups.model.js";
import { createGroup } from "../groups.service.js";
import { ZodError } from "zod";

export async function postGroup(c: Context) {
  try {
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