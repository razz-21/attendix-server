import { Context } from "hono";
import { deleteUserById } from "../users.services";

export async function deleteUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    const result = await deleteUserById(id);
    return c.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
    return c.json({ error: errorMessage }, 500);
  }
}