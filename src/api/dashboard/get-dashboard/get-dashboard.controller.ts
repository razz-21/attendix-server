import { Context } from "hono";
import { getDashboardData } from "../dashboard.service.js";

export async function getDashboardController(c: Context) {
  try {
    const data = await getDashboardData();
    return c.json(data, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get dashboard data';
    return c.json({ error: errorMessage }, 500);
  }
}