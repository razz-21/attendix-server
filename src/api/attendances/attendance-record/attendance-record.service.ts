import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { DeleteAttendanceRecord, GetAttendanceRecord, PatchAttendanceRecord, PostAttendanceRecord } from "./attendance-record.model.js";
import { getDb } from "../../../config/db.config.js";

export const getAttendanceRecords = async (attendances_id: string): Promise<GetAttendanceRecord[]> => {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const record = await collection.find({ attendances_id }).sort({ created_at: -1 }).toArray();
    return record;
  } catch (error) {
    throw new Error('Failed to get attendance record');
  }
};

export const createAttendanceRecord = async (payload: PostAttendanceRecord): Promise<GetAttendanceRecord> => {
  try {
    const db = getDb();
    const collection = db.collection<PostAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendance record');
    }
    return payload;
  } catch (error) {
    throw new Error('Failed to create attendance record');
  }
}

export const updateAttendanceRecord = async (id: string, payload: PatchAttendanceRecord): Promise<GetAttendanceRecord> => {
  try {
    const db = getDb();
    const collection = db.collection<PatchAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const result = await collection.findOneAndUpdate({ id }, { $set: payload }, { returnDocument: 'after' }) as GetAttendanceRecord | null;
    if (!result) {
      throw new Error('Failed to update attendance record');
    }
    return result;
  } catch (error) {
    throw new Error('Failed to update attendance record');
  }
}

export const deleteAttendanceRecord = async (id: string): Promise<boolean> => {
  try {
    const db = getDb();
    const collection = db.collection<DeleteAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const result = await collection.deleteOne({ id });
    if (!result.acknowledged) {
      throw new Error('Failed to delete attendance record');
    }

    return result.acknowledged;
  } catch (error) {
    throw new Error('Failed to delete attendance record');
  }
}