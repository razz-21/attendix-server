import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { getDb } from "../../../config/db.config.js";
import { GetAttendanceRecord, GetAttendanceRecordsQuery, PatchAttendanceRecord, PostAttendanceRecord } from "./attendance-record.model.js";
import { Filter } from "mongodb";

export async function getAttendanceRecords(attendance_id: string, params: GetAttendanceRecordsQuery): Promise<GetAttendanceRecord[]> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendanceRecord>(COLLECTIONS.ATTENDANCE);
    const searchQuery = params.q?.trim();

    const filter: Filter<GetAttendanceRecord> = { attendance_id };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const records = await collection.find<GetAttendanceRecord>(filter).sort({ created_at: -1 }).toArray();
    return records;
  } catch (error) {
    throw new Error('Failed to get attendance records');
  }
}

export async function getAttendanceRecordById(attendance_id: string, id: string): Promise<GetAttendanceRecord | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendanceRecord>(COLLECTIONS.ATTENDANCE);
    return await collection.findOne<GetAttendanceRecord>({ id, attendance_id });
  } catch (error) {
    throw new Error('Failed to get attendance record');
  }
}

export async function createAttendanceRecord(payload: PostAttendanceRecord): Promise<GetAttendanceRecord> {
  try {
    const db = getDb();
    const collection = db.collection<PostAttendanceRecord>(COLLECTIONS.ATTENDANCE);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendance record');
    }
    return payload as unknown as GetAttendanceRecord;
  } catch (error) {
    throw new Error('Failed to create attendance record');
  }
}

export async function updateAttendanceRecordById(attendance_id: string, id: string, payload: PatchAttendanceRecord): Promise<GetAttendanceRecord> {
  try {
    const db = getDb();
    const collection = db.collection<PatchAttendanceRecord>(COLLECTIONS.ATTENDANCE);
    const result = await collection.findOneAndUpdate(
      { id, attendance_id },
      { $set: { ...payload, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    ) as GetAttendanceRecord | null;

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
    const collection = db.collection<GetAttendanceRecord>(COLLECTIONS.ATTENDANCE);
    const result = await collection.deleteOne({ id, attendance_id });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete attendance record');
  }
}