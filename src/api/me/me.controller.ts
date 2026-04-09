import { Context } from "hono";

export async function getMe(c: Context) {
  try {
    const user = c.get("user");
    return c.json(user, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to current user';
    return c.json({ error: errorMessage }, 500);
  }
}