import { Context } from "hono";
import { canAccessAttendance, enrichAttendancesWithUsers, getAttendanceById } from "../attendance.service.js";
import { User } from "../../users/users.model.js";

export async function getAttendance(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }

    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const attendance = await getAttendanceById(id);

    if (!attendance) {
      return c.json({ error: 'Attendance not found' }, 404);
    }

    if (!canAccessAttendance(attendance, user.id)) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const enriched = await enrichAttendancesWithUsers([attendance], user);
    return c.json(enriched[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
