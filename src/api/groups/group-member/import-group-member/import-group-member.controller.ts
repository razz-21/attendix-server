import { Context } from "hono";
import { ImportGroupMemberSchema } from "../groups-member.model.js";
import { importGroupMembers } from "../groups-member.service.js";
import { ZodError } from "zod";

export async function importGroupMemberController(c: Context) {
  try {
    const body = await c.req.json();
    const payload = ImportGroupMemberSchema.parse(body);
    const member = await importGroupMembers(payload);
    return c.json(member, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to import group members';
    return c.json({ error: errorMessage }, 500);
  }
}