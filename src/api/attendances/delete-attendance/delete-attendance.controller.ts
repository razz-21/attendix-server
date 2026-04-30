import { Context } from "hono";
import { deleteAttendanceById } from "../attendance.service.js";

export async function deleteAttendance(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }
    const result = await deleteAttendanceById(id);
    return c.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
