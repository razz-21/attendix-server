import { PostUser } from "../../users/users.model.js";
import { PostRequestAccount, PostRequestAccountSchema } from "../auth.model.js";
import { Context } from "hono";
import { createUser } from "../../users/users.services.js";
import { ZodError } from "zod";

export async function postRequestAccountController(c: Context) {
  try {
    const payload = PostRequestAccountSchema.parse(await c.req.json<PostRequestAccount>());
    const userPayload: PostUser = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rfid: '',
      role: 'user',
      status: 'needs_verification',
    };

    const user = await createUser(userPayload);
    return c.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return c.json({ error: errorMessage }, 500);
  }
}