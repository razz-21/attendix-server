import { Context } from "hono";
import { getGroups as getGroupsService } from "../groups.service.js";
import { GetPaginatedGroupParamsSchema } from "../groups.model.js";
import { ZodError } from "zod";

export async function getGroups(c: Context) {
  try {
    const params = GetPaginatedGroupParamsSchema.parse(c.req.query());
    const groups = await getGroupsService(params);
    return c.json(groups, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get groups';
    return c.json({ error: errorMessage }, 500);
  }
}