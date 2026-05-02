import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { getDb } from "../../config/db.config.js";
import { GetAttendance, GetAttendancesQuery, PatchAttendance, PostAttendance } from "./attendance.model.js";
import { Filter } from "mongodb";

export async function getAttendanceById(id: string): Promise<GetAttendance | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCES);
    const attendance = await collection.findOne<GetAttendance>({ id });
    return attendance;
  } catch (error) {
    throw new Error('Failed to get attendance by id');
  }
}

export async function getAttendances(params: GetAttendancesQuery): Promise<GetAttendance[]> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCES);
    const searchQuery = params.q?.trim();
    const filter: Filter<GetAttendance> = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { code: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const attendances = await collection.find<GetAttendance>(filter).toArray();
    return attendances;
  } catch (error) {
    throw new Error('Failed to get attendances');
  }
}

export async function createAttendance(payload: PostAttendance): Promise<GetAttendance> {
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

export async function updateAttendanceById(id: string, payload: PatchAttendance): Promise<GetAttendance> {
  try {
    const db = getDb();
    const collection = db.collection<PatchAttendance>(COLLECTIONS.ATTENDANCES);
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: payload },
      { returnDocument: 'after' }
    ) as GetAttendance | null;

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
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCES);
    const result = await collection.deleteOne({ id });
    return result.acknowledged;
  } catch (error) {
    throw new Error('Failed to delete attendance');
  }
}
