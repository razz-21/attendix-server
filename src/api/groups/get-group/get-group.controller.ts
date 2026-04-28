import { Context } from "hono";
import { getGroupById } from "../groups.service.js";
import { ZodError } from "zod";

export async function getGroup(c: Context) {
  try {
    const { id } = c.req.param();
    const group = await getGroupById(id);
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }
    return c.json(group, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get group';
    return c.json({ error: errorMessage }, 500);
  }
}