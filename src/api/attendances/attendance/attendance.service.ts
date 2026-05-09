import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { getDb } from "../../../config/db.config.js";
import { GetAttendance, GetAttendancesQuery, PatchAttendance, PostAttendance } from "./attendance.model.js";
import { Filter } from "mongodb";

export async function getAttendanceRecords(attendance_id: string, params: GetAttendancesQuery): Promise<GetAttendance[]> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCE);
    const searchQuery = params.q?.trim();

    const filter: Filter<GetAttendance> = { attendance_id };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const records = await collection.find<GetAttendance>(filter).sort({ created_at: -1 }).toArray();
    return records;
  } catch (error) {
    throw new Error('Failed to get attendance records');
  }
}

export async function getAttendanceRecordById(attendance_id: string, id: string): Promise<GetAttendance | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCE);
    return await collection.findOne<GetAttendance>({ id, attendance_id });
  } catch (error) {
    throw new Error('Failed to get attendance record');
  }
}

export async function createAttendanceRecord(payload: PostAttendance): Promise<GetAttendance> {
  try {
    const db = getDb();
    const collection = db.collection<PostAttendance>(COLLECTIONS.ATTENDANCE);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendance record');
    }
    return payload as unknown as GetAttendance;
  } catch (error) {
    throw new Error('Failed to create attendance record');
  }
}

export async function updateAttendanceRecordById(attendance_id: string, id: string, payload: PatchAttendance): Promise<GetAttendance> {
  try {
    const db = getDb();
    const collection = db.collection<PatchAttendance>(COLLECTIONS.ATTENDANCE);
    const result = await collection.findOneAndUpdate(
      { id, attendance_id },
      { $set: { ...payload, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    ) as GetAttendance | null;

    if (!result) {
      throw new Error('Attendance record not found');
    }

    return result;
  } catch (error) {
    throw new Error('Failed to update attendance record');
  }
}

export async function deleteAttendanceRecordById(attendance_id: string, id: string): Promise<boolean> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCE);
    const result = await collection.deleteOne({ id, attendance_id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete attendance record');
  }
}