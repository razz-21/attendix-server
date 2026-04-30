import { Context } from "hono";
import { isUserEmailExists } from "../users.services";


export async function emailExists(c: Context) {
  try {
    const email = c.req.param('email');
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }
    const result = await isUserEmailExists(email);
    return c.json({
      exists: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check if email exists';
    return c.json({ error: errorMessage }, 500);
  }
}