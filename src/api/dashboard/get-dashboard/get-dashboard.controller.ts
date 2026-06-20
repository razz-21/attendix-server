import { Context } from "hono";
import { getDashboardData } from "../dashboard.service.js";
import { User } from "../../users/users.model.js";

export async function getDashboardController(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }
    const data = await getDashboardData(user);
    return c.json(data, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get dashboard data';
    return c.json({ error: errorMessage }, 500);
  }
}