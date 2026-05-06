import { Context } from "hono";
import { getAttendanceRecords } from "../attendance-record.service.js";
import { GetAttendanceRecordsQuerySchema } from "../attendance-record.model.js";
import { ZodError } from "zod";

export async function getAttendanceRecordsController(c: Context) {
  try {
    const { attendance_id } = c.req.param();
    const params = GetAttendanceRecordsQuerySchema.parse(c.req.query());
    const records = await getAttendanceRecords(attendance_id, params);
    return c.json(records, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get attendance records';
    return c.json({ error: errorMessage }, 500);
  }
}