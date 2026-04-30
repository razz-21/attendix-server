import { Context } from "hono";
import { getAttendanceById } from "../attendance.service.js";

export async function getAttendance(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const attendance = await getAttendanceById(id);

    if (!attendance) {
      return c.json({ error: 'Attendance not found' }, 404);
    }
    return c.json(attendance);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
