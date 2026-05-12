import { Context } from "hono";
import { ZodError } from "zod";
import { PatchAttendanceRecordSchema } from "../attendance-record.model.js";
import { updateAttendanceRecord } from "../attendance-record.service.js";

export const patchAttendanceRecordController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    if (!id) {
      return c.json({ error: 'ID is required' }, 400);
    }

    const body = await c.req.json();

    if (body.status === 'excused') {
      if (!body.reason_type) {
        return c.json({ error: 'Reason type is required for excused status' }, 400);
      }
      if (!body.reason) {
        return c.json({ error: 'Reason is required for excused status' }, 400);
      }
    }
    
    const payload = PatchAttendanceRecordSchema.parse({ ...body });
    const record = await updateAttendanceRecord(id, payload);
    return c.json(record, 200); 
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update attendance record' }, 500);
  }
}