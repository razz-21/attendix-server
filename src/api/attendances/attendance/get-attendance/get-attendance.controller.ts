import { Context } from "hono";
import { getAttendanceRecordById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function getAttendanceRecordController(c: Context) {
  try {
    const { attendance_id, id } = c.req.param();
    const attendance = await getAttendanceRecordById(attendance_id, id);
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