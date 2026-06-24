import { Context } from "hono";
import { bulkDeleteAttendancesByIds } from "../attendance.service.js";
import { BulkDeleteAttendancesSchema } from "../attendance.model.js";
import { User } from "../../users/users.model.js";
import { ZodError } from "zod";

export async function bulkDeleteAttendancesController(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user?.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }

    const body = BulkDeleteAttendancesSchema.parse(await c.req.json());
    const deletedCount = await bulkDeleteAttendancesByIds(body.ids, user.id);

    if (deletedCount === 0) {
      return c.json({ error: 'No attendances were deleted' }, 404);
    }

    return c.json({ message: 'Attendances deleted successfully', deletedCount }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendances';
    return c.json({ error: errorMessage }, 500);
  }
}
