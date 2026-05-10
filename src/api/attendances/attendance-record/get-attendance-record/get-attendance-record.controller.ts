import { Context } from "hono";
import { getAttendanceRecords } from "../attendance-record.service.js";

export const getAttendanceRecordController = async (c: Context) => {
  try {
    const { attendances_id } = c.req.param();
    if (!attendances_id) {
      return c.json({ error: 'Attendances ID is required' }, 400);
    }
    
    const attendanceRecord = await getAttendanceRecords(attendances_id);
    return c.json(attendanceRecord, 200);
  } catch (error) {
    return c.json({ error: 'Failed to get attendance record' }, 500);
  }
}