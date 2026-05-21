import { Context } from "hono";
import { searchAttendances } from "../dashboard.service.js";

export async function searchAttendancesController(c: Context) {
  try {
    const { q } = c.req.query();
    if (!q) return c.json([], 200);
    const results = await searchAttendances(q);
    return c.json(results, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search attendances';
    return c.json({ error: errorMessage }, 500);
  }
}