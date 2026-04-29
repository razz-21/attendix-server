import { Context } from "hono";
import { PatchGroup, PatchGroupSchema } from "../groups.model.js";
import { updateGroupById } from "../groups.service.js";
import { ZodError } from "zod";

export async function patchGroup(c: Context) {
  try {
    const { id } = c.req.param();
    const payload = PatchGroupSchema.parse(await c.req.json<PatchGroup>());
    const group = await updateGroupById(id, payload);
    return c.json(group, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update group';
    return c.json({ error: errorMessage }, 500);
  }
}