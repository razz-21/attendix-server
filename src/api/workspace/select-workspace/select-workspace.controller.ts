import { Context } from "hono";
import { selectWorkspace } from "../workspace.service.js";

export async function selectWorkspaceController(c: Context) {
  try {
    const user = c.get('user');
    const { workspace_id } = await c.req.json();
    await selectWorkspace(user.id, workspace_id);
    return c.json({ message: 'Workspace selected successfully' }, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to select workspace';
    return c.json({ error: errorMessage }, 500);
  }
}