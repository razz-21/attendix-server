import { Context } from "hono";
import { importGroups } from "../groups.service.js";
import { PostGroupSchema } from "../groups.model.js";
import { ZodError } from "zod";

export async function importGroupsController(c: Context) {
  try {
    const body = await c.req.json<unknown[]>();
    if (!Array.isArray(body)) {
      return c.json({ error: 'Payload must be an array' }, 400);
    }

    const errors: { row: number; issues: unknown }[] = [];
    const validGroups = [];

    for (let i = 0; i < body.length; i++) {
      const result = PostGroupSchema.safeParse(body[i]);
      if (!result.success) {
        errors.push({ row: i + 1, issues: result.error.issues });
      } else {
        validGroups.push(result.data);
      }
    }

    if (errors.length > 0) {
      return c.json({ error: 'Some rows are invalid', errors }, 400);
    }

    const count = await importGroups(validGroups);
    return c.json({ message: `Successfully imported ${count} groups` }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to import groups';
    return c.json({ error: errorMessage }, 500);
  }
}