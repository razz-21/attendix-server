import { Context } from "hono";
import { createAttendance } from "../attendance.service.js";
import { PostAttendanceSchema } from "../attendance.model.js";
import { ZodError } from "zod";

export async function postAttendanceController(c: Context) {
  try {
    const { attendances_id } = c.req.param();
    if (!attendances_id) {
      return c.json({ error: "attendances_id is required" }, 400);
    }
    const body = await c.req.json();

    const payload = PostAttendanceSchema.parse({ ...body, attendances_id });
    const record = await createAttendance(payload);
    return c.json(record, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create attendance';
    return c.json({ error: errorMessage }, 500);
  }
}