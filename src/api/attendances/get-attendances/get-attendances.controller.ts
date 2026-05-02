import { Context } from "hono";
import { getAttendances as getAttendancesService } from "../attendance.service.js";
import { GetAttendancesQuerySchema } from "../attendance.model.js";
import { ZodError } from "zod";

export async function getAttendances(c: Context) {
  try {
    const params = GetAttendancesQuerySchema.parse(c.req.query());
    const attendances = await getAttendancesService(params);
    return c.json(attendances, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendances';
    return c.json({ error: errorMessage }, 500);
  }
}
