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

export async function getGroups(params: GetPaginatedGroupParams, user: any): Promise<GetPaginatedGroups> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const searchQuery = params.q?.trim();

    const ownershipFilter: Filter<GetGroup> = {
      $or: [
        { created_by: user.id },
        ...(user.workspace_id ? [{ workspace_id: user.workspace_id }] : []),
      ],
    };

    const searchFilter: Filter<GetGroup> = searchQuery ? {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    } : {};

    const workspaceFilter: Filter<GetGroup> = params.workspace_id ? {
      workspace_id: params.workspace_id,
    } : {};

    const conditions = [ownershipFilter];
    if (Object.keys(searchFilter).length > 0) conditions.push(searchFilter);
    if (Object.keys(workspaceFilter).length > 0) conditions.push(workspaceFilter);

    const filter: Filter<GetGroup> = conditions.length > 1 
      ? { $and: conditions } 
      : conditions[0];

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const groups = await groupsCollection.aggregate<GetGroup>([
      { $match: filter },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: COLLECTIONS.GROUP_MEMBERS,
          let: { groupId: '$id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$group_id', '$$groupId'] } } },
            { $count: 'count' },
          ],
          as: 'member_stats',
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.USERS,
          localField: 'created_by',
          foreignField: 'id',
          as: 'creator'
        }
      },
      {
        $unwind: {
          path: '$creator',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          count_members: {
            $ifNull: [{ $arrayElemAt: ['$member_stats.count', 0] }, 0],
          },
          creator: {
            $cond: {
              if: { $ifNull: ['$creator', false] },
              then: {
                id: '$creator.id',
                firstname: '$creator.firstname',
                lastname: '$creator.lastname',
                avatar: '$creator.avatar'
              },
              else: '$$REMOVE'
            }
          }
        }
      },
      { $unset: 'member_stats' },
    ]).toArray();

    const total = await groupsCollection.countDocuments(filter);
    return { data: groups, total, page, limit };
  } catch (error) {
    throw new Error('Failed to get groups');
  }
}
export async function createGroup(payload: PostGroup): Promise<GetGroup> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<GetGroup>(COLLECTIONS.GROUPS);
    const result = await groupsCollection.insertOne(payload as unknown as GetGroup);
    if (!result.acknowledged) {
      throw new Error('Failed to create group');
    }
    
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const creator = await usersCollection.findOne({ id: payload.created_by }) as any;
    
    return {
      ...payload,
      ...(creator ? {
        creator: {
          id: creator.id,
          firstname: creator.firstname,
          lastname: creator.lastname,
          avatar: creator.avatar,
        }
      } : {})
    } as unknown as GetGroup;
  } catch (error) {
    throw new Error('Failed to create group');
  }
}

export async function updateGroupById(id: string, payload: PatchGroup): Promise<GetGroup> {
  try {
    const db = getDb();
    const groupsCollection = db.collection<PatchGroup>(COLLECTIONS.GROUPS);
    const result = await groupsCollection.findOneAndUpdate( { id },
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