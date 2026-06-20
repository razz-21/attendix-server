import { Context } from "hono";
import { searchAttendances } from "../dashboard.service.js";
import { User } from "../../users/users.model.js";

export async function searchAttendancesController(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }

    const { q } = c.req.query();
    if (!q) return c.json([], 200);
    const results = await searchAttendances(q, user);
    return c.json(results, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search attendances';
    return c.json({ error: errorMessage }, 500);
  }
}