import { Context } from "hono";
import { getAttendanceRecordById } from "../attendance-record.service.js";
import { ZodError } from "zod";

export async function getAttendanceRecordController(c: Context) {
  try {
    const { attendance_id, id } = c.req.param();
    const record = await getAttendanceRecordById(attendance_id, id);
    if (!record) {
      return c.json({ error: 'Attendance record not found' }, 404);
    }
    return c.json(record, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}