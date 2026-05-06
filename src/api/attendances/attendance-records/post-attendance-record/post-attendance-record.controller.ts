import { Context } from "hono";
import { createAttendanceRecord } from "../attendance-record.service.js";
import { PostAttendanceRecordSchema } from "../attendance-record.model.js";
import { ZodError } from "zod";

export async function postAttendanceRecordController(c: Context) {
  try {
    const { attendance_id } = c.req.param();
    const body = await c.req.json();

    // Validate end_time > start_time
    const startTime = new Date(`1970-01-01 ${body.start_time}`);
    const endTime = new Date(`1970-01-01 ${body.end_time}`);
    if (endTime <= startTime) {
      return c.json({ error: 'end_time must be later than start_time' }, 400);
    }

    const payload = PostAttendanceRecordSchema.parse({ ...body, attendance_id });
    const record = await createAttendanceRecord(payload);
    return c.json(record, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create attendance record';
    return c.json({ error: errorMessage }, 500);
  }
}