import type { Filter } from 'mongodb';
import { getDb } from '../../config/db.config.js';
import {
  GetPaginatedUsers,
  GetUser,
  PatchUser,
  PostUser,
  UserRoleSchema,
  UserStatusSchema,
} from "./users.model.js";
import { COLLECTIONS } from "../../constants/collectionts.constant.js";

export async function getUserById(id: string): Promise<GetUser | null> {
  try {
    const db = getDb();
    const usersCollection = db.collection<GetUser>(COLLECTIONS.USERS);
    const user = await usersCollection.findOne<GetUser>({ id }, { projection: { password: 0 } });
    return user;
  } catch (error) {
    throw new Error('Failed to get user by id');
  }
}

export async function getUsersService(page: number, limit: number, q?: string, status?: string, role?: string): Promise<GetPaginatedUsers> {
  try {
    const db = getDb();
    const usersCollection = db.collection<GetUser>(COLLECTIONS.USERS);
    const trimmed = q?.trim();
    const filter: Filter<GetUser> = trimmed
      ? {
          $or: [
            { rfid: { $regex: trimmed, $options: 'i' } },
            { firstname: { $regex: trimmed, $options: 'i' } },
            { lastname: { $regex: trimmed, $options: 'i' } },
          ],
        }
      : {};

    const statusResult = status ? UserStatusSchema.safeParse(status) : null;
    if (statusResult?.success) {
      filter.status = statusResult.data;
    }
    const roleResult = role ? UserRoleSchema.safeParse(role) : null;
    if (roleResult?.success) {
      filter.role = roleResult.data;
    }
    const users = await usersCollection
      .find<GetUser>(filter, { projection: { password: 0 } })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
      
    const total = await usersCollection.countDocuments(filter);
    return {
      data: users,
      total,
      page,
      limit,
    };
  } catch (error) {
    throw new Error('Failed to get users');
  }
}

export async function createUser(user: PostUser): Promise<GetUser> {
  try {
    const db = getDb();
    const usersCollection = db.collection<PostUser>(COLLECTIONS.USERS);
    await usersCollection.insertOne(user);

    return user
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

export async function updateUser(id: string, user: PatchUser): Promise<GetUser | null> {
  try {
    const db = getDb();
    const usersCollection = db.collection<PatchUser>(COLLECTIONS.USERS);
    const result = await usersCollection.findOneAndUpdate(
      { id },
      { $set: user },
      { returnDocument: 'after', projection: { password: 0 } },
    ) as GetUser | null;
    return result;
  } catch (error) {
    throw new Error('Failed to update user');
  }
}

export async function deleteUserById(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

export async function isUsernameExists(username: string): Promise<boolean> {
  try {
    const db = getDb();
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const result = await usersCollection.findOne({ username });
    return result !== null;
  } catch (error) {
    throw new Error('Failed to check if username exists');
  }
}

export async function isUserEmailExists(email: string): Promise<boolean> {
  try {
    const db = getDb();
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const result = await usersCollection.findOne({ email });
    return result !== null;
  } catch (error) {
    throw new Error('Failed to check if email exists');
  }
}