import { Context } from "hono";
import { deleteGroupById } from "../groups.service.js";
import { ZodError } from "zod";

export async function deleteGroup(c: Context) {
  try {
    const { id } = c.req.param();
    const result = await deleteGroupById(id);
    if (!result) {
      return c.json({ error: 'Group not found' }, 404);
    }
    return c.json({ message: 'Group deleted successfully' }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete group';
    return c.json({ error: errorMessage }, 500);
  }
}