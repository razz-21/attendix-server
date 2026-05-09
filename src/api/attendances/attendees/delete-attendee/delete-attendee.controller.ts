import { Context } from "hono";
import { deleteAttendee } from "../attendees.service.js";

export async function deleteAttendeeController(c: Context) {
  try {
    const attendanceId = c.req.param('id');
    const attendeeId = c.req.param('attendees_record_id');

    if (!attendanceId || !attendeeId) {
      return c.json({ error: 'Attendance ID and attendee ID are required' }, 400);
    }
    
    const deleted = await deleteAttendee(attendanceId, attendeeId);
    
    if (!deleted) {
      return c.json({ error: 'Attendee not found' }, 404);
    }
    
    return c.json({ message: 'Attendee deleted successfully' }, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete attendee';
    return c.json({ error: errorMessage }, 500);
  }
}
