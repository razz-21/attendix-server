import { Context } from "hono";
import { PostWorkspace, PostWorkspaceSchema } from "../workspace.model.js";
import { createWorkspace } from "../workspace.service.js";
import { ZodError } from "zod";

export async function postWorkspace(c: Context) {
  try {
    const payload = PostWorkspaceSchema.parse(await c.req.json<PostWorkspace>());
    const workspace = await createWorkspace(payload);
    return c.json(workspace, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create workspace';
    return c.json({ error: errorMessage }, 500);
  }
}