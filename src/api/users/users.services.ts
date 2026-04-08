import { getDb } from "../../config/db.config.js";
import { GetPaginatedUsers, GetUser, PatchUser, PostUser } from "./users.model.js";

const USERS_COLLECTION = 'users';

export async function getUserByIdService(id: string): Promise<GetUser | null> {
  try {
    const db = getDb();
    const usersCollection = db.collection<GetUser>(USERS_COLLECTION);
    const user = await usersCollection.findOne<GetUser>({ id });
    return user;
  } catch (error) {
    throw new Error('Failed to get user by id');
  }
}

export async function getUsersService(page: number, limit: number): Promise<GetPaginatedUsers> {
  try {
    const db = getDb();
    const usersCollection = db.collection<GetUser>(USERS_COLLECTION);
    const users = await usersCollection.find<GetUser>({}).skip((page - 1) * limit).limit(limit).toArray();
    const total = await usersCollection.countDocuments();
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

export async function createUserService(user: PostUser): Promise<GetUser> {
  try {
    const db = getDb();
    const usersCollection = db.collection<PostUser>(USERS_COLLECTION);
    await usersCollection.insertOne(user);

    return user
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

export async function updateUserService(id: string, user: PatchUser): Promise<GetUser | null> {
  try {
    console.log("USERID", id);
    const db = getDb();
    const usersCollection = db.collection<PatchUser>(USERS_COLLECTION);
    const result = await usersCollection.findOneAndUpdate({ id }, { $set: user }, { returnDocument: 'after' }) as GetUser | null;
    return result;
  } catch (error) {
    throw new Error('Failed to update user');
  }
}

export async function deleteUserService(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const usersCollection = db.collection(USERS_COLLECTION);
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

export async function isUsernameExistsService(username: string): Promise<boolean> {
  try {
    const db = getDb();
    const usersCollection = db.collection(USERS_COLLECTION);
    const result = await usersCollection.findOne({ username });
    return result !== null;
  } catch (error) {
    throw new Error('Failed to check if username exists');
  }
}