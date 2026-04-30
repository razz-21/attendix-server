import { Context } from "hono";
import { isUsernameExists } from "../users.services";


export async function usernameExist(c: Context) {
  try {
    const username = c.req.param('username');
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }
    const result = await isUsernameExists(username);
    return c.json({
      exists: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check if username exists';
    return c.json({ error: errorMessage }, 500);
  }
}
