import { Context } from "hono";
import { deleteGroupMemberById } from "../groups-member.service.js";
import { ZodError } from "zod";

export async function deleteGroupMemberController(c: Context) {
  try {
    const { group_id, id } = c.req.param();
    const result = await deleteGroupMemberById(group_id, id);
    if (!result) return c.json({ error: 'Group member not found' }, 404);
    return c.json({ message: 'Group member deleted successfully' }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete group member';
    return c.json({ error: errorMessage }, 500);
  }
}