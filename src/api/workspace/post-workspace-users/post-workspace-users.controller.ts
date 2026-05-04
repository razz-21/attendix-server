import { GetUser } from "../../users/users.model.js";
import { Context } from "hono";
import { addWorkspaceUsers } from "../workspace.service";

export async function postWorkspaceUsersController(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }

    const payload = await c.req.json<{ users: GetUser[] }>();

    const users = await addWorkspaceUsers(id, payload.users);
    return c.json(users);
  } catch (error) {
    return c.json({ error: 'Failed to add workspace users' }, 500);
  }
}