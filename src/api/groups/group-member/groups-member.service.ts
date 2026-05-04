import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { GetGroupMember, GetPaginatedGroupMembers, GetPaginatedGroupMemberParams, PatchGroupMember, PostGroupMember } from "./groups-member.model.js";
import { getDb } from "../../../config/db.config.js";
import { Filter } from "mongodb";

export async function getGroupMembers(group_id: string, params: GetPaginatedGroupMemberParams): Promise<GetPaginatedGroupMembers> {
  try {
    const db = getDb();
    const collection = db.collection<GetGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const searchQuery = params.q?.trim();

    const filter: Filter<GetGroupMember> = {
      group_id,
      ...(searchQuery ? {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { rfid: { $regex: searchQuery, $options: 'i' } },
        ],
      } : {}),
      ...(params.department ? { department: params.department } : {}),
    };

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const members = await collection.find<GetGroupMember>(filter).sort({ created_at: -1 }).skip(skip).limit(limit).toArray();
    const total = await collection.countDocuments(filter);

    return { data: members, total, page, limit };
  } catch (error) {
    throw new Error('Failed to get group members');
  }
}

export async function getGroupMemberById(group_id: string, id: string): Promise<GetGroupMember | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    return await collection.findOne<GetGroupMember>({ id, group_id });
  } catch (error) {
    throw new Error('Failed to get group member');
  }
}

export async function createGroupMember(payload: PostGroupMember): Promise<GetGroupMember> {
  try {
    const db = getDb();
    const collection = db.collection<PostGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) throw new Error('Failed to create group member');
    return payload as unknown as GetGroupMember;
  } catch (error) {
    throw new Error('Failed to create group member');
  }
}

export async function updateGroupMemberById(group_id: string, id: string, payload: PatchGroupMember): Promise<GetGroupMember> {
  try {
    const db = getDb();
    const collection = db.collection<PatchGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const result = await collection.findOneAndUpdate(
      { id, group_id },
      { $set: { ...payload, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    ) as GetGroupMember | null;
    if (!result) throw new Error('Group member not found');
    return result;
  } catch (error) {
    console.error('updateGroupMemberById error:', error); 
    throw new Error('Failed to update group member');
  }
}

export async function deleteGroupMemberById(group_id: string, id: string): Promise<boolean> {
  try {
    const db = getDb();
    const collection = db.collection<GetGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const result = await collection.deleteOne({ id, group_id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete group member');
  }
}

export async function importGroupMembers(members: PostGroupMember[]): Promise<number> {
  try {
    const db = getDb();
    const collection = db.collection<PostGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const result = await collection.insertMany(members);
    if (!result.acknowledged) throw new Error('Failed to import group members');
    return result.insertedCount;
  } catch (error) {
    throw new Error('Failed to import group members');
  }
}