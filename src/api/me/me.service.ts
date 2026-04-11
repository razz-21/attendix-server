import { compare } from "bcrypt-ts";
import { COLLECTIONS } from "src/constants/collectionts.constant";
import { getDb } from "src/config/db.config";

export async function isMePasswordValid(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Failed to check if password is valid');
  }
}

export async function getMePassword(id: string): Promise<string> {
  try {
    const db = getDb();
    const user = await db.collection<{ password: string }>(COLLECTIONS.USERS).findOne({ id }, { projection: { password: 1 } });
    return user?.password ?? '';
  } catch (error) {
    throw new Error('Failed to get user password');
  }
}

export async function updateMePassword(id: string, password: string): Promise<boolean> {
  try {
    const db = getDb();
    const result = await db.collection<{ password: string }>(COLLECTIONS.USERS).updateOne({ id }, { $set: { password } });
    return result.modifiedCount > 0;
  } catch (error) {
    throw new Error('Failed to update user password');
  }
}