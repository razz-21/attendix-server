import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { GetGroup, GetPaginatedGroups, GetPaginatedGroupParams, PatchGroup, PostGroup } from "./groups.model.js";
import { getDb } from "../../config/db.config.js";
import { Filter } from "mongodb";

export async function getGroupById(id: string): Promise<GetGroup | null> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const group = await groupsCollection.findOne<GetGroup>({ id });
    return group;
  } catch (error) {
    throw new Error('Failed to get group by id');
  }
}

export async function getGroups(params: GetPaginatedGroupParams): Promise<GetPaginatedGroups> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const searchQuery = params.q?.trim();
    const filter: Filter<GetGroup> = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { department: { $regex: searchQuery, $options: 'i' } },
            { section: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const groups = await groupsCollection.find<GetGroup>(filter).toArray();
    const total = await groupsCollection.countDocuments(filter);
    return {
      data: groups,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  } catch (error) {
    throw new Error('Failed to get groups');
  }
}

export async function createGroup(payload: PostGroup): Promise<GetGroup> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const group: GetGroup = { ...payload, id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await groupsCollection.insertOne(group);

    if (!result.acknowledged) {
      throw new Error('Failed to create group');
    }

    return group;
  } catch (error) {
    throw new Error('Failed to create group');
  }
}

export async function updateGroupById(id: string, payload: PatchGroup): Promise<GetGroup> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<PatchGroup>(COLLECTIONS.GROUPS);
    const result = await groupsCollection.findOneAndUpdate(
      { id },
      { $set: { ...payload, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    ) as GetGroup | null;

    if (!result) {
      throw new Error('Group not found');
    }

    return result;
  } catch (error) {
    throw new Error('Failed to update group');
  }
}

export async function deleteGroupById(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const result = await groupsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete group');
  }
}

export async function importGroups(payload: PostGroup[]): Promise<number> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<PostGroup>(COLLECTIONS.GROUPS);
    const result = await groupsCollection.insertMany(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to import groups');
    }
    return result.insertedCount;
  } catch (error) {
    throw new Error('Failed to import groups');
  }
}