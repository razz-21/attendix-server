import { Context } from "hono";
import { PatchWorkspace, PatchWorkspaceSchema } from "../workspace.model.js";
import { updateWorkspaceById } from "../workspace.service.js";
import { ZodError } from "zod";

export async function patchWorkspace(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }
    
    const payload = PatchWorkspaceSchema.parse(await c.req.json<PatchWorkspace>());
    const workspace = await updateWorkspaceById(id, payload);

    return c.json(workspace, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update workspace';
    return c.json({ error: errorMessage }, 500);
  }
}