import { Context } from "hono";
import { getAttendanceById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function getAttendanceController(c: Context) {
  try {
    const { attendances_id, id } = c.req.param();
    if (!attendances_id || !id) {
      return c.json({ error: "attendances_id and id are required" }, 400);
    }
    const attendance = await getAttendanceById(attendances_id, id);
    if (!attendance) {
      return c.json({ error: 'Attendance not found' }, 404);
    }
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance';
    return c.json({ error: errorMessage }, 500);
  }
}