import { Context } from "hono";
import { PatchUser, PatchUserSchema } from "../users.model.js";
import { isUserEmailExists, isUsernameExists, updateUser } from "../users.services.js";
import { getWorkspaceById } from "../../workspace/workspace.service.js";
import { ZodError } from "zod";
import { sendApprovalEmail } from "src/api/auth/email.service.js";

export async function patchUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    
    const payload = PatchUserSchema.parse(await c.req.json<PatchUser>());

    if (payload.username && await isUsernameExists(payload.username)) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (payload.email && await isUserEmailExists(payload.email)) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    if (payload.workspace_id != null) {
      const workspace = await getWorkspaceById(payload.workspace_id);
      if (!workspace) {
        return c.json({ message: 'Workspace not found or does not exist' }, 404);
      }
    }

    const body = {
      ...payload,
      updated_at: new Date().toISOString(),
    };
    const result = await updateUser(id, body);
    
    if (result && result.status === 'active') {
      await sendApprovalEmail(result.email, result);
    }
    return c.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    return c.json({ message: errorMessage }, 500);
  }
}