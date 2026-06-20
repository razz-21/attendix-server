import { Context } from "hono";
import { bulkDeleteAttendanceRecordsByAttendanceId, deleteAttendanceById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function deleteAttendanceController(c: Context) {
  try {
    const { attendances_id, id } = c.req.param();
    if (!attendances_id || !id) {
      return c.json({ error: "attendance_id and id are required" }, 400);
    }
    const result = await deleteAttendanceById(attendances_id, id);
    if (!result) {
      return c.json({ error: 'Attendance not found' }, 404);
    }

    if (result) {
      await bulkDeleteAttendanceRecordsByAttendanceId(id);
    }

    return c.json({ message: 'Attendance deleted successfully' }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendance';
    return c.json({ error: errorMessage }, 500);
  }
}