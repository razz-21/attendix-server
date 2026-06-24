import { Context } from "hono";
import { bulkDeleteAttendeesByIds } from "../attendees.service.js";
import { BulkDeleteAttendeesSchema } from "../attendees.model.js";
import { ZodError } from "zod";

export async function bulkDeleteAttendeesController(c: Context) {
  try {
    const { attendances_id } = c.req.param();
    const body = BulkDeleteAttendeesSchema.parse(await c.req.json());
    const deletedCount = await bulkDeleteAttendeesByIds(attendances_id, body.ids);

    if (deletedCount === 0) {
      return c.json({ error: 'No attendees were deleted' }, 404);
    }

    return c.json({ message: 'Attendees deleted successfully', deletedCount }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendees';
    return c.json({ error: errorMessage }, 500);
  }
}
