import { Context } from "hono";
import { getUsersService } from "../users.services.js";

export async function getUsers(c: Context) {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const q = c.req.query('q');
    const status = c.req.query('status');
    const role = c.req.query('role');

    if (isNaN(page) || isNaN(limit)) {
      return c.json({ error: 'Invalid page or limit' }, 400);
    }
  
    const users = await getUsersService(page, limit, q, status, role);
    return c.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get users';
    return c.json({ error: errorMessage }, 500);
  }
}