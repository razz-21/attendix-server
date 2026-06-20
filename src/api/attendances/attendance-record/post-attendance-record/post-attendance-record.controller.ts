import { Context } from "hono";
import { ZodError } from "zod";
import { createAttendanceRecord } from "../attendance-record.service.js";
import { PostAttendanceRecordSchema } from "../attendance-record.model.js";

export const postAttendanceRecordController = async (c: Context) => {
  try {
    const { attendances_id } = c.req.param();
    if (!attendances_id) {
      return c.json({ error: 'Attendances ID is required' }, 400);
    }

    const body = await c.req.json();
    const payload = PostAttendanceRecordSchema.parse({ ...body });
    const record = await createAttendanceRecord(payload);
    return c.json(record, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    return c.json({ error: 'Failed to create attendance record' }, 500);
  }
}