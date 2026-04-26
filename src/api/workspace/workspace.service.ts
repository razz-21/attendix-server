import { COLLECTIONS } from "src/constants/collectionts.constant";
import { GetPaginatedWorkspace, GetPaginatedWorkspaceParams, GetWorkspace, PatchWorkspace, PostWorkspace, PostWorkspaceSchema } from "./workspace.model";
import { getDb } from "src/config/db.config";
import { Filter } from "mongodb";

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
    const filter: Filter<GetWorkspace> = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    console.log(filter);
    const workspaces = await workspacesCollection.find<GetWorkspace>(filter).toArray();
    const total = await workspacesCollection.countDocuments(filter);
    return {
      data: workspaces,
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
    return payload;
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