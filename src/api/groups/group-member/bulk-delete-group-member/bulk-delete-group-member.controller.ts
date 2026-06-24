import { Context } from "hono";
import { bulkDeleteGroupMembersByIds } from "../groups-member.service.js";
import { BulkDeleteGroupMembersSchema } from "../groups-member.model.js";
import { ZodError } from "zod";

export async function bulkDeleteGroupMembersController(c: Context) {
  try {
    const { group_id } = c.req.param();
    const body = BulkDeleteGroupMembersSchema.parse(await c.req.json());
    const deletedCount = await bulkDeleteGroupMembersByIds(group_id, body.ids);

    if (deletedCount === 0) {
      return c.json({ error: 'No group members were deleted' }, 404);
    }

    return c.json({ message: 'Group members deleted successfully', deletedCount }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete group members';
    return c.json({ error: errorMessage }, 500);
  }
}
