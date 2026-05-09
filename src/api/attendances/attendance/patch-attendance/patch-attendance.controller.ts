import { Context } from "hono";
import { updateAttendanceRecordById } from "../attendance.service.js";
import { PatchAttendanceSchema } from "../attendance.model.js";
import { ZodError } from "zod";

export async function patchAttendanceRecordController(c: Context) {
  try {
    const { attendance_id, id } = c.req.param();
    if (!attendance_id || !id) {
      return c.json({ error: "attendance_id and id are required" }, 400);
    }
    const body = await c.req.json();

    // Validate end_time > start_time if both provided
    if (body.start_time && body.end_time) {
      const startTime = new Date(`1970-01-01 ${body.start_time}`);
      const endTime = new Date(`1970-01-01 ${body.end_time}`);
      if (endTime <= startTime) {
        return c.json({ error: 'end_time must be later than start_time' }, 400);
      }
    }

    const payload = PatchAttendanceSchema.parse(body);
    const attendance = await updateAttendanceRecordById(attendance_id, id, payload);
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}