import { Context } from "hono";
import { getGroupMembers } from "../groups-member.service";
import { GetPaginatedGroupMemberParamsSchema } from "../groups-member.model";
import { ZodError } from "zod";

export async function getGroupMembersController(c: Context) {
  try {
    const { group_id } = c.req.param();
    const params = GetPaginatedGroupMemberParamsSchema.parse(c.req.query());
    const members = await getGroupMembers(group_id, params);
    return c.json(members, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get group members';
    return c.json({ error: errorMessage }, 500);
  }
}