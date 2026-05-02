import { Context } from "hono";
import { PatchAttendance, PatchAttendanceSchema } from "../attendance.model.js";
import { updateAttendanceById } from "../attendance.service.js";
import { ZodError } from "zod";

export async function patchAttendance(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const payload = PatchAttendanceSchema.parse(await c.req.json<PatchAttendance>());
    const attendance = await updateAttendanceById(id, payload);

    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
