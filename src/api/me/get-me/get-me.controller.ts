import { Context } from "hono";
import { getDb } from "../../../config/db.config.js";
import { COLLECTIONS } from "../../../constants/collectionts.constant.js";

export async function getMe(c: Context) {
  try {
    const tokenUser = c.get("user");
    const db = getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne(
      { id: tokenUser.id },
      { projection: { password: 0 } }
    );
    return c.json(user, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to current user';
    return c.json({ error: errorMessage }, 500);
  }
}