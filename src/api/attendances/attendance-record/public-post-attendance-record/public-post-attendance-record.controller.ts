import { Context } from "hono";
import { ZodError } from "zod";
import { checkIfAttendanceRecordExists, createAttendanceRecord, getAttendanceById, getAttendeeByRfid } from "../attendance-record.service.js";
import { PostAttendanceRecord } from "../attendance-record.model.js";

export const publicPostAttendanceRecordController = async (c: Context) => {
  try {
    const { attendances_id } = c.req.param();
    if (!attendances_id) {
      return c.json({ error: 'Attendances ID is required' }, 400);
    }

    const { rfid, attendance_id, otc  } = c.req.query();
    if (!rfid) {
      return c.json({ error: 'RFID is required' }, 400);
    }

    if (!attendance_id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const attendance = await getAttendanceById(attendance_id);
    if (!attendance) {
      return c.json({ error: 'Attendance not found' }, 404);
    }

    if (attendance.enable_otc === 'on') {
      if (!otc) {
        return c.json({ error: 'OTC is required' }, 400);
      }

      const hasOtc = attendance.otc_code !== undefined && attendance.otc_code !== null && !!attendance.otc_code_expires_at;
      const expiresAt = attendance.otc_code_expires_at ? new Date(attendance.otc_code_expires_at).getTime() : NaN;

      if (!hasOtc || Number.isNaN(expiresAt) || Date.now() > expiresAt) {
        return c.json({ error: 'OTC has expired. Please enter the latest code.' }, 400);
      }

      const expectedOtc = String(attendance.otc_code).padStart(3, '0');
      if (otc.trim() !== expectedOtc) {
        return c.json({ error: 'Invalid OTC' }, 400);
      }
    }

    const attendee = await getAttendeeByRfid(rfid, attendances_id);
    if (!attendee) {
      return c.json({ error: 'Attendee not found' }, 404);
    }

    if (attendance.attendances_id !== attendances_id) {
      return c.json({ error: 'Attendance does not belong to this event' }, 404);
    }

    if (attendance.status === 'inactive') {
      return c.json({ error: 'Attendance is inactive' }, 403);
    }

    const recordExists = await checkIfAttendanceRecordExists(attendance_id, attendee.id);
    if (recordExists) {
      return c.json({ error: 'Attendance record already exists' }, 409);
    }

    const body: PostAttendanceRecord = {
      id: crypto.randomUUID(),
      attendances_id: attendance.attendances_id,
      attendance_id: attendance.id,
      attendee_id: attendee.id,
      status: 'present',
      reason: null,
      reason_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const record = await createAttendanceRecord(body);
    return c.json(record, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    if (error instanceof Error) {
      if (error.message === 'Attendance not found') {
        return c.json({ error: error.message }, 404);
      }
      if (error.message === 'Attendance is inactive') {
        return c.json({ error: error.message }, 403);
      }
    }
    return c.json({ error: 'Failed to create attendance record' }, 500);
  }
}
