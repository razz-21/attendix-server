import { Context } from "hono";
import { GetUser } from "../users/users.model";
import { PatchMePassword, PatchMePasswordSchema } from "./me.model";
import { ZodError } from "zod";
import { hash } from 'bcrypt-ts';
import { getMePassword, isMePasswordValid, updateMePassword } from "./me.service";

export async function getMe(c: Context) {
  try {
    const user = c.get("user");
    return c.json(user, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to current user';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function patchMePassword(c: Context) {
  try {
    const user = c.get("user") as GetUser;
    const id = user.id;
    const payload = PatchMePasswordSchema.parse(await c.req.json<PatchMePassword>());

    if (payload.new_password !== payload.confirm_new_password) {
      return c.json({ error: 'New password and confirm new password do not match' }, 400);
    }
    
    const userPassword = await getMePassword(id);

    const isPasswordValid = await isMePasswordValid(payload.current_password, userPassword);
    if (!isPasswordValid) {
      return c.json({ error: 'Curernt password is invalid' }, 400);
    }

    const hashedNewPassword = await hash(payload.new_password, 12);

    const result = await updateMePassword(id, hashedNewPassword);
    if (!result) {
      return c.json({ error: 'Failed to update password' }, 500);
    }

    return c.json({ success: true, message: 'Password updated successfully' }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
    return c.json({ error: errorMessage }, 500);
  }
}