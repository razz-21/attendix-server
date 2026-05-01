import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { GetPaginatedWorkspace, GetPaginatedWorkspaceParams, GetWorkspace, PatchWorkspace, PostWorkspace } from "./workspace.model.js";
import { getDb } from "../../config/db.config.js";
import { Filter } from "mongodb";
import { User } from "../users/users.model.js";

export async function getWorkspaceById(id: string): Promise<GetWorkspace | null> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<GetWorkspace>(COLLECTIONS.WORKSPACES);
    const workspace = await workspacesCollection.findOne<GetWorkspace>({ id });
    return workspace;
  } catch (error) {
    throw new Error('Failed to get workspace by id');
  }
}

export async function getWorkspaces(params: GetPaginatedWorkspaceParams): Promise<GetPaginatedWorkspace> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<GetWorkspace>(COLLECTIONS.WORKSPACES);
    const searchQuery = params.q?.trim();
    const page = params.page || 1;
    const limit = params.limit || 5;
    const filter: Filter<GetWorkspace> = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const workspacesWithTotals = await workspacesCollection.aggregate<GetWorkspace>([
      { $match: filter },
      {
        $lookup: {
          from: COLLECTIONS.USERS,
          localField: "id",
          foreignField: "workspace_id",
          as: "workspace_users",
        },
      },
      {
        $lookup: {
          from: COLLECTIONS.GROUPS,
          localField: "id",
          foreignField: "workspace_id",
          as: "workspace_groups",
        },
      },
      {
        $addFields: {
          total_users: { $size: "$workspace_users" },
          total_groups: { $size: "$workspace_groups" },
        },
      },
      {
        $project: {
          workspace_users: 0,
          workspace_groups: 0,
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]).toArray();
    
    const total = await workspacesCollection.countDocuments(filter);
    return {
      data: workspacesWithTotals,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  } catch (error) {
    throw new Error('Failed to get workspaces');
  }
}

export async function getTotalWorkspaces(): Promise<number> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<GetWorkspace>(COLLECTIONS.WORKSPACES);
    const total = await workspacesCollection.countDocuments();
    return total;
  } catch (error) {
    throw new Error('Failed to get total workspaces');
  }
}

export async function createWorkspace(payload: PostWorkspace): Promise<GetWorkspace> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<PostWorkspace>(COLLECTIONS.WORKSPACES);
    const result = await workspacesCollection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create workspace');
    }
    return { ...payload, total_users: 0, total_groups: 0 };
  } catch (error) {
    throw new Error('Failed to create workspace');
  }
}

export async function updateWorkspaceById(id: string, payload: PatchWorkspace): Promise<GetWorkspace> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<PatchWorkspace>(COLLECTIONS.WORKSPACES);
    const result = await workspacesCollection.findOneAndUpdate({ id }, { $set: payload }, { returnDocument: 'after' }) as GetWorkspace | null;
    
    if (!result) {
      throw new Error('Workspace not found');
    }

    return result;
  } catch (error) {
    throw new Error('Failed to update workspace');
  }
}

export async function deleteWorkspaceById(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const workspacesCollection = db.collection<GetWorkspace>(COLLECTIONS.WORKSPACES);
    const result = await workspacesCollection.deleteOne({ id });
    return result.acknowledged;
  } catch (error) {
    throw new Error('Failed to delete workspace');
  }
}

export async function getWorkspaceUsers(id: string): Promise<User[]> {
  try {
    const db = getDb();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    const users = await usersCollection.find({ workspace_id: id }, { projection: { password: 0 } }).toArray();
    return users;
  } catch (error) {
    throw new Error('Failed to get workspace users');
  }
}