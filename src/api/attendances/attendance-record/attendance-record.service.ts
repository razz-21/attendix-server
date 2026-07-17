import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { DeleteAttendanceRecord, GetAttendanceRecord, PatchAttendanceRecord, PostAttendanceRecord } from "./attendance-record.model.js";
import { getDb } from "../../../config/db.config.js";
import { GetAttendee } from "../attendees/attendees.model.js";
import { GetAttendance } from "../attendance/attendance.model.js";
import { broadcastToAttendance } from "../../../realtime/realtime.js";

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

export const getAttendanceById = async (attendance_id: string): Promise<GetAttendance | null> => {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCE);
    const attendance = await collection.findOne<GetAttendance>({ id: attendance_id });
    return attendance;
  } catch (error) {
    throw new Error('Failed to get attendance by id');
  }
}

export const setAttendanceOtc = async (
  attendance_id: string,
  otc_code: number,
  otc_code_expires_at: string,
): Promise<void> => {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendance>(COLLECTIONS.ATTENDANCE);
    await collection.updateOne(
      { id: attendance_id },
      { $set: { otc_code, otc_code_expires_at, updated_at: new Date().toISOString() } },
    );
  } catch (error) {
    throw new Error('Failed to set attendance OTC');
  }
}

export const createAttendanceRecord = async (payload: PostAttendanceRecord): Promise<GetAttendanceRecord> => {
  try {
    const attendance = await getAttendanceById(payload.attendance_id);
    if (!attendance) {
      throw new Error('Attendance not found');
    }
    if (attendance.status === 'inactive') {
      throw new Error('Attendance is inactive');
    }

    const db = getDb();
    const collection = db.collection<PostAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const result = await collection.insertOne(payload);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendance record');
    }
    broadcastToAttendance(payload.attendances_id, 'record.created', payload);
    return payload;
  } catch (error) {
    if (error instanceof Error && (error.message === 'Attendance not found' || error.message === 'Attendance is inactive')) {
      throw error;
    }
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
    broadcastToAttendance(result.attendances_id, 'record.updated', result);
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

export const getAttendeeByRfid = async (rfid: string, attendances_id?: string): Promise<GetAttendee | null> => {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    const filter: { rfid: string; attendance_id?: string } = { rfid };
    if (attendances_id) {
      filter.attendance_id = attendances_id;
    }
    const attendee = await collection.findOne<GetAttendee>(filter);
    return attendee;
  } catch (error) {
    throw new Error('Failed to get attendee by rfid');
  }
}

export const checkIfAttendanceRecordExists = async (attendance_id: string, attendee_id: string): Promise<boolean> => {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendanceRecord>(COLLECTIONS.ATTENDANCE_RECORDS);
    const record = await collection.findOne<GetAttendanceRecord>({ attendance_id, attendee_id });
    return record ? true : false;
  } catch (error) {
    throw new Error('Failed to check if attendance record exists');
  }
}