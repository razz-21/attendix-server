import { Context } from "hono";
import { PostAttendance, PostAttendanceSchema } from "../attendance.model.js";
import { createAttendance } from "../attendance.service.js";
import { ZodError } from "zod";
import { User } from "../../users/users.model.js";

export async function postAttendance(c: Context) {
  try {
    const user = c.get('user') as User;
    if (!user || !user.id) {
      return c.json({ error: 'Unauthorized: missing user context' }, 401);
    }

    const payload = PostAttendanceSchema.parse(await c.req.json<PostAttendance>());

    const attendance = await createAttendance(payload);
    return c.json(attendance, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create attendance';
    return c.json({ error: errorMessage }, 500);
  }
}
