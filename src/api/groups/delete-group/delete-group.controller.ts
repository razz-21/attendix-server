import { Context } from "hono";
import { deleteGroupById, getGroupById } from "../groups.service.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function deleteGroup(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }
    const { id } = c.req.param();

    const group = await getGroupById(id);
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }

    const isCreator = group.created_by === user.id;
    const inWorkspace = group.workspace_id && group.workspace_id === user.workspace_id;
    if (!isCreator && !inWorkspace) {
      return c.json({ error: 'Forbidden' }, 403);
    }

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