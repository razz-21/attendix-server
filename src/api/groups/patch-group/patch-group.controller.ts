import { Context } from "hono";
import { PatchGroup, PatchGroupSchema } from "../groups.model.js";
import { updateGroupById, getGroupById } from "../groups.service.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function patchGroup(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }
    const { id } = c.req.param();

    const groupToUpdate = await getGroupById(id);
    if (!groupToUpdate) {
      return c.json({ error: 'Group not found' }, 404);
    }

    const isCreator = groupToUpdate.created_by === user.id;
    const inWorkspace = groupToUpdate.workspace_id && groupToUpdate.workspace_id === user.workspace_id;
    if (!isCreator && !inWorkspace) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const payload = PatchGroupSchema.parse(await c.req.json<PatchGroup>());
    const group = await updateGroupById(id, payload);
    return c.json(group, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update group';
    return c.json({ error: errorMessage }, 500);
  }
}