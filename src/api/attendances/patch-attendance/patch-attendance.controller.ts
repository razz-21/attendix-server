import { Context } from "hono";
import { PatchAttendance, PatchAttendanceSchema } from "../attendance.model.js";
import { enrichAttendancesWithUsers, updateAttendanceById, getAttendanceById, validateSharedWithUsersInWorkspace } from "../attendance.service.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function patchAttendance(c: Context) {
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

    const payload = PatchAttendanceSchema.parse(await c.req.json<PatchAttendance>());

    if (typeof payload.shared_with !== "undefined") {
      const isValid = await validateSharedWithUsersInWorkspace(payload.shared_with ?? [], user.workspace_id);
      if (!isValid) {
        return c.json({ error: "Invalid shared_with users" }, 400);
      }
    }

    const attendance = await updateAttendanceById(id, payload);

    const enriched = await enrichAttendancesWithUsers([attendance], user);
    return c.json(enriched[0], 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
