import { Context } from "hono";
import { updateGroupMemberById } from "../groups-member.service.js";
import { PatchGroupMemberSchema } from "../groups-member.model.js";
import { ZodError } from "zod";

export async function patchGroupMemberController(c: Context) {
  try {
    const { group_id, id } = c.req.param();
    const body = await c.req.json();
    const payload = PatchGroupMemberSchema.parse(body);
    const member = await updateGroupMemberById(group_id, id, payload);
    return c.json(member, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update group member';
    return c.json({ error: errorMessage }, 500);
  }
}