import { getDb } from "@/config/db.config.js";
import { GetUser, GetUserWithPassword } from "../users/users.model.js";
import { compare } from "bcrypt-ts";
import { COLLECTIONS } from "@/constants/collectionts.constant.js";
import { sign } from "hono/jwt";

export async function getUserByEmailOrUsername(email?: string, username?: string): Promise<GetUserWithPassword | null> {
  try {
    const db = getDb();

    const user = await db.collection<GetUserWithPassword>(COLLECTIONS.USERS).findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error('Failed to get user by email or username');
  }
}

export async function isUserPasswordValid(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Failed to check if password is valid');
  }
}

export async function signAccessToken(payload: { user: GetUser, exp: number }): Promise<string> {
  try {
    return await sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string,
      "HS256"
    );
  } catch (error) {
    throw new Error('Failed to sign access token');
  }
}

export async function signRefreshToken(payload: { user: GetUser, exp: number }): Promise<string> {
  try {
    return await sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      "HS256"
    );
  } catch (error) {
    throw new Error('Failed to sign refresh token');
  }
}