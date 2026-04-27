import { Context } from "hono";
import { getWorkspaces as getWorkspacesService } from "../workspace.service.js";
import { GetPaginatedWorkspaceParamsSchema } from "../workspace.model.js";
import { ZodError } from "zod";

export async function getWorkspaces(c: Context) {
  try {
    const params = GetPaginatedWorkspaceParamsSchema.parse(c.req.query());
    const workspaces = await getWorkspacesService(params);
    return c.json(workspaces, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to get workspaces';
    return c.json({ error: errorMessage }, 500);
  }
}