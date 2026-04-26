import { Context } from "hono";
import { getWorkspaceById } from "../workspace.service";

export async function getWorkspace(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Workspace ID is required' }, 400);
    }
    
    const workspace = await getWorkspaceById(id);

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }
    return c.json(workspace);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get workspace';
    return c.json({ error: errorMessage }, 500);
  }
}