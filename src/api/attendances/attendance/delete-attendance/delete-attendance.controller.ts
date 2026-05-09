import { Context } from "hono";
import { deleteAttendanceRecordById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function deleteAttendanceRecordController(c: Context) {
  try {
    const { attendances_id, id } = c.req.param();
    if (!attendances_id || !id) {
      return c.json({ error: "attendances_id and id are required" }, 400);
    }
    const result = await deleteAttendanceRecordById(attendances_id, id);
    if (!result) {
      return c.json({ error: 'Attendance record not found' }, 404);
    }
    return c.json({ message: 'Attendance record deleted successfully' }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}