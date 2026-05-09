import { Context } from "hono";
import { getAttendance } from "../attendance.service.js";
import { GetAttendancesQuerySchema } from "../attendance.model.js";
import { ZodError } from "zod";

export async function getAttendancesController(c: Context) {
  try {
    const { attendance_id } = c.req.param();
    if (!attendance_id) {
      return c.json({ error: "attendances_id is required" }, 400);
    }
    const params = GetAttendancesQuerySchema.parse(c.req.query());
    const attendance = await getAttendance(attendance_id, params);
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance records';
    return c.json({ error: errorMessage }, 500);
  }
}