import { Context } from "hono";
import { getUserById } from "../users.services.js";

export async function getUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
  
    const user = await getUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
  
    return c.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user by id';
    return c.json({ error: errorMessage }, 500);
  }
}