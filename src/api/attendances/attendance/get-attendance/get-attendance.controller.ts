import { Context } from "hono";
import { getAttendanceRecordById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function getAttendanceRecordController(c: Context) {
  try {
    const { attendances_id, id } = c.req.param();
    if (!attendances_id || !id) {
      return c.json({ error: "attendance_id and id are required" }, 400);
    }
    const attendance = await getAttendanceRecordById(attendances_id, id);
    if (!attendance) {
      return c.json({ error: 'Attendance record not found' }, 404);
    }
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}