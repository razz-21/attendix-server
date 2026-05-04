import { Context } from "hono";
import { createGroupMember } from "../groups-member.service.js";
import { PostGroupMemberSchema } from "../groups-member.model.js";
import { ZodError } from "zod";

export async function postGroupMemberController(c: Context) {
  try {
    const { group_id } = c.req.param();
    const body = await c.req.json();
    const payload = PostGroupMemberSchema.parse({ ...body, group_id });
    const now = new Date().toISOString();
    const member = await createGroupMember({
      ...payload,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    } as any);
    return c.json(member, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create group member';
    return c.json({ error: errorMessage }, 500);
  }
}