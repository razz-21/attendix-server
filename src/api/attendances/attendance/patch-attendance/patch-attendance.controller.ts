import { Context } from "hono";
import { updateAttendanceById } from "../attendance.service.js";
import { PatchAttendanceSchema } from "../attendance.model.js";
import { ZodError } from "zod";

export async function patchAttendanceController(c: Context) {
  try {
    const { attendances_id, id } = c.req.param();
    if (!attendances_id || !id) {
      return c.json({ error: "attendances_id and id are required" }, 400);
    }
    const body = await c.req.json();

    const payload = PatchAttendanceSchema.parse(body);
    const attendance = await updateAttendanceById(attendances_id, id, payload);
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}