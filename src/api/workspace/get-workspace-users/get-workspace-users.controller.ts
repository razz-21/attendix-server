import { Context } from "hono";
import { getWorkspaceUsers } from "../workspace.service.js";

export async function getWorkspaceUsersController(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }
    const users = await getWorkspaceUsers(id);
    return c.json(users);
  } catch (error) {
    return c.json({ error: 'Failed to get workspace users' }, 500);
  }
}