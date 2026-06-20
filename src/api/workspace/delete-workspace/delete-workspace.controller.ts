import { Context } from "hono";
import { deleteWorkspaceById } from "../workspace.service.js";

export async function deleteWorkspace(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }
    const result = await deleteWorkspaceById(id);
    return c.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete workspace';
    return c.json({ error: errorMessage }, 500);
  }
}