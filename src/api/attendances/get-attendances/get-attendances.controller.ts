import { Context } from "hono";
import { enrichAttendancesWithUsers, getAttendances as getAttendancesService } from "../attendance.service.js";
import { GetAttendancesQuerySchema } from "../attendance.model.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function getAttendances(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }
    const params = GetAttendancesQuerySchema.parse(c.req.query());
    const attendances = await getAttendancesService(params, user);
    const enrichedAttendances = await enrichAttendancesWithUsers(attendances, user);
    return c.json(enrichedAttendances, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendances';
    return c.json({ error: errorMessage }, 500);
  }
}
