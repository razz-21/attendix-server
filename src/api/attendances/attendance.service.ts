import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { getDb } from "../../config/db.config.js";
import { Attendance, GetAttendance, GetAttendancesQuery, PatchAttendance, PostAttendance } from "./attendance.model.js";
import { Filter } from "mongodb";
import { User } from "../users/users.model.js";

export function buildAttendanceAccessFilter(user: { id: string }): Filter<Attendance> {
  return {
    $or: [
      { created_by: user.id },
      { shared_with: { $in: [user.id] } },
    ],
  };
}

export function canAccessAttendance(
  attendance: Pick<Attendance, "created_by" | "shared_with">,
  userId: string,
): boolean {
  return (
    attendance.created_by === userId ||
    (attendance.shared_with ?? []).includes(userId)
  );
}

export async function getAttendanceById(id: string): Promise<Attendance | null> {
  try {
    const db = getDb();
    const collection = db.collection<Attendance>(COLLECTIONS.ATTENDANCES);
    const attendance = await collection.findOne<Attendance>({ id });
    return attendance;
  } catch (error) {
    throw new Error('Failed to get attendance by id');
  }
}

export async function getAttendances(params: GetAttendancesQuery, user: { id: string; workspace_id?: string | null }): Promise<Attendance[]> {
  try {
    const db = getDb();
    const collection = db.collection<Attendance>(COLLECTIONS.ATTENDANCES);
    const searchQuery = params.q?.trim();
    const statusQuery = params.status;

    const filter: Filter<Attendance> = {
      $and: [buildAttendanceAccessFilter(user)],
    };

    if (searchQuery) {
      filter.$and!.push({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { code: { $regex: searchQuery, $options: 'i' } },
        ],
      });
    }

    if (statusQuery) {
      filter.status = statusQuery;
    }

    const attendances = await collection.find<Attendance>(filter).sort({ created_at: -1 }).toArray();
    return attendances;
  } catch (error) {
    throw new Error('Failed to get attendances');
  }
}

export async function createAttendance(payload: PostAttendance): Promise<Attendance> {
  try {
    const db = getDb();
    const collection = db.collection<PostAttendance>(COLLECTIONS.ATTENDANCES);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendance');
    }
    return payload;
  } catch (error) {
    throw new Error('Failed to create attendance');
  }
}

export async function updateAttendanceById(id: string, payload: PatchAttendance): Promise<Attendance> {
  try {
    const db = getDb();
    const collection = db.collection<PatchAttendance>(COLLECTIONS.ATTENDANCES);
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: payload },
      { returnDocument: 'after' }
    ) as Attendance | null;

    if (!result) {
      throw new Error('Attendance not found');
    }

    return result;
  } catch (error) {
    throw new Error('Failed to update attendance');
  }
}

export async function deleteAttendanceById(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const collection = db.collection<Attendance>(COLLECTIONS.ATTENDANCES);
    const result = await collection.deleteOne({ id });
    return result.acknowledged;
  } catch (error) {
    throw new Error('Failed to delete attendance');
  }
}

export async function enrichAttendancesWithUsers(
  attendances: Attendance[],
  requester: { workspace_id?: string | null }
): Promise<GetAttendance[]> {
  if (attendances.length === 0) return [];

  const db = getDb();
  const usersCollection = db.collection<User>(COLLECTIONS.USERS);

  const idsToLookup = new Set<string>();
  for (const attendance of attendances) {
    if (attendance.created_by) idsToLookup.add(attendance.created_by);
    for (const id of attendance.shared_with ?? []) {
      idsToLookup.add(id);
    }
  }

  const userIds = [...idsToLookup];
  const users = await usersCollection
    .find<User>(
      { id: { $in: userIds } },
      { projection: { password: 0 } }
    )
    .toArray();

  const usersById = new Map(users.map((u) => [u.id, u]));

  const canFilterByWorkspace = typeof requester.workspace_id === "string" && requester.workspace_id.length > 0;

  const toPublicUser = (u: User) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
  });

  return attendances.map((attendance) => {
    const createdBy = usersById.get(attendance.created_by);
    const created_by = createdBy ? toPublicUser(createdBy) : { id: attendance.created_by, firstname: "", lastname: "" };

    const shared_with_users = (attendance.shared_with ?? [])
      .map((id) => usersById.get(id))
      .filter((u): u is User => !!u)
      .filter((u) => !canFilterByWorkspace || u.workspace_id === requester.workspace_id)
      .map((u) => toPublicUser(u));

    return {
      ...attendance,
      created_by,
      shared_with_users,
    };
  });
}

export async function validateSharedWithUsersInWorkspace(
  sharedWithIds: string[],
  workspaceId: string | null | undefined
): Promise<boolean> {
  if (!sharedWithIds || sharedWithIds.length === 0) return true;
  if (!workspaceId) return false;

  const db = getDb();
  const usersCollection = db.collection<User>(COLLECTIONS.USERS);

  const users = await usersCollection
    .find<User>(
      {
        id: { $in: sharedWithIds },
        workspace_id: workspaceId,
      },
      { projection: { password: 0 } }
    )
    .toArray();

  const validIds = new Set(users.map((u) => u.id));
  return sharedWithIds.every((id) => validIds.has(id));
}
