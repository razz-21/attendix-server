import { Context } from "hono";
import { deleteAttendanceById, getAttendanceById } from "../attendance.service.js";
import { User } from "../../users/users.model.js";

export async function deleteAttendance(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }

    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const attendanceToUpdate = await getAttendanceById(id);
    if (!attendanceToUpdate) {
      return c.json({ error: 'Attendance not found' }, 404);
    }

    const isCreator = attendanceToUpdate.created_by === user.id;
    if (!isCreator) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const result = await deleteAttendanceById(id);
    return c.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
