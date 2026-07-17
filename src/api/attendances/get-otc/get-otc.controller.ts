import { Context } from "hono";
import { getAttendanceById, setAttendanceOtc } from "../attendance-record/attendance-record.service.js";

const OTC_TTL_SECONDS = 15;

export async function getOtcController(c: Context) {
  try {
    const attendance_id = c.req.param('attendance_id') ?? '';
    if (!attendance_id) {
      return c.json({ error: 'Attendance ID is required' }, 400);
    }

    const attendance = await getAttendanceById(attendance_id);
    if (!attendance) {
      return c.json({ error: 'Attendance not found' }, 404);
    }

    // Generate a fresh 3-digit code and persist it with a short expiry window.
    const otc_code = Math.floor(Math.random() * 1000);
    const otc_code_expires_at = new Date(Date.now() + OTC_TTL_SECONDS * 1000).toISOString();

    await setAttendanceOtc(attendance_id, otc_code, otc_code_expires_at);

    return c.json({
      otc: String(otc_code).padStart(3, '0'),
      expires_in: OTC_TTL_SECONDS,
    }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to generate OTC' }, 500);
  }
}
